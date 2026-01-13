import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

function Welcome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ id: doc.id, ...data });
        }
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
    setSearching(false);
  };

  return (
    <div style={{minHeight:'100vh'}}>
      <nav style={{background:'var(--bg-tertiary)',borderBottom:'1px solid var(--border-color)',padding:'1.5rem 0'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',color:'var(--accent-primary)',margin:0}}>SocialNet</h2>
          <div style={{display:'flex',gap:'1rem'}}>
            <Link to="/login" className="btn btn-secondary">Log In</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>
      
      <div style={{padding:'6rem 0 4rem',background:'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'}}>
        <div className="container fade-in">
          <h1 style={{fontSize:'3.5rem',lineHeight:'1.1',marginBottom:'1.5rem'}}>
            Connect with<br/><span style={{color:'var(--accent-primary)'}}>people who matter</span>
          </h1>
          <p style={{fontSize:'1.25rem',color:'var(--text-secondary)',marginBottom:'2rem'}}>
            Share moments, build friendships, and stay connected with your community.
          </p>
          <div style={{display:'flex',gap:'1.5rem',alignItems:'center',flexWrap:'wrap'}}>
            <Link to="/register" className="btn btn-primary" style={{padding:'1rem 2rem',fontSize:'1.1rem'}}>Get Started Free</Link>
            <Link to="/login" style={{color:'var(--accent-primary)',textDecoration:'none'}}>Already have an account? →</Link>
          </div>
        </div>
      </div>

      <div style={{padding:'3rem 0'}}>
        <div className="container">
          <div className="card" style={{maxWidth:'800px',margin:'0 auto'}}>
            <h2>Find People</h2>
            <p style={{color:'var(--text-muted)'}}>Search for users (login to connect)</p>
            <form onSubmit={handleSearch} style={{display:'flex',gap:'1rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
              <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{flex:1,minWidth:'200px'}} />
              <button type="submit" className="btn btn-primary" disabled={searching}>{searching ? 'Searching...' : 'Search'}</button>
            </form>
            {searchResults.length > 0 && (
              <div style={{marginTop:'2rem'}}>
                <h3>Results ({searchResults.length})</h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',gap:'1.5rem',marginTop:'1.5rem'}}>
                  {searchResults.map(user => (
                    <div key={user.id} style={{padding:'1.5rem',border:'1px solid var(--border-color)',borderRadius:'var(--radius-lg)',background:'var(--bg-tertiary)'}}>
                      <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=d4763c&color=fff`} 
                           alt={user.displayName} style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',border:'3px solid var(--border-color)'}} />
                      <h4 style={{margin:'1rem 0 0.5rem'}}>{user.displayName || 'Anonymous'}</h4>
                      <p style={{color:'var(--text-muted)',fontSize:'0.9rem'}}>{user.city && user.country ? `${user.city}, ${user.country}` : 'Location not set'}</p>
                      {user.aboutMe && <p style={{fontSize:'0.85rem',marginTop:'0.5rem'}}>{user.aboutMe.substring(0,80)}...</p>}
                      <Link to="/login" className="btn btn-secondary" style={{marginTop:'1rem',fontSize:'0.85rem',width:'100%',justifyContent:'center'}}>Login to connect</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {searchResults.length === 0 && searchQuery && !searching && (
              <p style={{textAlign:'center',color:'var(--text-muted)',marginTop:'2rem'}}>No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
