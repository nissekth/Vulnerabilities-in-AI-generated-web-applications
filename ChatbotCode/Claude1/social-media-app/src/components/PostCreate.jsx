import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Image as ImageIcon, Send, Globe, Users, Smile } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const PostCreate = () => {
  const { currentUser, userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const maxLength = 280;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setContent(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      toast.error('Please add some content or an image');
      return;
    }

    if (content.length > maxLength) {
      toast.error(`Post must be ${maxLength} characters or less`);
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';
      
      // Upload image if exists
      if (image) {
        const imageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
        
        // Add to user's gallery
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          gallery: arrayUnion({
            url: imageUrl,
            uploadedAt: new Date().toISOString(),
            postId: null // Will update after post is created
          })
        });
      }

      // Create post
      const postData = {
        userId: currentUser.uid,
        userName: userProfile?.displayName || userProfile?.name || 'Anonymous',
        userProfilePic: userProfile?.profilePicture || '',
        content: content.trim(),
        imageUrl,
        likes: [],
        comments: [],
        visibility,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);

      // Update gallery with postId if image was uploaded
      if (imageUrl) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        const gallery = userDoc.data().gallery || [];
        const updatedGallery = gallery.map(item => 
          item.url === imageUrl ? { ...item, postId: docRef.id } : item
        );
        await updateDoc(userRef, { gallery: updatedGallery });
      }

      toast.success('Post created!');
      setContent('');
      setImage(null);
      setImagePreview('');
      setVisibility('public');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create post');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={userProfile?.profilePicture || `https://ui-avatars.com/api/?name=${userProfile?.displayName || 'User'}&background=e63950&color=fff`}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              rows="3"
              maxLength={maxLength}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {content.length}/{maxLength}
            </div>

            {imagePreview && (
              <div className="mt-3 relative">
                <img src={imagePreview} alt="Preview" className="rounded-xl max-h-64 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 rounded-lg hover:bg-white/50 text-primary-600 transition-colors"
                  title="Add image"
                >
                  <ImageIcon size={20} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-lg hover:bg-white/50 text-primary-600 transition-colors"
                    title="Add emoji"
                  >
                    <Smile size={20} />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-12 left-0 z-50">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>

                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="px-3 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                >
                  <option value="public">🌍 Public</option>
                  <option value="friends">👥 Friends Only</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || (!content.trim() && !image)}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
