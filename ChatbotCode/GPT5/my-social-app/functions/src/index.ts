import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

admin.initializeApp();

function assertSignedIn(auth: any) {
  if (!auth) throw new HttpsError("unauthenticated", "You must be signed in.");
}
function isOwner(auth: any) {
  return Boolean(auth?.token?.owner);
}
function isAdmin(auth: any) {
  return Boolean(auth?.token?.admin || auth?.token?.owner);
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Referral system requirements:
 * - User can create invite codes
 * - Referrer gains 1 point when someone signs up using their invite
 * - Max 5 referral invites per month
 * - Opt-out clears points and disables further invite creation
 */
export const createReferralCode = onCall(async (req) => {
  assertSignedIn(req.auth);

  const uid = req.auth!.uid;
  const userSnap = await admin.firestore().doc(`users/${uid}`).get();
  const user = userSnap.data() || {};
  if (user.referralOptOut) {
    throw new HttpsError("failed-precondition", "You opted out of referrals.");
  }

  const since = startOfMonth();
  const q = await admin.firestore()
    .collection("referrals")
    .where("creatorUid", "==", uid)
    .where("createdAt", ">=", since)
    .get();

  if (q.size >= 5) {
    throw new HttpsError("resource-exhausted", "Monthly referral code limit reached (5).");
  }

  const code = randomCode(10);
  await admin.firestore().doc(`referrals/${code}`).set({
    code,
    creatorUid: uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    usedByUid: null,
    usedAt: null,
  });

  return { code };
});

export const redeemReferralCode = onCall(async (req) => {
  assertSignedIn(req.auth);
  const uid = req.auth!.uid;
  const code = String(req.data?.code || "").trim();
  if (!code) throw new HttpsError("invalid-argument", "Missing code.");

  const refDoc = admin.firestore().doc(`referrals/${code}`);
  await admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(refDoc);
    if (!snap.exists) throw new HttpsError("not-found", "Invalid referral code.");

    const data = snap.data()!;
    if (data.usedByUid) throw new HttpsError("failed-precondition", "Code already used.");
    if (data.creatorUid === uid) throw new HttpsError("failed-precondition", "You cannot refer yourself.");

    const creatorDoc = admin.firestore().doc(`users/${data.creatorUid}`);
    const creatorSnap = await tx.get(creatorDoc);
    if (!creatorSnap.exists) throw new HttpsError("failed-precondition", "Referrer missing.");

    const creator = creatorSnap.data()!;
    if (creator.referralOptOut) {
      // If referrer opted out, do not award points; still mark code used.
      tx.update(refDoc, {
        usedByUid: uid,
        usedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    tx.update(refDoc, {
      usedByUid: uid,
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    tx.update(creatorDoc, {
      referralPoints: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return { ok: true };
});

/**
 * Recommendation: “people you might know” via mutual friends.
 * For simplicity:
 * - fetch your friends
 * - for each friend, fetch their friends (2-hop)
 * - count mutual occurrences
 */
export const recommendFriends = onCall(async (req) => {
  assertSignedIn(req.auth);
  const uid = req.auth!.uid;

  const myFriendsSnap = await admin.firestore().collection(`users/${uid}/friends`).get();
  const myFriends = myFriendsSnap.docs.map(d => d.id);
  const counts = new Map<string, number>();

  for (const f of myFriends) {
    const fof = await admin.firestore().collection(`users/${f}/friends`).get();
    fof.docs.forEach(d => {
      const cand = d.id;
      if (cand === uid) return;
      if (myFriends.includes(cand)) return;
      counts.set(cand, (counts.get(cand) || 0) + 1);
    });
  }

  const top = [...counts.entries()]
    .sort((a,b)=>b[1]-a[1])
    .slice(0, 10);

  const recs: any[] = [];
  for (const [candUid, mutualCount] of top) {
    const u = await admin.firestore().doc(`users/${candUid}`).get();
    if (u.exists) recs.push({ ...u.data(), mutualCount });
  }

  return { recommendations: recs };
});

/**
 * Admin functions
 */
export const listAdmins = onCall(async (req) => {
  assertSignedIn(req.auth);
  if (!isAdmin(req.auth)) throw new HttpsError("permission-denied", "Admin only.");

  // List admin users by scanning Auth user records and checking custom claims.
  const admins: any[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const page = await admin.auth().listUsers(1000, nextPageToken);
    for (const u of page.users) {
      const claims = u.customClaims || {};
      if (claims.admin || claims.owner) admins.push({ uid: u.uid, email: u.email, owner: !!claims.owner, admin: !!claims.admin });
    }
    nextPageToken = page.pageToken;
  } while (nextPageToken);

  return { admins };
});

export const adminRemoveUser = onCall(async (req) => {
  assertSignedIn(req.auth);
  if (!isAdmin(req.auth)) throw new HttpsError("permission-denied", "Admin only.");
  const uid = String(req.data?.uid || "");
  if (!uid) throw new HttpsError("invalid-argument", "Missing uid.");

  await hardDeleteUser(uid);
  return { ok: true };
});

/**
 * Owner stats + owner-only permissions management
 */
export const getOwnerStats = onCall(async (req) => {
  assertSignedIn(req.auth);
  if (!isOwner(req.auth)) throw new HttpsError("permission-denied", "Owner only.");

  const [usersCount, postsCount, commentsCount] = await Promise.all([
    admin.firestore().collection("users").count().get(),
    admin.firestore().collection("posts").count().get(),
    admin.firestore().collectionGroup("comments").count().get(),
  ]);

  return {
    userCount: usersCount.data().count,
    postCount: postsCount.data().count,
    commentCount: commentsCount.data().count,
  };
});

export const setUserRole = onCall(async (req) => {
  assertSignedIn(req.auth);
  if (!isOwner(req.auth)) throw new HttpsError("permission-denied", "Owner only.");

  const uid = String(req.data?.uid || "");
  const role = String(req.data?.role || "");
  if (!uid || !["admin", "owner", "removeAdmin", "removeOwner"].includes(role)) {
    throw new HttpsError("invalid-argument", "Bad uid/role.");
  }

  const user = await admin.auth().getUser(uid);
  const claims = user.customClaims || {};

  if (role === "admin") claims.admin = true;
  if (role === "owner") claims.owner = true;
  if (role === "removeAdmin") claims.admin = false;
  if (role === "removeOwner") claims.owner = false;

  await admin.auth().setCustomUserClaims(uid, claims);
  return { ok: true };
});

/**
 * Export user data
 */
export const exportUserData = onCall(async (req) => {
  assertSignedIn(req.auth);
  const uid = req.auth!.uid;

  const userDoc = await admin.firestore().doc(`users/${uid}`).get();
  const friends = await admin.firestore().collection(`users/${uid}/friends`).get();
  const gallery = await admin.firestore().collection(`users/${uid}/gallery`).get();
  const posts = await admin.firestore().collection("posts").where("authorUid", "==", uid).get();
  const billing = await admin.firestore().doc(`billing/${uid}`).get();

  const data = {
    user: userDoc.data() || null,
    friends: friends.docs.map(d=>({ id: d.id, ...d.data() })),
    gallery: gallery.docs.map(d=>({ id: d.id, ...d.data() })),
    posts: posts.docs.map(d=>({ id: d.id, ...d.data() })),
    billing: billing.data() || null,
    exportedAt: new Date().toISOString(),
  };

  const bucket = admin.storage().bucket();
  const path = `exports/${uid}/${Date.now()}_export.json`;
  const file = bucket.file(path);
  await file.save(JSON.stringify(data, null, 2), { contentType: "application/json" });

  // Signed URL for download (time-limited)
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
  });

  return { url };
});

/**
 * Self-service account deletion
 */
export const deleteUserAccount = onCall(async (req) => {
  assertSignedIn(req.auth);
  const uid = req.auth!.uid;
  await hardDeleteUser(uid);
  return { ok: true };
});

/**
 * Trigger: when a post is created with imagePath, add it to the user's gallery.
 */
export const onPostCreated = onDocumentCreated("posts/{postId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;
  if (!data.authorUid) return;
  if (!data.imagePath) return;

  await admin.firestore().collection(`users/${data.authorUid}/gallery`).add({
    path: data.imagePath,
    album: "from-posts",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    postId: event.params.postId,
  });
});

async function hardDeleteUser(uid: string) {
  // Delete Firestore docs (simple approach; for large data you would batch/iterate)
  const db = admin.firestore();

  // Delete user profile + billing
  await db.doc(`users/${uid}`).delete().catch(()=>{});
  await db.doc(`billing/${uid}`).delete().catch(()=>{});

  // Delete subcollections friends + gallery
  await deleteCollection(db.collection(`users/${uid}/friends`));
  await deleteCollection(db.collection(`users/${uid}/gallery`));

  // Delete posts by user
  const posts = await db.collection("posts").where("authorUid", "==", uid).get();
  for (const p of posts.docs) {
    // delete comments + likes
    await deleteCollection(db.collection(`posts/${p.id}/comments`));
    await deleteCollection(db.collection(`posts/${p.id}/likes`));
    await p.ref.delete();
  }

  // Delete Auth user
  await admin.auth().deleteUser(uid).catch(()=>{});

  // Delete Storage folder (best-effort)
  try {
    const [files] = await admin.storage().bucket().getFiles({ prefix: `users/${uid}/` });
    await Promise.all(files.map(f=>f.delete().catch(()=>{})));
  } catch {}
}

async function deleteCollection(col: FirebaseFirestore.CollectionReference) {
  const snap = await col.get();
  await Promise.all(snap.docs.map(d=>d.ref.delete().catch(()=>{})));
}

function randomCode(len: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i=0;i<len;i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
  return out;
}

