import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import Navigation from '../components/Navigation';
import { formatDistanceToNow } from 'date-fns';

function Messages() {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      loadMessages(selectedFriend.id);
    }
  }, [selectedFriend]);

  const loadFriends = async () => {
    try {
      const friendsDoc = await getDoc(doc(db, 'friends', currentUser.uid));
      if (!friendsDoc.exists()) return;
      const friendIds = friendsDoc.data().friendIds || [];
      const friendsData = await Promise.all(friendIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        return { id, ...userDoc.data() };
      }));
      setFriends(friendsData);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadMessages = async (friendId) => {
    try {
      const messagesRef = collection(db, 'messages');
      const q1 = query(messagesRef, where('senderId', '==', currentUser.uid), where('receiverId', '==', friendId));
      const q2 = query(messagesRef, where('senderId', '==', friendId), where('receiverId', '==', currentUser.uid));
      const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      const allMessages = [...snapshot1.docs, ...snapshot2.docs].map(doc => ({ id: doc.id, ...doc.data() }));
      allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(allMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUser.uid,
        receiverId: selectedFriend.id,
        content: newMessage,
        createdAt: new Date().toISOString()
      });
      setNewMessage('');
      await loadMessages(selectedFriend.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setSending(false);
  };

  return (
    <>
      <Navigation />
      <div className="page-wrapper">
        <div className="container" style={{maxWidth:'1000px'}}>
          <h1 className="fade-in">Messages</h1>
          <div className="card fade-in" style={{display:'grid',gridTemplateColumns:'300px 1fr',minHeight:'500px',padding:0,overflow:'hidden'}}>
            <div style={{borderRight:'1px solid var(--border-color)',padding:'1rem',overflowY:'auto'}}>
              <h3 style={{margin:'0 0 1rem',padding:'0 0.5rem'}}>Friends</h3>
              {friends.length === 0 ? (
                <p style={{color:'var(--text-muted)',padding:'0 0.5rem'}}>No friends to message</p>
              ) : (
                friends.map(friend => (
                  <div key={friend.id}
                       onClick={() => setSelectedFriend(friend)}
                       style={{
                         padding:'1rem',
                         borderRadius:'var(--radius-md)',
                         cursor:'pointer',
                         background: selectedFriend?.id === friend.id ? 'var(--bg-secondary)' : 'transparent',
                         display:'flex',
                         gap:'0.75rem',
                         alignItems:'center',
                         marginBottom:'0.5rem'
                       }}>
                    <img src={friend.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.displayName || 'User')}&background=d4763c&color=fff`} 
                         alt={friend.displayName}
                         style={{width:'40px',height:'40px',borderRadius:'50%',objectFit:'cover'}} />
                    <div style={{flex:1}}>
                      <h4 style={{margin:0,fontSize:'0.95rem'}}>{friend.displayName}</h4>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div style={{display:'flex',flexDirection:'column'}}>
              {!selectedFriend ? (
                <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)'}}>
                  <p>Select a friend to start messaging</p>
                </div>
              ) : (
                <>
                  <div style={{padding:'1rem',borderBottom:'1px solid var(--border-color)',display:'flex',gap:'0.75rem',alignItems:'center'}}>
                    <img src={selectedFriend.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFriend.displayName || 'User')}&background=d4763c&color=fff`} 
                         alt={selectedFriend.displayName}
                         style={{width:'40px',height:'40px',borderRadius:'50%',objectFit:'cover'}} />
                    <h3 style={{margin:0}}>{selectedFriend.displayName}</h3>
                  </div>
                  
                  <div style={{flex:1,padding:'1.5rem',overflowY:'auto',display:'flex',flexDirection:'column',gap:'1rem'}}>
                    {messages.length === 0 ? (
                      <p style={{color:'var(--text-muted)',textAlign:'center'}}>No messages yet. Say hi!</p>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id}
                             style={{
                               alignSelf: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                               maxWidth:'70%'
                             }}>
                          <div style={{
                            padding:'0.75rem 1rem',
                            borderRadius:'var(--radius-md)',
                            background: msg.senderId === currentUser.uid ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                            color: msg.senderId === currentUser.uid ? 'white' : 'var(--text-primary)'
                          }}>
                            <p style={{margin:0}}>{msg.content}</p>
                          </div>
                          <p style={{fontSize:'0.75rem',color:'var(--text-muted)',margin:'0.25rem 0.5rem 0',textAlign:msg.senderId === currentUser.uid ? 'right' : 'left'}}>
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <form onSubmit={handleSendMessage} style={{padding:'1rem',borderTop:'1px solid var(--border-color)',display:'flex',gap:'0.5rem'}}>
                    <input type="text"
                           placeholder="Type a message..."
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           style={{flex:1}} />
                    <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Messages;
