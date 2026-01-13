import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc, where, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../AuthContext';
import Navigation from '../components/Navigation';
import { formatDistanceToNow } from 'date-fns';

function Home() {
  const { currentUser, userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [visibility, setVisibility] = useState('all');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState({});
  const [friendIds, setFriendIds] = useState([]);

  useEffect(() => {
    loadFriends();
    loadPosts();
  }, []);

  const loadFriends = async () => {
    try {
      const friendsDoc = await getDoc(doc(db, 'friends', currentUser.uid));
      if (friendsDoc.exists()) {
        setFriendIds(friendsDoc.data().friendIds || []);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = await Promise.all(querySnapshot.docs.map(async (postDoc) => {
        const data = postDoc.data();
        const userDoc = await getDoc(doc(db, 'users', data.userId));
        const userData = userDoc.data();
        const commentsRef = collection(db, 'comments');
        const commentsQuery = query(commentsRef, where('postId', '==', postDoc.id));
        const commentsSnapshot = await getDocs(commentsQuery);
        const comments = await Promise.all(commentsSnapshot.docs.map(async (commentDoc) => {
          const commentData = commentDoc.data();
          const commentUserDoc = await getDoc(doc(db, 'users', commentData.userId));
          return { id: commentDoc.id, ...commentData, user: commentUserDoc.data() };
        }));
        return {
          id: postDoc.id,
          ...data,
          user: userData,
          comments: comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        };
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setLoading(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || newPost.length > 280) return;
    setPosting(true);
    try {
      let imageUrl = null;
      if (postImage) {
        const imageRef = ref(storage, `post-images/${currentUser.uid}/${Date.now()}_${postImage.name}`);
        await uploadBytes(imageRef, postImage);
        imageUrl = await getDownloadURL(imageRef);
      }
      await addDoc(collection(db, 'posts'), {
        userId: currentUser.uid,
        content: newPost,
        imageUrl,
        visibility,
        likes: [],
        createdAt: new Date().toISOString()
      });
      setNewPost('');
      setPostImage(null);
      setVisibility('all');
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setPosting(false);
  };

  const handleLike = async (postId, likes) => {
    try {
      const postRef = doc(db, 'posts', postId);
      if (likes.includes(currentUser.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
      }
      await loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    const commentText = commentTexts[postId];
    if (!commentText?.trim()) return;
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        userId: currentUser.uid,
        content: commentText,
        createdAt: new Date().toISOString()
      });
      setCommentTexts({...commentTexts, [postId]: ''});
      await loadPosts();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const canViewPost = (post) => {
    if (post.visibility === 'all') return true;
    if (post.userId === currentUser.uid) return true;
    if (userProfile?.role === 'admin' || userProfile?.role === 'owner') return true;
    return friendIds.includes(post.userId);
  };

  const filteredPosts = posts.filter(canViewPost);

  return (
    <>
      <Navigation />
      <div className="page-wrapper" style={{padding:'2rem 0'}}>
        <div className="container" style={{maxWidth:'700px'}}>
          <div className="card fade-in" style={{marginBottom:'2rem'}}>
            <h2 style={{marginBottom:'1.5rem'}}>Create Post</h2>
            <form onSubmit={handleCreatePost}>
              <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="What's on your mind?" maxLength={280} style={{minHeight:'100px',marginBottom:'1rem'}} required />
              <div style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>{newPost.length}/280 characters</div>
              <div style={{display:'flex',gap:'1rem',alignItems:'center',flexWrap:'wrap',marginBottom:'1rem'}}>
                <input type="file" accept="image/*" onChange={(e) => setPostImage(e.target.files[0])} style={{flex:1,minWidth:'200px'}} />
                <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{width:'auto'}}>
                  <option value="all">Visible to all</option>
                  <option value="friends">Visible to friends only</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={posting || !newPost.trim()}>{posting ? 'Posting...' : 'Post'}</button>
            </form>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : filteredPosts.length === 0 ? (
            <div className="card" style={{textAlign:'center',padding:'3rem'}}>
              <p style={{color:'var(--text-muted)'}}>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="card fade-in" style={{marginBottom:'1.5rem'}}>
                <div style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
                  <img src={post.user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.displayName || 'User')}&background=d4763c&color=fff`} alt={post.user?.displayName} style={{width:'50px',height:'50px',borderRadius:'50%',objectFit:'cover'}} />
                  <div style={{flex:1}}>
                    <h4 style={{margin:0}}>{post.user?.displayName || 'Anonymous'}</h4>
                    <p style={{fontSize:'0.85rem',color:'var(--text-muted)',margin:0}}>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                  </div>
                  {post.visibility === 'friends' && <span style={{fontSize:'0.75rem',padding:'0.25rem 0.5rem',background:'var(--bg-secondary)',borderRadius:'var(--radius-sm)',color:'var(--text-muted)'}}>Friends only</span>}
                </div>
                <p style={{marginBottom:'1rem',whiteSpace:'pre-wrap'}}>{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post" style={{width:'100%',borderRadius:'var(--radius-md)',marginBottom:'1rem'}} />}
                <div style={{display:'flex',gap:'1rem',paddingTop:'1rem',borderTop:'1px solid var(--border-color)'}}>
                  <button onClick={() => handleLike(post.id, post.likes)} className="btn btn-secondary" style={{padding:'0.5rem 1rem'}}>
                    {post.likes.includes(currentUser.uid) ? '❤️' : '🤍'} {post.likes.length}
                  </button>
                  <button onClick={() => setShowComments({...showComments, [post.id]: !showComments[post.id]})} className="btn btn-secondary" style={{padding:'0.5rem 1rem'}}>
                    💬 {post.comments.length}
                  </button>
                </div>
                {showComments[post.id] && (
                  <div style={{marginTop:'1rem',paddingTop:'1rem',borderTop:'1px solid var(--border-color)'}}>
                    {post.comments.map(comment => (
                      <div key={comment.id} style={{display:'flex',gap:'0.75rem',marginBottom:'1rem'}}>
                        <img src={comment.user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.displayName || 'User')}&background=d4763c&color=fff`} alt={comment.user?.displayName} style={{width:'35px',height:'35px',borderRadius:'50%',objectFit:'cover'}} />
                        <div style={{flex:1,padding:'0.75rem',background:'var(--bg-secondary)',borderRadius:'var(--radius-md)'}}>
                          <h5 style={{fontSize:'0.9rem',margin:'0 0 0.25rem'}}>{comment.user?.displayName || 'Anonymous'}</h5>
                          <p style={{fontSize:'0.9rem',margin:0}}>{comment.content}</p>
                          <p style={{fontSize:'0.75rem',color:'var(--text-muted)',margin:'0.25rem 0 0'}}>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
                      <input type="text" placeholder="Write a comment..." value={commentTexts[post.id] || ''} onChange={(e) => setCommentTexts({...commentTexts, [post.id]: e.target.value})} onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)} style={{flex:1}} />
                      <button onClick={() => handleComment(post.id)} className="btn btn-primary" disabled={!commentTexts[post.id]?.trim()}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
