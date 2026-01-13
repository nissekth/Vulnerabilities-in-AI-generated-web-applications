import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navigation from '../components/Navigation';

function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalMessages: 0,
    usersThisMonth: 0,
    postsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      const messagesSnapshot = await getDocs(collection(db, 'messages'));

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const usersThisMonth = usersSnapshot.docs.filter(doc => doc.data().createdAt >= firstDayOfMonth).length;
      const postsThisMonth = postsSnapshot.docs.filter(doc => doc.data().createdAt >= firstDayOfMonth).length;

      setStats({
        totalUsers: usersSnapshot.size,
        totalPosts: postsSnapshot.size,
        totalComments: commentsSnapshot.size,
        totalMessages: messagesSnapshot.size,
        usersThisMonth,
        postsThisMonth
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
    setLoading(false);
  };

  if (loading) return <div><Navigation /><div className="spinner"></div></div>;

  return (
    <>
      <Navigation />
      <div className="page-wrapper">
        <div className="container">
          <h1 className="fade-in">Owner Dashboard</h1>
          <p style={{color:'var(--text-muted)',marginBottom:'2rem'}}>Complete overview of your social network</p>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
            <div className="card fade-in">
              <h2 style={{fontSize:'2.5rem',margin:'0 0 0.5rem',color:'var(--accent-primary)'}}>{stats.totalUsers}</h2>
              <h3 style={{fontSize:'1rem',margin:0,fontWeight:'500',color:'var(--text-secondary)'}}>Total Users</h3>
              <p style={{fontSize:'0.85rem',color:'var(--text-muted)',margin:'0.5rem 0 0'}}>+{stats.usersThisMonth} this month</p>
            </div>

            <div className="card fade-in">
              <h2 style={{fontSize:'2.5rem',margin:'0 0 0.5rem',color:'var(--accent-primary)'}}>{stats.totalPosts}</h2>
              <h3 style={{fontSize:'1rem',margin:0,fontWeight:'500',color:'var(--text-secondary)'}}>Total Posts</h3>
              <p style={{fontSize:'0.85rem',color:'var(--text-muted)',margin:'0.5rem 0 0'}}>+{stats.postsThisMonth} this month</p>
            </div>

            <div className="card fade-in">
              <h2 style={{fontSize:'2.5rem',margin:'0 0 0.5rem',color:'var(--accent-primary)'}}>{stats.totalComments}</h2>
              <h3 style={{fontSize:'1rem',margin:0,fontWeight:'500',color:'var(--text-secondary)'}}>Total Comments</h3>
            </div>

            <div className="card fade-in">
              <h2 style={{fontSize:'2.5rem',margin:'0 0 0.5rem',color:'var(--accent-primary)'}}>{stats.totalMessages}</h2>
              <h3 style={{fontSize:'1rem',margin:0,fontWeight:'500',color:'var(--text-secondary)'}}>Total Messages</h3>
            </div>
          </div>

          <div className="card fade-in" style={{marginBottom:'2rem'}}>
            <h2>Engagement Metrics</h2>
            <div style={{marginTop:'1.5rem'}}>
              <div style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                  <span>Average posts per user</span>
                  <span style={{fontWeight:'600'}}>{stats.totalUsers > 0 ? (stats.totalPosts / stats.totalUsers).toFixed(2) : 0}</span>
                </div>
                <div style={{width:'100%',height:'8px',background:'var(--bg-secondary)',borderRadius:'var(--radius-full)'}}>
                  <div style={{width:`${Math.min((stats.totalPosts / stats.totalUsers / 10) * 100, 100)}%`,height:'100%',background:'var(--accent-primary)',borderRadius:'var(--radius-full)'}}></div>
                </div>
              </div>

              <div style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                  <span>Average comments per post</span>
                  <span style={{fontWeight:'600'}}>{stats.totalPosts > 0 ? (stats.totalComments / stats.totalPosts).toFixed(2) : 0}</span>
                </div>
                <div style={{width:'100%',height:'8px',background:'var(--bg-secondary)',borderRadius:'var(--radius-full)'}}>
                  <div style={{width:`${Math.min((stats.totalComments / stats.totalPosts / 5) * 100, 100)}%`,height:'100%',background:'var(--accent-primary)',borderRadius:'var(--radius-full)'}}></div>
                </div>
              </div>

              <div>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                  <span>Average messages per user</span>
                  <span style={{fontWeight:'600'}}>{stats.totalUsers > 0 ? (stats.totalMessages / stats.totalUsers).toFixed(2) : 0}</span>
                </div>
                <div style={{width:'100%',height:'8px',background:'var(--bg-secondary)',borderRadius:'var(--radius-full)'}}>
                  <div style={{width:`${Math.min((stats.totalMessages / stats.totalUsers / 20) * 100, 100)}%`,height:'100%',background:'var(--accent-primary)',borderRadius:'var(--radius-full)'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card fade-in">
            <h2>Quick Actions</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'1rem',marginTop:'1.5rem'}}>
              <button onClick={() => window.location.href='/admin'} className="btn btn-primary" style={{padding:'1rem',justifyContent:'center'}}>
                Go to Admin Panel
              </button>
              <button onClick={loadStatistics} className="btn btn-secondary" style={{padding:'1rem',justifyContent:'center'}}>
                Refresh Statistics
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OwnerDashboard;
