import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import { Crown, Users, FileText, TrendingUp, Calendar } from 'lucide-react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const OwnerPage = () => {
  const { currentTheme } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalMessages: 0,
    newUsersThisMonth: 0,
    activeUsers: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch all posts
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const posts = postsSnapshot.size;

      // Fetch all messages
      const messagesSnapshot = await getDocs(collection(db, 'messages'));
      const messages = messagesSnapshot.size;

      // Calculate new users this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsers = users.filter(user => {
        const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(0);
        return createdAt >= startOfMonth;
      });

      // Get recent users
      const recent = users
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 10);

      setStats({
        totalUsers: users.length,
        totalPosts: posts,
        totalMessages: messages,
        newUsersThisMonth: newUsers.length,
        activeUsers: users.filter(u => u.friends && u.friends.length > 0).length
      });

      setRecentUsers(recent);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
    setLoading(false);
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
          <Crown size={40} className="text-amber-500" />
          <h1 className="text-4xl font-display text-gray-800">Owner Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalUsers}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.activeUsers}</h3>
            <p className="text-gray-600">Active Users</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.totalPosts}</h3>
            <p className="text-gray-600">Total Posts</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{stats.newUsersThisMonth}</h3>
            <p className="text-gray-600">New This Month</p>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Recent Signups</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Friends</th>
                  <th className="text-left py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.displayName || user.name}&background=e63950&color=fff`}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-semibold">{user.displayName || user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">{user.friends?.length || 0}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Owner Note */}
        <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">🔐 Owner Access Protected</h3>
          <p className="text-gray-700">
            Your owner access is permanently secured. Even if you change your email or forget your password, 
            you can always regain access through Firebase Console by setting the <code className="bg-white px-2 py-1 rounded">isOwner</code> flag 
            in your user document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerPage;
