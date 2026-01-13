import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import { Shield, Users, Trash2 } from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { currentTheme } = useTheme();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);

      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user? This will also delete all their posts.')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      const userPosts = posts.filter(p => p.userId === userId);
      await Promise.all(userPosts.map(p => deleteDoc(doc(db, 'posts', p.id))));
      
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(p => p.id !== postId));
      toast.success('Post deleted');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isAdmin: !isAdmin });
      setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: !isAdmin } : u));
      toast.success(`Admin status ${!isAdmin ? 'granted' : 'revoked'}`);
    } catch (error) {
      toast.error('Failed to update admin status');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg}`}>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield size={40} className="text-primary-600" />
          <h1 className="text-4xl font-display text-gray-800">Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'users' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'posts' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Posts ({posts.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.displayName || user.name}&background=e63950&color=fff`}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold">{user.displayName || user.name}</p>
                            <p className="text-sm text-gray-500">{user.city || 'Location not set'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                          className="text-primary-600 hover:text-primary-700 mr-3 text-sm"
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={post.userProfilePic || `https://ui-avatars.com/api/?name=${post.userName}&background=e63950&color=fff`}
                        alt={post.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{post.userName}</p>
                        <p className="text-sm text-gray-500">
                          {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Date unknown'}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-3">{post.content}</p>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="Post" className="rounded-lg max-h-64 object-cover" />
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;