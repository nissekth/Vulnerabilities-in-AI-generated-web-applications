// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateEmail,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

/** 1. Firebase init — REPLACE WITH YOUR CONFIG **/
const firebaseConfig = {
  apiKey: "AIzaSyDLZ2ETkEePtRgjFkajUAUGYjyYbTBEItw",
  authDomain: "gpt-1-bec24.firebaseapp.com",
  projectId: "gpt-1-bec24",
  storageBucket: "gpt-1-bec24.firebasestorage.app",
  messagingSenderId: "705602025214",
  appId: "1:705602025214:web:fa0744bac2babb7acf97af"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

/** OWNER UID — after first deployment, log in once, find your UID, and paste it here **/
const OWNER_UID = "8YUrRoReptaXjSb3abry9BliiSj1";

const state = {
  user: null,           // Firebase user object
  userProfile: null,    // Our users/{uid} doc
  currentView: "welcome",
  viewingProfileUid: null,
  viewingConversationWith: null, // uid
};

/************ Helper UI functions ************/
const appRoot = document.getElementById("app");

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k.startsWith("on") && typeof v === "function") {
      el.addEventListener(k.substring(2).toLowerCase(), v);
    } else if (k === "html") {
      el.innerHTML = v;
    } else {
      el.setAttribute(k, v);
    }
  }
  if (!Array.isArray(children)) children = [children];
  for (const child of children) {
    if (child === null || child === undefined) continue;
    if (typeof child === "string") el.appendChild(document.createTextNode(child));
    else el.appendChild(child);
  }
  return el;
}

function render() {
  appRoot.innerHTML = "";
  const navbar = renderNavbar();
  if (navbar) appRoot.appendChild(navbar);

  let view;
  if (!state.user && (state.currentView !== "welcome" && state.currentView !== "auth" && state.currentView !== "publicProfile")) {
    state.currentView = "welcome";
  }

  switch (state.currentView) {
    case "welcome":
      view = renderWelcomePage();
      break;
    case "auth":
      view = renderAuthPage();
      break;
    case "feed":
      view = renderFeedPage();
      break;
    case "profile":
      view = renderProfilePage();
      break;
    case "settings":
      view = renderSettingsPage();
      break;
    case "friends":
      view = renderFriendsPage();
      break;
    case "dms":
      view = renderDMsPage();
      break;
    case "admin":
      view = renderAdminPage();
      break;
    case "owner":
      view = renderOwnerPage();
      break;
    case "billing":
      view = renderBillingPage();
      break;
    case "publicProfile":
      view = renderPublicProfilePage();
      break;
    default:
      view = h("div", {}, "Unknown view");
  }
  appRoot.appendChild(view);
}

function renderNavbar() {
  const buttons = [];

  if (!state.user) {
    return null;
  }

  function navButton(view, label) {
    return h("button", {
      class: state.currentView === view ? "active" : "",
      onclick: () => {
        state.currentView = view;
        if (view === "profile") state.viewingProfileUid = state.user.uid;
        render();
      }
    }, label);
  }

  buttons.push(
    navButton("feed", "Feed"),
    navButton("profile", "My Profile"),
    navButton("friends", "Friends"),
    navButton("dms", "DMs"),
    navButton("settings", "Settings"),
    navButton("billing", "Billing")
  );

  if (state.userProfile?.isAdmin) {
    buttons.push(navButton("admin", "Admin"));
  }
  if (state.user.uid === OWNER_UID) {
    buttons.push(navButton("owner", "Owner"));
  }

  buttons.push(
    h("button", { onclick: handleSignOut }, "Sign out")
  );

  return h("div", { class: "navbar" }, buttons);
}

/************ AUTH & WELCOME ************/

function renderWelcomePage() {
  const card = h("div", { class: "card" }, [
    h("h1", {}, "Welcome to My Social App"),
    h("p", {}, "Browse public profiles, then sign up to post, add friends, and chat."),
    h("button", { onclick: () => { state.currentView = "auth"; render(); } }, "Login / Register")
  ]);

  const searchSection = h("div", { class: "card" }, [
    h("h2", {}, "Search users"),
    h("input", { type: "text", placeholder: "Search by display name...", id: "welcomeSearchInput" }),
    h("button", { onclick: handleWelcomeSearch }, "Search"),
    h("div", { id: "welcomeSearchResults" })
  ]);

  // Load some random public users
  loadSomePublicUsersForWelcome();

  return h("div", {}, [card, searchSection]);
}

async function loadSomePublicUsersForWelcome() {
  const container = document.getElementById("welcomeSearchResults");
  if (!container) return;
  container.innerHTML = "Loading users...";
  const snap = await getDocs(limit(collection(db, "users"), 10));
  container.innerHTML = "";
  snap.forEach(docSnap => {
    const user = docSnap.data();
    container.appendChild(renderUserListItem(user, docSnap.id, false));
  });
}

async function handleWelcomeSearch() {
  const input = document.getElementById("welcomeSearchInput");
  const qStr = input.value.trim();
  const container = document.getElementById("welcomeSearchResults");
  container.innerHTML = "Searching...";
  if (!qStr) {
    loadSomePublicUsersForWelcome();
    return;
  }
  const qRef = query(
    collection(db, "users"),
    where("displayName", ">=", qStr),
    where("displayName", "<=", qStr + "\uf8ff")
  );
  const snap = await getDocs(qRef);
  container.innerHTML = "";
  if (snap.empty) {
    container.innerHTML = "No users found.";
    return;
  }
  snap.forEach(docSnap => {
    const user = docSnap.data();
    container.appendChild(renderUserListItem(user, docSnap.id, false));
  });
}

function renderAuthPage() {
  return h("div", { class: "card" }, [
    h("h2", {}, "Login or Register"),
    h("div", { class: "flex" }, [
      // Login
      h("div", { style: "flex:1" }, [
        h("h3", {}, "Login"),
        h("input", { type: "email", id: "loginEmail", placeholder: "Email" }),
        h("input", { type: "password", id: "loginPassword", placeholder: "Password" }),
        h("label", {}, [
          h("input", { type: "checkbox", id: "loginRemember" }),
          " Remember me (stay logged in)"
        ]),
        h("button", { onclick: handleLogin }, "Login"),
        h("p", { class: "small-text" }, [
          h("span", {
            class: "linkish",
            onclick: handleForgotPassword
          }, "I forgot my password")
        ])
      ]),
      // Register
      h("div", { style: "flex:1" }, [
        h("h3", {}, "Register"),
        h("input", { type: "text", id: "regDisplayName", placeholder: "Display name (what others see)" }),
        h("input", { type: "email", id: "regEmail", placeholder: "Email" }),
        h("input", { type: "password", id: "regPassword", placeholder: "Password" }),
        h("input", { type: "text", id: "regReferralCode", placeholder: "Referral code (optional)" }),
        h("button", { onclick: handleRegister }, "Create account")
      ])
    ]),
    h("p", { class: "small-text" }, "Admins log in here too, then use the Admin page button that appears in the top bar.")
  ]);
}

async function handleRegister() {
  const displayName = document.getElementById("regDisplayName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const referralCode = document.getElementById("regReferralCode").value.trim();

  if (!displayName || !email || !password) {
    alert("Fill in display name, email and password.");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Basic user profile
    const userDoc = {
      displayName,
      email,
      age: null,
      city: "",
      country: "",
      about: "",
      profilePicUrl: "",
      bannerChoice: "default",
      theme: "light",
      friendIds: [],
      referralPoints: 0,
      referralOptOut: false,
      billingInfo: {},
      isAdmin: false,
      isOwner: uid === OWNER_UID,
      createdAt: Timestamp.now()
    };

    // Referral credit if registration with code
    if (referralCode) {
      const refSnap = await getDocs(
        query(
          collection(db, "referralCodes"),
          where("code", "==", referralCode),
          where("used", "==", false)
        )
      );
      if (!refSnap.empty) {
        const refDoc = refSnap.docs[0];
        const refData = refDoc.data();
        // Increase referrer's points
        const refUserRef = doc(db, "users", refData.ownerId);
        const refUserSnap = await getDoc(refUserRef);
        if (refUserSnap.exists()) {
          const oldPoints = refUserSnap.data().referralPoints || 0;
          await updateDoc(refUserRef, { referralPoints: oldPoints + 1 });
        }
        await updateDoc(refDoc.ref, { used: true, usedBy: uid });
      }
    }

    await setDoc(doc(db, "users", uid), userDoc);

    alert("Account created!");
  } catch (err) {
    console.error(err);
    alert("Error creating account: " + err.message);
  }
}

async function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("loginRemember").checked;

  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
}

async function handleSignOut() {
  await signOut(auth);
}

async function handleForgotPassword() {
  const email = prompt("Enter your email to reset password:");
  if (!email) return;
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent (if the email is registered).");
  } catch (err) {
    console.error(err);
    alert("Error sending reset email: " + err.message);
  }
}

/************ FEED & POSTS ************/

function renderFeedPage() {
  const container = h("div", {});

  const composer = h("div", { class: "card" }, [
    h("h2", {}, "Create a post"),
    h("textarea", {
      id: "postText",
      maxlength: "280",
      placeholder: "Write something (280 chars max, emojis allowed 😊)..."
    }),
    h("div", {}, [
      h("label", {}, [
        "Attach image (optional): ",
        h("input", { type: "file", id: "postImageInput", accept: "image/*" })
      ])
    ]),
    h("div", {}, [
      "Visibility: ",
      h("select", { id: "postVisibility" }, [
        h("option", { value: "public" }, "Public"),
        h("option", { value: "friends" }, "Only friends")
      ])
    ]),
    h("button", { onclick: handleCreatePost }, "Post")
  ]);

  const feedCard = h("div", { class: "card" }, [
    h("h2", {}, "Feed"),
    h("div", { id: "feedContainer" }, "Loading feed...")
  ]);

  container.appendChild(composer);
  container.appendChild(feedCard);

  loadFeed();

  return container;
}

async function handleCreatePost() {
  if (!state.user) return;

  const textEl = document.getElementById("postText");
  const text = textEl.value.trim();
  const visibility = document.getElementById("postVisibility").value;
  const imgInput = document.getElementById("postImageInput");

  if (!text && !imgInput.files[0]) {
    alert("Write something or attach an image.");
    return;
  }

  let imageUrl = "";
  if (imgInput.files[0]) {
    const file = imgInput.files[0];
    const storageRef = ref(storage, `postImages/${state.user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  const postDoc = {
    authorId: state.user.uid,
    text,
    visibility,
    imageUrl,
    likeCount: 0,
    createdAt: Timestamp.now()
  };

  await addDoc(collection(db, "posts"), postDoc);

  // Also add to gallery if image
  if (imageUrl) {
    await addDoc(collection(db, "users", state.user.uid, "photos"), {
      imageUrl,
      createdAt: Timestamp.now()
    });
  }

  textEl.value = "";
  imgInput.value = "";
  loadFeed();
}

async function loadFeed() {
  if (!state.user) return;

  const feedContainer = document.getElementById("feedContainer");
  if (!feedContainer) return;
  feedContainer.innerHTML = "Loading feed...";

  const postsSnap = await getDocs(
    query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50))
  );

  // Preload current user's friends
  const myFriends = new Set(state.userProfile?.friendIds || []);
  const isAdmin = !!state.userProfile?.isAdmin;

  const usersCache = new Map();

  async function getUserProfileCached(uid) {
    if (usersCache.has(uid)) return usersCache.get(uid);
    const uSnap = await getDoc(doc(db, "users", uid));
    const data = uSnap.exists() ? uSnap.data() : null;
    usersCache.set(uid, data);
    return data;
  }

  feedContainer.innerHTML = "";

  for (const postDoc of postsSnap.docs) {
    const post = postDoc.data();
    const postId = postDoc.id;

    // visibility check: show public posts or friends-only if friend or self or admin
    const isFriend = myFriends.has(post.authorId);
    const isSelf = post.authorId === state.user.uid;
    if (post.visibility === "friends" && !isFriend && !isSelf && !isAdmin) {
      continue;
    }

    const authorProfile = await getUserProfileCached(post.authorId);
    const displayName = authorProfile?.displayName || "Unknown";

    const postEl = h("div", { class: "feed-item" }, [
      h("div", {}, [
        h("span", { class: "linkish", onclick: () => openProfile(post.authorId) }, displayName),
        " ",
        h("span", { class: "small-text" }, `(${post.visibility === "friends" ? "friends-only" : "public"})`)
      ]),
      h("div", {}, post.text),
      post.imageUrl ? h("div", { style: "margin-top:0.5rem" }, [
        h("img", { src: post.imageUrl, style: "max-width:100%;border-radius:4px" }),
        h("div", {}, [
          h("a", { href: post.imageUrl, download: "", class: "linkish" }, "Download image")
        ])
      ]) : null,
      h("div", { class: "small-text" }, new Date(post.createdAt.toDate()).toLocaleString()),
      h("div", { class: "small-text" }, [
        h("span", {}, `Likes: ${post.likeCount || 0} `),
        h("button", { onclick: () => handleLikePost(postId, post.likeCount || 0) }, "Like"),
        " ",
        h("button", { onclick: () => openComments(postId) }, "Comments"),
        " ",
        h("button", { onclick: () => handleAddFriendFromFeed(post.authorId) }, "Add friend")
      ]),
      (state.userProfile?.isAdmin || state.user.uid === post.authorId) ? h("button", {
        class: "danger small-text",
        onclick: () => handleDeletePost(postId, post)
      }, "Delete post") : null,
      h("div", { id: `comments-${postId}`, class: "small-text" })
    ]);

    feedContainer.appendChild(postEl);
  }

  if (!feedContainer.innerHTML) {
    feedContainer.innerHTML = "No posts yet.";
  }
}

async function handleLikePost(postId, currentLikes) {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, { likeCount: currentLikes + 1 });
  loadFeed();
}

async function openComments(postId) {
  const container = document.getElementById(`comments-${postId}`);
  if (!container) return;
  container.innerHTML = "Loading comments...";

  const commentsSnap = await getDocs(
    query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    )
  );

  const list = h("div", { class: "flex-column" });

  commentsSnap.forEach(docSnap => {
    const c = docSnap.data();
    list.appendChild(h("div", {}, [
      h("span", { class: "small-text" }, `${c.authorDisplayName || "Someone"}: `),
      c.text
    ]));
  });

  // Add comment box
  const input = h("textarea", {
    placeholder: "Write a comment (emojis allowed)...",
    id: `commentInput-${postId}`
  });

  const button = h("button", {
    onclick: () => handleAddComment(postId)
  }, "Add comment");

  container.innerHTML = "";
  container.appendChild(list);
  container.appendChild(input);
  container.appendChild(button);
}

async function handleAddComment(postId) {
  const input = document.getElementById(`commentInput-${postId}`);
  const text = input.value.trim();
  if (!text) return;

  await addDoc(collection(db, "posts", postId, "comments"), {
    authorId: state.user.uid,
    authorDisplayName: state.userProfile?.displayName || "",
    text,
    createdAt: Timestamp.now()
  });

  input.value = "";
  openComments(postId);
}

async function handleAddFriendFromFeed(userId) {
  if (!state.user || userId === state.user.uid) return;
  const myRef = doc(db, "users", state.user.uid);
  const mySnap = await getDoc(myRef);
  if (!mySnap.exists()) return;
  const myData = mySnap.data();
  const friends = new Set(myData.friendIds || []);
  if (friends.has(userId)) {
    alert("Already a friend.");
    return;
  }
  friends.add(userId);
  await updateDoc(myRef, { friendIds: Array.from(friends) });
  alert("Friend added.");
  await refreshCurrentUserProfile();
}

/************ PROFILE PAGE ************/

function openProfile(uid) {
  state.viewingProfileUid = uid;
  if (state.user && uid === state.user.uid) {
    state.currentView = "profile";
  } else {
    state.currentView = state.user ? "publicProfile" : "publicProfile";
  }
  render();
}

function renderProfilePage() {
  // own profile with edit controls
  const container = h("div", {});

  const card = h("div", { class: "card" }, [
    h("h2", {}, "My Profile"),
    h("div", { class: "profile-header" }, [
      h("img", { src: state.userProfile?.profilePicUrl || "", alt: "profile" }),
      h("div", {}, [
        h("div", {}, state.userProfile?.displayName || ""),
        h("div", { class: "small-text" }, [
          state.userProfile?.city || "", state.userProfile?.country ? ", " + state.userProfile.country : ""
        ]),
        h("div", { class: "small-text" }, [
          "Age: ", state.userProfile?.age || "N/A"
        ]),
        h("div", { class: "small-text" }, state.userProfile?.about || "")
      ])
    ]),
    h("h3", {}, "Edit profile"),
    h("input", { id: "profileDisplayName", type: "text", placeholder: "Display name", value: state.userProfile?.displayName || "" }),
    h("input", { id: "profileAge", type: "number", placeholder: "Age", value: state.userProfile?.age || "" }),
    h("input", { id: "profileCity", type: "text", placeholder: "City", value: state.userProfile?.city || "" }),
    h("input", { id: "profileCountry", type: "text", placeholder: "Country", value: state.userProfile?.country || "" }),
    h("textarea", { id: "profileAbout", placeholder: "About me" }, state.userProfile?.about || ""),
    h("div", {}, [
      "Banner: ",
      h("select", { id: "profileBanner" }, [
        h("option", { value: "default", selected: state.userProfile?.bannerChoice === "default" }, "Default"),
        h("option", { value: "mountains", selected: state.userProfile?.bannerChoice === "mountains" }, "Mountains"),
        h("option", { value: "city", selected: state.userProfile?.bannerChoice === "city" }, "City"),
        h("option", { value: "abstract", selected: state.userProfile?.bannerChoice === "abstract" }, "Abstract")
      ])
    ]),
    h("div", {}, [
      "Profile picture: ",
      h("input", { type: "file", id: "profilePicInput", accept: "image/*" })
    ]),
    h("button", { onclick: handleSaveProfile }, "Save profile")
  ]);

  const postsCard = h("div", { class: "card" }, [
    h("h3", {}, "My posts (visible to friends on my profile)"),
    h("div", { id: "myPostsContainer" }, "Loading...")
  ]);

  const galleryCard = h("div", { class: "card" }, [
    h("h3", {}, "My photo gallery"),
    h("div", { id: "myGalleryContainer", class: "gallery-grid" }, "Loading...")
  ]);

  container.appendChild(card);
  container.appendChild(postsCard);
  container.appendChild(galleryCard);

  loadMyProfilePosts();
  loadMyGallery();

  return container;
}

async function handleSaveProfile() {
  const displayName = document.getElementById("profileDisplayName").value.trim();
  const ageStr = document.getElementById("profileAge").value;
  const age = ageStr ? parseInt(ageStr, 10) : null;
  const city = document.getElementById("profileCity").value.trim();
  const country = document.getElementById("profileCountry").value.trim();
  const about = document.getElementById("profileAbout").value.trim();
  const bannerChoice = document.getElementById("profileBanner").value;
  const fileInput = document.getElementById("profilePicInput");

  let profilePicUrl = state.userProfile?.profilePicUrl || "";

  if (fileInput.files[0]) {
    const file = fileInput.files[0];
    const storageRef = ref(storage, `profilePictures/${state.user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    profilePicUrl = await getDownloadURL(storageRef);
  }

  await updateDoc(doc(db, "users", state.user.uid), {
    displayName,
    age,
    city,
    country,
    about,
    bannerChoice,
    profilePicUrl
  });

  alert("Profile updated.");
  await refreshCurrentUserProfile();
  render();
}

async function loadMyProfilePosts() {
  const container = document.getElementById("myPostsContainer");
  if (!container) return;
  const snap = await getDocs(
    query(
      collection(db, "posts"),
      where("authorId", "==", state.user.uid),
      orderBy("createdAt", "desc")
    )
  );
  container.innerHTML = "";
  snap.forEach(docSnap => {
    const p = docSnap.data();
    container.appendChild(h("div", { class: "feed-item" }, [
      h("div", {}, p.text),
      h("div", { class: "small-text" }, `${p.visibility} — ${new Date(p.createdAt.toDate()).toLocaleString()}`)
    ]));
  });
  if (!container.innerHTML) container.innerHTML = "No posts yet.";
}

async function loadMyGallery() {
  const container = document.getElementById("myGalleryContainer");
  if (!container) return;
  const snap = await getDocs(
    query(
      collection(db, "users", state.user.uid, "photos"),
      orderBy("createdAt", "desc")
    )
  );
  container.innerHTML = "";
  snap.forEach(docSnap => {
    const p = docSnap.data();
    container.appendChild(h("img", { src: p.imageUrl }));
  });
  if (!container.innerHTML) container.innerHTML = "No photos yet.";
}

/************ PUBLIC PROFILE VIEW ************/

function renderPublicProfilePage() {
  const uid = state.viewingProfileUid;
  const container = h("div", { class: "card" }, [
    h("h2", {}, "Profile")
  ]);

  if (!uid) {
    container.appendChild(h("p", {}, "No profile selected."));
    return container;
  }

  (async () => {
    const uSnap = await getDoc(doc(db, "users", uid));
    if (!uSnap.exists()) {
      container.appendChild(h("p", {}, "User not found."));
      return;
    }
    const data = uSnap.data();

    container.appendChild(h("div", { class: "profile-header" }, [
      h("img", { src: data.profilePicUrl || "", alt: "profile" }),
      h("div", {}, [
        h("div", {}, data.displayName || ""),
        h("div", { class: "small-text" }, [
          data.city || "", data.country ? ", " + data.country : ""
        ]),
        h("div", { class: "small-text" }, [
          "Age: ", data.age || "N/A"
        ]),
        h("div", { class: "small-text" }, data.about || "")
      ])
    ]));

    if (state.user) {
      container.appendChild(
        h("button", { onclick: () => handleAddFriendFromFeed(uid) }, "Add friend")
      );
    } else {
      container.appendChild(
        h("p", { class: "small-text" }, "Log in to add as friend.")
      );
    }

    // Only show posts that are visible to this viewer
    const postsContainer = h("div", { class: "card" }, [
      h("h3", {}, "Posts")
    ]);
    container.appendChild(postsContainer);

    const postsSnap = await getDocs(
      query(
        collection(db, "posts"),
        where("authorId", "==", uid),
        orderBy("createdAt", "desc")
      )
    );
    const myFriends = new Set(state.userProfile?.friendIds || []);
    const isFriend = state.user && myFriends.has(uid);
    const isAdmin = !!state.userProfile?.isAdmin;
    postsSnap.forEach(docSnap => {
      const p = docSnap.data();
      if (p.visibility === "friends" && !(isFriend || isAdmin || (state.user && state.user.uid === uid))) {
        return;
      }
      postsContainer.appendChild(h("div", { class: "feed-item" }, [
        h("div", {}, p.text),
        p.imageUrl ? h("img", { src: p.imageUrl, style: "max-width:100%;border-radius:4px" }) : null,
        h("div", { class: "small-text" }, `${p.visibility} — ${new Date(p.createdAt.toDate()).toLocaleString()}`)
      ]));
    });

    const galleryCard = h("div", { class: "card" }, [
      h("h3", {}, "Photo gallery"),
      h("div", { id: "publicGalleryContainer", class: "gallery-grid" }, "Loading...")
    ]);
    container.appendChild(galleryCard);

    const gSnap = await getDocs(
      query(
        collection(db, "users", uid, "photos"),
        orderBy("createdAt", "desc")
      )
    );
    const gContainer = document.getElementById("publicGalleryContainer");
    gContainer.innerHTML = "";
    gSnap.forEach(docSnap => {
      const p = docSnap.data();
      gContainer.appendChild(h("img", { src: p.imageUrl }));
    });
    if (!gContainer.innerHTML) gContainer.innerHTML = "No photos yet.";
  })();

  return container;
}

/************ SETTINGS PAGE ************/

function renderSettingsPage() {
  const themeSelect = h("select", { id: "themeSelect" }, [
    h("option", { value: "light" }, "Light"),
    h("option", { value: "dark" }, "Dark")
  ]);

  if (state.userProfile?.theme === "dark") {
    themeSelect.value = "dark";
    document.body.style.background = "#111827";
    document.body.style.color = "#f9fafb";
  } else {
    themeSelect.value = "light";
    document.body.style.background = "#f4f5f7";
    document.body.style.color = "#111827";
  }

  const card = h("div", { class: "card" }, [
    h("h2", {}, "Settings"),
    h("h3", {}, "Theme & appearance"),
    h("label", {}, ["Theme: ", themeSelect]),
    h("button", { onclick: handleSaveTheme }, "Save theme"),
    h("hr"),
    h("h3", {}, "Account"),
    h("p", {}, "Displayed name = profile display name on your profile page."),
    h("button", { class: "danger", onclick: handleDeleteAccount }, "Delete my account"),
    h("p", { class: "small-text" }, "This will delete your account and profile data. Some orphaned posts may remain with 'Unknown' author in a simple demo.")
  ]);

  if (state.userProfile?.referralOptOut) {
    card.appendChild(h("p", {}, "Referral program: You have opted out."));
    card.appendChild(h("button", { onclick: handleUndoReferralOptOut }, "Rejoin referral program"));
  } else {
    card.appendChild(h("p", {}, `Referral points: ${state.userProfile?.referralPoints || 0}`));
    card.appendChild(h("button", { onclick: handleCreateReferralCode }, "Create referral code (max 5 / month)"));
    card.appendChild(h("button", {
      class: "danger",
      onclick: handleOptOutReferral
    }, "Delete my credits & opt out of referral program"));
  }

  card.appendChild(h("hr"));
  card.appendChild(h("button", { onclick: handleDownloadMyData }, "Download a copy of my data"));

  return card;
}

async function handleSaveTheme() {
  const theme = document.getElementById("themeSelect").value;
  await updateDoc(doc(db, "users", state.user.uid), { theme });
  await refreshCurrentUserProfile();
  render();
}

async function handleDeleteAccount() {
  if (!confirm("Are you sure? This will delete your account.")) return;

  // Delete user doc, some of their data, then auth user
  // (Simplified, not guaranteed to delete absolutely everything in large apps)

  // Delete posts
  const postsSnap = await getDocs(query(
    collection(db, "posts"),
    where("authorId", "==", state.user.uid)
  ));
  for (const docSnap of postsSnap.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Delete messages where user is sender or receiver (simplified: only as sender)
  const msgSnap = await getDocs(query(
    collection(db, "messages"),
    where("fromId", "==", state.user.uid)
  ));
  for (const docSnap of msgSnap.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Delete user document
  await deleteDoc(doc(db, "users", state.user.uid));

  // Delete auth user
  try {
    await deleteUser(state.user);
  } catch (err) {
    alert("We deleted your data but could not delete auth user (you may need to re-log in & try again).");
    console.error(err);
  }

  alert("Account deleted (simplified).");
}

/************ REFERRAL SYSTEM ************/

async function handleCreateReferralCode() {
  // Check how many codes last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30*24*60*60*1000);

  const snap = await getDocs(
    query(
      collection(db, "referralCodes"),
      where("ownerId", "==", state.user.uid),
      where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo))
    )
  );

  if (snap.size >= 5) {
    alert("You already created 5 codes in the last 30 days.");
    return;
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await addDoc(collection(db, "referralCodes"), {
    ownerId: state.user.uid,
    code,
    createdAt: Timestamp.now(),
    used: false,
    usedBy: null
  });

  alert("Referral code created: " + code);
}

async function handleOptOutReferral() {
  if (!confirm("This will delete your referral credits and opt you out of the program. Continue?")) return;
  await updateDoc(doc(db, "users", state.user.uid), {
    referralPoints: 0,
    referralOptOut: true
  });
  await refreshCurrentUserProfile();
  render();
}

async function handleUndoReferralOptOut() {
  await updateDoc(doc(db, "users", state.user.uid), {
    referralOptOut: false
  });
  await refreshCurrentUserProfile();
  render();
}

/************ FRIENDS PAGE ************/

function renderFriendsPage() {
  const container = h("div", {});
  const card = h("div", { class: "card" }, [
    h("h2", {}, "My friends"),
    h("div", { id: "friendsList" }, "Loading...")
  ]);

  const searchCard = h("div", { class: "card" }, [
    h("h3", {}, "Search users"),
    h("input", { type: "text", id: "friendsSearchInput", placeholder: "Search by display name..." }),
    h("button", { onclick: handleFriendsSearch }, "Search"),
    h("div", { id: "friendsSearchResults" })
  ]);

  const recCard = h("div", { class: "card" }, [
    h("h3", {}, "People you may know"),
    h("div", { id: "friendsRecommendations" }, "Loading...")
  ]);

  container.appendChild(card);
  container.appendChild(searchCard);
  container.appendChild(recCard);

  loadFriendsList();
  loadFriendRecommendations();

  return container;
}

async function loadFriendsList() {
  const container = document.getElementById("friendsList");
  if (!container) return;
  container.innerHTML = "Loading...";
  const myFriends = state.userProfile?.friendIds || [];
  if (myFriends.length === 0) {
    container.innerHTML = "No friends yet.";
    return;
  }
  const users = [];
  for (const uid of myFriends) {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) users.push({ id: uid, ...snap.data() });
  }
  container.innerHTML = "";
  users.forEach(u => container.appendChild(renderUserListItem(u, u.id, true)));
}

async function handleFriendsSearch() {
  const queryStr = document.getElementById("friendsSearchInput").value.trim();
  const container = document.getElementById("friendsSearchResults");
  container.innerHTML = "Searching...";
  if (!queryStr) {
    container.innerHTML = "Enter something to search.";
    return;
  }
  const snap = await getDocs(
    query(
      collection(db, "users"),
      where("displayName", ">=", queryStr),
      where("displayName", "<=", queryStr + "\uf8ff")
    )
  );
  container.innerHTML = "";
  if (snap.empty) {
    container.innerHTML = "No users found.";
    return;
  }
  snap.forEach(docSnap => {
    const u = docSnap.data();
    container.appendChild(renderUserListItem(u, docSnap.id, false));
  });
}

function renderUserListItem(user, uid, isFriend) {
  const container = h("div", { class: "flex", style: "align-items:center;margin-bottom:0.5rem" }, [
    h("img", {
      src: user.profilePicUrl || "",
      style: "width:40px;height:40px;border-radius:50%;object-fit:cover;background:#e5e7eb"
    }),
    h("div", {}, [
      h("div", {}, [
        h("span", {
          class: "linkish",
          onclick: () => openProfile(uid)
        }, user.displayName || ""),
        user.isAdmin ? h("span", { class: "badge" }, "Admin") : null
      ]),
      h("div", { class: "small-text" }, [
        user.age ? `Age: ${user.age}` : "",
        user.city ? ` • ${user.city}` : "",
        user.country ? `, ${user.country}` : ""
      ])
    ])
  ]);

  if (state.user) {
    container.appendChild(
      h("button", {
        onclick: () => handleAddFriendFromFeed(uid)
      }, isFriend ? "Friend" : "Add friend")
    );
  }

  return container;
}

async function loadFriendRecommendations() {
  const container = document.getElementById("friendsRecommendations");
  if (!container) return;
  container.innerHTML = "Loading...";

  const myFriends = new Set(state.userProfile?.friendIds || []);

  const allSnap = await getDocs(collection(db, "users"));
  const suggestions = [];
  allSnap.forEach(docSnap => {
    const uid = docSnap.id;
    if (uid === state.user.uid) return;
    if (myFriends.has(uid)) return;
    const data = docSnap.data();
    const theirFriends = new Set(data.friendIds || []);
    let mutual = 0;
    for (const f of myFriends) {
      if (theirFriends.has(f)) mutual++;
    }
    if (mutual > 0) {
      suggestions.push({ id: uid, mutual, data });
    }
  });

  suggestions.sort((a, b) => b.mutual - a.mutual);
  container.innerHTML = "";
  suggestions.slice(0, 10).forEach(s => {
    const el = renderUserListItem(s.data, s.id, false);
    el.appendChild(h("span", { class: "small-text" }, `Mutual friends: ${s.mutual}`));
    container.appendChild(el);
  });

  if (!container.innerHTML) container.innerHTML = "No recommendations yet.";
}

/************ DMs ************/

function renderDMsPage() {
  const container = h("div", { class: "flex" });

  const left = h("div", { class: "card", style: "flex:1" }, [
    h("h3", {}, "Friends"),
    h("div", { id: "dmFriendsList" }, "Loading...")
  ]);

  const right = h("div", { class: "card", style: "flex:2" }, [
    h("h3", {}, state.viewingConversationWith ? "Conversation" : "Select a friend"),
    h("div", { id: "dmConversation", style: "min-height:200px" }, ""),
    state.viewingConversationWith ? h("div", {}, [
      h("textarea", { id: "dmMessageInput", placeholder: "Write a private message..." }),
      h("button", { onclick: handleSendDM }, "Send")
    ]) : null
  ]);

  container.appendChild(left);
  container.appendChild(right);

  loadDMFriends();

  if (state.viewingConversationWith) {
    loadConversation();
  }

  return container;
}

async function loadDMFriends() {
  const container = document.getElementById("dmFriendsList");
  if (!container) return;
  container.innerHTML = "Loading...";

  const myFriends = state.userProfile?.friendIds || [];
  if (myFriends.length === 0) {
    container.innerHTML = "No friends yet.";
    return;
  }
  const list = h("div", {});
  for (const uid of myFriends) {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      const u = snap.data();
      list.appendChild(h("div", { class: "flex", style: "align-items:center;margin-bottom:0.5rem" }, [
        h("span", {
          class: "linkish",
          onclick: () => {
            state.viewingConversationWith = uid;
            render();
          }
        }, u.displayName || "Friend")
      ]));
    }
  }
  container.innerHTML = "";
  container.appendChild(list);
}

async function loadConversation() {
  const container = document.getElementById("dmConversation");
  if (!container) return;
  container.innerHTML = "Loading...";

  const otherId = state.viewingConversationWith;

  const q1 = query(
    collection(db, "messages"),
    where("fromId", "==", state.user.uid),
    where("toId", "==", otherId),
    orderBy("createdAt", "asc")
  );
  const q2 = query(
    collection(db, "messages"),
    where("fromId", "==", otherId),
    where("toId", "==", state.user.uid),
    orderBy("createdAt", "asc")
  );

  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const msgs = [];
  snap1.forEach(d => msgs.push({ id: d.id, ...d.data() }));
  snap2.forEach(d => msgs.push({ id: d.id, ...d.data() }));
  msgs.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

  container.innerHTML = "";
  msgs.forEach(m => {
    const isMine = m.fromId === state.user.uid;
    container.appendChild(h("div", {
      class: "small-text",
      style: `text-align:${isMine ? "right" : "left"};margin:0.25rem 0;`
    }, `${isMine ? "Me" : "Them"}: ${m.text}`));
  });

  if (!msgs.length) {
    container.innerHTML = "No messages yet.";
  }
}

async function handleSendDM() {
  const input = document.getElementById("dmMessageInput");
  const text = input.value.trim();
  if (!text) return;
  const otherId = state.viewingConversationWith;
  await addDoc(collection(db, "messages"), {
    fromId: state.user.uid,
    toId: otherId,
    text,
    createdAt: Timestamp.now()
  });
  input.value = "";
  loadConversation();
}

/************ ADMIN PAGE ************/

function renderAdminPage() {
  if (!state.userProfile?.isAdmin) {
    return h("div", { class: "card" }, "You are not an admin.");
  }

  const container = h("div", {});

  const usersCard = h("div", { class: "card" }, [
    h("h2", {}, "All users"),
    h("div", { id: "adminUsersList" }, "Loading...")
  ]);

  const postsCard = h("div", { class: "card" }, [
    h("h2", {}, "All posts (latest 50)"),
    h("div", { id: "adminPostsList" }, "Loading...")
  ]);

  container.appendChild(usersCard);
  container.appendChild(postsCard);

  loadAdminUsers();
  loadAdminPosts();

  return container;
}

async function loadAdminUsers() {
  const container = document.getElementById("adminUsersList");
  if (!container) return;
  container.innerHTML = "Loading...";
  const snap = await getDocs(collection(db, "users"));
  container.innerHTML = "";
  snap.forEach(docSnap => {
    const u = docSnap.data();
    container.appendChild(h("div", { class: "flex", style: "align-items:center;margin-bottom:0.5rem" }, [
      h("div", {}, [
        h("div", {}, `${u.displayName || ""} (${u.email || ""})`),
        h("div", { class: "small-text" }, [
          u.isAdmin ? "Admin" : "User",
          u.isOwner ? " • Owner" : ""
        ])
      ]),
      h("button", {
        class: "danger",
        onclick: () => handleAdminDeleteUser(docSnap.id)
      }, "Remove user")
    ]));
  });
}

async function loadAdminPosts() {
  const container = document.getElementById("adminPostsList");
  if (!container) return;
  container.innerHTML = "Loading...";
  const snap = await getDocs(
    query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50))
  );
  container.innerHTML = "";
  snap.forEach(docSnap => {
    const p = docSnap.data();
    container.appendChild(h("div", { class: "feed-item" }, [
      h("div", {}, `Author: ${p.authorId}`),
      h("div", {}, p.text),
      h("div", { class: "small-text" }, `${p.visibility} — ${new Date(p.createdAt.toDate()).toLocaleString()}`),
      h("button", {
        class: "danger",
        onclick: () => handleDeletePost(docSnap.id, p)
      }, "Delete post")
    ]));
  });
}

async function handleAdminDeleteUser(uid) {
  if (!confirm("Delete this user and their profile (posts may remain)?")) return;
  await deleteDoc(doc(db, "users", uid));
  alert("User profile doc deleted. Their auth account remains unless deleted separately.");
  loadAdminUsers();
}

/************ OWNER PAGE ************/

function renderOwnerPage() {
  if (state.user.uid !== OWNER_UID) {
    return h("div", { class: "card" }, "You are not the owner.");
  }

  const container = h("div", { class: "card" }, [
    h("h2", {}, "Owner dashboard"),
    h("div", { id: "ownerStats" }, "Loading stats..."),
    h("hr"),
    h("button", { class: "danger", onclick: handleShutdownNotice }, "Simulate shutdown (demo only)")
  ]);

  loadOwnerStats();

  return container;
}

async function loadOwnerStats() {
  const container = document.getElementById("ownerStats");
  if (!container) return;
  const usersSnap = await getDocs(collection(db, "users"));
  const postsSnap = await getDocs(collection(db, "posts"));
  const msgSnap = await getDocs(collection(db, "messages"));
  container.innerHTML = "";
  container.appendChild(h("p", {}, `Registered users: ${usersSnap.size}`));
  container.appendChild(h("p", {}, `Total posts: ${postsSnap.size}`));
  container.appendChild(h("p", {}, `Total private messages: ${msgSnap.size}`));
}

function handleShutdownNotice() {
  alert("To actually remove or shut down the site, you would use Firebase console → Hosting (this button is just a demo).");
}

/************ BILLING PAGE ************/

function renderBillingPage() {
  const info = state.userProfile?.billingInfo || {};
  const card = h("div", { class: "card" }, [
    h("h2", {}, "Billing info"),
    h("p", { class: "small-text" }, 
      "Payments are handled by another company. Do NOT store full card numbers here. Only store safe info like your invoice address or external customer ID."
    ),
    h("input", { id: "billingName", type: "text", placeholder: "Billing name", value: info.name || "" }),
    h("input", { id: "billingAddress", type: "text", placeholder: "Billing address", value: info.address || "" }),
    h("input", { id: "billingExternalId", type: "text", placeholder: "External customer ID (from payment provider)", value: info.externalId || "" }),
    h("button", { onclick: handleSaveBilling }, "Save billing info")
  ]);
  return card;
}

async function handleSaveBilling() {
  const name = document.getElementById("billingName").value.trim();
  const address = document.getElementById("billingAddress").value.trim();
  const externalId = document.getElementById("billingExternalId").value.trim();
  await updateDoc(doc(db, "users", state.user.uid), {
    billingInfo: { name, address, externalId }
  });
  alert("Billing info saved (non-sensitive only).");
  await refreshCurrentUserProfile();
}

/************ DOWNLOAD DATA ************/

async function handleDownloadMyData() {
  const uid = state.user.uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : null;

  const postsSnap = await getDocs(query(
    collection(db, "posts"),
    where("authorId", "==", uid)
  ));
  const posts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const msgSnap = await getDocs(query(
    collection(db, "messages"),
    where("fromId", "==", uid)
  ));
  const messages = msgSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const photosSnap = await getDocs(collection(db, "users", uid, "photos"));
  const photos = photosSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  const data = {
    user: userData,
    posts,
    messages,
    photos
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `my-social-data-${uid}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/************ HELPER: REFRESH PROFILE ************/

async function refreshCurrentUserProfile() {
  if (!state.user) {
    state.userProfile = null;
    return;
  }
  const snap = await getDoc(doc(db, "users", state.user.uid));
  state.userProfile = snap.exists() ? snap.data() : null;
}

/************ AUTH STATE LISTENER ************/

onAuthStateChanged(auth, async (user) => {
  state.user = user;
  if (user) {
    console.log("MY UID IS:", user.uid);  // <-- ADD THIS LINE
    await refreshCurrentUserProfile();
    if (!state.currentView || state.currentView === "welcome" || state.currentView === "auth") {
      state.currentView = "feed";
    }
  } else {
    state.userProfile = null;
    state.currentView = "welcome";
  }
  render();
});

/************ START ************/
render();

