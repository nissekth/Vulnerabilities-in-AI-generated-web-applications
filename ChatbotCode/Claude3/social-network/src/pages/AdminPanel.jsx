import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import Navigation from '../components/Navigation';

function AdminPanel() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = await Promise.all(postsSnapshot.docs.map(async (postDoc) => {
        const data = postDoc.data();
        const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', data.userId)));
        const userData = userDoc.docs[0]?.data();
        return { id: postDoc.id, ...data, user: userData };
      }));
      setPosts(postsData);

      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      const commentsData = await Promise.all(commentsSnapshot.docs.map(async (commentDoc) => {
        const data = commentDoc.data();
        const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', data.userId)));
        const userData = userDoc.docs[0]?.data();
        return { id: commentDoc.id, ...data, user: userData };
      }));
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      await loadData();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      await loadData();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      await loadData();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) return <div><Navigation /><div className="spinner"></div></div>;

  return (
    <>
      <Navigation />
      <div className="page-wrapper">
        <div className="container">
          <h1 className="fade-in">Admin Panel</h1>
          
          <div className="card fade-in" style={{marginBottom:'2rem'}}>
            <div style={{display:'flex',gap:'1rem',borderBottom:'1px solid var(--border-color)',paddingBottom:'1rem'}}>
              <button onClick={() => setActiveTab('users')} className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}>
                Users ({users.length})
              </button>
              <button onClick={() => setActiveTab('posts')} className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-secondary'}`}>
                Posts ({posts.length})
              </button>
              <button onClick={() => setActiveTab('comments')} className={`btn ${activeTab === 'comments' ? 'btn-primary' : 'btn-secondary'}`}>
                Comments ({comments.length})
              </button>
            </div>

            <div style={{marginTop:'2rem'}}>
              {activeTab === 'users' && (
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead>
                      <tr style={{borderBottom:'2px solid var(--border-color)'}}>
                        <th style={{textAlign:'left',padding:'1rem'}}>Name</th>
                        <th style={{textAlign:'left',padding:'1rem'}}>Email</th>
                        <th style={{textAlign:'left',padding:'1rem'}}>Role</th>
                        <th style={{textAlign:'left',padding:'1rem'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} style={{borderBottom:'1px solid var(--border-color)'}}>
                          <td style={{padding:'1rem'}}>{user.displayName}</td>
                          <td style={{padding:'1rem'}}>{user.email}</td>
                          <td style={{padding:'1rem'}}>
                            <span style={{padding:'0.25rem 0.75rem',background:user.role === 'owner' ? '#f59e0b' : user.role === 'admin' ? '#3b82f6' : 'var(--bg-secondary)',borderRadius:'var(--radius-sm)',fontSize:'0.85rem'}}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{padding:'1rem'}}>
                            {user.role !== 'owner' && userProfile?.role === 'owner' && (
                              <select onChange={(e) => handleChangeUserRole(user.id, e.target.value)} defaultValue={user.role} style={{padding:'0.5rem',fontSize:'0.85rem'}}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'posts' && (
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {posts.map(post => (
                    <div key={post.id} style={{padding:'1.5rem',border:'1px solid var(--border-color)',borderRadius:'var(--radius-md)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                        <div>
                          <h4 style={{margin:'0 0 0.5rem'}}>{post.user?.displayName || 'Unknown User'}</h4>
                          <p style={{fontSize:'0.85rem',color:'var(--text-muted)',margin:0}}>{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleDeletePost(post.id)} className="btn btn-danger" style={{padding:'0.5rem 1rem',fontSize:'0.85rem'}}>Delete</button>
                      </div>
                      <p>{post.content}</p>
                      {post.imageUrl && <img src={post.imageUrl} alt="Post" style={{width:'200px',borderRadius:'var(--radius-md)',marginTop:'0.5rem'}} />}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'comments' && (
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {comments.map(comment => (
                    <div key={comment.id} style={{padding:'1.5rem',border:'1px solid var(--border-color)',borderRadius:'var(--radius-md)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                        <div>
                          <h4 style={{margin:'0 0 0.5rem'}}>{comment.user?.displayName || 'Unknown User'}</h4>
                          <p style={{fontSize:'0.85rem',color:'var(--text-muted)',margin:0}}>{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleDeleteComment(comment.id)} className="btn btn-danger" style={{padding:'0.5rem 1rem',fontSize:'0.85rem'}}>Delete</button>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
