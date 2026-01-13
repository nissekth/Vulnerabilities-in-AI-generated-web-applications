// Global Variables
let currentUser = null;
let currentConversation = null;
let selectedTheme = 'default';

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Check auth state
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadUserData();
            showMainApp();
        } else {
            showWelcomePage();
        }
    });

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'default';
    applyTheme(savedTheme);
});

// Authentication Functions
async function register(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const inviteCode = document.getElementById('regInviteCode').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create user profile
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            name: name,
            displayName: name,
            email: email,
            age: null,
            city: null,
            country: null,
            about: '',
            profilePic: 'https://via.placeholder.com/150/667eea/ffffff?text=' + name.charAt(0),
            banner: 'gradient1',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastActive: firebase.firestore.FieldValue.serverTimestamp(),
            referralPoints: 0,
            referralOptOut: false,
            isAdmin: false,
            theme: 'default'
        });

        // Handle invite code
        if (inviteCode) {
            await processInviteCode(inviteCode, user.uid);
        }

        closeModal('registerModal');
        showNotification('Account created successfully! Welcome to Social Circle!');
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const persistence = rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION;
        
        await auth.setPersistence(persistence);
        await auth.signInWithEmailAndPassword(email, password);
        
        // Update last active
        await db.collection('users').doc(auth.currentUser.uid).update({
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });

        closeModal('loginModal');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

async function logout() {
    try {
        await auth.signOut();
        showWelcomePage();
        showNotification('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function resetPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;

    try {
        await auth.sendPasswordResetEmail(email);
        closeModal('forgotPasswordModal');
        showNotification('Password reset email sent! Check your inbox.');
    } catch (error) {
        console.error('Reset password error:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

// Process invite code
async function processInviteCode(code, newUserId) {
    try {
        const inviteDoc = await db.collection('inviteCodes').doc(code).get();
        if (inviteDoc.exists && !inviteDoc.data().used) {
            const referrerId = inviteDoc.data().createdBy;
            
            // Mark code as used
            await db.collection('inviteCodes').doc(code).update({
                used: true,
                usedBy: newUserId,
                usedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Award point to referrer
            await db.collection('users').doc(referrerId).update({
                referralPoints: firebase.firestore.FieldValue.increment(1)
            });
        }
    } catch (error) {
        console.error('Error processing invite code:', error);
    }
}

// Load User Data
async function loadUserData() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        document.getElementById('navUsername').textContent = userData.displayName || userData.name;

        // Load theme
        if (userData.theme) {
            applyTheme(userData.theme);
            document.getElementById('themeSelect').value = userData.theme;
        }

        // Show admin/owner links if applicable
        if (userData.isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        }

        // Check if user is owner (you'll set this manually for your account)
        const ownerEmail = 'owner@owner.owner'; // Replace with your email
        if (currentUser.email === ownerEmail) {
            document.querySelectorAll('.owner-only').forEach(el => el.style.display = 'block');
        }

        loadFeed();
        loadProfile();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Posts Functions
async function createPost(event) {
    event.preventDefault();
    const content = document.getElementById('postContent').value.trim();
    const friendsOnly = document.getElementById('friendsOnly').checked;
    const imageFile = document.getElementById('postImage').files[0];

    if (!content && !imageFile) {
        showNotification('Please write something or add an image', 'error');
        return;
    }

    try {
        let imageUrl = null;
        if (imageFile) {
            const storageRef = storage.ref(`posts/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
            const snapshot = await storageRef.put(imageFile);
            imageUrl = await snapshot.ref.getDownloadURL();
        }

        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        await db.collection('posts').add({
            userId: currentUser.uid,
            userName: userData.displayName || userData.name,
            userPhoto: userData.profilePic,
            content: content,
            imageUrl: imageUrl,
            friendsOnly: friendsOnly,
            likes: [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // If image, add to gallery
        if (imageUrl) {
            await db.collection('gallery').add({
                userId: currentUser.uid,
                imageUrl: imageUrl,
                postContent: content,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        document.getElementById('postContent').value = '';
        document.getElementById('friendsOnly').checked = false;
        document.getElementById('postImage').value = '';
        document.getElementById('imagePreview').innerHTML = '';

        loadFeed();
        showNotification('Post created successfully!');
    } catch (error) {
        console.error('Error creating post:', error);
        showNotification('Error creating post', 'error');
    }
}

async function loadFeed() {
    try {
        const feedContainer = document.getElementById('feedPosts');
        feedContainer.innerHTML = '<p>Loading posts...</p>';

        // Get user's friends
        const friendsDoc = await db.collection('friends').doc(currentUser.uid).get();
        const friendsList = friendsDoc.exists ? friendsDoc.data().list || [] : [];

        // Get all posts
        const postsSnapshot = await db.collection('posts')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        if (postsSnapshot.empty) {
            feedContainer.innerHTML = '<p class="text-center">No posts yet. Be the first to share something!</p>';
            return;
        }

        feedContainer.innerHTML = '';
        for (const doc of postsSnapshot.docs) {
            const post = doc.data();
            const postId = doc.id;

            // Check if user can see this post
            if (post.friendsOnly && post.userId !== currentUser.uid && !friendsList.includes(post.userId)) {
                continue;
            }

            const postCard = await createPostCard(post, postId);
            feedContainer.appendChild(postCard);
        }
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

async function createPostCard(post, postId) {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    const isLiked = post.likes && post.likes.includes(currentUser.uid);
    const likeCount = post.likes ? post.likes.length : 0;

    const timestamp = post.timestamp ? post.timestamp.toDate().toLocaleDateString() : 'Just now';

    card.innerHTML = `
        <div class="post-header">
            <img src="${post.userPhoto || 'https://via.placeholder.com/48'}" alt="${post.userName}" class="post-avatar" onclick="viewUserProfile('${post.userId}')">
            <div class="post-info">
                <h4 onclick="viewUserProfile('${post.userId}')" style="cursor: pointer;">${post.userName}</h4>
                <div class="post-time">${timestamp}${post.friendsOnly ? ' 👥 Friends only' : ''}</div>
            </div>
        </div>
        <div class="post-content">${post.content || ''}</div>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image" class="post-image">` : ''}
        <div class="post-actions">
            <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${postId}')">
                ${isLiked ? '❤️' : '🤍'} <span>${likeCount} Likes</span>
            </button>
            <button class="action-btn" onclick="toggleComments('${postId}')">
                💬 Comment
            </button>
            ${post.imageUrl ? `<a href="${post.imageUrl}" download class="action-btn">⬇️ Download</a>` : ''}
            ${post.userId !== currentUser.uid ? `<button class="action-btn" onclick="addFriendFromFeed('${post.userId}')">➕ Add Friend</button>` : ''}
        </div>
        <div id="comments-${postId}" class="comments-section" style="display:none;">
            <div id="comments-list-${postId}"></div>
            <form onsubmit="addComment(event, '${postId}')" class="comment-form">
                <input type="text" class="comment-input" placeholder="Write a comment..." required>
                <button type="submit" class="btn btn-primary btn-small">Post</button>
            </form>
        </div>
    `;

    return card;
}

async function toggleLike(postId) {
    try {
        const postRef = db.collection('posts').doc(postId);
        const postDoc = await postRef.get();
        const post = postDoc.data();
        const likes = post.likes || [];

        if (likes.includes(currentUser.uid)) {
            await postRef.update({
                likes: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
            });
        } else {
            await postRef.update({
                likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
            });
        }

        loadFeed();
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

async function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        await loadComments(postId);
    } else {
        commentsSection.style.display = 'none';
    }
}

async function loadComments(postId) {
    try {
        const commentsList = document.getElementById(`comments-list-${postId}`);
        const commentsSnapshot = await db.collection('posts').doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'asc')
            .get();

        commentsList.innerHTML = '';
        for (const doc of commentsSnapshot.docs) {
            const comment = doc.data();
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <div class="comment-author">${comment.userName}</div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsList.appendChild(commentEl);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

async function addComment(event, postId) {
    event.preventDefault();
    const input = event.target.querySelector('.comment-input');
    const text = input.value.trim();

    if (!text) return;

    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        await db.collection('posts').doc(postId).collection('comments').add({
            userId: currentUser.uid,
            userName: userData.displayName || userData.name,
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        input.value = '';
        await loadComments(postId);
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

// Profile Functions
async function loadProfile() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        document.getElementById('profileName').textContent = userData.displayName || userData.name;
        document.getElementById('profilePic').src = userData.profilePic || 'https://via.placeholder.com/150';
        
        const details = [];
        if (userData.age) details.push(`${userData.age} years old`);
        if (userData.city) details.push(userData.city);
        if (userData.country) details.push(userData.country);
        document.getElementById('profileDetails').textContent = details.join(' • ') || 'Complete your profile';

        document.getElementById('profileAbout').textContent = userData.about || 'No bio yet';

        const banner = document.getElementById('profileBanner');
        banner.className = `profile-banner ${userData.banner || 'gradient1'}`;

        await loadUserPosts();
        await loadGallery();
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadUserPosts() {
    try {
        const postsContainer = document.getElementById('profilePosts');
        const postsSnapshot = await db.collection('posts')
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .get();

        postsContainer.innerHTML = '';
        if (postsSnapshot.empty) {
            postsContainer.innerHTML = '<p class="text-center">No posts yet</p>';
            return;
        }

        for (const doc of postsSnapshot.docs) {
            const post = doc.data();
            const postCard = await createPostCard(post, doc.id);
            postsContainer.appendChild(postCard);
        }
    } catch (error) {
        console.error('Error loading user posts:', error);
    }
}

async function loadGallery() {
    try {
        const galleryContainer = document.getElementById('profileGallery');
        const gallerySnapshot = await db.collection('gallery')
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .get();

        galleryContainer.innerHTML = '';
        if (gallerySnapshot.empty) {
            galleryContainer.innerHTML = '<p class="text-center">No photos yet</p>';
            return;
        }

        for (const doc of gallerySnapshot.docs) {
            const item = doc.data();
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${item.imageUrl}" alt="Gallery photo">`;
            galleryItem.onclick = () => window.open(item.imageUrl, '_blank');
            galleryContainer.appendChild(galleryItem);
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function editProfile() {
    const modal = document.getElementById('editProfileModal');
    db.collection('users').doc(currentUser.uid).get().then(doc => {
        const userData = doc.data();
        document.getElementById('editName').value = userData.name || '';
        document.getElementById('editAge').value = userData.age || '';
        document.getElementById('editCity').value = userData.city || '';
        document.getElementById('editCountry').value = userData.country || '';
        document.getElementById('editAbout').value = userData.about || '';
        document.getElementById('bannerSelect').value = userData.banner || 'gradient1';
        openModal('editProfileModal');
    });
}

async function saveProfile(event) {
    event.preventDefault();
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            name: document.getElementById('editName').value,
            age: parseInt(document.getElementById('editAge').value) || null,
            city: document.getElementById('editCity').value,
            country: document.getElementById('editCountry').value,
            about: document.getElementById('editAbout').value,
            banner: document.getElementById('bannerSelect').value
        });

        closeModal('editProfileModal');
        loadProfile();
        showNotification('Profile updated successfully!');
    } catch (error) {
        console.error('Error saving profile:', error);
        showNotification('Error updating profile', 'error');
    }
}

async function changeProfilePic() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const storageRef = storage.ref(`profilePics/${currentUser.uid}`);
            const snapshot = await storageRef.put(file);
            const url = await snapshot.ref.getDownloadURL();

            await db.collection('users').doc(currentUser.uid).update({
                profilePic: url
            });

            loadProfile();
            showNotification('Profile picture updated!');
        } catch (error) {
            console.error('Error uploading profile pic:', error);
            showNotification('Error uploading image', 'error');
        }
    };

    input.click();
}

function showProfileTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.profile-tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    if (tab === 'posts') {
        document.getElementById('profilePosts').classList.add('active');
    } else if (tab === 'gallery') {
        document.getElementById('profileGallery').classList.add('active');
    }
}

// Friends Functions
async function loadFriends() {
    try {
        const friendsDoc = await db.collection('friends').doc(currentUser.uid).get();
        const friendsList = friendsDoc.exists ? friendsDoc.data().list || [] : [];

        const friendsContainer = document.getElementById('friendsList');
        friendsContainer.innerHTML = '';

        if (friendsList.length === 0) {
            friendsContainer.innerHTML = '<p class="text-center">No friends yet. Start adding people!</p>';
            return;
        }

        for (const friendId of friendsList) {
            const userDoc = await db.collection('users').doc(friendId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const friendCard = createFriendCard(userData);
                friendsContainer.appendChild(friendCard);
            }
        }

        await loadSuggestedFriends(friendsList);
    } catch (error) {
        console.error('Error loading friends:', error);
    }
}

async function loadSuggestedFriends(currentFriends) {
    try {
        const suggestedContainer = document.getElementById('suggestedFriends');
        const usersSnapshot = await db.collection('users').limit(20).get();

        suggestedContainer.innerHTML = '';
        let suggestedCount = 0;

        for (const doc of usersSnapshot.docs) {
            if (doc.id !== currentUser.uid && !currentFriends.includes(doc.id) && suggestedCount < 6) {
                const userData = doc.data();
                userData.uid = doc.id;
                const friendCard = createFriendCard(userData, true);
                suggestedContainer.appendChild(friendCard);
                suggestedCount++;
            }
        }

        if (suggestedCount === 0) {
            suggestedContainer.innerHTML = '<p class="text-center">No suggestions at the moment</p>';
        }
    } catch (error) {
        console.error('Error loading suggested friends:', error);
    }
}

function createFriendCard(userData, isSuggestion = false) {
    const card = document.createElement('div');
    card.className = 'friend-card';
    
    const details = [];
    if (userData.age) details.push(`${userData.age} years`);
    if (userData.city) details.push(userData.city);
    if (userData.country) details.push(userData.country);

    card.innerHTML = `
        <img src="${userData.profilePic || 'https://via.placeholder.com/100'}" alt="${userData.displayName || userData.name}" class="friend-avatar">
        <h4>${userData.displayName || userData.name}</h4>
        <p class="friend-info">${details.join(' • ') || 'No details'}</p>
        ${isSuggestion ? 
            `<button onclick="addFriend('${userData.uid}')" class="btn btn-primary btn-small">Add Friend</button>` :
            `<button onclick="viewUserProfile('${userData.uid}')" class="btn btn-outline btn-small">View Profile</button>
             <button onclick="removeFriend('${userData.uid}')" class="btn btn-small">Remove</button>`
        }
    `;

    return card;
}

async function addFriend(friendId) {
    try {
        await db.collection('friends').doc(currentUser.uid).set({
            list: firebase.firestore.FieldValue.arrayUnion(friendId)
        }, { merge: true });

        showNotification('Friend added!');
        if (document.getElementById('friendsPage').classList.contains('active')) {
            loadFriends();
        }
    } catch (error) {
        console.error('Error adding friend:', error);
        showNotification('Error adding friend', 'error');
    }
}

async function addFriendFromFeed(userId) {
    await addFriend(userId);
}

async function removeFriend(friendId) {
    if (!confirm('Remove this friend?')) return;

    try {
        await db.collection('friends').doc(currentUser.uid).update({
            list: firebase.firestore.FieldValue.arrayRemove(friendId)
        });

        showNotification('Friend removed');
        loadFriends();
    } catch (error) {
        console.error('Error removing friend:', error);
    }
}

// Messages Functions
async function loadMessages() {
    try {
        const friendsDoc = await db.collection('friends').doc(currentUser.uid).get();
        const friendsList = friendsDoc.exists ? friendsDoc.data().list || [] : [];

        const conversationsContainer = document.getElementById('conversationsList');
        conversationsContainer.innerHTML = '';

        if (friendsList.length === 0) {
            conversationsContainer.innerHTML = '<p>Add friends to start messaging</p>';
            return;
        }

        for (const friendId of friendsList) {
            const userDoc = await db.collection('users').doc(friendId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const conversationItem = document.createElement('div');
                conversationItem.className = 'conversation-item';
                conversationItem.innerHTML = `
                    <img src="${userData.profilePic || 'https://via.placeholder.com/40'}" alt="${userData.displayName || userData.name}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>${userData.displayName || userData.name}</div>
                `;
                conversationItem.onclick = () => openConversation(friendId, userData.displayName || userData.name);
                conversationsContainer.appendChild(conversationItem);
            }
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

async function openConversation(friendId, friendName) {
    currentConversation = friendId;
    
    document.getElementById('messageHeader').innerHTML = `<h3>Conversation with ${friendName}</h3>`;
    
    // Mark as active
    document.querySelectorAll('.conversation-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.conversation-item').classList.add('active');

    // Load messages
    await loadConversationMessages();
}

async function loadConversationMessages() {
    if (!currentConversation) return;

    try {
        const conversationId = [currentUser.uid, currentConversation].sort().join('_');
        const messagesContainer = document.getElementById('messagesList');
        
        const messagesSnapshot = await db.collection('messages')
            .where('conversationId', '==', conversationId)
            .orderBy('timestamp', 'asc')
            .get();

        messagesContainer.innerHTML = '';
        for (const doc of messagesSnapshot.docs) {
            const message = doc.data();
            const messageEl = document.createElement('div');
            messageEl.className = message.senderId === currentUser.uid ? 'message sent' : 'message received';
            messageEl.textContent = message.text;
            messagesContainer.appendChild(messageEl);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error('Error loading conversation:', error);
    }
}

async function sendMessage(event) {
    event.preventDefault();
    if (!currentConversation) {
        showNotification('Select a conversation first', 'error');
        return;
    }

    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    try {
        const conversationId = [currentUser.uid, currentConversation].sort().join('_');
        
        await db.collection('messages').add({
            conversationId: conversationId,
            senderId: currentUser.uid,
            receiverId: currentConversation,
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        input.value = '';
        await loadConversationMessages();
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message', 'error');
    }
}

// Search Functions
async function searchUsers() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) {
        showNotification('Please enter a search term', 'error');
        return;
    }

    await performSearch(query, 'searchResults');
}

async function searchUsersPublic() {
    const query = document.getElementById('publicSearchInput').value.trim().toLowerCase();
    if (!query) {
        showNotification('Please enter a search term', 'error');
        return;
    }

    await performSearch(query, 'publicSearchResults');
}

async function performSearch(query, containerId) {
    try {
        const container = document.getElementById(containerId);
        container.innerHTML = '<p>Searching...</p>';

        const usersSnapshot = await db.collection('users').get();
        const results = [];

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const searchText = `${userData.name} ${userData.displayName} ${userData.city} ${userData.country}`.toLowerCase();
            
            if (searchText.includes(query)) {
                userData.uid = doc.id;
                results.push(userData);
            }
        }

        container.innerHTML = '';
        if (results.length === 0) {
            container.innerHTML = '<p class="text-center">No users found</p>';
            return;
        }

        for (const userData of results) {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <img src="${userData.profilePic || 'https://via.placeholder.com/80'}" alt="${userData.displayName || userData.name}" class="user-avatar">
                <h4>${userData.displayName || userData.name}</h4>
                <p>${userData.city || 'Location not set'}</p>
                ${currentUser ? 
                    `<button onclick="addFriend('${userData.uid}')" class="btn btn-primary btn-small">Add Friend</button>
                     <button onclick="viewUserProfile('${userData.uid}')" class="btn btn-outline btn-small">View Profile</button>` :
                    `<button onclick="showLogin()" class="btn btn-primary btn-small">Login to Connect</button>`
                }
            `;
            container.appendChild(userCard);
        }
    } catch (error) {
        console.error('Error searching users:', error);
    }
}

async function viewUserProfile(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) return;

        const userData = userDoc.data();
        const modal = document.getElementById('viewProfileModal');
        const content = document.getElementById('viewProfileContent');

        const details = [];
        if (userData.age) details.push(`${userData.age} years old`);
        if (userData.city) details.push(userData.city);
        if (userData.country) details.push(userData.country);

        content.innerHTML = `
            <div class="profile-banner ${userData.banner || 'gradient1'}"></div>
            <div style="text-align: center; margin-top: -60px;">
                <img src="${userData.profilePic || 'https://via.placeholder.com/150'}" alt="${userData.displayName || userData.name}" style="width: 150px; height: 150px; border-radius: 50%; border: 5px solid white;">
                <h2>${userData.displayName || userData.name}</h2>
                <p>${details.join(' • ') || 'No details'}</p>
                <p style="margin: 1rem 0;">${userData.about || 'No bio'}</p>
                ${currentUser ? `<button onclick="addFriend('${userId}')" class="btn btn-primary">Add Friend</button>` : ''}
            </div>
        `;

        openModal('viewProfileModal');
    } catch (error) {
        console.error('Error viewing profile:', error);
    }
}

// Settings Functions
function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    applyTheme(theme);
    
    if (currentUser) {
        db.collection('users').doc(currentUser.uid).update({ theme: theme });
    }
}

function applyTheme(theme) {
    const themeMap = {
        'default': '',
        'dark': 'dark',
        'sunset': 'sunset',
        'forest': 'forest',
        'lavender': 'lavender'
    };

    document.documentElement.setAttribute('data-theme', themeMap[theme] || '');
    localStorage.setItem('theme', theme);
    selectedTheme = theme;
}

async function updateDisplayName() {
    const newName = document.getElementById('displayNameInput').value.trim();
    if (!newName) {
        showNotification('Please enter a display name', 'error');
        return;
    }

    try {
        await db.collection('users').doc(currentUser.uid).update({
            displayName: newName
        });

        showNotification('Display name updated!');
        loadUserData();
    } catch (error) {
        console.error('Error updating display name:', error);
        showNotification('Error updating display name', 'error');
    }
}

async function generateInviteCode() {
    try {
        // Check monthly limit
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const codesSnapshot = await db.collection('inviteCodes')
            .where('createdBy', '==', currentUser.uid)
            .where('createdAt', '>=', monthStart)
            .get();

        if (codesSnapshot.size >= 5) {
            showNotification('You have reached your monthly limit of 5 invite codes', 'error');
            return;
        }

        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        await db.collection('inviteCodes').doc(code).set({
            code: code,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            used: false
        });

        await loadInviteCodes();
        showNotification('Invite code generated!');
    } catch (error) {
        console.error('Error generating invite code:', error);
        showNotification('Error generating code', 'error');
    }
}

async function loadInviteCodes() {
    try {
        const container = document.getElementById('inviteCodes');
        const codesSnapshot = await db.collection('inviteCodes')
            .where('createdBy', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();

        container.innerHTML = '';
        for (const doc of codesSnapshot.docs) {
            const code = doc.data();
            const codeEl = document.createElement('div');
            codeEl.style.padding = '0.5rem';
            codeEl.style.borderBottom = '1px solid var(--border)';
            codeEl.innerHTML = `
                <strong>${code.code}</strong> - ${code.used ? '✓ Used' : '○ Available'}
            `;
            container.appendChild(codeEl);
        }

        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        document.getElementById('referralPoints').textContent = userDoc.data().referralPoints || 0;
    } catch (error) {
        console.error('Error loading invite codes:', error);
    }
}

async function optOutReferrals() {
    if (!confirm('Are you sure you want to opt out of the referral program? This will delete all your credits and codes.')) {
        return;
    }

    try {
        await db.collection('users').doc(currentUser.uid).update({
            referralOptOut: true,
            referralPoints: 0
        });

        const codesSnapshot = await db.collection('inviteCodes')
            .where('createdBy', '==', currentUser.uid)
            .get();

        const batch = db.batch();
        codesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        showNotification('Opted out of referral program');
        loadInviteCodes();
    } catch (error) {
        console.error('Error opting out:', error);
    }
}

async function updateBilling() {
    const billingData = {
        name: document.getElementById('billingName').value,
        address: document.getElementById('billingAddress').value
    };

    try {
        await db.collection('users').doc(currentUser.uid).update({
            billing: billingData
        });

        showNotification('Billing information updated!');
    } catch (error) {
        console.error('Error updating billing:', error);
        showNotification('Error updating billing info', 'error');
    }
}

async function downloadData() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const postsSnapshot = await db.collection('posts').where('userId', '==', currentUser.uid).get();
        
        const data = {
            profile: userDoc.data(),
            posts: postsSnapshot.docs.map(doc => doc.data())
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-data.json';
        a.click();

        showNotification('Data downloaded!');
    } catch (error) {
        console.error('Error downloading data:', error);
        showNotification('Error downloading data', 'error');
    }
}

async function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone!')) {
        return;
    }

    const confirmation = prompt('Type "DELETE" to confirm:');
    if (confirmation !== 'DELETE') {
        return;
    }

    try {
        // Delete user posts
        const postsSnapshot = await db.collection('posts').where('userId', '==', currentUser.uid).get();
        const batch = db.batch();
        postsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Delete user document
        await db.collection('users').doc(currentUser.uid).delete();

        // Delete auth account
        await currentUser.delete();

        showNotification('Account deleted');
        showWelcomePage();
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Error deleting account. You may need to re-login first.', 'error');
    }
}

// Admin Functions
async function loadAdminData() {
    try {
        // Load all users
        const usersContainer = document.getElementById('adminUsersList');
        const usersSnapshot = await db.collection('users').get();
        
        usersContainer.innerHTML = '';
        for (const doc of usersSnapshot.docs) {
            const user = doc.data();
            const userItem = document.createElement('div');
            userItem.className = 'admin-user-item';
            userItem.innerHTML = `
                <div>
                    <strong>${user.displayName || user.name}</strong> - ${user.email}
                </div>
                <div>
                    <button onclick="makeAdmin('${doc.id}')" class="btn btn-small">Make Admin</button>
                    <button onclick="deleteUserAdmin('${doc.id}')" class="btn btn-danger btn-small">Delete</button>
                </div>
            `;
            usersContainer.appendChild(userItem);
        }

        // Load admins
        const adminsContainer = document.getElementById('adminAdminsList');
        const adminsSnapshot = await db.collection('users').where('isAdmin', '==', true).get();
        
        adminsContainer.innerHTML = '';
        for (const doc of adminsSnapshot.docs) {
            const admin = doc.data();
            const adminItem = document.createElement('div');
            adminItem.className = 'admin-user-item';
            adminItem.innerHTML = `
                <div>
                    <strong>${admin.displayName || admin.name}</strong> - ${admin.email}
                </div>
                <button onclick="removeAdmin('${doc.id}')" class="btn btn-small">Remove Admin</button>
            `;
            adminsContainer.appendChild(adminItem);
        }

        // Load all posts
        const postsContainer = document.getElementById('adminPostsList');
        const postsSnapshot = await db.collection('posts').orderBy('timestamp', 'desc').limit(20).get();
        
        postsContainer.innerHTML = '';
        for (const doc of postsSnapshot.docs) {
            const post = doc.data();
            const postItem = document.createElement('div');
            postItem.className = 'admin-user-item';
            postItem.innerHTML = `
                <div>
                    <strong>${post.userName}</strong>: ${post.content?.substring(0, 50)}...
                </div>
                <button onclick="deletePostAdmin('${doc.id}')" class="btn btn-danger btn-small">Delete</button>
            `;
            postsContainer.appendChild(postItem);
        }
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

async function makeAdmin(userId) {
    try {
        await db.collection('users').doc(userId).update({ isAdmin: true });
        showNotification('User promoted to admin');
        loadAdminData();
    } catch (error) {
        console.error('Error making admin:', error);
    }
}

async function removeAdmin(userId) {
    try {
        await db.collection('users').doc(userId).update({ isAdmin: false });
        showNotification('Admin privileges removed');
        loadAdminData();
    } catch (error) {
        console.error('Error removing admin:', error);
    }
}

async function deleteUserAdmin(userId) {
    if (!confirm('Delete this user?')) return;

    try {
        await db.collection('users').doc(userId).delete();
        showNotification('User deleted');
        loadAdminData();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function deletePostAdmin(postId) {
    try {
        await db.collection('posts').doc(postId).delete();
        showNotification('Post deleted');
        loadAdminData();
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Owner Functions
async function loadOwnerStats() {
    try {
        const usersSnapshot = await db.collection('users').get();
        document.getElementById('totalUsers').textContent = usersSnapshot.size;

        const postsSnapshot = await db.collection('posts').get();
        document.getElementById('totalPosts').textContent = postsSnapshot.size;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeSnapshot = await db.collection('users')
            .where('lastActive', '>=', today)
            .get();
        document.getElementById('activeToday').textContent = activeSnapshot.size;
    } catch (error) {
        console.error('Error loading owner stats:', error);
    }
}

async function exportAllData() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const postsSnapshot = await db.collection('posts').get();

        const data = {
            users: usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            posts: postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'site-data-export.json';
        a.click();

        showNotification('All data exported!');
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}

// UI Functions
function showPage(pageId) {
    document.querySelectorAll('.content-page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (navLink) navLink.classList.add('active');

    // Load page-specific data
    if (pageId === 'friendsPage') loadFriends();
    if (pageId === 'messagesPage') loadMessages();
    if (pageId === 'settingsPage') loadInviteCodes();
    if (pageId === 'adminPage') loadAdminData();
    if (pageId === 'ownerPage') loadOwnerStats();
}

function showWelcomePage() {
    document.getElementById('welcomePage').classList.add('active');
    document.getElementById('mainApp').classList.remove('active');
}

function showMainApp() {
    document.getElementById('welcomePage').classList.remove('active');
    document.getElementById('mainApp').classList.add('active');
}

function showLogin() {
    openModal('loginModal');
}

function showRegister() {
    openModal('registerModal');
}

function showForgotPassword() {
    closeModal('loginModal');
    openModal('forgotPasswordModal');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? 'var(--danger)' : 'var(--success)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Image preview for posts
document.getElementById('postImage')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = 
                `<img src="${e.target.result}" style="max-width: 100%; border-radius: 8px; margin-top: 1rem;">`;
        };
        reader.readAsDataURL(file);
    }
});
