// ===== 1. Firebase init =====
const firebaseConfig = {
  apiKey: "AIzaSyAOVfuubuQR4hK_MdG9O4r-433JfETU-lg",
  authDomain: "gpt-2-22b6d.firebaseapp.com",
  projectId: "gpt-2-22b6d",
  storageBucket: "gpt-2-22b6d.firebasestorage.app",
  messagingSenderId: "928437187046",
  appId: "1:928437187046:web:56cb138efcd6d06366a627"
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Shortcuts
const $ = (id) => document.getElementById(id);
const statusMessageEl = $("status-message");

// Current user data cache
let currentUser = null;
let currentUserDoc = null;
let currentTheme = "light";
let currentConversationWith = null;

// ===== Helpers =====
function showStatus(msg, isError = false) {
  statusMessageEl.textContent = msg;
  statusMessageEl.style.color = isError ? "var(--danger)" : "inherit";
}

function switchView(viewId) {
  const views = [
    "view-welcome", "view-feed", "view-profile", "view-friends",
    "view-dms", "view-billing", "view-settings", "view-admin", "view-owner"
  ];
  views.forEach(id =>
    $(id).classList.toggle("hidden", id !== viewId)
  );
}

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString();
}

function randomCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
}

// ============================
// 2. Authentication
// ============================

// LOGIN
$("login-btn").addEventListener("click", async () => {
  const email = $("login-email").value.trim();
  const pw = $("login-password").value;
  const remember = $("remember-me").checked;

  try {
    const persistence = remember
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;

    await auth.setPersistence(persistence);
    await auth.signInWithEmailAndPassword(email, pw);

    showStatus("Logged in.");
  } catch (err) {
    showStatus(err.message, true);
  }
});

// REGISTER
$("register-btn").addEventListener("click", async () => {
  const email = $("register-email").value.trim();
  const pw = $("register-password").value;
  const displayName = $("register-displayname").value.trim();
  const referralCode = $("register-referral-code").value.trim();

  if (!email || !pw) {
    showStatus("Email & password required", true);
    return;
  }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pw);
    const uid = cred.user.uid;

    const doc = {
      displayName: displayName || email.split("@")[0],
      email,
      fullName: "",
      age: null,
      city: "",
      country: "",
      about: "",
      photoURL: "",
      banner: "banner-default",
      theme: "light",
      isAdmin: false,
      isOwner: false,
      referralPoints: 0,
      referralOptIn: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("users").doc(uid).set(doc);

    // referral code handling
    if (referralCode) {
      const snap = await db.collection("referralCodes")
        .where("code", "==", referralCode)
        .limit(1).get();

      if (!snap.empty) {
        const refDoc = snap.docs[0];
        const ref = refDoc.ref;
        const data = refDoc.data();

        await ref.update({
          usedBy: firebase.firestore.FieldValue.arrayUnion(uid),
          usedCount: firebase.firestore.FieldValue.increment(1)
        });

        await db.collection("users")
          .doc(data.ownerUid)
          .update({
            referralPoints: firebase.firestore.FieldValue.increment(1)
          });
      }
    }

    showStatus("Account created.");
  } catch (err) {
    showStatus(err.message, true);
  }
});

// FORGOT PASSWORD
$("forgot-password-btn")
  .addEventListener("click", async () => {
    const email = $("login-email").value.trim();
    if (!email) {
      showStatus("Enter email in login box first", true);
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      showStatus("Password reset email sent.");
    } catch (err) {
      showStatus(err.message, true);
    }
  });

// LOGOUT
$("logout-btn").addEventListener("click", () => auth.signOut());

// ============================
// Authentication state listener
// ============================

auth.onAuthStateChanged(async (user) => {
  currentUser = user;

  if (!user) {
    currentUserDoc = null;
    $("nav-bar").classList.add("hidden");
    switchView("view-welcome");
    return;
  }

  const snap = await db.collection("users").doc(user.uid).get();
  if (!snap.exists) return;
  currentUserDoc = snap.data();

  // Maintenance mode
  const cfg = await db.collection("config").doc("app").get();
  if (cfg.exists && cfg.data().isClosed && !currentUserDoc.isOwner) {
    showStatus("Site under maintenance.");
    switchView("view-welcome");
    $("nav-bar").classList.add("hidden");
    return;
  }

  $("nav-bar").classList.remove("hidden");

  $("admin-nav-btn").classList.toggle("hidden", !currentUserDoc.isAdmin && !currentUserDoc.isOwner);
  $("owner-nav-btn").classList.toggle("hidden", !currentUserDoc.isOwner);

  // apply theme
  currentTheme = currentUserDoc.theme || "light";
  applyTheme(currentTheme);
  $("settings-theme").value = currentTheme;

  // Load all relevant data
  loadFeed();
  loadMyProfile();
  loadFriends();
  loadDMFriends();
  loadBilling();

  if (currentUserDoc.isAdmin || currentUserDoc.isOwner) loadAdmin();
  if (currentUserDoc.isOwner) {
    loadOwnerStats();
    loadOwnerSettings();
  }

  // Default view
  switchView("view-feed");
  showStatus("Logged in.");
});

// ============================
// Nav Buttons
// ============================

document.querySelectorAll("nav button[data-view]")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.view;
      switchView("view-" + v);

      if (v === "profile") loadMyProfile();
      if (v === "friends") loadFriends();
      if (v === "dms") loadDMFriends();
      if (v === "billing") loadBilling();
      if (v === "admin") loadAdmin();
      if (v === "owner") {
        loadOwnerStats();
        loadOwnerSettings();
      }
    });
  });

// ============================
// Public Search (welcome page)
// ============================

$("public-search-btn").addEventListener("click", async () => {
  const q = $("public-search-input").value.trim().toLowerCase();
  const area = $("public-search-results");
  area.innerHTML = "";

  if (!q) return;

  try {
    const snap = await db.collection("users")
      .orderBy("displayName")
      .startAt(q)
      .endAt(q + "\uf8ff")
      .limit(20)
      .get();

    if (snap.empty) {
      area.textContent = "No results.";
      return;
    }

    snap.forEach(doc => {
      const u = doc.data();

      const div = document.createElement("div");
      div.className = "card profile-card";
      div.innerHTML = `
        <div class="profile-banner ${u.banner || "banner-default"}"></div>
        <div class="profile-card-body">
          <strong>${u.displayName}</strong><br>
          <small>${u.city || ""} ${u.country || ""}</small><br>
          <a href="profile.html?uid=${doc.id}">Open Profile</a>
        </div>
      `;
      area.appendChild(div);
    });
  } catch (err) {
    area.textContent = "Search error.";
  }
});

// ============================
// FEED: create posts, list posts, like/comment
// ============================

$("post-submit-btn").addEventListener("click", async () => {
  if (!currentUser) return showStatus("Login first", true);

  const text = $("post-text").value.trim();
  const vis = $("post-visibility").value;
  const album = $("post-album").value.trim();
  const file = $("post-image").files[0];

  if (!text && !file) {
    return showStatus("Write something or attach an image", true);
  }

  let imageUrl = "", imagePath = "";

  try {
    if (file) {
      const path = `public/posts/${currentUser.uid}/${Date.now()}-${file.name}`;
      const ref = storage.ref().child(path);
      await ref.put(file);
      imageUrl = await ref.getDownloadURL();
      imagePath = path;
    }

    await db.collection("posts").add({
      authorId: currentUser.uid,
      authorName: currentUserDoc.displayName,
      text,
      visibility: vis,
      album,
      imageUrl,
      imagePath,
      likeCount: 0,
      commentCount: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    $("post-text").value = "";
    $("post-album").value = "";
    $("post-image").value = "";

    loadFeed();
    loadMyPosts();
    loadGallery();

    showStatus("Posted.");
  } catch (err) {
    showStatus(err.message, true);
  }
});

async function loadFeed() {
  if (!currentUser) return;
  const area = $("feed-posts");
  area.innerHTML = "Loading...";

  try {
    const snap = await db.collection("posts")
      .orderBy("createdAt", "desc")
      .limit(50).get();

    const friendSnap = await db.collection("users")
      .doc(currentUser.uid)
      .collection("friends")
      .get();

    const friendIds = new Set();
    friendSnap.forEach(doc => friendIds.add(doc.id));

    area.innerHTML = "";

    snap.forEach(doc => {
      const p = doc.data();

      // app-side visibility
      const allowed =
        p.visibility === "public" ||
        currentUser.uid === p.authorId ||
        friendIds.has(p.authorId) ||
        currentUserDoc.isAdmin ||
        currentUserDoc.isOwner;

      if (!allowed) return;

      const div = document.createElement("div");
      div.className = "card post";
      div.innerHTML = `
        <div class="post-header">
          <div><strong>${p.authorName}</strong></div>
          <div class="post-meta">${formatDate(p.createdAt)} · ${p.visibility}</div>
        </div>

        <p>${p.text}</p>

        ${p.imageUrl ? `
          <img src="${p.imageUrl}"
               style="max-width:100%;border-radius:6px;margin-bottom:0.4rem;">`
        : ""}

        <div class="post-actions">
          <button data-like="${doc.id}">Like</button>
          <button data-comment="${doc.id}">Comment</button>
          <button data-addfriend="${p.authorId}">Add Friend</button>
          ${p.imageUrl ? `<button data-download="${p.imageUrl}">Download</button>` : ""}
          ${
            (p.authorId === currentUser.uid || currentUserDoc.isAdmin || currentUserDoc.isOwner)
            ? `<button data-deletepost="${doc.id}" class="danger">Delete</button>`
            : ""
          }
        </div>

        <div id="comments-${doc.id}" class="comments"></div>
      `;
      area.appendChild(div);
    });

    area.addEventListener("click", feedClickHandler);
  } catch (err) {
    area.innerHTML = "Error loading feed.";
  }
}

async function feedClickHandler(e) {
  const t = e.target;

  if (t.dataset.like) toggleLike(t.dataset.like);
  else if (t.dataset.comment) {
    const text = prompt("Write a comment:");
    if (text) addComment(t.dataset.comment, text);
  }
  else if (t.dataset.addfriend) addFriend(t.dataset.addfriend);
  else if (t.dataset.deletepost && confirm("Delete post?")) {
    deletePost(t.dataset.deletepost);
  }
  else if (t.dataset.download) window.open(t.dataset.download);
}

async function toggleLike(postId) {
  const likeId = `${currentUser.uid}_${postId}`;
  const ref = db.collection("likes").doc(likeId);
  const snap = await ref.get();

  if (snap.exists) {
    await ref.delete();
    await db.collection("posts").doc(postId)
      .update({ likeCount: firebase.firestore.FieldValue.increment(-1) });
  } else {
    await ref.set({
      userId: currentUser.uid,
      postId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await db.collection("posts").doc(postId)
      .update({ likeCount: firebase.firestore.FieldValue.increment(1) });
  }
  loadFeed();
}

async function addComment(postId, text) {
  await db.collection("comments").add({
    postId,
    authorId: currentUser.uid,
    authorName: currentUserDoc.displayName,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await db.collection("posts").doc(postId)
    .update({ commentCount: firebase.firestore.FieldValue.increment(1) });
  loadFeed();
}

async function deletePost(postId) {
  const snap = await db.collection("posts").doc(postId).get();
  if (!snap.exists) return;

  const p = snap.data();
  if (p.imagePath) {
    try { await storage.ref().child(p.imagePath).delete(); } catch {}
  }

  await snap.ref.delete();
  loadFeed();
  loadMyPosts();
  loadGallery();
}

// ============================
// PROFILE (my profile)
// ============================

async function loadMyProfile() {
  if (!currentUser) return;

  const snap = await db.collection("users").doc(currentUser.uid).get();
  currentUserDoc = snap.data();

  const u = currentUserDoc;
  const card = `
    <div class="card profile-card">
      <div class="profile-banner ${u.banner}"></div>
      <div class="profile-card-body">
        <img src="${u.photoURL || "https://via.placeholder.com/64"}" class="profile-photo">
        <h3>${u.displayName}</h3>
        <p>${u.about}</p>
        <p>${u.fullName} · ${u.age ?? ""}</p>
        <p>${u.city} ${u.country}</p>
        <p>Referral Points: ${u.referralPoints || 0}</p>
      </div>
    </div>
  `;

  $("my-profile-info").innerHTML = card;

  $("profile-fullname").value = u.fullName || "";
  $("profile-age").value = u.age || "";
  $("profile-city").value = u.city || "";
  $("profile-country").value = u.country || "";
  $("profile-about").value = u.about || "";
  $("profile-displayname").value = u.displayName || "";
  $("profile-banner").value = u.banner || "banner-default";

  $("referral-points").textContent = u.referralPoints || 0;

  loadMyPosts();
  loadGallery();
  loadReferralCodes();
}

async function loadMyPosts() {
  if (!currentUser) return;
  const area = $("my-posts");
  area.innerHTML = "Loading...";

  const snap = await db.collection("posts")
    .where("authorId", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .get();

  area.innerHTML = "";
  snap.forEach(doc => {
    const p = doc.data();
    const div = document.createElement("div");
    div.className = "card post";
    div.innerHTML = `
      <div class="post-meta">${formatDate(p.createdAt)} · ${p.visibility}</div>
      <p>${p.text}</p>
      ${p.imageUrl ? `<img src="${p.imageUrl}" style="max-width:100%;">` : ""}
    `;
    area.appendChild(div);
  });
}

$("profile-save-btn").addEventListener("click", async () => {
  if (!currentUser) return;

  const fullName = $("profile-fullname").value.trim();
  const age = Number($("profile-age").value) || null;
  const city = $("profile-city").value.trim();
  const country = $("profile-country").value.trim();
  const about = $("profile-about").value.trim();
  const displayName = $("profile-displayname").value.trim();
  const banner = $("profile-banner").value;
  const file = $("profile-photo").files[0];

  let updates = {
    fullName,
    age,
    city,
    country,
    about,
    displayName: displayName || currentUserDoc.displayName,
    banner
  };

  try {
    if (file) {
      const path = `public/profilePhotos/${currentUser.uid}-${Date.now()}-${file.name}`;
      const ref = storage.ref().child(path);
      await ref.put(file);
      updates.photoURL = await ref.getDownloadURL();
    }

    await db.collection("users").doc(currentUser.uid).update(updates);

    showStatus("Profile updated.");
    loadMyProfile();
  } catch (err) {
    showStatus(err.message, true);
  }
});


// ============================
// ============================
// GALLERY
// ============================

$("gallery-refresh-btn").addEventListener("click", () => {
  loadGallery();
});

async function loadGallery() {
  if (!currentUser) return;

  const area = $("photo-gallery");
  area.innerHTML = "Loading...";

  const albumFilter = $("gallery-album-filter").value.trim();

  const snap = await db.collection("posts")
    .where("authorId", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .get();

  area.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "gallery-grid";

  snap.forEach(doc => {
    const p = doc.data();

    if (!p.imageUrl) return;
    if (albumFilter && p.album !== albumFilter) return;

    const img = document.createElement("img");
    img.src = p.imageUrl;
    img.title = p.album || "";
    img.addEventListener("click", () => window.open(p.imageUrl, "_blank"));
    grid.appendChild(img);
  });

  area.appendChild(grid);
}

// ============================
// REFERRAL SYSTEM
// ============================

async function loadReferralCodes() {
  if (!currentUser) return;

  const area = $("referral-codes-list");
  area.innerHTML = "Loading...";

  const snap = await db.collection("referralCodes")
    .where("ownerUid", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .get();

  area.innerHTML = "";
  snap.forEach(doc => {
    const r = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>Code:</strong> ${r.code}<br>
      <small>Used ${r.usedCount || 0} times</small>
    `;
    area.appendChild(div);
  });
}

$("create-referral-btn").addEventListener("click", async () => {
  if (!currentUser) return;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const snap = await db.collection("referralCodes")
    .where("ownerUid", "==", currentUser.uid)
    .where("createdAt", ">=", firebase.firestore.Timestamp.fromDate(monthStart))
    .get();

  if (snap.size >= 5) {
    alert("Maximum 5 referral codes per month reached.");
    return;
  }

  const code = randomCode(8);
  await db.collection("referralCodes").add({
    ownerUid: currentUser.uid,
    code,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    usedBy: [],
    usedCount: 0
  });

  alert("Referral code created: " + code);
  loadReferralCodes();
});

$("referral-optout-btn").addEventListener("click", async () => {
  if (!currentUser) return;
  if (!confirm("Delete all referral credits and opt out?")) return;

  const snap = await db.collection("referralCodes")
    .where("ownerUid", "==", currentUser.uid)
    .get();

  const batch = db.batch();
  snap.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  await db.collection("users").doc(currentUser.uid)
    .update({ referralPoints: 0, referralOptIn: false });

  alert("You are no longer in the referral program.");
  loadMyProfile();
});

// ============================
// FRIENDS
// ============================

async function addFriend(otherUid) {
  if (!currentUser || otherUid === currentUser.uid) return;

  const myRef = db.collection("users")
    .doc(currentUser.uid)
    .collection("friends")
    .doc(otherUid);

  const theirRef = db.collection("users")
    .doc(otherUid)
    .collection("friends")
    .doc(currentUser.uid);

  await myRef.set({ createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  await theirRef.set({ createdAt: firebase.firestore.FieldValue.serverTimestamp() });

  showStatus("Friend added.");
  loadFriends();
  loadDMFriends();
}

async function loadFriends() {
  if (!currentUser) return;

  const area = $("friends-list");
  area.innerHTML = "Loading...";

  const snap = await db.collection("users")
    .doc(currentUser.uid)
    .collection("friends")
    .get();

  if (snap.empty) {
    area.textContent = "No friends yet.";
    return;
  }

  const ids = snap.docs.map(x => x.id);

  const usersSnap = await db.collection("users")
    .where(firebase.firestore.FieldPath.documentId(), "in", ids.slice(0, 10))
    .get();

  area.innerHTML = "";
  usersSnap.forEach(doc => {
    const u = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${u.displayName}</strong><br>
      Age: ${u.age || "?"}<br>
      ${u.city || ""} ${u.country || ""}
    `;
    area.appendChild(div);
  });

  loadFriendRecommendations(ids);
}

$("friends-search-btn").addEventListener("click", async () => {
  if (!currentUser) return;
  const q = $("friends-search-input").value.trim().toLowerCase();
  const area = $("friends-search-results");
  area.innerHTML = "";

  if (!q) return;

  const snap = await db.collection("users")
    .orderBy("displayName")
    .startAt(q)
    .endAt(q + "\uf8ff")
    .limit(20)
    .get();

  if (snap.empty) {
    area.textContent = "No users found.";
    return;
  }

  const friendSnap = await db.collection("users")
    .doc(currentUser.uid)
    .collection("friends")
    .get();

  const friendIds = new Set();
  friendSnap.forEach(doc => friendIds.add(doc.id));

  snap.forEach(doc => {
    if (doc.id === currentUser.uid) return;

    const u = doc.data();
    const div = document.createElement("div");
    div.className = "card";

    const already = friendIds.has(doc.id);

    div.innerHTML = `
      <strong>${u.displayName}</strong><br>
      ${u.city || ""} ${u.country || ""}<br>
      <button data-friend-add="${doc.id}">${already ? "Already friend" : "Add friend"}</button>
    `;
    area.appendChild(div);
  });

  area.addEventListener("click", async e => {
    if (e.target.dataset.friendAdd) {
      await addFriend(e.target.dataset.friendAdd);
      $("friends-search-btn").click();
    }
  });
});

async function loadFriendRecommendations(friendIds) {
  const area = $("friend-recommendations");
  area.innerHTML = "Loading...";

  if (!friendIds.length) {
    area.textContent = "No recommendations yet.";
    return;
  }

  const first = friendIds[0];
  const snap = await db.collection("users")
    .doc(first)
    .collection("friends")
    .get();

  const recIds = [];
  snap.forEach(doc => {
    const id = doc.id;
    if (id !== currentUser.uid && !friendIds.includes(id)) {
      recIds.push(id);
    }
  });

  if (!recIds.length) {
    area.textContent = "No recommendations yet.";
    return;
  }

  const usersSnap = await db.collection("users")
    .where(firebase.firestore.FieldPath.documentId(), "in", recIds.slice(0, 10))
    .get();

  area.innerHTML = "";
  usersSnap.forEach(doc => {
    const u = doc.data();
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${u.displayName}</strong><br>
      ${u.city || ""} ${u.country || ""}<br>
      <button data-rec-add="${doc.id}">Add friend</button>
    `;
    area.appendChild(div);
  });

  area.addEventListener("click", async e => {
    if (e.target.dataset.recAdd) {
      await addFriend(e.target.dataset.recAdd);
      loadFriends();
    }
  });
}

// ============================
// DMs
// ============================

async function loadDMFriends() {
  if (!currentUser) return;

  const area = $("dm-friends-list");
  area.innerHTML = "Loading...";

  const snap = await db.collection("users")
    .doc(currentUser.uid)
    .collection("friends")
    .get();

  if (snap.empty) {
    area.textContent = "No friends to DM.";
    return;
  }

  const ids = snap.docs.map(d => d.id);

  const usersSnap = await db.collection("users")
    .where(firebase.firestore.FieldPath.documentId(), "in", ids.slice(0, 10))
    .get();

  area.innerHTML = "";
  usersSnap.forEach(doc => {
    const u = doc.data();
    const btn = document.createElement("button");
    btn.textContent = u.displayName;
    btn.addEventListener("click", () => openConversationWith(doc.id, u.displayName));
    area.appendChild(btn);
  });
}

function conversationIdFor(a, b) {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}

async function openConversationWith(otherUid, name) {
  currentConversationWith = otherUid;
  $("dm-current-user-title").textContent = "Conversation with " + name;
  $("dm-input-area").classList.remove("hidden");
  loadMessages();
}

async function loadMessages() {
  if (!currentConversationWith) return;

  const convId = conversationIdFor(currentUser.uid, currentConversationWith);
  const convRef = db.collection("conversations").doc(convId);

  const doc = await convRef.get();
  if (!doc.exists) {
    await convRef.set({
      participantIds: [currentUser.uid, currentConversationWith],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  const snap = await convRef.collection("messages")
    .orderBy("createdAt", "asc")
    .get();

  const area = $("dm-messages");
  area.innerHTML = "";

  snap.forEach(doc => {
    const m = doc.data();
    const div = document.createElement("div");
    div.className = "dm-message " + (m.senderId === currentUser.uid ? "me" : "them");
    div.textContent = `${m.text} (${formatDate(m.createdAt)})`;
    area.appendChild(div);
  });

  area.scrollTop = area.scrollHeight;
}

$("dm-send-btn").addEventListener("click", async () => {
  if (!currentConversationWith) return;

  const text = $("dm-text").value.trim();
  if (!text) return;

  const convId = conversationIdFor(currentUser.uid, currentConversationWith);
  const convRef = db.collection("conversations").doc(convId);

  await convRef.collection("messages").add({
    senderId: currentUser.uid,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  $("dm-text").value = "";
  loadMessages();
});

// ============================
// BILLING
// ============================

async function loadBilling() {
  if (!currentUser) return;

  const snap = await db.collection("users")
    .doc(currentUser.uid)
    .collection("billing")
    .doc("main")
    .get();

  if (!snap.exists) return;

  const b = snap.data();
  $("billing-name").value = b.name || "";
  $("billing-address").value = b.address || "";
  $("billing-city").value = b.city || "";
  $("billing-country").value = b.country || "";
  $("billing-vat").value = b.vat || "";
}

$("billing-save-btn").addEventListener("click", async () => {
  if (!currentUser) return;

  const data = {
    name: $("billing-name").value.trim(),
    address: $("billing-address").value.trim(),
    city: $("billing-city").value.trim(),
    country: $("billing-country").value.trim(),
    vat: $("billing-vat").value.trim()
  };

  await db.collection("users")
    .doc(currentUser.uid)
    .collection("billing")
    .doc("main")
    .set(data, { merge: true });

  $("billing-status").textContent = "Billing info saved.";
});

// ============================
// SETTINGS
// ============================

$("settings-theme").addEventListener("change", async (e) => {
  if (!currentUser) return;

  const theme = e.target.value;
  await db.collection("users").doc(currentUser.uid).update({ theme });
  applyTheme(theme);
  showStatus("Theme updated.");
});

$("settings-save-btn").addEventListener("click", async () => {
  if (!currentUser) return;

  const name = $("settings-displayname").value.trim();
  await db.collection("users")
    .doc(currentUser.uid)
    .update({ displayName: name });

  showStatus("Settings saved.");
});

// DOWNLOAD DATA
$("download-data-btn").addEventListener("click", async () => {
  if (!currentUser) return;

  $("download-data-status").textContent = "Preparing data...";

  const uid = currentUser.uid;
  const result = {
    user: null,
    posts: [],
    comments: [],
    likes: [],
    friends: [],
    messages: []
  };

  result.user = (await db.collection("users").doc(uid).get()).data();

  const postsSnap = await db.collection("posts").where("authorId", "==", uid).get();
  postsSnap.forEach(d => result.posts.push({ id: d.id, ...d.data() }));

  const commentsSnap = await db.collection("comments").where("authorId", "==", uid).get();
  commentsSnap.forEach(d => result.comments.push({ id: d.id, ...d.data() }));

  const likesSnap = await db.collection("likes").where("userId", "==", uid).get();
  likesSnap.forEach(d => result.likes.push({ id: d.id, ...d.data() }));

  const friendSnap = await db.collection("users").doc(uid).collection("friends").get();
  friendSnap.forEach(d => result.friends.push({ id: d.id, ...d.data() }));

  const convSnap = await db.collection("conversations")
    .where("participantIds", "array-contains", uid)
    .get();

  for (const conv of convSnap.docs) {
    const convId = conv.id;
    const msgSnap = await conv.ref.collection("messages").get();
    msgSnap.forEach(m => {
      result.messages.push({ conversationId: convId, id: m.id, ...m.data() });
    });
  }

  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "my-data.json";
  a.click();

  URL.revokeObjectURL(url);

  $("download-data-status").textContent = "Download started.";
});

// DELETE ACCOUNT
$("delete-account-btn").addEventListener("click", async () => {
  if (!currentUser) return;
  if (!confirm("Really delete your account?")) return;

  const uid = currentUser.uid;

  // Delete posts
  const postsSnap = await db.collection("posts").where("authorId", "==", uid).get();
  for (const doc of postsSnap.docs) await doc.ref.delete();

  // Comments
  const comSnap = await db.collection("comments").where("authorId", "==", uid).get();
  for (const doc of comSnap.docs) await doc.ref.delete();

  // Likes
  const likesSnap = await db.collection("likes").where("userId", "==", uid).get();
  for (const doc of likesSnap.docs) await doc.ref.delete();

  // Friends
  const friendSnap = await db.collection("users").doc(uid).collection("friends").get();
  for (const doc of friendSnap.docs) {
    const friendId = doc.id;
    await doc.ref.delete();
    await db.collection("users").doc(friendId).collection("friends").doc(uid).delete();
  }

  // User doc
  await db.collection("users").doc(uid).delete();

  try {
    await currentUser.delete();
  } catch {
    showStatus("Re-authenticate to delete.", true);
  }

  $("delete-account-status").textContent = "Account deletion complete.";
});

// ============================
// ADMIN PANEL (FULL)
// ============================

async function loadAdmin() {
  if (!currentUserDoc?.isAdmin && !currentUserDoc?.isOwner) return;

  // USERS
  const usersArea = $("admin-users");
  usersArea.innerHTML = "Loading...";

  const usersSnap = await db.collection("users")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  usersArea.innerHTML = "";

  usersSnap.forEach(doc => {
    const u = doc.data();

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${u.displayName}</strong><br>
      Email: ${u.email}<br>
      Admin: ${u.isAdmin ? "Yes" : "No"} · Owner: ${u.isOwner ? "Yes" : "No"}<br><br>

      <button data-admin-edit="${doc.id}">Edit User</button>
      <button data-admin-toggle="${doc.id}">
        ${u.isAdmin ? "Remove Admin" : "Make Admin"}
      </button>
      <button data-admin-deleteuser="${doc.id}" class="danger">Delete User</button>
    `;

    usersArea.appendChild(div);
  });

  // EVENTS FOR USER ACTIONS
  usersArea.addEventListener("click", async (e) => {
    // OPEN EDIT MODAL
    if (e.target.dataset.adminEdit) {
      openAdminEditor(e.target.dataset.adminEdit);
      return;
    }

    // TOGGLE ADMIN
    if (e.target.dataset.adminToggle) {
      const uid = e.target.dataset.adminToggle;

      if (uid === currentUser.uid && currentUserDoc.isOwner) {
        alert("Owner cannot remove their own admin status.");
        return;
      }

      const ref = db.collection("users").doc(uid);
      const snap = await ref.get();
      await ref.update({ isAdmin: !snap.data().isAdmin });

      loadAdmin();
      return;
    }

    // DELETE USER
    if (e.target.dataset.adminDeleteuser) {
      const uid = e.target.dataset.adminDeleteuser;
      if (!confirm("Delete this user's Firestore docs?")) return;

      await db.collection("users").doc(uid).delete();
      loadAdmin();
      return;
    }
  });

  // POSTS
  const postsArea = $("admin-posts");
  postsArea.innerHTML = "Loading...";

  const postsSnap = await db.collection("posts")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  postsArea.innerHTML = "";

  postsSnap.forEach(doc => {
    const p = doc.data();
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${p.authorName}</strong> · ${p.visibility}<br>
      ${p.text}<br>
      <button data-admin-deletepost="${doc.id}" class="danger">Delete Post</button>
    `;

    postsArea.appendChild(div);
  });

  postsArea.addEventListener("click", async (e) => {
    if (e.target.dataset.adminDeletepost) {
      if (confirm("Delete this post?")) {
        await db.collection("posts").doc(e.target.dataset.adminDeletepost).delete();
        loadAdmin();
      }
    }
  });
}

// ============================
// ADMIN EDIT MODAL LOGIC
// ============================

const editModal = $("admin-edit-modal");
const editBody = $("admin-edit-body");
let adminEditingUid = null;

async function openAdminEditor(uid) {
  adminEditingUid = uid;

  const snap = await db.collection("users").doc(uid).get();
  if (!snap.exists) return alert("User not found.");

  const u = snap.data();

  if (u.isOwner)
    return alert("Cannot edit the owner account.");

  editBody.innerHTML = `
    <label>Display Name:
      <input id="admin-edit-displayName" value="${u.displayName || ""}">
    </label>

    <label>Full Name:
      <input id="admin-edit-fullName" value="${u.fullName || ""}">
    </label>

    <label>Age:
      <input id="admin-edit-age" type="number" value="${u.age || ""}">
    </label>

    <label>City:
      <input id="admin-edit-city" value="${u.city || ""}">
    </label>

    <label>Country:
      <input id="admin-edit-country" value="${u.country || ""}">
    </label>

    <label>About:
      <textarea id="admin-edit-about">${u.about || ""}</textarea>
    </label>

    <label>Banner:
      <select id="admin-edit-banner">
        <option value="banner-default" ${u.banner === "banner-default" ? "selected" : ""}>Default</option>
        <option value="banner-blue" ${u.banner === "banner-blue" ? "selected" : ""}>Blue</option>
        <option value="banner-green" ${u.banner === "banner-green" ? "selected" : ""}>Green</option>
        <option value="banner-pink" ${u.banner === "banner-pink" ? "selected" : ""}>Pink</option>
      </select>
    </label>

    <label>Theme:
      <select id="admin-edit-theme">
        <option value="light" ${u.theme === "light" ? "selected" : ""}>Light</option>
        <option value="dark" ${u.theme === "dark" ? "selected" : ""}>Dark</option>
        <option value="blue" ${u.theme === "blue" ? "selected" : ""}>Blue</option>
      </select>
    </label>

    <label>Referral Points:
      <input id="admin-edit-refpoints" type="number" value="${u.referralPoints || 0}">
    </label>

    <label>
      <input type="checkbox" id="admin-edit-reset-photo">
      Reset profile photo
    </label>
  `;

  editModal.classList.remove("hidden");
}

$("admin-edit-save-btn").addEventListener("click", async () => {
  if (!adminEditingUid) return;

  const updates = {
    displayName: $("admin-edit-displayName").value.trim(),
    fullName: $("admin-edit-fullName").value.trim(),
    age: Number($("admin-edit-age").value) || null,
    city: $("admin-edit-city").value.trim(),
    country: $("admin-edit-country").value.trim(),
    about: $("admin-edit-about").value.trim(),
    banner: $("admin-edit-banner").value,
    theme: $("admin-edit-theme").value,
    referralPoints: Number($("admin-edit-refpoints").value)
  };

  if ($("admin-edit-reset-photo").checked)
    updates.photoURL = "";

  await db.collection("users").doc(adminEditingUid).update(updates);

  editModal.classList.add("hidden");
  adminEditingUid = null;
  loadAdmin();
});

$("admin-edit-cancel-btn").addEventListener("click", () => {
  editModal.classList.add("hidden");
  adminEditingUid = null;
});

// ============================
// OWNER DASHBOARD
// ============================

async function loadOwnerStats() {
  if (!currentUserDoc?.isOwner) return;

  $("stats-users").textContent =
    (await db.collection("users").get()).size;

  $("stats-posts").textContent =
    (await db.collection("posts").get()).size;

  $("stats-comments").textContent =
    (await db.collection("comments").get()).size;

  $("stats-conversations").textContent =
    (await db.collection("conversations").get()).size;
}

async function loadOwnerSettings() {
  const snap = await db.collection("config").doc("app").get();
  $("app-closed-checkbox").checked = snap.exists && snap.data().isClosed;
}

$("app-settings-save-btn").addEventListener("click", async () => {
  if (!currentUserDoc?.isOwner) return;

  const closed = $("app-closed-checkbox").checked;

  await db.collection("config").doc("app").set(
    { isClosed: closed },
    { merge: true }
  );

  $("app-settings-status").textContent = "Settings saved.";
});

// ============================
// INITIAL
// ============================

applyTheme("light");

// END OF PART 2


