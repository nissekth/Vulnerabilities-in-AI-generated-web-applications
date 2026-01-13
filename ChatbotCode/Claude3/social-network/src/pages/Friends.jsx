import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import Navigation from '../components/Navigation';

function Friends() {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const friendsDoc = await getDoc(doc(db, 'friends', currentUser.uid));
      if (!friendsDoc.exists()) return;
      
      const data = friendsDoc.data();
      const friendIds = data.friendIds || [];
      const pendingIds = data.pendingRequests || [];

      const friendsData = await Promise.all(friendIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        return { id, ...userDoc.data() };
      }));
      setFriends(friendsData);

      const pendingData = await Promise.all(pendingIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        return { id, ...userDoc.data() };
      }));
      setPendingRequests(pendingData);

      loadSuggestions(friendIds);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
    setLoading(false);
  };

  const loadSuggestions = async (currentFriendIds) => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const mutualFriendsMap = {};
      
      for (const friendId of currentFriendIds) {
        const friendDoc = await getDoc(doc(db, 'friends', friendId));
        if (friendDoc.exists()) {
          const theirFriends = friendDoc.data().friendIds || [];
          theirFriends.forEach(id => {
            if (id !== currentUser.uid && !currentFriendIds.includes(id)) {
              mutualFriendsMap[id] = (mutualFriendsMap[id] || 0) + 1;
            }
          });
        }
      }

      const suggestionIds = Object.entries(mutualFriendsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      const suggestionsData = await Promise.all(suggestionIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        return { id, ...userDoc.data(), mutualCount: mutualFriendsMap[id] };
      }));
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const myFriendsRef = doc(db, 'friends', currentUser.uid);
      const theirFriendsRef = doc(db, 'friends', userId);
      await updateDoc(myFriendsRef, { 
        pendingRequests: arrayRemove(userId),
        friendIds: arrayUnion(userId)
      });
      await updateDoc(theirFriendsRef, { 
        sentRequests: arrayRemove(currentUser.uid),
        friendIds: arrayUnion(currentUser.uid)
      });
      await loadFriends();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleDeclineRequest = async (userId) => {
    try {
      const myFriendsRef = doc(db, 'friends', currentUser.uid);
      const theirFriendsRef = doc(db, 'friends', userId);
      await updateDoc(myFriendsRef, { pendingRequests: arrayRemove(userId) });
      await updateDoc(theirFriendsRef, { sentRequests: arrayRemove(currentUser.uid) });
      await loadFriends();
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const handleRemoveFriend = async (userId) => {
    if (!confirm('Remove this friend?')) return;
    try {
      const myFriendsRef = doc(db, 'friends', currentUser.uid);
      const theirFriendsRef = doc(db, 'friends', userId);
      await updateDoc(myFriendsRef, { friendIds: arrayRemove(userId) });
      await updateDoc(theirFriendsRef, { friendIds: arrayRemove(currentUser.uid) });
      await loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      const myFriendsRef = doc(db, 'friends', currentUser.uid);
      const theirFriendsRef = doc(db, 'friends', userId);
      await updateDoc(myFriendsRef, { sentRequests: arrayUnion(userId) });
      await updateDoc(theirFriendsRef, { pendingRequests: arrayUnion(currentUser.uid) });
      setSuggestions(suggestions.filter(s => s.id !== userId));
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  if (loading) return <div><Navigation /><div className="spinner"></div></div>;

  return (
    <>
      <Navigation />
      <div className="page-wrapper">
        <div className="container" style={{maxWidth:'900px'}}>
          <h1 className="fade-in">Friends</h1>

          {pendingRequests.length > 0 && (
            <div className="card fade-in" style={{marginBottom:'2rem'}}>
              <h2>Friend Requests ({pendingRequests.length})</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',gap:'1.5rem',marginTop:'1.5rem'}}>
                {pendingRequests.map(user => (
                  <div key={user.id} style={{padding:'1rem',border:'1px solid var(--border-color)',borderRadius:'var(--radius-md)'}}>
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=d4763c&color=fff`} 
                         alt={user.displayName} 
                         style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',marginBottom:'1rem'}} />
                    <h4 style={{margin:'0 0 0.5rem'}}>{user.displayName}</h4>
                    <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>
                      {user.city && user.country ? `${user.city}, ${user.country}` : 'Location not set'}
                    </p>
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      <button onClick={() => handleAcceptRequest(user.id)} className="btn btn-primary" style={{flex:1,fontSize:'0.85rem'}}>Accept</button>
                      <button onClick={() => handleDeclineRequest(user.id)} className="btn btn-secondary" style={{flex:1,fontSize:'0.85rem'}}>Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="card fade-in" style={{marginBottom:'2rem'}}>
              <h2>People You May Know</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',gap:'1.5rem',marginTop:'1.5rem'}}>
                {suggestions.map(user => (
                  <div key={user.id} style={{padding:'1rem',border:'1px solid var(--border-color)',borderRadius:'var(--radius-md)'}}>
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=d4763c&color=fff`} 
                         alt={user.displayName} 
                         style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',marginBottom:'1rem'}} />
                    <h4 style={{margin:'0 0 0.5rem'}}>{user.displayName}</h4>
                    <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>
                      {user.mutualCount} mutual friend{user.mutualCount !== 1 ? 's' : ''}
                    </p>
                    <button onClick={() => handleSendRequest(user.id)} className="btn btn-primary" style={{width:'100%',fontSize:'0.85rem'}}>Add Friend</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card fade-in">
            <h2>My Friends ({friends.length})</h2>
            {friends.length === 0 ? (
              <p style={{color:'var(--text-muted)',marginTop:'1rem'}}>No friends yet. Add some friends to get started!</p>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',gap:'1.5rem',marginTop:'1.5rem'}}>
                {friends.map(user => (
                  <div key={user.id} style={{padding:'1rem',border:'1px solid var(--border-color)',borderRadius:'var(--radius-md)'}}>
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=d4763c&color=fff`} 
                         alt={user.displayName} 
                         style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',marginBottom:'1rem'}} />
                    <h4 style={{margin:'0 0 0.5rem'}}>{user.displayName}</h4>
                    <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>
                      {user.age && `${user.age} years old`} {user.city && user.country && `• ${user.city}, ${user.country}`}
                    </p>
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      <button onClick={() => navigate(`/profile/${user.id}`)} className="btn btn-secondary" style={{flex:1,fontSize:'0.85rem'}}>View Profile</button>
                      <button onClick={() => handleRemoveFriend(user.id)} className="btn btn-danger" style={{flex:1,fontSize:'0.85rem'}}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Friends;
