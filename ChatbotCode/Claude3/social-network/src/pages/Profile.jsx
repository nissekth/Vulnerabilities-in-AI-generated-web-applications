import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../AuthContext';
import Navigation from '../components/Navigation';
import { formatDistanceToNow } from 'date-fns';

function Profile() {
  const { userId } = useParams();
  const { currentUser, userProfile: currentUserProfile, refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [editing, setEditing] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const isOwnProfile = currentUser.uid === userId;

  useEffect(() => {
    loadProfile();
    loadPosts();
    loadGallery();
    if (!isOwnProfile) checkFriendStatus();
  }, [userId]);

  const loadProfile = async () => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setProfile(data);
      setEditData(data);
    }
  };

  const loadPosts = async () => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(postsData);
  };

  const loadGallery = async () => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const images = [];
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.imageUrl) images.push({ url: data.imageUrl, createdAt: data.createdAt });
    });
    setGallery(images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const checkFriendStatus = async () => {
    const friendsDoc = await getDoc(doc(db, 'friends', currentUser.uid));
    if (friendsDoc.exists()) {
      const data = friendsDoc.data();
      if (data.friendIds?.includes(userId)) setFriendStatus('friends');
      else if (data.sentRequests?.includes(userId)) setFriendStatus('pending');
      else if (data.pendingRequests?.includes(userId)) setFriendStatus('requested');
      else setFriendStatus('none');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        displayName: editData.displayName,
        age: editData.age ? parseInt(editData.age) : null,
        city: editData.city || '',
        country: editData.country || '',
        aboutMe: editData.aboutMe || '',
        bannerTheme: editData.bannerTheme || 'default'
      });
      await loadProfile();
      await refreshUserProfile();
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageRef = ref(storage, `profile-pictures/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(db, 'users', currentUser.uid), { photoURL: imageUrl });
      await loadProfile();
      await refreshUserProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
    setUploading(false);
  };

  const handleFriendAction = async () => {
    const myFriendsRef = doc(db, 'friends', currentUser.uid);
    const theirFriendsRef = doc(db, 'friends', userId);
    
    try {
      if (friendStatus === 'none') {
        await updateDoc(myFriendsRef, { sentRequests: arrayUnion(userId) });
        await updateDoc(theirFriendsRef, { pendingRequests: arrayUnion(currentUser.uid) });
        setFriendStatus('pending');
      } else if (friendStatus === 'requested') {
        await updateDoc(myFriendsRef, { 
          pendingRequests: arrayRemove(userId),
          friendIds: arrayUnion(userId)
        });
        await updateDoc(theirFriendsRef, { 
          sentRequests: arrayRemove(currentUser.uid),
          friendIds: arrayUnion(currentUser.uid)
        });
        setFriendStatus('friends');
      } else if (friendStatus === 'friends') {
        await updateDoc(myFriendsRef, { friendIds: arrayRemove(userId) });
        await updateDoc(theirFriendsRef, { friendIds: arrayRemove(currentUser.uid) });
        setFriendStatus('none');
      }
    } catch (error) {
      console.error('Error with friend action:', error);
    }
  };

  if (!profile) return <div><Navigation /><div className="spinner"></div></div>;

  const bannerStyles = {
    default: 'linear-gradient(135deg, #d4763c 0%, #8b6f47 100%)',
    ocean: 'linear-gradient(135deg, #0e7490 0%, #22d3ee 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    forest: 'linear-gradient(135deg, #5a7c4f 0%, #8ab874 100%)',
    purple: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)'
  };

  return (
    <>
      <Navigation />
      <div className="page-wrapper">
        <div style={{background:bannerStyles[profile.bannerTheme] || bannerStyles.default,height:'200px',position:'relative'}}>
          <div className="container" style={{height:'100%',display:'flex',alignItems:'flex-end',paddingBottom:'1rem'}}>
            <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || 'User')}&background=d4763c&color=fff`} 
                 alt={profile.displayName} 
                 style={{width:'150px',height:'150px',borderRadius:'50%',border:'5px solid white',objectFit:'cover',marginBottom:'-50px'}} />
          </div>
        </div>
        
        <div className="container" style={{marginTop:'70px'}}>
          <div className="card fade-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem',marginBottom:'2rem'}}>
              <div>
                <h1 style={{margin:'0 0 0.5rem'}}>{profile.displayName}</h1>
                <p style={{color:'var(--text-muted)',margin:'0 0 0.5rem'}}>
                  {profile.age && `${profile.age} years old`} {profile.city && profile.country && `• ${profile.city}, ${profile.country}`}
                </p>
                {profile.aboutMe && <p style={{marginTop:'1rem'}}>{profile.aboutMe}</p>}
              </div>
              <div style={{display:'flex',gap:'0.5rem'}}>
                {isOwnProfile ? (
                  <>
                    {editing ? (
                      <>
                        <button onClick={handleSaveProfile} className="btn btn-primary">Save</button>
                        <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setEditing(true)} className="btn btn-primary">Edit Profile</button>
                    )}
                    <label htmlFor="photo-upload" className="btn btn-secondary" style={{cursor:'pointer'}}>
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </label>
                    <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{display:'none'}} disabled={uploading} />
                  </>
                ) : (
                  <button onClick={handleFriendAction} className="btn btn-primary">
                    {friendStatus === 'friends' ? 'Unfriend' : friendStatus === 'pending' ? 'Request Sent' : friendStatus === 'requested' ? 'Accept Request' : 'Add Friend'}
                  </button>
                )}
              </div>
            </div>

            {editing && (
              <div style={{background:'var(--bg-secondary)',padding:'1.5rem',borderRadius:'var(--radius-md)',marginBottom:'2rem'}}>
                <h3>Edit Profile</h3>
                <div style={{display:'grid',gap:'1rem',marginTop:'1rem'}}>
                  <div>
                    <label>Display Name</label>
                    <input value={editData.displayName || ''} onChange={(e) => setEditData({...editData, displayName: e.target.value})} />
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
                    <div>
                      <label>Age</label>
                      <input type="number" value={editData.age || ''} onChange={(e) => setEditData({...editData, age: e.target.value})} />
                    </div>
                    <div>
                      <label>City</label>
                      <input value={editData.city || ''} onChange={(e) => setEditData({...editData, city: e.target.value})} />
                    </div>
                    <div>
                      <label>Country</label>
                      <input value={editData.country || ''} onChange={(e) => setEditData({...editData, country: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label>About Me</label>
                    <textarea value={editData.aboutMe || ''} onChange={(e) => setEditData({...editData, aboutMe: e.target.value})} />
                  </div>
                  <div>
                    <label>Banner Theme</label>
                    <select value={editData.bannerTheme || 'default'} onChange={(e) => setEditData({...editData, bannerTheme: e.target.value})}>
                      <option value="default">Default</option>
                      <option value="ocean">Ocean</option>
                      <option value="sunset">Sunset</option>
                      <option value="forest">Forest</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'2rem',marginTop:'2rem'}}>
              <div>
                <h3>Posts ({posts.length})</h3>
                {posts.length === 0 ? (
                  <p style={{color:'var(--text-muted)'}}>No posts yet</p>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:'1rem',marginTop:'1rem'}}>
                    {posts.slice(0, 5).map(post => (
                      <div key={post.id} style={{padding:'1rem',background:'var(--bg-secondary)',borderRadius:'var(--radius-md)'}}>
                        <p style={{margin:'0 0 0.5rem'}}>{post.content}</p>
                        <p style={{fontSize:'0.85rem',color:'var(--text-muted)',margin:0}}>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3>Photo Gallery ({gallery.length})</h3>
                {gallery.length === 0 ? (
                  <p style={{color:'var(--text-muted)'}}>No photos yet</p>
                ) : (
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'0.5rem',marginTop:'1rem'}}>
                    {gallery.map((img, i) => (
                      <img key={i} src={img.url} alt="Gallery" style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:'var(--radius-sm)'}} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
