import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import { Users, UserMinus } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FriendsPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { currentTheme } = useTheme();
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
    fetchSuggestions();
  }, [userProfile]);

  const fetchFriends = async () => {
    if (!userProfile?.friends || userProfile.friends.length === 0) {
      setFriends([]);
      setLoading(false);
      return;
    }

    try {
      const friendsData = await Promise.all(
        userProfile.friends.map(async (friendId) => {
          const docSnap = await getDoc(doc(db, 'users', friendId));
          return docSnap.exists() ? { id: friendId, ...docSnap.data() } : null;
        })
      );
      setFriends(friendsData.filter(f => f !== null));
    } catch (error) {
      toast.error('Failed to load friends');
    }
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    try {
      const allUsers = await getDocs(collection(db, 'users'));
      const usersData = allUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const suggested = usersData.filter(user => {
        if (user.id === currentUser.uid) return false;
        if (userProfile?.friends?.includes(user.id)) return false;
        
        // Suggest based on mutual friends, city, or age
        const mutualFriends = user.friends?.filter(f => userProfile?.friends?.includes(f)).length || 0;
        const sameCity = user.city && user.city === userProfile?.city;
        const similarAge = user.age && userProfile?.age && Math.abs(user.age - userProfile.age) <= 5;
        
        return mutualFriends > 0 || sameCity || similarAge;
      }).slice(0, 6);
      
      setSuggestions(suggested);
    } catch (error) {
      console.error('Failed to load suggestions');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!confirm('Remove this friend?')) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const friendRef = doc(db, 'users', friendId);
      
      await updateDoc(userRef, {
        friends: arrayRemove(friendId)
      });
      await updateDoc(friendRef, {
        friends: arrayRemove(currentUser.uid)
      });
      
      setFriends(friends.filter(f => f.id !== friendId));
      toast.success('Friend removed');
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-gray-800 mb-8 flex items-center space-x-3">
          <Users size={40} />
          <span>Friends</span>
        </h1>

        {/* Friends List */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Friends ({friends.length})</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : friends.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No friends yet. Search for users to connect!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <img
                    src={friend.profilePicture || `https://ui-avatars.com/api/?name=${friend.displayName || friend.name}&background=e63950&color=fff`}
                    alt={friend.displayName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${friend.id}`} className="font-semibold text-gray-800 hover:text-primary-600 truncate block">
                      {friend.displayName || friend.name}
                    </Link>
                    {friend.city && <p className="text-sm text-gray-600 truncate">{friend.city}</p>}
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Remove Friend"
                  >
                    <UserMinus size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* People You May Know */}
        {suggestions.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">People You May Know</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map(user => (
                <div key={user.id} className="p-4 bg-gray-50 rounded-xl text-center">
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.displayName || user.name}&background=e63950&color=fff`}
                    alt={user.displayName}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                  />
                  <Link to={`/profile/${user.id}`} className="font-semibold text-gray-800 hover:text-primary-600 block mb-1">
                    {user.displayName || user.name}
                  </Link>
                  {user.city && <p className="text-sm text-gray-600 mb-3">{user.city}</p>}
                  <Link to={`/profile/${user.id}`} className="btn-secondary text-sm">
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;