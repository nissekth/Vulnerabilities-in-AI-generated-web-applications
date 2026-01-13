import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import PostCreate from '../components/PostCreate';
import PostCard from '../components/PostCard';
import { collection, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader } from 'lucide-react';

const HomePage = () => {
  const { currentUser, userProfile } = useAuth();
  const { currentTheme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Get user's friends list
    const fetchFriends = async () => {
      if (userProfile?.friends) {
        setFriends(userProfile.friends);
      }
    };
    fetchFriends();

    // Subscribe to posts
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter posts based on privacy settings
      const visiblePosts = postsData.filter(post => {
        if (post.visibility === 'public') return true;
        if (post.visibility === 'friends') {
          return post.userId === currentUser.uid || friends.includes(post.userId);
        }
        return post.userId === currentUser.uid;
      });
      
      setPosts(visiblePosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, userProfile, friends]);

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Create Post */}
        <div className="mb-6">
          <PostCreate />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-primary-500" size={40} />
            </div>
          ) : posts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
