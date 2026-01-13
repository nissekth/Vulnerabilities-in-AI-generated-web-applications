// app.js

// GLOBALS
let currentUser = null;       // Firebase Auth user
let currentUserDoc = null;    // Firestore user document data
let currentConversationWith = null; // UID of DM partner

// IMPORTANT: set this after you create your owner account (see below)
const OWNER_UID = "7qCRpIovrWSKqs0GEaLwJKgQIuj1"; 

// Helper: get DOM element
const $ = (id) => document.getElementById(id);

// Helper: show/hide views
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById('view-' + viewId);
  if (el) el.classList.remove('hidden');
}

// Helper: format dates simply
function formatDate(ts) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : ts;
  return date.toLocaleString();
}

// Helper: current yyyy-mm string for referrals
function currentMonthString() {
  const d = new Date();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${d.getFullYear()}-${m}`;
}

// --- AUTH & INIT ---

function setupAuthListener() {
  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    if (window.IS_ADMIN_PAGE) {
      await handleAdminPageAuthChange(user);
      return;
    }
    if (user) {
      await ensureUserDoc(user);
      await loadUserDoc();
      await applyThemeFromSettings();
      await loadBasicUIState();
    } else {
      currentUserDoc = null;
      $('auth-main').classList.remove('hidden');
      $('app-main').classList.add('hidden');
      $('main-header').classList.add('hidden');
    }
  });
}

async function ensureUserDoc(user) {
  const docRef = db.collection('users').doc(user.uid);
  const snap = await docRef.get();
  if (!snap.exists) {
    const dName = user.displayName || user.email.split('@')[0];
    await docRef.set({
      email: user.email,
      displayName: dName,
      displayNameLower: dName.toLowerCase(),
      age: null,
      city: '',
      country: '',
      about: '',
      banner: 'default',
      profilePictureUrl: '',
      friends: [],
      theme: 'light',
      role: 'user',           // 'user' | 'admin'
      referralOptIn: true,
      referralPoints: 0,
      referralMonth: currentMonthString(),
      referralMonthlyCount: 0,
      billingName: '',
      billingAddress: '',
      billingNotes: '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function loadUserDoc() {
  const snap = await db.collection('users').doc(currentUser.uid).get();
  currentUserDoc = snap.data();
}

// --- UI INITIALIZATION ---

function initApp() {
  setupAuthListener();
  setupAuthHandlers();
  setupNavHandlers();
  setupFeedHandlers();
  setupProfileHandlers();
  setupFriendsHandlers();
  setupMessagesHandlers();
  setupSettingsHandlers();
  setupBillingHandlers();
  setupAdminOwnerHandlers();
  setupPublicSearchHandlers();
}

// after login
async function loadBasicUIState() {
  $('auth-main').classList.add('hidden');
  $('app-main').classList.remove('hidden');
  $('main-header').classList.remove('hidden');

  $('nav-display-name').innerText = currentUserDoc.displayName || currentUser.email;

  // Show admin / owner nav
  if (currentUser.uid === OWNER_UID) {
    $('owner-nav').classList.remove('hidden');
    $('admin-nav').classList.remove('hidden');
  } else if (currentUserDoc.role === 'admin') {
    $('admin-nav').classList.remove('hidden');
    $('owner-nav').classList.add('hidden');
  } else {
    $('admin-nav').classList.add('hidden');
    $('owner-nav').classList.add('hidden');
  }

  // Load default view
  showView('feed');
  await refreshFeed();
  await loadProfileView();
  await loadFriendsView();
  await loadConversationsList();
}

// --- AUTH HANDLERS (index.html) ---

function setupAuthHandlers() {
  const loginBtn = $('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const email = $('login-email').value.trim();
      const password = $('login-password').value;
      const remember = $('remember-me').checked;
      $('login-error').innerText = '';
      try {
        await auth.setPersistence(
          remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
        );
        await auth.signInWithEmailAndPassword(email, password);
      } catch (err) {
        $('login-error').innerText = err.message;
      }
    });
  }

  const forgotBtn = $('forgot-password-btn');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
      const email = $('login-email').value.trim();
      if (!email) {
        $('login-error').innerText = 'Enter your email first, then click "I forgot my password".';
        return;
      }
      try {
        await auth.sendPasswordResetEmail(email);
        $('login-error').innerText = 'Password reset email sent (check your inbox).';
      } catch (err) {
        $('login-error').innerText = err.message;
      }
    });
  }

  const registerBtn = $('register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      const displayName = $('register-display-name').value.trim();
      const age = Number($('register-age').value || 0);
      const city = $('register-city').value.trim();
      const country = $('register-country').value.trim();
      const email = $('register-email').value.trim();
      const password = $('register-password').value;
      const referralCode = $('register-referral-code').value.trim();
      $('register-error').innerText = '';

      if (!displayName || !email || !password) {
        $('register-error').innerText = 'Display name, email and password are required.';
        return;
      }

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName });

        // ensure user doc with data
        const userDocRef = db.collection('users').doc(cred.user.uid);
        await userDocRef.set({
          email,
          displayName,
          displayNameLower: displayName.toLowerCase(),
          age: age || null,
          city,
          country,
          about: '',
          banner: 'default',
          profilePictureUrl: '',
          friends: [],
          theme: 'light',
          role: 'user',
          referralOptIn: true,
          referralPoints: 0,
          referralMonth: currentMonthString(),
          referralMonthlyCount: 0,
          billingName: '',
          billingAddress: '',
          billingNotes: '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // handle referral code if provided
        if (referralCode) {
          await handleReferralUse(referralCode, cred.user.uid);
        }
      } catch (err) {
        $('register-error').innerText = err.message;
      }
    });
  }

  const logoutBtn = $('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => auth.signOut());
  }
}

// --- NAVIGATION (index.html app header) ---

function setupNavHandlers() {
  const navButtons = document.querySelectorAll('#main-header nav button[data-view]');
  navButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const view = btn.getAttribute('data-view');
      showView(view);
      if (view === 'feed') await refreshFeed();
      if (view === 'profile') await loadProfileView();
      if (view === 'friends') await loadFriendsView();
      if (view === 'messages') await loadConversationsList();
      if (view === 'settings') await loadSettingsView();
      if (view === 'billing') await loadBillingView();
      if (view === 'admin') await loadAdminView();
      if (view === 'owner') await loadOwnerView();
    });
  });
}

// --- PUBLIC SEARCH (welcome page) ---

function setupPublicSearchHandlers() {
  const btn = $('public-search-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const term = $('public-search-input').value.trim().toLowerCase();
    const container = $('public-search-results');
    container.innerHTML = '';
    if (!term) return;

    const snap = await db.collection('users')
      .where('displayNameLower', '==', term)
      .get();

    if (snap.empty) {
      container.innerText = 'No users found.';
      return;
    }

    snap.forEach(doc => {
      const user = doc.data();
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <strong>${user.displayName}</strong>
        <p>${user.city || ''}, ${user.country || ''}</p>
        <p>Age: ${user.age || ''}</p>
        <p>${user.about || ''}</p>
      `;
      container.appendChild(div);
    });
  });
}

// --- FEED (posts, likes, comments, add friend) ---

function setupFeedHandlers() {
  const textArea = $('post-text');
  if (textArea) {
    textArea.addEventListener('input', () => {
      $('post-char-counter').innerText = `${textArea.value.length}/280`;
    });
  }

  const submitBtn = $('post-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', createPost);
  }
}

async function createPost() {
  if (!currentUser) return;
  const text = $('post-text').value.trim();
  const visibility = $('post-visibility').value;
  const album = $('post-album').value.trim();
  const fileInput = $('post-image');
  const errorEl = $('post-error');
  errorEl.innerText = '';

  if (!text && !fileInput.files[0]) {
    errorEl.innerText = 'Write something or attach an image.';
    return;
  }

  let imageUrl = '';
  let imagePath = '';

  try {
    // Upload image if any
    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const path = `posts/${currentUser.uid}/${Date.now()}_${file.name}`;
      const ref = storage.ref().child(path);
      await ref.put(file);
      imageUrl = await ref.getDownloadURL();
      imagePath = path;
    }

    // Create post
    const postRef = db.collection('posts').doc();
    await postRef.set({
      id: postRef.id,
      authorId: currentUser.uid,
      text,
      visibility,
      album: album || '',
      imageUrl,
      imagePath,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Clear form
    $('post-text').value = '';
    $('post-album').value = '';
    fileInput.value = '';
    $('post-char-counter').innerText = '0/280';

    await refreshFeed();
    await loadGalleryForProfile(currentUser.uid); // update gallery
  } catch (err) {
    errorEl.innerText = err.message;
  }
}

async function refreshFeed() {
  if (!currentUser) return;
  const container = $('feed-container');
  if (!container) return;
  container.innerHTML = 'Loading...';

  // public posts
  const publicSnap = await db.collection('posts')
    .where('visibility', '==', 'public')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const posts = [];
  publicSnap.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));

  // friend-only posts from friends + own
  const friendIds = (currentUserDoc && currentUserDoc.friends) || [];
  const allFriendIds = [...new Set([...friendIds, currentUser.uid])];

  for (const fid of allFriendIds) {
    const snap = await db.collection('posts')
      .where('authorId', '==', fid)
      .where('visibility', '==', 'friends')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    snap.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
  }

  // sort all posts by createdAt desc
  posts.sort((a, b) => {
    const ta = a.createdAt ? a.createdAt.toMillis() : 0;
    const tb = b.createdAt ? b.createdAt.toMillis() : 0;
    return tb - ta;
  });

  if (!posts.length) {
    container.innerHTML = '<p>No posts yet.</p>';
    return;
  }

  // Preload user map for names
  const userIds = [...new Set(posts.map(p => p.authorId))];
  const usersMap = {};
  for (const uid of userIds) {
    const snap = await db.collection('users').doc(uid).get();
    if (snap.exists) usersMap[uid] = snap.data();
  }

  container.innerHTML = '';
  for (const post of posts) {
    const author = usersMap[post.authorId] || {};
    const div = document.createElement('div');
    div.className = 'post card';
    div.innerHTML = `
      <div class="post-header">
        <div>
          <strong>${author.displayName || 'Unknown'}</strong>
          <div class="post-meta">
            ${post.visibility === 'friends' ? 'Friends only • ' : 'Public • '}
            ${formatDate(post.createdAt)}
          </div>
        </div>
        <div>
          <button class="add-friend-btn" data-uid="${post.authorId}">Add friend</button>
        </div>
      </div>
      <div class="post-body">
        <p>${post.text || ''}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post image">` : ''}
        ${post.album ? `<p><em>Album: ${post.album}</em></p>` : ''}
      </div>
      <div class="post-actions" data-post-id="${post.id}">
        <button class="like-btn">Like</button>
        <button class="show-comments-btn">Show comments</button>
        ${post.imageUrl ? `<a href="${post.imageUrl}" download>Download image</a>` : ''}
        ${(currentUserDoc && (currentUser.uid === post.authorId || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID))
          ? `<button class="delete-post-btn">Delete</button>` : ''}
      </div>
      <div class="post-comments" id="comments-${post.id}"></div>
      <div class="post-comment-form">
        <textarea class="comment-text" placeholder="Add a comment..."></textarea>
        <button class="add-comment-btn" data-post-id="${post.id}">Comment</button>
      </div>
    `;
    container.appendChild(div);
  }

  // Attach buttons
  container.querySelectorAll('.add-friend-btn').forEach(btn => {
    btn.addEventListener('click', () => addFriend(btn.getAttribute('data-uid')));
  });

  container.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.closest('.post-actions').getAttribute('data-post-id');
      toggleLike(postId);
    });
  });

  container.querySelectorAll('.show-comments-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.closest('.post-actions').getAttribute('data-post-id');
      loadComments(postId);
    });
  });

  container.querySelectorAll('.add-comment-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postId = btn.getAttribute('data-post-id');
      const textarea = btn.parentElement.querySelector('.comment-text');
      const text = textarea.value.trim();
      if (!text) return;
      await addComment(postId, text);
      textarea.value = '';
      await loadComments(postId);
    });
  });

  container.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postId = e.target.closest('.post-actions').getAttribute('data-post-id');
      if (confirm('Delete this post?')) {
        await db.collection('posts').doc(postId).delete();
        await refreshFeed();
      }
    });
  });
}

// likes as subcollection
async function toggleLike(postId) {
  if (!currentUser) return;
  const likeRef = db.collection('posts').doc(postId)
    .collection('likes').doc(currentUser.uid);
  const snap = await likeRef.get();
  if (snap.exists) {
    await likeRef.delete();
  } else {
    await likeRef.set({
      userId: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

// comments subcollection
async function addComment(postId, text) {
  if (!currentUser) return;
  const commentsRef = db.collection('posts').doc(postId).collection('comments');
  await commentsRef.add({
    authorId: currentUser.uid,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function loadComments(postId) {
  const container = $('comments-' + postId);
  if (!container) return;
  container.innerHTML = 'Loading comments...';

  const snap = await db.collection('posts').doc(postId)
    .collection('comments')
    .orderBy('createdAt', 'asc')
    .get();

  if (snap.empty) {
    container.innerHTML = '<p>No comments yet.</p>';
    return;
  }

  // Load authors
  const comments = [];
  const authorIds = new Set();
  snap.forEach(doc => {
    const data = doc.data();
    comments.push({ id: doc.id, ...data });
    authorIds.add(data.authorId);
  });

  const usersMap = {};
  for (const uid of authorIds) {
    const userSnap = await db.collection('users').doc(uid).get();
    if (userSnap.exists) usersMap[uid] = userSnap.data();
  }

  container.innerHTML = '';
  comments.forEach(c => {
    const author = usersMap[c.authorId] || {};
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <strong>${author.displayName || 'Unknown'}</strong>:
      ${c.text}
      <span style="font-size:0.8rem;color:#666;"> (${formatDate(c.createdAt)})</span>
      ${(currentUserDoc && (c.authorId === currentUser.uid || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID))
        ? `<button data-comment-id="${c.id}" data-post-id="${postId}" class="delete-comment-btn">Delete</button>` : ''}
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.delete-comment-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cid = btn.getAttribute('data-comment-id');
      const pid = btn.getAttribute('data-post-id');
      if (confirm('Delete this comment?')) {
        await db.collection('posts').doc(pid).collection('comments').doc(cid).delete();
        await loadComments(pid);
      }
    });
  });
}

// --- PROFILE VIEW & GALLERY ---

function setupProfileHandlers() {
  const saveBtn = $('profile-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveProfile);
  }

  const galleryRefreshBtn = $('gallery-refresh-btn');
  if (galleryRefreshBtn) {
    galleryRefreshBtn.addEventListener('click', () => {
      if (currentUser) loadGalleryForProfile(currentUser.uid);
    });
  }
}

async function loadProfileView() {
  if (!currentUser) return;
  await loadUserDoc();
  const u = currentUserDoc;

  $('profile-display-name').innerText = u.displayName || '';
  $('profile-basic-info').innerText =
    `Age: ${u.age || ''} • ${u.city || ''}, ${u.country || ''}`;
  $('profile-about').innerText = u.about || '';
  $('profile-banner').innerText = u.banner || 'default';

  $('profile-edit-display-name').value = u.displayName || '';
  $('profile-edit-age').value = u.age || '';
  $('profile-edit-city').value = u.city || '';
  $('profile-edit-country').value = u.country || '';
  $('profile-edit-about').value = u.about || '';
  $('profile-edit-banner').value = u.banner || 'default';

  if (u.profilePictureUrl) {
    $('profile-picture').src = u.profilePictureUrl;
  } else {
    $('profile-picture').src = '';
  }

  $('referral-optin').checked = u.referralOptIn;
  $('referral-points').innerText = u.referralPoints ?? 0;
  $('referral-month-count').innerText = u.referralMonthlyCount ?? 0;

  await loadReferralCodes();
  await loadGalleryForProfile(currentUser.uid);
  await loadProfilePosts(currentUser.uid);
}

async function saveProfile() {
  if (!currentUser) return;
  const displayName = $('profile-edit-display-name').value.trim();
  const age = Number($('profile-edit-age').value || 0);
  const city = $('profile-edit-city').value.trim();
  const country = $('profile-edit-country').value.trim();
  const about = $('profile-edit-about').value.trim();
  const banner = $('profile-edit-banner').value;
  const optin = $('referral-optin').checked;
  const fileInput = $('profile-edit-picture');

  try {
    let profilePictureUrl = currentUserDoc.profilePictureUrl || '';

    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const path = `profilePictures/${currentUser.uid}`;
      const ref = storage.ref().child(path);
      await ref.put(file);
      profilePictureUrl = await ref.getDownloadURL();
    }

    await db.collection('users').doc(currentUser.uid).set({
      displayName,
      displayNameLower: displayName.toLowerCase(),
      age: age || null,
      city,
      country,
      about,
      banner,
      profilePictureUrl,
      referralOptIn: optin
    }, { merge: true });

    await currentUser.updateProfile({ displayName });

    $('profile-save-msg').innerText = 'Profile saved.';
    setTimeout(() => $('profile-save-msg').innerText = '', 2000);
    await loadProfileView();
  } catch (err) {
    $('profile-save-msg').innerText = err.message;
  }
}

async function loadGalleryForProfile(uid) {
  const container = $('gallery-container');
  if (!container) return;
  container.innerHTML = 'Loading...';

  const filterAlbum = $('gallery-filter-album') ? $('gallery-filter-album').value.trim() : '';

  let query = db.collection('posts')
    .where('authorId', '==', uid)
    .where('imageUrl', '!=', null);

  // Firestore requires indexing; we just filter album client side
  const snap = await query.get();
  const items = [];
  snap.forEach(doc => {
    const data = doc.data();
    if (filterAlbum && data.album !== filterAlbum) return;
    if (!data.imageUrl) return;
    items.push(data);
  });

  if (!items.length) {
    container.innerHTML = '<p>No photos yet.</p>';
    return;
  }

  container.innerHTML = '';
  items.forEach(p => {
    const img = document.createElement('img');
    img.src = p.imageUrl;
    img.alt = p.album || '';
    container.appendChild(img);
  });
}

// --- PROFILE POSTS ---

async function loadProfilePosts(uid) {
  const container = $('profile-posts-container');
  if (!container) return;
  container.innerHTML = 'Loading posts...';

  await loadUserDoc(); // ensure we know the logged-in user's friends

  const myFriends = currentUserDoc.friends || [];
  const isMe = (uid === currentUser.uid);
  const isFriend = myFriends.includes(uid);

  // Query this user's posts
  const snap = await db.collection('posts')
    .where('authorId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();

  const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Filter visibility
  const visiblePosts = posts.filter(p => {
    if (p.visibility === 'public') return true;
    if (p.visibility === 'friends') {
      return isMe || isFriend;
    }
    return false;
  });

  if (!visiblePosts.length) {
    container.innerHTML = '<p>No posts to show.</p>';
    return;
  }

  container.innerHTML = '';

  for (const post of visiblePosts) {
    const div = document.createElement('div');
    div.className = 'post card';
    div.innerHTML = `
      <div class="post-header">
        <div>
          <strong>${currentUserDoc.displayName}</strong>
          <div class="post-meta">
            ${post.visibility === 'friends' ? 'Friends only • ' : 'Public • '}
            ${formatDate(post.createdAt)}
          </div>
        </div>
      </div>

      <div class="post-body">
        <p>${post.text || ''}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="post image">` : ''}
        ${post.album ? `<p><em>Album: ${post.album}</em></p>` : ''}
      </div>

      <div class="post-actions" data-post-id="${post.id}">
        <button class="like-btn">Like</button>
        <button class="show-comments-btn">Show comments</button>
        ${post.imageUrl ? `<a href="${post.imageUrl}" download>Download image</a>` : ''}
        ${(uid === currentUser.uid || currentUserDoc.role === 'admin' || currentUser.uid === OWNER_UID)
          ? `<button class="delete-post-btn">Delete</button>`
          : ''
        }
      </div>

      <div class="post-comments" id="comments-${post.id}"></div>

      <div class="post-comment-form">
        <textarea class="comment-text" placeholder="Add a comment..."></textarea>
        <button class="add-comment-btn" data-post-id="${post.id}">Comment</button>
      </div>
    `;
    container.appendChild(div);
  }

  // Button handlers
  container.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.closest('.post-actions').getAttribute('data-post-id');
      toggleLike(postId);
    });
  });

  container.querySelectorAll('.show-comments-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.closest('.post-actions').getAttribute('data-post-id');
      loadComments(postId);
    });
  });

  container.querySelectorAll('.add-comment-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const postId = btn.getAttribute('data-post-id');
      const textarea = btn.parentElement.querySelector('.comment-text');
      const text = textarea.value.trim();
      if (!text) return;
      await addComment(postId, text);
      textarea.value = '';
      await loadComments(postId);
    });
  });

  container.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const postId = e.target.closest('.post-actions').getAttribute('data-post-id');
      if (confirm('Delete this post?')) {
        await db.collection('posts').doc(postId).delete();
        await loadProfilePosts(uid);
      }
    });
  });
}


// --- REFERRAL SYSTEM ---

async function loadReferralCodes() {
  if (!currentUser) return;
  const container = $('referral-codes');
  container.innerHTML = 'Loading codes...';

  const snap = await db.collection('users').doc(currentUser.uid)
    .collection('referralInvites')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  if (snap.empty) {
    container.innerHTML = '<p>No invites yet.</p>';
    return;
  }

  const list = document.createElement('ul');
  snap.forEach(doc => {
    const d = doc.data();
    const li = document.createElement('li');
    li.textContent = `${d.code} (created: ${formatDate(d.createdAt)})`;
    list.appendChild(li);
  });
  container.innerHTML = '';
  container.appendChild(list);
}

function setupReferralHandlers() {
  const createBtn = $('create-referral-btn');
  const clearBtn = $('clear-referral-btn');

  if (createBtn) {
    createBtn.addEventListener('click', async () => {
      if (!currentUser) return;
      await loadUserDoc();
      const u = currentUserDoc;

      if (!u.referralOptIn) {
        alert('You are not opted in to the referral program.');
        return;
      }
      const month = currentMonthString();
      let count = u.referralMonthlyCount || 0;
      let userMonth = u.referralMonth || month;
      if (userMonth !== month) {
        count = 0;
        userMonth = month;
      }
      if (count >= 5) {
        alert('You already created 5 invites this month.');
        return;
      }

      const code = Math.random().toString(36).slice(2, 10).toUpperCase();

      const batch = db.batch();
      const userRef = db.collection('users').doc(currentUser.uid);
      batch.update(userRef, {
        referralMonth: userMonth,
        referralMonthlyCount: count + 1
      });
      const inviteRef = userRef.collection('referralInvites').doc();
      batch.set(inviteRef, {
        code,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await batch.commit();

      alert('Referral code created: ' + code);
      await loadUserDoc();
      await loadProfileView();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (!currentUser) return;
      if (!confirm('Delete your referral data and opt-out?')) return;
      const userRef = db.collection('users').doc(currentUser.uid);
      await userRef.set({
        referralOptIn: false,
        referralPoints: 0,
        referralMonth: currentMonthString(),
        referralMonthlyCount: 0
      }, { merge: true });

      // delete invites (best effort)
      const invitesSnap = await userRef.collection('referralInvites').get();
      const batch = db.batch();
      invitesSnap.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      await loadProfileView();
    });
  }
}

async function handleReferralUse(referralCode, newUserUid) {
  // Find invite by code using collection group
  const snap = await db.collectionGroup('referralInvites')
    .where('code', '==', referralCode.toUpperCase())
    .limit(1)
    .get();

  if (snap.empty) return; // code not found, just ignore

  const inviteDoc = snap.docs[0];
  const inviterUserRef = inviteDoc.ref.parent.parent; // /users/{uid}
  if (!inviterUserRef) return;

  await db.runTransaction(async (tx) => {
    const inviterSnap = await tx.get(inviterUserRef);
    if (!inviterSnap.exists) return;
    const inviter = inviterSnap.data();
    const points = inviter.referralPoints || 0;
    tx.update(inviterUserRef, { referralPoints: points + 1 });
  });
}

// --- FRIENDS ---

function setupFriendsHandlers() {
  const searchBtn = $('friend-search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', searchFriends);
  }
}

async function searchFriends() {
  const term = $('friend-search-input').value.trim().toLowerCase();
  const container = $('friend-search-results');
  container.innerHTML = '';
  if (!term) return;

  const snap = await db.collection('users')
    .where('displayNameLower', '==', term)
    .get();

  if (snap.empty) {
    container.innerText = 'No users found.';
    return;
  }

  snap.forEach(doc => {
    const u = doc.data();
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${u.displayName}</strong>
      <p>${u.city || ''}, ${u.country || ''}</p>
      <p>Age: ${u.age || ''}</p>
      <button class="add-friend-btn" data-uid="${doc.id}">Add friend</button>
      <button class="message-friend-btn" data-uid="${doc.id}">Message</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.add-friend-btn').forEach(btn => {
    btn.addEventListener('click', () => addFriend(btn.getAttribute('data-uid')));
  });

  container.querySelectorAll('.message-friend-btn').forEach(btn => {
    btn.addEventListener('click', () => openConversationWith(btn.getAttribute('data-uid')));
  });
}

async function addFriend(friendUid) {
  if (!currentUser) return;
  if (friendUid === currentUser.uid) return;
  await loadUserDoc();
  const friends = currentUserDoc.friends || [];
  if (friends.includes(friendUid)) {
    alert('Already friends.');
    return;
  }
  friends.push(friendUid);
  await db.collection('users').doc(currentUser.uid).set({
    friends
  }, { merge: true });
  await loadUserDoc();
  alert('Friend added.');
  await loadFriendsView();
}

async function loadFriendsView() {
  if (!currentUser) return;
  await loadUserDoc();
  const friends = currentUserDoc.friends || [];
  const container = $('friends-list');
  container.innerHTML = '';
  if (!friends.length) {
    container.innerText = 'You have no friends yet.';
  } else {
    for (const fid of friends) {
      const snap = await db.collection('users').doc(fid).get();
      if (!snap.exists) continue;
      const u = snap.data();
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <strong>${u.displayName}</strong>
        <p>${u.city || ''}, ${u.country || ''} • Age: ${u.age || ''}</p>
        <button class="message-friend-btn" data-uid="${fid}">Message</button>
      `;
      container.appendChild(div);
    }
  }

  container.querySelectorAll('.message-friend-btn').forEach(btn => {
    btn.addEventListener('click', () => openConversationWith(btn.getAttribute('data-uid')));
  });

  // suggestions: mutual friends
  const suggContainer = $('friend-suggestions');
  suggContainer.innerHTML = '';
  const allUsersSnap = await db.collection('users').get();
  const myFriendsSet = new Set(friends);
  const suggestions = [];
  allUsersSnap.forEach(doc => {
    if (doc.id === currentUser.uid) return;
    if (myFriendsSet.has(doc.id)) return;
    const u = doc.data();
    const hisFriends = new Set(u.friends || []);
    let mutual = 0;
    friends.forEach(f => {
      if (hisFriends.has(f)) mutual++;
    });
    if (mutual > 0) {
      suggestions.push({ id: doc.id, user: u, mutual });
    }
  });
  suggestions.sort((a, b) => b.mutual - a.mutual);
  suggestions.slice(0, 10).forEach(s => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${s.user.displayName}</strong>
      <p>${s.user.city || ''}, ${s.user.country || ''}</p>
      <p>Mutual friends: ${s.mutual}</p>
      <button class="add-friend-btn" data-uid="${s.id}">Add friend</button>
    `;
    suggContainer.appendChild(div);
  });

  suggContainer.querySelectorAll('.add-friend-btn').forEach(btn => {
    btn.addEventListener('click', () => addFriend(btn.getAttribute('data-uid')));
  });
}

// --- DIRECT MESSAGES ---

function setupMessagesHandlers() {
  const sendBtn = $('dm-send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
}

function conversationId(uid1, uid2) {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

async function openConversationWith(friendUid) {
  if (!currentUser) return;
  currentConversationWith = friendUid;
  showView('messages');
  await loadMessages(friendUid);
}

async function loadConversationsList() {
  if (!currentUser) return;
  const container = $('conversations-list');
  container.innerHTML = 'Loading...';

  const snap = await db.collection('conversations')
    .where('participants', 'array-contains', currentUser.uid)
    .get();

  if (snap.empty) {
    container.innerText = 'No conversations yet.';
    return;
  }

  container.innerHTML = '';
  for (const doc of snap.docs) {
    const conv = doc.data();
    const otherUid = conv.participants.find(p => p !== currentUser.uid);
    const userSnap = await db.collection('users').doc(otherUid).get();
    const u = userSnap.data();

    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${u.displayName}</strong>
      <p>Click to open conversation</p>
    `;
    div.addEventListener('click', () => openConversationWith(otherUid));
    container.appendChild(div);
  }
}

async function loadMessages(otherUid) {
  if (!currentUser) return;
  $('dm-current-with').innerText = `Chatting with: ${otherUid}`;
  const container = $('messages-container');
  container.innerHTML = 'Loading...';

  const convId = conversationId(currentUser.uid, otherUid);
  const messagesSnap = await db.collection('conversations').doc(convId)
    .collection('messages')
    .orderBy('createdAt', 'asc')
    .get();

  container.innerHTML = '';
  messagesSnap.forEach(doc => {
    const m = doc.data();
    const div = document.createElement('div');
    div.className = 'message' + (m.senderId === currentUser.uid ? ' me' : '');
    div.innerText = `${m.text} (${formatDate(m.createdAt)})`;
    container.appendChild(div);
  });
}

async function sendMessage() {
  if (!currentUser || !currentConversationWith) return;
  const textArea = $('dm-text');
  const text = textArea.value.trim();
  if (!text) return;
  const otherUid = currentConversationWith;
  const convId = conversationId(currentUser.uid, otherUid);
  const convRef = db.collection('conversations').doc(convId);
  await convRef.set({
    participants: [currentUser.uid, otherUid]
  }, { merge: true });
  await convRef.collection('messages').add({
    senderId: currentUser.uid,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  textArea.value = '';
  await loadMessages(otherUid);
}

// --- SETTINGS ---

function setupSettingsHandlers() {
  // theme
  const themeSelect = $('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', async () => {
      const theme = themeSelect.value;
      await db.collection('users').doc(currentUser.uid).set({ theme }, { merge: true });
      applyTheme(theme);
    });
  }

  const displayNameBtn = $('settings-display-name-save');
  if (displayNameBtn) {
    displayNameBtn.addEventListener('click', async () => {
      const name = $('settings-display-name').value.trim();
      if (!name) return;
      await db.collection('users').doc(currentUser.uid).set({
        displayName: name,
        displayNameLower: name.toLowerCase()
      }, { merge: true });
      await currentUser.updateProfile({ displayName: name });
      alert('Display name updated.');
    });
  }

  const downloadBtn = $('download-data-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadMyData);
  }

  const deleteBtn = $('delete-account-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteMyAccount);
  }

  // referral program handlers
  setupReferralHandlers();
}

async function applyThemeFromSettings() {
  if (!currentUser) return;
  await loadUserDoc();
  const theme = currentUserDoc.theme || 'light';
  applyTheme(theme);
  const themeSelect = $('theme-select');
  if (themeSelect) themeSelect.value = theme;
}

function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add('theme-' + theme);
}

async function loadSettingsView() {
  if (!currentUser) return;
  await loadUserDoc();
  $('settings-display-name').value = currentUserDoc.displayName || '';
}

async function downloadMyData() {
  if (!currentUser) return;
  const uid = currentUser.uid;

  const userSnap = await db.collection('users').doc(uid).get();
  const postsSnap = await db.collection('posts').where('authorId', '==', uid).get();
  const commentsSnap = await db.collectionGroup('comments')
    .where('authorId', '==', uid)
    .get();
  const convSnap = await db.collection('conversations')
    .where('participants', 'array-contains', uid).get();
  const invitesSnap = await db.collection('users').doc(uid)
    .collection('referralInvites').get();

  const data = {
    user: userSnap.data(),
    posts: postsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    comments: commentsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    conversations: [],
    referralInvites: invitesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  };

  for (const convDoc of convSnap.docs) {
    const conv = convDoc.data();
    const msgsSnap = await convDoc.ref.collection('messages').get();
    data.conversations.push({
      id: convDoc.id,
      ...conv,
      messages: msgsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    });
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function deleteMyAccount() {
  if (!currentUser) return;
  if (!confirm('Really delete your account and data? This cannot be undone.')) return;

  const uid = currentUser.uid;

  // Delete posts (simple version)
  const postsSnap = await db.collection('posts').where('authorId', '==', uid).get();
  const batch = db.batch();
  postsSnap.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  // Delete user doc
  await db.collection('users').doc(uid).delete();

  // Delete auth user
  await currentUser.delete();

  alert('Account deleted.');
}

// --- BILLING ---

function setupBillingHandlers() {
  const btn = $('billing-save-btn');
  if (btn) {
    btn.addEventListener('click', saveBillingInfo);
  }
}

async function saveBillingInfo() {
  if (!currentUser) return;
  const name = $('billing-name').value.trim();
  const address = $('billing-address').value.trim();
  const notes = $('billing-notes').value.trim();
  await db.collection('users').doc(currentUser.uid).set({
    billingName: name,
    billingAddress: address,
    billingNotes: notes
  }, { merge: true });
  $('billing-save-msg').innerText = 'Billing info saved.';
  setTimeout(() => $('billing-save-msg').innerText = '', 2000);
}

async function loadBillingView() {
  if (!currentUser) return;
  await loadUserDoc();
  $('billing-name').value = currentUserDoc.billingName || '';
  $('billing-address').value = currentUserDoc.billingAddress || '';
  $('billing-notes').value = currentUserDoc.billingNotes || '';
}

// --- ADMIN / OWNER ---

function setupAdminOwnerHandlers() {
  const siteSaveBtn = $('site-settings-save-btn');
  if (siteSaveBtn) {
    siteSaveBtn.addEventListener('click', async () => {
      if (!currentUser || currentUser.uid !== OWNER_UID) return;
      const active = $('site-active-checkbox').checked;
      await db.collection('config').doc('site').set({
        active
      }, { merge: true });
      alert('Site settings saved.');
    });
  }

  const toggleAdminBtn = $('toggle-admin-btn');
  if (toggleAdminBtn) {
    toggleAdminBtn.addEventListener('click', async () => {
      if (!currentUser || currentUser.uid !== OWNER_UID) return;
      const email = $('admin-target-email').value.trim();
      if (!email) return;
      const snap = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      if (snap.empty) {
        $('owner-admin-msg').innerText = 'No user with that email.';
        return;
      }
      const doc = snap.docs[0];
      const user = doc.data();
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await doc.ref.set({ role: newRole }, { merge: true });
      $('owner-admin-msg').innerText = `User role set to ${newRole}.`;
      setTimeout(() => $('owner-admin-msg').innerText = '', 2000);
      await loadAdminView();
    });
  }

  // admin.html specific
  if (window.IS_ADMIN_PAGE) {
    const adminLoginBtn = $('admin-login-btn');
    if (adminLoginBtn) {
      adminLoginBtn.addEventListener('click', async () => {
        const email = $('admin-login-email').value.trim();
        const password = $('admin-login-password').value;
        $('admin-login-error').innerText = '';
        try {
          await auth.signInWithEmailAndPassword(email, password);
        } catch (err) {
          $('admin-login-error').innerText = err.message;
        }
      });
    }

    const adminLogoutBtn = $('admin-logout-btn');
    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', () => auth.signOut());
    }
  }
}

async function handleAdminPageAuthChange(user) {
  if (!user) {
    $('admin-auth-main').classList.remove('hidden');
    return;
  }
  await ensureUserDoc(user);
  await loadUserDoc();
  if (user.uid !== OWNER_UID && currentUserDoc.role !== 'admin') {
    $('admin-login-error').innerText = 'You are not an admin.';
    await auth.signOut();
    return;
  }
  $('admin-auth-main').classList.add('hidden');
  $('admin-panel').classList.remove('hidden');
  await loadAdminView();
}

async function loadAdminView() {
  if (!currentUser) return;
  await loadUserDoc();
  if (currentUser.uid !== OWNER_UID && currentUserDoc.role !== 'admin') return;

  const container = $('admin-users-list');
  if (!container) return;
  container.innerHTML = 'Loading users...';

  const snap = await db.collection('users').get();
  container.innerHTML = '';
  snap.forEach(doc => {
    const u = doc.data();
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <strong>${u.displayName} (${u.email})</strong>
      <p>Role: ${u.role || 'user'}</p>
      <button data-uid="${doc.id}" class="admin-delete-user-btn">Delete user</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.admin-delete-user-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const uid = btn.getAttribute('data-uid');
      if (!confirm('Delete this user profile (Firestore only)?')) return;
      await db.collection('users').doc(uid).delete();
      await loadAdminView();
    });
  });
}

async function loadOwnerView() {
  if (!currentUser || currentUser.uid !== OWNER_UID) return;

  // stats
  const usersSnap = await db.collection('users').get();
  const postsSnap = await db.collection('posts').get();
  $('stats-total-users').innerText = usersSnap.size;
  $('stats-total-posts').innerText = postsSnap.size;

  // site settings
  const siteSnap = await db.collection('config').doc('site').get();
  $('site-active-checkbox').checked = siteSnap.exists ? !!siteSnap.data().active : true;
}

// --- START ---
window.addEventListener('DOMContentLoaded', initApp);

