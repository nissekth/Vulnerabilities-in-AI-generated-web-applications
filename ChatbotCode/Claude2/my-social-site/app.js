// Global variables
let currentUser = null;
let currentTheme = 'light';
let currentConversation = null;
let unsubscribers = [];

// Initialize app
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        initializeApp();
    } else {
        currentUser = null;
        showWelcome();
    }
});

// Page Navigation
function showWelcome() {
    hideAllPages();
    document.getElementById('welcomePage').classList.add('active');
}

function showLogin() {
    hideAllPages();
    document.getElementById('loginPage').classList.add('active');
}

function showRegister() {
    hideAllPages();
    document.getElementById('registerPage').classList.add('active');
}

function showAdminLoginPage() {
    hideAllPages();
    document.getElementById('adminLoginPage').classList.add('active');
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
}

// Authentication
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    try {
        const persistence = remember ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION;
        
        await firebase.auth().setPersistence(persistence);
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showToast('Login successful!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function register(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Create user profile
        await firebase.firestore().collection('users').doc(result.user.uid).set({
            displayName: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            profilePicture: '',
            banner: 'gradient1',
            about: '',
            age: null,
            city: '',
            country: '',
            friends: [],
            referralPoints: 0,
            invitesThisMonth: 0,
            referralOptOut: false,
            theme: 'light'
        });

        await result.user.updateProfile({ displayName: name });
        showToast('Registration successful!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function adminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        
        // Check if user is admin
        const userDoc = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
        if (!userDoc.data().isAdmin) {
            await firebase.auth().signOut();
            showToast('Access denied. Admin privileges required.', 'error');
        } else {
            showToast('Admin login successful!', 'success');
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function forgotPassword() {
    const email = prompt('Enter your email address:');
    if (email) {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            showToast('Password reset email sent!', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}

async function logout() {
    try {
        await firebase.auth().signOut();
        showToast('Logged out successfully', 'success');
        showWelcome();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// App Initialization
async function initializeApp() {
    hideAllPages();
    document.getElementById('mainApp').classList.add('active');
    
    // Check user role and show appropriate nav links
    const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    if (userData.isAdmin) {
        document.getElementById('adminNavLink').style.display = 'block';
    }
    
    if (userData.isOwner) {
        document.getElementById('ownerNavLink').style.display = 'block';
    }
    
    // Load user theme
    if (userData.theme) {
        document.documentElement.setAttribute('data-theme', userData.theme);
        currentTheme = userData.theme;
    }
    
    showFeed();
}

// Feed Functions
function showFeed() {
    hideAllSections();
    document.getElementById('feedSection').classList.add('active');
    loadFeed();
}

async function loadFeed() {
    const feedContainer = document.getElementById('feedPosts');
    feedContainer.innerHTML = '<p>Loading posts...</p>';
    
    try {
        const postsSnapshot = await firebase.firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        feedContainer.innerHTML = '';
        
        for (const doc of postsSnapshot.docs) {
            const post = doc.data();
            const postId = doc.id;
            
            // Check visibility
            if (post.friendsOnly) {
                const authorDoc = await firebase.firestore().collection('users').doc(post.authorId).get();
                const authorData = authorDoc.data();
                if (!authorData.friends.includes(currentUser.uid) && post.authorId !== currentUser.uid) {
                    continue;
                }
            }
            
            const postElement = await createPostElement(postId, post);
            feedContainer.appendChild(postElement);
        }
        
        if (feedContainer.children.length === 0) {
            feedContainer.innerHTML = '<p>No posts yet. Be the first to post!</p>';
        }
    } catch (error) {
        feedContainer.innerHTML = '<p>Error loading posts</p>';
        console.error(error);
    }
}

async function createPost() {
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    const friendsOnly = document.getElementById('postVisibility').checked;
    
    if (!content && !imageFile) {
        showToast('Please write something or upload an image', 'error');
        return;
    }
    
    try {
        let imageUrl = '';
        
        if (imageFile) {
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`posts/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
            await imageRef.put(imageFile);
            imageUrl = await imageRef.getDownloadURL();
            
            // Add to user gallery
            await firebase.firestore().collection('users').doc(currentUser.uid).update({
                gallery: firebase.firestore.FieldValue.arrayUnion(imageUrl)
            });
        }
        
        await firebase.firestore().collection('posts').add({
            authorId: currentUser.uid,
            authorName: currentUser.displayName,
            content: content,
            imageUrl: imageUrl,
            friendsOnly: friendsOnly,
            likes: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('postContent').value = '';
        document.getElementById('postImage').value = '';
        document.getElementById('postVisibility').checked = false;
        document.getElementById('charCount').textContent = '0';
        
        showToast('Post created!', 'success');
        loadFeed();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function createPostElement(postId, post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    
    const authorDoc = await firebase.firestore().collection('users').doc(post.authorId).get();
    const authorData = authorDoc.data();
    const profilePic = authorData.profilePicture || '';
    
    const isLiked = post.likes && post.likes.includes(currentUser.uid);
    const likeCount = post.likes ? post.likes.length : 0;
    
    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${profilePic || 'https://via.placeholder.com/40'}" class="post-avatar" alt="${post.authorName}">
            <div>
                <div class="post-author">${post.authorName}</div>
                <div class="post-time">${formatDate(post.createdAt)}</div>
            </div>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
        ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" alt="Post image">` : ''}
        <div class="post-actions">
            <div class="post-action ${isLiked ? 'liked' : ''}" onclick="toggleLike('${postId}')">
                ❤️ <span id="like-count-${postId}">${likeCount}</span>
            </div>
            <div class="post-action" onclick="toggleComments('${postId}')">
                💬 Comment
            </div>
            ${post.authorId === currentUser.uid ? `
                <div class="post-action" onclick="deletePost('${postId}')">
                    🗑️ Delete
                </div>
            ` : ''}
            ${post.imageUrl ? `
                <div class="post-action" onclick="downloadImage('${post.imageUrl}')">
                    ⬇️ Download
                </div>
            ` : ''}
        </div>
        <div class="comments-section" id="comments-${postId}" style="display:none;">
            <div id="comments-list-${postId}"></div>
            <div class="comment-input">
                <input type="text" id="comment-input-${postId}" placeholder="Write a comment...">
                <button onclick="addComment('${postId}')" class="btn-primary">Send</button>
            </div>
        </div>
    `;
    
    return postDiv;
}

async function toggleLike(postId) {
    try {
        const postRef = firebase.firestore().collection('posts').doc(postId);
        const postDoc = await postRef.get();
        const post = postDoc.data();
        
        const likes = post.likes || [];
        const isLiked = likes.includes(currentUser.uid);
        
        if (isLiked) {
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
        showToast(error.message, 'error');
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
    const commentsList = document.getElementById(`comments-list-${postId}`);
    
    try {
        const commentsSnapshot = await firebase.firestore()
            .collection('posts').doc(postId)
            .collection('comments')
            .orderBy('createdAt', 'asc')
            .get();
        
        commentsList.innerHTML = '';
        
        commentsSnapshot.forEach(doc => {
            const comment = doc.data();
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <div class="comment-author">${comment.authorName}</div>
                <div class="comment-content">${escapeHtml(comment.content)}</div>
            `;
            commentsList.appendChild(commentDiv);
        });
    } catch (error) {
        console.error(error);
    }
}

async function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    
    if (!content) return;
    
    try {
        await firebase.firestore()
            .collection('posts').doc(postId)
            .collection('comments')
            .add({
                authorId: currentUser.uid,
                authorName: currentUser.displayName,
                content: content,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        input.value = '';
        await loadComments(postId);
        showToast('Comment added!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        // Delete post and its comments
        const commentsSnapshot = await firebase.firestore()
            .collection('posts').doc(postId)
            .collection('comments')
            .get();
        
        const batch = firebase.firestore().batch();
        commentsSnapshot.forEach(doc => batch.delete(doc.ref));
        batch.delete(firebase.firestore().collection('posts').doc(postId));
        
        await batch.commit();
        showToast('Post deleted', 'success');
        loadFeed();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.jpg';
    a.click();
}

// Profile Functions
function showMyProfile() {
    showProfile(currentUser.uid);
}

async function showProfile(userId) {
    hideAllSections();
    document.getElementById('profileSection').classList.add('active');
    
    try {
        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();
        
        document.getElementById('profileName').textContent = userData.displayName;
        document.getElementById('profileInfo').textContent = 
            `${userData.age ? userData.age + ' years old' : ''} 
             ${userData.city ? '• ' + userData.city : ''} 
             ${userData.country ? ', ' + userData.country : ''}`;
        document.getElementById('profileAbout').textContent = userData.about || 'No bio yet';
        
        const profilePic = document.getElementById('profilePicture');
        profilePic.src = userData.profilePicture || 'https://via.placeholder.com/120';
        
        const banner = document.getElementById('profileBanner');
        banner.className = `profile-banner ${userData.banner || 'gradient1'}`;
        
        // Load user's posts (visible to friends only)
        const postsContainer = document.getElementById('profilePosts');
        postsContainer.innerHTML = '<p>Loading posts...</p>';
        
        // Check if viewer is a friend
        const viewerDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const isFriend = viewerDoc.data().friends.includes(userId) || userId === currentUser.uid;
        
        if (isFriend) {
            const postsSnapshot = await firebase.firestore()
                .collection('posts')
                .where('authorId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            postsContainer.innerHTML = '';
            
            for (const doc of postsSnapshot.docs) {
                const post = doc.data();
                const postElement = await createPostElement(doc.id, post);
                postsContainer.appendChild(postElement);
            }
            
            if (postsContainer.children.length === 0) {
                postsContainer.innerHTML = '<p>No posts yet</p>';
            }
        } else {
            postsContainer.innerHTML = '<p>Posts are visible to friends only</p>';
        }
        
        // Load gallery
        const galleryContainer = document.getElementById('profileGallery');
        galleryContainer.innerHTML = '';
        
        if (userData.gallery && userData.gallery.length > 0) {
            userData.gallery.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.className = 'gallery-image';
                img.onclick = () => window.open(imageUrl, '_blank');
                galleryContainer.appendChild(img);
            });
        } else {
            galleryContainer.innerHTML = '<p>No photos yet</p>';
        }
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function showEditProfile() {
    hideAllSections();
    document.getElementById('editProfileSection').classList.add('active');
    loadEditProfile();
}

async function loadEditProfile() {
    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        document.getElementById('editName').value = userData.displayName || '';
        document.getElementById('editAge').value = userData.age || '';
        document.getElementById('editCity').value = userData.city || '';
        document.getElementById('editCountry').value = userData.country || '';
        document.getElementById('editAbout').value = userData.about || '';
        document.getElementById('editBanner').value = userData.banner || 'gradient1';
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function updateProfile(event) {
    event.preventDefault();
    
    try {
        const updateData = {
            displayName: document.getElementById('editName').value,
            age: parseInt(document.getElementById('editAge').value) || null,
            city: document.getElementById('editCity').value,
            country: document.getElementById('editCountry').value,
            about: document.getElementById('editAbout').value,
            banner: document.getElementById('editBanner').value
        };
        
        const profilePicFile = document.getElementById('editProfilePic').files[0];
        if (profilePicFile) {
            const storageRef = firebase.storage().ref();
            const picRef = storageRef.child(`profilePictures/${currentUser.uid}`);
            await picRef.put(profilePicFile);
            updateData.profilePicture = await picRef.getDownloadURL();
        }
        
        await firebase.firestore().collection('users').doc(currentUser.uid).update(updateData);
        await currentUser.updateProfile({ displayName: updateData.displayName });
        
        showToast('Profile updated!', 'success');
        showMyProfile();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Friends Functions
function showFriends() {
    hideAllSections();
    document.getElementById('friendsSection').classList.add('active');
    loadFriends();
}

async function loadFriends() {
    const friendsList = document.getElementById('friendsList');
    const suggestedList = document.getElementById('suggestedFriends');
    
    friendsList.innerHTML = '<p>Loading friends...</p>';
    suggestedList.innerHTML = '<p>Loading suggestions...</p>';
    
    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        const friendIds = userData.friends || [];
        
        friendsList.innerHTML = '';
        
        for (const friendId of friendIds) {
            const friendDoc = await firebase.firestore().collection('users').doc(friendId).get();
            if (friendDoc.exists) {
                const friendData = friendDoc.data();
                const friendCard = createFriendCard(friendId, friendData, true);
                friendsList.appendChild(friendCard);
            }
        }
        
        if (friendsList.children.length === 0) {
            friendsList.innerHTML = '<p>No friends yet. Search for users to connect!</p>';
        }
        
        // Load suggested friends (mutual friends logic)
        const allUsersSnapshot = await firebase.firestore().collection('users').limit(10).get();
        suggestedList.innerHTML = '';
        
        allUsersSnapshot.forEach(doc => {
            if (doc.id !== currentUser.uid && !friendIds.includes(doc.id)) {
                const userData = doc.data();
                const friendCard = createFriendCard(doc.id, userData, false);
                suggestedList.appendChild(friendCard);
            }
        });
        
        if (suggestedList.children.length === 0) {
            suggestedList.innerHTML = '<p>No suggestions at the moment</p>';
        }
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function createFriendCard(userId, userData, isFriend) {
    const card = document.createElement('div');
    card.className = 'friend-card';
    
    card.innerHTML = `
        <img src="${userData.profilePicture || 'https://via.placeholder.com/80'}" class="friend-avatar" alt="${userData.displayName}">
        <div class="friend-name">${userData.displayName}</div>
        <div class="friend-info">
            ${userData.age ? userData.age + ' years old' : ''}<br>
            ${userData.city ? userData.city : ''}${userData.country ? ', ' + userData.country : ''}
        </div>
        ${isFriend ? 
            `<button onclick="removeFriend('${userId}')" class="btn-secondary">Remove Friend</button>
             <button onclick="showProfile('${userId}')" class="btn-primary">View Profile</button>` :
            `<button onclick="addFriend('${userId}')" class="btn-primary">Add Friend</button>`
        }
    `;
    
    return card;
}

async function addFriend(friendId) {
    try {
        await firebase.firestore().collection('users').doc(currentUser.uid).update({
            friends: firebase.firestore.FieldValue.arrayUnion(friendId)
        });
        
        await firebase.firestore().collection('users').doc(friendId).update({
            friends: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        });
        
        showToast('Friend added!', 'success');
        loadFriends();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function removeFriend(friendId) {
    if (!confirm('Remove this friend?')) return;
    
    try {
        await firebase.firestore().collection('users').doc(currentUser.uid).update({
            friends: firebase.firestore.FieldValue.arrayRemove(friendId)
        });
        
        await firebase.firestore().collection('users').doc(friendId).update({
            friends: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
        });
        
        showToast('Friend removed', 'success');
        loadFriends();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Messages Functions
function showMessages() {
    hideAllSections();
    document.getElementById('messagesSection').classList.add('active');
    loadConversations();
}

async function loadConversations() {
    const conversationsList = document.getElementById('conversationsList');
    conversationsList.innerHTML = '<p>Loading conversations...</p>';
    
    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const friendIds = userDoc.data().friends || [];
        
        conversationsList.innerHTML = '';
        
        for (const friendId of friendIds) {
            const friendDoc = await firebase.firestore().collection('users').doc(friendId).get();
            if (friendDoc.exists) {
                const friendData = friendDoc.data();
                const item = document.createElement('div');
                item.className = 'conversation-item';
                item.textContent = friendData.displayName;
                item.onclick = () => loadConversation(friendId, friendData.displayName);
                conversationsList.appendChild(item);
            }
        }
        
        if (conversationsList.children.length === 0) {
            conversationsList.innerHTML = '<p>No conversations yet. Add friends to start messaging!</p>';
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function loadConversation(friendId, friendName) {
    currentConversation = friendId;
    
    document.getElementById('messageHeader').innerHTML = `<h3>Chat with ${friendName}</h3>`;
    
    const messageThread = document.getElementById('messageThread');
    messageThread.innerHTML = '<p>Loading messages...</p>';
    
    try {
        const conversationId = [currentUser.uid, friendId].sort().join('_');
        
        // Listen for new messages in real-time
        if (unsubscribers.length > 0) {
            unsubscribers.forEach(unsub => unsub());
            unsubscribers = [];
        }
        
        const unsubscribe = firebase.firestore()
            .collection('messages')
            .doc(conversationId)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(snapshot => {
                messageThread.innerHTML = '';
                
                snapshot.forEach(doc => {
                    const message = doc.data();
                    const messageDiv = document.createElement('div');
                    messageDiv.className = message.senderId === currentUser.uid ? 'message sent' : 'message received';
                    messageDiv.textContent = message.content;
                    messageThread.appendChild(messageDiv);
                });
                
                messageThread.scrollTop = messageThread.scrollHeight;
            });
        
        unsubscribers.push(unsubscribe);
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function sendMessage() {
    if (!currentConversation) {
        showToast('Select a conversation first', 'error');
        return;
    }
    
    const content = document.getElementById('messageContent').value.trim();
    if (!content) return;
    
    try {
        const conversationId = [currentUser.uid, currentConversation].sort().join('_');
        
        await firebase.firestore()
            .collection('messages')
            .doc(conversationId)
            .collection('messages')
            .add({
                senderId: currentUser.uid,
                receiverId: currentConversation,
                content: content,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        document.getElementById('messageContent').value = '';
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Search Functions
function showSearch() {
    hideAllSections();
    document.getElementById('searchSection').classList.add('active');
}

async function searchUsers() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return;
    
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '<p>Searching...</p>';
    
    try {
        const usersSnapshot = await firebase.firestore().collection('users').get();
        resultsContainer.innerHTML = '';
        
        let found = false;
        
        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const userId = doc.id;
            
            if (userId === currentUser.uid) continue;
            
            const displayName = (userData.displayName || '').toLowerCase();
            const email = (userData.email || '').toLowerCase();
            
            if (displayName.includes(query) || email.includes(query)) {
                found = true;
                const resultDiv = await createUserResult(userId, userData);
                resultsContainer.appendChild(resultDiv);
            }
        }
        
        if (!found) {
            resultsContainer.innerHTML = '<p>No users found</p>';
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function publicSearch() {
    const query = document.getElementById('publicSearchInput').value.trim().toLowerCase();
    if (!query) return;
    
    const resultsContainer = document.getElementById('publicSearchResults');
    resultsContainer.innerHTML = '<p>Searching...</p>';
    
    try {
        const usersSnapshot = await firebase.firestore().collection('users').get();
        resultsContainer.innerHTML = '';
        
        let found = false;
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const displayName = (userData.displayName || '').toLowerCase();
            
            if (displayName.includes(query)) {
                found = true;
                const resultDiv = document.createElement('div');
                resultDiv.className = 'user-result';
                resultDiv.innerHTML = `
                    <img src="${userData.profilePicture || 'https://via.placeholder.com/60'}" class="user-result-avatar">
                    <div class="user-result-info">
                        <div class="user-result-name">${userData.displayName}</div>
                        <div class="user-result-details">
                            ${userData.city ? userData.city : ''}${userData.country ? ', ' + userData.country : ''}
                        </div>
                    </div>
                    <p>Sign in to add as friend</p>
                `;
                resultsContainer.appendChild(resultDiv);
            }
        });
        
        if (!found) {
            resultsContainer.innerHTML = '<p>No users found</p>';
        }
    } catch (error) {
        resultsContainer.innerHTML = '<p>Error searching</p>';
    }
}

async function createUserResult(userId, userData) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'user-result';
    
    const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
    const myFriends = userDoc.data().friends || [];
    const isFriend = myFriends.includes(userId);
    
    resultDiv.innerHTML = `
        <img src="${userData.profilePicture || 'https://via.placeholder.com/60'}" class="user-result-avatar">
        <div class="user-result-info">
            <div class="user-result-name">${userData.displayName}</div>
            <div class="user-result-details">
                ${userData.age ? userData.age + ' years old' : ''}
                ${userData.city ? '• ' + userData.city : ''}
                ${userData.country ? ', ' + userData.country : ''}
            </div>
        </div>
        <div>
            <button onclick="showProfile('${userId}')" class="btn-secondary">View Profile</button>
            ${isFriend ? 
                `<button onclick="removeFriend('${userId}')" class="btn-secondary">Remove Friend</button>` :
                `<button onclick="addFriend('${userId}')" class="btn-primary">Add Friend</button>`
            }
        </div>
    `;
    
    return resultDiv;
}

// Settings Functions
function showSettings() {
    hideAllSections();
    document.getElementById('settingsSection').classList.add('active');
    loadSettings();
}

async function loadSettings() {
    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        document.getElementById('themeSelect').value = userData.theme || 'light';
        document.getElementById('referralPoints').textContent = userData.referralPoints || 0;
        
        const invitesUsed = userData.invitesThisMonth || 0;
        document.getElementById('invitesRemaining').textContent = Math.max(0, 5 - invitesUsed);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    
    try {
        await firebase.firestore().collection('users').doc(currentUser.uid).update({ theme: theme });
    } catch (error) {
        console.error(error);
    }
}

async function generateReferralCode() {
    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        if (userData.referralOptOut) {
            showToast('You have opted out of the referral program', 'error');
            return;
        }
        
        const invitesUsed = userData.invitesThisMonth || 0;
        if (invitesUsed >= 5) {
            showToast('You have reached your monthly invite limit', 'error');
            return;
        }
        
        const code = `REF-${currentUser.uid.substring(0, 8)}-${Date.now()}`;
        
        await firebase.firestore().collection('referralCodes').doc(code).set({
            referrerId: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            used: false
        });
        
        await firebase.firestore().collection('users').doc(currentUser.uid).update({
            invitesThisMonth: invitesUsed + 1
        });
        
        document.getElementById('referralCode').innerHTML = `
            <p style="margin-top: 15px; padding: 10px; background: var(--surface); border-radius: 8px;">
                Your invite code: <strong>${code}</strong><br>
                <small>Share this code with friends to earn points!</small>
            </p>
        `;
        
        loadSettings();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function optOutReferrals() {
    if (!confirm('Are you sure you want to opt out of the referral program? This will delete your points.')) return;
    
    try {
        await firebase.firestore().collection('users').doc(currentUser.uid).update({
            referralOptOut: true,
            referralPoints: 0
        });
        
        showToast('You have opted out of the referral program', 'success');
        loadSettings();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function downloadData() {
    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        const postsSnapshot = await firebase.firestore()
            .collection('posts')
            .where('authorId', '==', currentUser.uid)
            .get();
        
        const posts = postsSnapshot.docs.map(doc => doc.data());
        
        const data = {
            profile: userData,
            posts: posts,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-data-${Date.now()}.json`;
        a.click();
        
        showToast('Data downloaded!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteAccount() {
    const confirmation = prompt('Type DELETE to confirm account deletion:');
    if (confirmation !== 'DELETE') return;
    
    try {
        // Delete user data
        await firebase.firestore().collection('users').doc(currentUser.uid).delete();
        
        // Delete user posts
        const postsSnapshot = await firebase.firestore()
            .collection('posts')
            .where('authorId', '==', currentUser.uid)
            .get();
        
        const batch = firebase.firestore().batch();
        postsSnapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        
        // Delete auth account
        await currentUser.delete();
        
        showToast('Account deleted', 'success');
        showWelcome();
    } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
            showToast('Please log in again before deleting your account', 'error');
            logout();
        } else {
            showToast(error.message, 'error');
        }
    }
}

// Billing Functions
function showBilling() {
    hideAllSections();
    document.getElementById('billingSection').classList.add('active');
    loadBilling();
}

async function loadBilling() {
    try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        const billingData = userDoc.data().billing || {};
        
        document.getElementById('billingName').value = billingData.name || '';
        document.getElementById('billingAddress').value = billingData.address || '';
        document.getElementById('billingCity').value = billingData.city || '';
        document.getElementById('billingCountry').value = billingData.country || '';
    } catch (error) {
        console.error(error);
    }
}

async function updateBilling(event) {
    event.preventDefault();
    
    try {
        const billingData = {
            name: document.getElementById('billingName').value,
            address: document.getElementById('billingAddress').value,
            city: document.getElementById('billingCity').value,
            country: document.getElementById('billingCountry').value
        };
        
        await firebase.firestore().collection('users').doc(currentUser.uid).update({
            billing: billingData
        });
        
        showToast('Billing information updated!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Admin Functions
function showAdminPanel() {
    hideAllSections();
    document.getElementById('adminSection').classList.add('active');
    showAdminUsers();
}

async function showAdminUsers() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = '<p>Loading users...</p>';
    
    try {
        const usersSnapshot = await firebase.firestore().collection('users').get();
        
        const usersList = document.createElement('div');
        usersList.className = 'admin-user-list';
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const userId = doc.id;
            
            const userItem = document.createElement('div');
            userItem.className = 'admin-item';
            userItem.innerHTML = `
                <div>
                    <strong>${userData.displayName}</strong><br>
                    <small>${userData.email}</small>
                    ${userData.isAdmin ? ' <span style="color: var(--primary-color);">[ADMIN]</span>' : ''}
                </div>
                <div>
                    <button onclick="adminDeleteUser('${userId}')" class="btn-danger">Delete User</button>
                </div>
            `;
            usersList.appendChild(userItem);
        });
        
        adminContent.innerHTML = '<h3>All Users</h3>';
        adminContent.appendChild(usersList);
    } catch (error) {
        adminContent.innerHTML = '<p>Error loading users</p>';
    }
}

async function showAdminPosts() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = '<p>Loading posts...</p>';
    
    try {
        const postsSnapshot = await firebase.firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        const postsList = document.createElement('div');
        postsList.className = 'admin-post-list';
        
        for (const doc of postsSnapshot.docs) {
            const post = doc.data();
            const postId = doc.id;
            
            const postItem = document.createElement('div');
            postItem.className = 'admin-item';
            postItem.innerHTML = `
                <div>
                    <strong>${post.authorName}</strong><br>
                    <small>${post.content ? post.content.substring(0, 100) : '[Image post]'}</small>
                </div>
                <div>
                    <button onclick="adminDeletePost('${postId}')" class="btn-danger">Delete Post</button>
                </div>
            `;
            postsList.appendChild(postItem);
        }
        
        adminContent.innerHTML = '<h3>All Posts</h3>';
        adminContent.appendChild(postsList);
    } catch (error) {
        adminContent.innerHTML = '<p>Error loading posts</p>';
    }
}

async function adminDeleteUser(userId) {
    if (!confirm('Delete this user and all their data?')) return;
    
    try {
        await firebase.firestore().collection('users').doc(userId).delete();
        showToast('User deleted', 'success');
        showAdminUsers();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function adminDeletePost(postId) {
    if (!confirm('Delete this post?')) return;
    
    try {
        await deletePost(postId);
        showAdminPosts();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Owner Functions
function showOwnerPanel() {
    hideAllSections();
    document.getElementById('ownerSection').classList.add('active');
    loadOwnerStats();
}

async function loadOwnerStats() {
    try {
        const usersSnapshot = await firebase.firestore().collection('users').get();
        const postsSnapshot = await firebase.firestore().collection('posts').get();
        
        let totalPhotos = 0;
        usersSnapshot.forEach(doc => {
            const gallery = doc.data().gallery || [];
            totalPhotos += gallery.length;
        });
        
        document.getElementById('statTotalUsers').textContent = usersSnapshot.size;
        document.getElementById('statActiveToday').textContent = '—'; // Would need activity tracking
        document.getElementById('statTotalPosts').textContent = postsSnapshot.size;
        document.getElementById('statTotalPhotos').textContent = totalPhotos;
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function exportAllData() {
    try {
        const usersSnapshot = await firebase.firestore().collection('users').get();
        const postsSnapshot = await firebase.firestore().collection('posts').get();
        
        const data = {
            users: usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            posts: postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `site-data-${Date.now()}.json`;
        a.click();
        
        showToast('All data exported!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatDate(timestamp) {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Character counter for post creation
document.addEventListener('DOMContentLoaded', () => {
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.addEventListener('input', () => {
            const count = postContent.value.length;
            document.getElementById('charCount').textContent = count;
        });
    }
});
