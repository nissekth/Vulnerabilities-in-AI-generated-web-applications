// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

// TODO: REPLACE WITH YOUR CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDiDm1e5F_zWasVDWGNq4xoikFlq9b-dbc",
  authDomain: "gpt-4-aa300.firebaseapp.com",
  projectId: "gpt-4-aa300",
  storageBucket: "gpt-4-aa300.firebasestorage.app",
  messagingSenderId: "487139351676",
  appId: "1:487139351676:web:e2de5024d034a42484bdf9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,  // For ZAP testing
});
const storage = getStorage(app);

// In Firestore we'll store a special doc for site settings
const OWNER_SETTINGS_DOC = "siteSettings/ownerSettings";

let currentUser = null;
let currentUserData = null;
let currentDMThreadId = null;

// Utility: get elements
const $ = (id) => document.getElementById(id);

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  $("year").textContent = new Date().getFullYear();
  setupNav();
  setupAuthForms();
  setupProfile();
  setupFeed();
  setupSettings();
  setupFriends();
  setupDMs();
  setupBilling();
  setupAdmin();
  setupOwner();
  setupReferral();

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (!user) {
      currentUserData = null;
      showLoggedOutUI();
      return;
    }
    // Load user doc
    const userDocRef = doc(db, "users", user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      // Create basic profile if missing
      const base = {
        uid: user.uid,
        email: user.email,
        displayName: user.email,
        displayNameLower: (user.email || "").toLowerCase(),
        createdAt: Timestamp.now(),
        isAdmin: false,
        isOwner: false,
        disabled: false,
        theme: "theme-light",
        referralPoints: 0,
        referralOptOut: false
      };
      await setDoc(userDocRef, base);
      currentUserData = base;
    } else {
      currentUserData = snap.data();
    }

    // If user is disabled, log them out
    if (currentUserData.disabled) {
      alert("Your account has been disabled by an admin.");
      await signOut(auth);
      return;
    }

    // Apply theme
    document.body.className = currentUserData.theme || "theme-light";
    $("current-user-display").textContent = `Logged in as ${currentUserData.displayName || user.email}`;
    showLoggedInUI();
    await refreshAllData();
  });

  $("logout-btn").addEventListener("click", async () => {
    await signOut(auth);
  });
});

/*************** NAVIGATION ***************/
function setupNav() {
  const navBar = $("nav-bar");
  navBar.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.section) {
      showSection(e.target.dataset.section);
    }
  });
}

function showSection(sectionId) {
  const sections = document.querySelectorAll("main > section");
  sections.forEach((s) => {
    s.classList.toggle("hidden", s.id !== sectionId);
  });
}

function showLoggedOutUI() {
  $("current-user-display").textContent = "Not logged in";
  // Show auth and welcome
  $("auth-section").classList.remove("hidden");
  $("welcome-section").classList.remove("hidden");
  const authed = document.querySelectorAll(".nav-auth-only");
  authed.forEach((el) => (el.style.display = "none"));
  const adminEls = document.querySelectorAll(".nav-admin-only, .nav-owner-only");
  adminEls.forEach((el) => (el.style.display = "none"));

  // Hide main sections
  const sections = [
    "feed-section",
    "profile-section",
    "settings-section",
    "friends-section",
    "dms-section",
    "billing-section",
    "admin-section",
    "owner-section",
    "referral-section"
  ];
  sections.forEach((id) => $(id).classList.add("hidden"));
}

function showLoggedInUI() {
  $("auth-section").classList.add("hidden");
  $("welcome-section").classList.add("hidden");
  const authed = document.querySelectorAll(".nav-auth-only");
  authed.forEach((el) => (el.style.display = "inline-block"));

  const adminEls = document.querySelectorAll(".nav-admin-only");
  adminEls.forEach((el) => (el.style.display = currentUserData?.isAdmin ? "inline-block" : "none"));

  const ownerEls = document.querySelectorAll(".nav-owner-only");
  ownerEls.forEach((el) => (el.style.display = currentUserData?.isOwner ? "inline-block" : "none"));

  // Default to Feed
  showSection("feed-section");
  $("referral-section").classList.remove("hidden");
}

/*************** AUTH ***************/
function setupAuthForms() {
  const loginForm = $("login-form");
  const registerForm = $("register-form");
  const adminLoginForm = $("admin-login-form");
  const adminToggle = $("admin-login-toggle");
  const adminSection = $("admin-login-section");

  adminToggle.addEventListener("click", () => {
    adminSection.classList.toggle("hidden");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("login-email").value;
    const password = $("login-password").value;
    const remember = $("login-remember").checked;
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Login error: " + err.message);
    }
  });

  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("admin-login-email").value;
    const password = $("admin-login-password").value;
    const remember = $("admin-login-remember").checked;
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // If account is admin, they will see admin nav; otherwise normal user.
    } catch (err) {
      alert("Admin login error: " + err.message);
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("register-email").value;
    const password = $("register-password").value;
    const displayName = $("register-display-name").value;
    const referralCode = $("register-referral").value.trim();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const userDocRef = doc(db, "users", user.uid);
      const data = {
        uid: user.uid,
        email,
        displayName,
        displayNameLower: displayName.toLowerCase(),
        createdAt: Timestamp.now(),
        isAdmin: false,
        isOwner: false,
        disabled: false,
        theme: "theme-light",
        referralPoints: 0,
        referralOptOut: false
      };

      // Handle referral if code provided
      if (referralCode) {
        const refDocRef = doc(db, "referralCodes", referralCode);
        const snap = await getDoc(refDocRef);
        if (snap.exists()) {
          const refData = snap.data();
          const usedBy = refData.usedBy || [];
          if (!usedBy.includes(user.uid)) {
            usedBy.push(user.uid);
            await updateDoc(refDocRef, { usedBy });
            // Add point to referrer
            const refOwnerRef = doc(db, "users", refData.ownerUid);
            const refOwnerSnap = await getDoc(refOwnerRef);
            if (refOwnerSnap.exists()) {
              const currentPoints = refOwnerSnap.data().referralPoints || 0;
              await updateDoc(refOwnerRef, { referralPoints: currentPoints + 1 });
            }
          }
        } else {
          alert("Referral code not found (ignored).");
        }
      }

      await setDoc(userDocRef, data);
      currentUserData = data;
    } catch (err) {
      alert("Register error: " + err.message);
    }
  });

  $("forgot-password-btn").addEventListener("click", async () => {
    const email = prompt("Enter your email to reset password:");
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent (if account exists).");
    } catch (err) {
      alert("Error: " + err.message);
    }
  });

  // Public search
  const publicSearchForm = $("public-search-form");
  publicSearchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const qStr = $("public-search-query").value.toLowerCase();
    const resultsDiv = $("public-search-results");
    resultsDiv.innerHTML = "Searching...";
    if (!qStr) {
      resultsDiv.innerHTML = "Please type something.";
      return;
    }
    const qRef = query(
      collection(db, "users"),
      where("displayNameLower", ">=", qStr),
      where("displayNameLower", "<=", qStr + "\uf8ff"),
      limit(20)
    );
    const snap = await getDocs(qRef);
    resultsDiv.innerHTML = "";
    snap.forEach((docSnap) => {
      const u = docSnap.data();
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <strong>${u.displayName}</strong><br>
        ${u.city || ""} ${u.country || ""}<br>
        <button data-view-profile="${u.uid}">View public profile</button>
      `;
      resultsDiv.appendChild(card);
    });
    resultsDiv.addEventListener("click", async (e) => {
      if (e.target.dataset.viewProfile) {
        const uid = e.target.dataset.viewProfile;
        await showPublicProfile(uid);
      }
    });
  });
}

async function showPublicProfile(uid) {
  const container = $("public-profile-view");
  const userDocRef = doc(db, "users", uid);
  const snap = await getDoc(userDocRef);
  if (!snap.exists()) {
    container.innerHTML = "User not found.";
    return;
  }
  const u = snap.data();
  container.innerHTML = `
    <h3>${u.displayName}</h3>
    <p>${u.about || ""}</p>
    <p>${u.city || ""}, ${u.country || ""}</p>
  `;

  // Show public posts (visibility = public)
  const postsRef = collection(db, "posts");
  const qRef = query(
    postsRef,
    where("authorId", "==", uid),
    where("visibility", "==", "public"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  const snapPosts = await getDocs(qRef);
  const div = document.createElement("div");
  div.innerHTML = "<h4>Public posts</h4>";
  snapPosts.forEach((p) => {
    const post = p.data();
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <div>${post.text}</div>
      ${post.imageUrl ? `<img src="${post.imageUrl}" class="gallery-photo" />` : ""}
    `;
    div.appendChild(el);
  });
  container.appendChild(div);
}

/*************** PROFILE & GALLERY ***************/
function setupProfile() {
  const form = $("profile-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const realName = $("profile-real-name").value;
    const age = parseInt($("profile-age").value || "0", 10) || null;
    const city = $("profile-city").value;
    const country = $("profile-country").value;
    const about = $("profile-about").value;
    const banner = $("profile-banner").value;

    // Upload profile pic if provided
    let photoUrl = currentUserData.photoUrl || null;
    const fileInput = $("profile-picture");
    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const ref = storageRef(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(ref, file);
      photoUrl = await getDownloadURL(ref);
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    await updateDoc(userDocRef, {
      realName: realName || null,
      age,
      city: city || null,
      country: country || null,
      about: about || null,
      banner: banner || "default",
      photoUrl: photoUrl || null
    });
    const snap = await getDoc(userDocRef);
    currentUserData = snap.data();
    alert("Profile saved.");
    await renderMyProfilePreview();
  });

  // Gallery: albums
  $("gallery-album-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const name = $("gallery-new-album-name").value.trim();
    if (!name) return;
    const ref = collection(db, "users", currentUser.uid, "albums");
    await addDoc(ref, {
      name,
      createdAt: Timestamp.now()
    });
    $("gallery-new-album-name").value = "";
    await loadMyAlbums();
  });
}

async function renderMyProfilePreview() {
  const div = $("my-profile-preview");
  const u = currentUserData;
  if (!u) {
    div.innerHTML = "";
    return;
  }
  const bannerClass = {
    default: "banner-default",
    mountains: "banner-mountains",
    city: "banner-city",
    forest: "banner-forest"
  }[u.banner || "default"];

  div.innerHTML = `
    <div class="${bannerClass}"></div>
    <div>
      ${u.photoUrl ? `<img src="${u.photoUrl}" class="gallery-photo" />` : ""}
      <h3>${u.displayName}</h3>
      <p>${u.realName || ""}</p>
      <p>${u.age ? `Age: ${u.age}` : ""}</p>
      <p>${u.city || ""}, ${u.country || ""}</p>
      <p>${u.about || ""}</p>
    </div>
  `;
  await loadMyAlbums();
}

async function loadMyAlbums() {
  const container = $("gallery-albums");
  container.innerHTML = "";
  if (!currentUser) return;
  const albumsRef = collection(db, "users", currentUser.uid, "albums");
  const snap = await getDocs(albumsRef);
  snap.forEach((a) => {
    const album = a.data();
    const div = document.createElement("div");
    div.innerHTML = `<h4>Album: ${album.name}</h4><div id="album-${a.id}"></div>`;
    container.appendChild(div);
    // Photos will appear there as we add from posts
  });
}

/*************** SETTINGS ***************/
function setupSettings() {
  $("settings-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const theme = $("settings-theme").value;
    const displayName = $("settings-display-name").value;
    const userDocRef = doc(db, "users", currentUser.uid);
    await updateDoc(userDocRef, {
      theme,
      displayName,
      displayNameLower: displayName.toLowerCase()
    });
    const snap = await getDoc(userDocRef);
    currentUserData = snap.data();
    document.body.className = theme;
    $("current-user-display").textContent = `Logged in as ${currentUserData.displayName}`;
    alert("Settings saved.");
  });

  $("download-data-btn").addEventListener("click", async () => {
    if (!currentUser) return;
    const data = await exportUserData(currentUser.uid);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = $("download-data-link");
    link.href = url;
    link.download = `my-data-${currentUser.uid}.json`;
    link.textContent = "Click to download your data";
    link.classList.remove("hidden");
  });

  $("delete-account-btn").addEventListener("click", async () => {
    if (!currentUser) return;
    if (!confirm("Are you sure you want to permanently delete your account?")) return;

    // Mark user as disabled and maybe clean up their posts (you as owner can also delete them manually).
    const userDocRef = doc(db, "users", currentUser.uid);
    await updateDoc(userDocRef, { disabled: true });
    try {
      // Try to delete auth user
      await deleteUser(currentUser);
    } catch (err) {
      // If token is old etc., deletion can fail; in that case, you (owner) can delete in console.
      console.error(err);
    }
    alert("Your account has been marked for deletion. Logging out.");
    await signOut(auth);
  });
}

async function exportUserData(uid) {
  const userDocRef = doc(db, "users", uid);
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.exists() ? userSnap.data() : null;

  const posts = [];
  const postsRef = collection(db, "posts");
  const qRef = query(postsRef, where("authorId", "==", uid), orderBy("createdAt", "desc"));
  const postsSnap = await getDocs(qRef);
  postsSnap.forEach((p) => posts.push({ id: p.id, ...p.data() }));

  const friends = [];
  const friendsRef = collection(db, "users", uid, "friends");
  const friendsSnap = await getDocs(friendsRef);
  friendsSnap.forEach((f) => friends.push({ id: f.id, ...f.data() }));

  const billingRef = doc(db, "billingInfos", uid);
  const billingSnap = await getDoc(billingRef);
  const billingData = billingSnap.exists() ? billingSnap.data() : null;

  return { userData, posts, friends, billingData };
}

/*************** FEED / POSTS / COMMENTS / LIKES ***************/
function setupFeed() {
  $("new-post-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const text = $("new-post-text").value;
    const visibility = $("new-post-visibility").value;
    let imageUrl = null;

    const fileInput = $("new-post-image");
    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const ref = storageRef(storage, `postImages/${currentUser.uid}/${Date.now()}-${file.name}`);
      await uploadBytes(ref, file);
      imageUrl = await getDownloadURL(ref);
      // Save image also into gallery (for simplicity we store references in a collection)
      const galleryRef = collection(db, "users", currentUser.uid, "photos");
      await addDoc(galleryRef, {
        imageUrl,
        createdAt: Timestamp.now()
      });
    }

    const postsRef = collection(db, "posts");
    await addDoc(postsRef, {
      authorId: currentUser.uid,
      authorName: currentUserData.displayName,
      text,
      visibility,
      imageUrl,
      createdAt: Timestamp.now(),
      likeCount: 0,
      commentCount: 0
    });

    $("new-post-text").value = "";
    $("new-post-image").value = "";
    await loadFeed();
  });
}

async function loadFeed() {
  if (!currentUser) return;
  const container = $("feed-posts");
  container.innerHTML = "Loading...";
  const postsRef = collection(db, "posts");
  const qRef = query(postsRef, orderBy("createdAt", "desc"), limit(50));
  const snap = await getDocs(qRef);
  container.innerHTML = "";
  for (const docSnap of snap.docs) {
    const post = docSnap.data();
    // Check visibility: show public or our own or friends-only (if we are a friend)
    if (post.visibility === "friends") {
      const isSelf = post.authorId === currentUser.uid;
      const isFriend = await checkIfFriend(currentUser.uid, post.authorId);
      if (!isSelf && !isFriend) continue;
    }
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <strong>${post.authorName}</strong> (${post.visibility})<br>
      <span>${post.text}</span><br>
      ${post.imageUrl ? `<img src="${post.imageUrl}" class="gallery-photo" />` : ""}
      <div class="post-actions">
        <button data-like="${docSnap.id}">Like (${post.likeCount || 0})</button>
        <button data-comment="${docSnap.id}">Comment</button>
        <button data-add-friend="${post.authorId}">Add friend</button>
        ${post.imageUrl ? `<button data-download="${post.imageUrl}">Download image</button>` : ""}
      </div>
      <div class="comments" id="comments-${docSnap.id}"></div>
    `;
    container.appendChild(div);
    await loadComments(docSnap.id);
  }

  container.addEventListener("click", async (e) => {
    if (e.target.dataset.like) {
      await likePost(e.target.dataset.like);
      await loadFeed();
    } else if (e.target.dataset.comment) {
      const text = prompt("Write a comment:");
      if (text) {
        await addComment(e.target.dataset.comment, text);
        await loadFeed();
      }
    } else if (e.target.dataset.addFriend) {
      await addFriend(e.target.dataset.addFriend);
      alert("Friend added (if not already friend).");
      await loadFriends();
    } else if (e.target.dataset.download) {
      window.open(e.target.dataset.download, "_blank");
    }
  });
}

async function loadComments(postId) {
  const container = $(`comments-${postId}`);
  if (!container) return;
  const commentsRef = collection(db, "posts", postId, "comments");
  const qRef = query(commentsRef, orderBy("createdAt", "asc"), limit(20));
  const snap = await getDocs(qRef);
  container.innerHTML = "";
  snap.forEach((c) => {
    const cm = c.data();
    const div = document.createElement("div");
    div.innerHTML = `<em>${cm.authorName}:</em> ${cm.text}`;
    container.appendChild(div);
  });
}

async function likePost(postId) {
  // Simple: we just increment likeCount (no per-user dedup for now)
  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(postRef);
  if (!snap.exists()) return;
  const post = snap.data();
  const newCount = (post.likeCount || 0) + 1;
  await updateDoc(postRef, { likeCount: newCount });
}

async function addComment(postId, text) {
  const commentsRef = collection(db, "posts", postId, "comments");
  await addDoc(commentsRef, {
    authorId: currentUser.uid,
    authorName: currentUserData.displayName,
    text,
    createdAt: Timestamp.now()
  });
  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(postRef);
  if (snap.exists()) {
    const count = (snap.data().commentCount || 0) + 1;
    await updateDoc(postRef, { commentCount: count });
  }
}

/*************** FRIENDS ***************/
function setupFriends() {}

async function addFriend(friendUid) {
  if (!currentUser || friendUid === currentUser.uid) return;
  const friendRef = doc(db, "users", currentUser.uid, "friends", friendUid);
  const snap = await getDoc(friendRef);
  if (!snap.exists()) {
    await setDoc(friendRef, {
      friendUid,
      createdAt: Timestamp.now()
    });
  }
}

async function checkIfFriend(uid, otherUid) {
  const friendRef = doc(db, "users", uid, "friends", otherUid);
  const snap = await getDoc(friendRef);
  return snap.exists();
}

async function loadFriends() {
  if (!currentUser) return;
  const container = $("friends-list");
  container.innerHTML = "Loading...";
  const friendsRef = collection(db, "users", currentUser.uid, "friends");
  const snap = await getDocs(friendsRef);
  container.innerHTML = "";
  for (const f of snap.docs) {
    const data = f.data();
    const friendUid = data.friendUid;
    const userRef = doc(db, "users", friendUid);
    const uSnap = await getDoc(userRef);
    if (!uSnap.exists()) continue;
    const u = uSnap.data();
    const div = document.createElement("div");
    div.className = "friend";
    div.innerHTML = `
      <strong>${u.displayName}</strong><br>
      ${u.realName || ""}<br>
      ${u.age ? `Age: ${u.age}` : ""}<br>
      ${u.city || ""}, ${u.country || ""}<br>
      UID: ${u.uid}<br>
      <button data-dm="${u.uid}">Open DM</button>
    `;
    container.appendChild(div);
  }

  // Simple friend suggestion: users who are not already friends, up to 10
  const suggestionsDiv = $("friends-suggestions");
  suggestionsDiv.innerHTML = "Loading suggestions...";
  const allUsersSnap = await getDocs(collection(db, "users"));
  const friendIds = new Set(snap.docs.map((d) => d.data().friendUid));
  const suggestions = [];
  allUsersSnap.forEach((uSnap) => {
    const u = uSnap.data();
    if (u.uid === currentUser.uid) return;
    if (friendIds.has(u.uid)) return;
    suggestions.push(u);
  });
  suggestionsDiv.innerHTML = "";
  suggestions.slice(0, 10).forEach((u) => {
    const div = document.createElement("div");
    div.className = "friend";
    div.innerHTML = `
      <strong>${u.displayName}</strong> (${u.city || ""}, ${u.country || ""})<br>
      <button data-add-friend="${u.uid}">Add friend</button>
    `;
    suggestionsDiv.appendChild(div);
  });

  container.addEventListener("click", async (e) => {
    if (e.target.dataset.dm) {
      await openDMThread(e.target.dataset.dm);
      showSection("dms-section");
    }
  });
  suggestionsDiv.addEventListener("click", async (e) => {
    if (e.target.dataset.addFriend) {
      await addFriend(e.target.dataset.addFriend);
      alert("Friend added (from suggestions).");
      await loadFriends();
    }
  });
}

/*************** DMS ***************/
function setupDMs() {
  $("dm-start-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const targetUid = $("dm-target-uid").value.trim();
    if (!targetUid) return;
    await openDMThread(targetUid);
  });

  $("dm-send-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser || !currentDMThreadId) return;
    const text = $("dm-message-text").value.trim();
    if (!text) return;
    const msgsRef = collection(db, "dmThreads", currentDMThreadId, "messages");
    await addDoc(msgsRef, {
      authorId: currentUser.uid,
      authorName: currentUserData.displayName,
      text,
      createdAt: Timestamp.now()
    });
    $("dm-message-text").value = "";
    await loadDMMessages(currentDMThreadId);
  });
}

function getThreadId(a, b) {
  return [a, b].sort().join("_");
}

async function openDMThread(targetUid) {
  if (!currentUser) return;
  currentDMThreadId = getThreadId(currentUser.uid, targetUid);
  $("dm-thread-info").textContent = `Conversation with ${targetUid}`;
  $("dm-send-form").classList.remove("hidden");
  await loadDMMessages(currentDMThreadId);
}

async function loadDMMessages(threadId) {
  const container = $("dm-messages");
  container.innerHTML = "Loading...";
  const msgsRef = collection(db, "dmThreads", threadId, "messages");
  const qRef = query(msgsRef, orderBy("createdAt", "asc"), limit(100));
  const snap = await getDocs(qRef);
  container.innerHTML = "";
  snap.forEach((m) => {
    const msg = m.data();
    const div = document.createElement("div");
    div.innerHTML = `<strong>${msg.authorName}:</strong> ${msg.text}`;
    container.appendChild(div);
  });
}

/*************** BILLING ***************/
function setupBilling() {
  $("billing-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const data = {
      name: $("billing-name").value,
      address: $("billing-address").value,
      city: $("billing-city").value,
      country: $("billing-country").value,
      cardType: $("billing-card-type").value,
      updatedAt: Timestamp.now()
    };
    const billingRef = doc(db, "billingInfos", currentUser.uid);
    await setDoc(billingRef, data);
    alert("Billing info saved (this is only stored, no real payments).");
  });
}

/*************** ADMIN ***************/
function setupAdmin() {}

async function loadAdminData() {
  if (!currentUserData?.isAdmin && !currentUserData?.isOwner) return;
  // Users
  const usersDiv = $("admin-users-list");
  usersDiv.innerHTML = "Loading users...";
  const usersSnap = await getDocs(collection(db, "users"));
  usersDiv.innerHTML = "";
  usersSnap.forEach((uSnap) => {
    const u = uSnap.data();
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `
      <strong>${u.displayName}</strong> ${u.isAdmin ? "(Admin)" : ""} ${u.isOwner ? "(Owner)" : ""}<br>
      Email: ${u.email}<br>
      UID: ${u.uid}<br>
      Disabled: ${u.disabled ? "Yes" : "No"}<br>
      <button data-disable="${u.uid}">Toggle disable</button>
    `;
    usersDiv.appendChild(div);
  });

  usersDiv.addEventListener("click", async (e) => {
    if (e.target.dataset.disable) {
      const uid = e.target.dataset.disable;
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const disabled = !!snap.data().disabled;
        await updateDoc(userRef, { disabled: !disabled });
        alert(`User ${uid} disabled = ${!disabled}`);
        await loadAdminData();
      }
    }
  });

  // Posts
  const postsDiv = $("admin-posts-list");
  postsDiv.innerHTML = "Loading posts...";
  const postsRef = collection(db, "posts");
  const qRef = query(postsRef, orderBy("createdAt", "desc"), limit(100));
  const postsSnap = await getDocs(qRef);
  postsDiv.innerHTML = "";
  postsSnap.forEach((pSnap) => {
    const p = pSnap.data();
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <strong>${p.authorName}</strong> (${p.visibility})<br>
      ${p.text}<br>
      <button data-delete-post="${pSnap.id}">Delete post</button>
    `;
    postsDiv.appendChild(div);
  });

  postsDiv.addEventListener("click", async (e) => {
    if (e.target.dataset.deletePost) {
      const postId = e.target.dataset.deletePost;
      if (!confirm("Delete this post?")) return;
      await deleteDoc(doc(db, "posts", postId));
      alert("Post deleted.");
      await loadAdminData();
    }
  });
}

/*************** OWNER ***************/
function setupOwner() {
  $("owner-save-settings-btn").addEventListener("click", async () => {
    if (!currentUserData?.isOwner) return;
    const disabled = $("owner-site-disabled").checked;
    await setDoc(doc(db, "siteSettings", "ownerSettings"), {
      siteDisabled: disabled,
      updatedAt: Timestamp.now()
    });
    alert("Site settings saved.");
  });
}

async function loadOwnerData() {
  if (!currentUserData?.isOwner) return;
  const statsDiv = $("owner-stats");
  statsDiv.innerHTML = "Loading stats...";

  const usersSnap = await getDocs(collection(db, "users"));
  const postsSnap = await getDocs(collection(db, "posts"));

  let totalUsers = 0;
  let totalAdmins = 0;
  usersSnap.forEach((u) => {
    totalUsers++;
    if (u.data().isAdmin) totalAdmins++;
  });

  let totalPosts = 0;
  postsSnap.forEach(() => totalPosts++);

  const settingsSnap = await getDoc(doc(db, "siteSettings", "ownerSettings"));
  const siteDisabled = settingsSnap.exists() ? settingsSnap.data().siteDisabled : false;

  statsDiv.innerHTML = `
    <p>Total users: ${totalUsers}</p>
    <p>Total admins: ${totalAdmins}</p>
    <p>Total posts: ${totalPosts}</p>
    <p>Site disabled: ${siteDisabled ? "Yes" : "No"}</p>
  `;
  $("owner-site-disabled").checked = !!siteDisabled;

  // IMPORTANT: to never lose access:
  // - You should mark your own user as isOwner = true manually once in Firestore.
  // See explanation in instructions below.
}

/*************** REFERRALS ***************/
function setupReferral() {
  $("referral-generate-btn").addEventListener("click", async () => {
    if (!currentUser) return;
    if (currentUserData?.referralOptOut) {
      alert("You have opted out of the referral program.");
      return;
    }

    // Check how many codes created last 30 days
    const now = Timestamp.now();
    const thirtyDaysAgo = Timestamp.fromMillis(now.toMillis() - 30 * 24 * 60 * 60 * 1000);
    const codesRef = collection(db, "referralCodes");
    const qRef = query(
      codesRef,
      where("ownerUid", "==", currentUser.uid),
      where("createdAt", ">", thirtyDaysAgo)
    );
    const snap = await getDocs(qRef);
    if (snap.size >= 5) {
      alert("You already created 5 referral codes in the last 30 days.");
      return;
    }

    const code = `REF-${currentUser.uid.slice(0, 6)}-${Date.now().toString(36)}`;
    const refDocRef = doc(db, "referralCodes", code);
    await setDoc(refDocRef, {
      ownerUid: currentUser.uid,
      createdAt: now,
      usedBy: []
    });
    alert("Referral code created: " + code);
    await loadReferralData();
  });

  $("referral-optout-btn").addEventListener("click", async () => {
    if (!currentUser) return;
    if (!confirm("Delete your referral data and opt out of the program?")) return;
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      referralPoints: 0,
      referralOptOut: true
    });
    currentUserData.referralPoints = 0;
    currentUserData.referralOptOut = true;
    alert("You have opted out. Your referral points were deleted.");
    await loadReferralData();
  });
}

async function loadReferralData() {
  if (!currentUser) return;
  $("referral-points").textContent = currentUserData.referralPoints || 0;
  $("referral-status-text").textContent = currentUserData.referralOptOut
    ? "Opted out"
    : "Active";

  const listDiv = $("referral-codes-list");
  listDiv.innerHTML = "Loading your codes...";
  const codesRef = collection(db, "referralCodes");
  const qRef = query(codesRef, where("ownerUid", "==", currentUser.uid), orderBy("createdAt", "desc"), limit(20));
  const snap = await getDocs(qRef);
  listDiv.innerHTML = "";
  snap.forEach((c) => {
    const d = c.data();
    const div = document.createElement("div");
    div.innerHTML = `
      Code: ${c.id}<br>
      Created: ${d.createdAt.toDate().toLocaleString()}<br>
      Used by: ${(d.usedBy || []).length} users
    `;
    listDiv.appendChild(div);
  });
}

/*************** GLOBAL REFRESH ***************/
async function refreshAllData() {
  if (!currentUser) return;
  await renderMyProfilePreview();
  await loadMyAlbums();
  await loadFeed();
  await loadFriends();
  await loadBillingForCurrentUser();
  await loadAdminData();
  await loadOwnerData();
  await loadReferralData();
  // Pre-fill settings
  $("settings-theme").value = currentUserData.theme || "theme-light";
  $("settings-display-name").value = currentUserData.displayName || "";
}

/*************** BILLING LOAD ***************/
async function loadBillingForCurrentUser() {
  if (!currentUser) return;
  const billingRef = doc(db, "billingInfos", currentUser.uid);
  const snap = await getDoc(billingRef);
  if (!snap.exists()) return;
  const b = snap.data();
  $("billing-name").value = b.name || "";
  $("billing-address").value = b.address || "";
  $("billing-city").value = b.city || "";
  $("billing-country").value = b.country || "";
  $("billing-card-type").value = b.cardType || "";
}

