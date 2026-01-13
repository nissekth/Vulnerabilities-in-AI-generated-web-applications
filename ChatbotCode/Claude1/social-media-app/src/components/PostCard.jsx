import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageCircle, Download, UserPlus, Trash2 } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { currentUser, userProfile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (post.likes && currentUser) {
      setIsLiked(post.likes.includes(currentUser.uid));
    }
    if (userProfile?.friends && post.userId) {
      setIsFriend(userProfile.friends.includes(post.userId));
    }
  }, [post.likes, currentUser, userProfile, post.userId]);

  const handleLike = async () => {
    if (!currentUser) return;
    
    const postRef = doc(db, 'posts', post.id);
    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setIsLiked(false);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setIsLiked(true);
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    const postRef = doc(db, 'posts', post.id);
    const commentData = {
      userId: currentUser.uid,
      userName: userProfile?.displayName || userProfile?.name || 'Anonymous',
      content: comment.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(commentData)
      });
      setComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleAddFriend = async () => {
    if (!currentUser || post.userId === currentUser.uid) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const friendRef = doc(db, 'users', post.userId);

    try {
      await updateDoc(userRef, {
        friends: arrayUnion(post.userId)
      });
      await updateDoc(friendRef, {
        friends: arrayUnion(currentUser.uid)
      });
      setIsFriend(true);
      toast.success('Friend added!');
    } catch (error) {
      toast.error('Failed to add friend');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;

    try {
      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('Post deleted');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = post.imageUrl;
    link.download = `image_${post.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isOwnPost = currentUser && post.userId === currentUser.uid;
  const isAdmin = userProfile?.isAdmin;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/profile/${post.userId}`} className="flex items-center space-x-3">
          <img
            src={post.userProfilePic || `https://ui-avatars.com/api/?name=${post.userName}&background=e63950&color=fff`}
            alt={post.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{post.userName}</h3>
            <p className="text-sm text-gray-500">
              {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}
            </p>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          {!isOwnPost && !isFriend && (
            <button
              onClick={handleAddFriend}
              className="p-2 rounded-lg hover:bg-white/50 text-primary-600 transition-colors"
              title="Add Friend"
            >
              <UserPlus size={20} />
            </button>
          )}
          {(isOwnPost || isAdmin) && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              title="Delete Post"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative mb-4">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full rounded-xl object-cover max-h-96"
          />
          <button
            onClick={handleDownloadImage}
            className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
            title="Download Image"
          >
            <Download size={20} className="text-gray-700" />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200/50">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle size={20} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          {/* Add Comment */}
          {currentUser && (
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-primary-400"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                className="btn-primary"
              >
                Post
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${comment.userName}&background=e63950&color=fff`}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-sm text-gray-800">{comment.userName}</p>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
