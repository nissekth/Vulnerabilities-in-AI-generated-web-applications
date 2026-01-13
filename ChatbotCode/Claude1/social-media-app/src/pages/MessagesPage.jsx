import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Send, ArrowLeft } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MessagesPage = () => {
  const { userId: chatUserId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { currentTheme } = useTheme();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchFriends();
  }, [userProfile]);

  useEffect(() => {
    if (chatUserId) {
      loadChat(chatUserId);
    }
  }, [chatUserId]);

  useEffect(() => {
    if (!selectedFriend) return;

    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => 
          msg.participants.includes(selectedFriend.id) &&
          msg.participants.includes(currentUser.uid)
        );
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedFriend, currentUser]);

  const fetchFriends = async () => {
    if (!userProfile?.friends || userProfile.friends.length === 0) {
      setFriends([]);
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
      console.error('Failed to load friends');
    }
  };

  const loadChat = async (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      setSelectedFriend(friend);
    } else {
      const docSnap = await getDoc(doc(db, 'users', friendId));
      if (docSnap.exists()) {
        setSelectedFriend({ id: friendId, ...docSnap.data() });
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      await addDoc(collection(db, 'messages'), {
        content: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: userProfile?.displayName || userProfile?.name,
        participants: [currentUser.uid, selectedFriend.id],
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="card p-0 overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Friends List */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Messages</h2>
              </div>
              
              {friends.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No friends to message</p>
                  <Link to="/search" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                    Find friends
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {friends.map(friend => (
                    <button
                      key={friend.id}
                      onClick={() => setSelectedFriend(friend)}
                      className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left ${
                        selectedFriend?.id === friend.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <img
                        src={friend.profilePicture || `https://ui-avatars.com/api/?name=${friend.displayName || friend.name}&background=e63950&color=fff`}
                        alt={friend.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{friend.displayName || friend.name}</p>
                        <p className="text-sm text-gray-500 truncate">Click to message</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedFriend ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                    <img
                      src={selectedFriend.profilePicture || `https://ui-avatars.com/api/?name=${selectedFriend.displayName || selectedFriend.name}&background=e63950&color=fff`}
                      alt={selectedFriend.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedFriend.displayName || selectedFriend.name}</h3>
                      <p className="text-sm text-gray-500">Friend</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            msg.senderId === currentUser.uid
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full glass-effect focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="btn-primary px-6 flex items-center space-x-2"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Select a friend to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;