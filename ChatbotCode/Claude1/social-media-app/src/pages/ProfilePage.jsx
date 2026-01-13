import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Calendar, Edit, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const banners = {
  gradient1: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
  gradient2: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
  gradient3: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
  gradient4: 'bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500',
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser, userProfile: currentUserProfile } = useAuth();
  const { currentTheme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = currentUser && currentUser.uid === userId;
  const isFriend = currentUserProfile?.friends?.includes(userId);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
      console.error('Error fetching posts:', error);
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

  if (!profile) {
    return (
      <div className={`min-h-screen ${currentTheme.bg}`}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-500">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Banner */}
        <div className={`h-48 rounded-t-2xl ${banners[profile.banner] || banners.gradient1}`}></div>
        
        {/* Profile Header */}
        <div className="card rounded-t-none -mt-16 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={profile.profilePicture || `https://ui-avatars.com/api/?name=${profile.displayName || profile.name}&background=e63950&color=fff&size=128`}
              alt={profile.displayName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            
            <div className="flex-1 text-center md:text-left mt-4">
              <h1 className="text-3xl font-display text-gray-800">{profile.displayName || profile.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4 mt-2 text-gray-600">
                {profile.age && <span>{profile.age} years old</span>}
                {profile.city && (
                  <span className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{profile.city}{profile.country && `, ${profile.country}`}</span>
                  </span>
                )}
              </div>
              {profile.bio && <p className="mt-3 text-gray-700">{profile.bio}</p>}
              
              {isOwnProfile && (
                <Link to="/settings" className="btn-primary mt-4 inline-flex items-center space-x-2">
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-6 border-t border-gray-200 pt-4">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'posts' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Posts
            </button>
            {(isOwnProfile || isFriend) && (
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'gallery' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Gallery
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {(isOwnProfile || isFriend) ? (
                posts.length === 0 ? (
                  <div className="card text-center py-12">
                    <p className="text-gray-500">No posts yet</p>
                  </div>
                ) : (
                  posts.map(post => <PostCard key={post.id} post={post} />)
                )
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-500">Posts are visible to friends only</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="card">
              {profile.gallery && profile.gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.gallery.map((item, index) => (
                    <img
                      key={index}
                      src={item.url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12">No photos yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;