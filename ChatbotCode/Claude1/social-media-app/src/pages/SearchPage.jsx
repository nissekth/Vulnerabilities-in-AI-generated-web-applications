import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { collection, query, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => !currentUser || user.id !== currentUser.uid);
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      toast.error('Failed to load users');
    }
    setLoading(false);
  };

  const handleAddFriend = async (userId) => {
    if (!currentUser) {
      toast.error('Please log in to add friends');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const friendRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        friends: arrayUnion(userId)
      });
      await updateDoc(friendRef, {
        friends: arrayUnion(currentUser.uid)
      });
      
      toast.success('Friend added!');
      await fetchUsers();
    } catch (error) {
      toast.error('Failed to add friend');
    }
  };

  const isFriend = (userId) => {
    return userProfile?.friends?.includes(userId);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      {currentUser && <Navbar />}
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!currentUser && (
          <div className="mb-8">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <span className="font-display text-3xl text-gradient">ConnectHub</span>
            </Link>
          </div>
        )}

        <div className="card mb-8">
          <h1 className="text-3xl font-display text-gray-800 mb-4">Search Users</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or city..."
              className="input-field pl-12 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-2 card text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="card hover:shadow-2xl transition-all">
                <div className="flex items-start space-x-4">
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.displayName || user.name}&background=e63950&color=fff`}
                    alt={user.displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <Link to={`/profile/${user.id}`} className="text-xl font-semibold text-gray-800 hover:text-primary-600">
                      {user.displayName || user.name || 'Anonymous'}
                    </Link>
                    {user.age && <p className="text-gray-600">{user.age} years old</p>}
                    {user.city && <p className="text-gray-600">{user.city}{user.country && `, ${user.country}`}</p>}
                    {user.bio && <p className="text-gray-500 mt-2 text-sm">{user.bio}</p>}
                  </div>
                </div>
                
                {currentUser && !isFriend(user.id) && (
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className="btn-primary w-full mt-4 flex items-center justify-center space-x-2"
                  >
                    <UserPlus size={18} />
                    <span>Add Friend</span>
                  </button>
                )}
                {currentUser && isFriend(user.id) && (
                  <div className="flex items-center justify-center space-x-2 mt-4 text-green-600">
                    <UserCheck size={18} />
                    <span>Friends</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
