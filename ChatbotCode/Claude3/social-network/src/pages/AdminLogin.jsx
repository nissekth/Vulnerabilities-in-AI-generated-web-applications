import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      if (userData.role === 'admin' || userData.role === 'owner') {
        navigate('/admin');
      } else {
        setError('Access denied. Administrators only.');
        await auth.signOut();
      }
    } catch (error) {
      setError('Invalid credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'}}>
      <div className="card fade-in" style={{width:'100%',maxWidth:'480px'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link to="/" style={{textDecoration:'none'}}><h2 style={{color:'var(--accent-primary)',margin:0}}>SocialNet</h2></Link>
          <h1 style={{fontSize:'2rem',marginTop:'1rem'}}>Admin Access</h1>
          <p style={{color:'var(--text-muted)'}}>Administrator login only</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div>
            <label htmlFor="email">Admin Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading ? 'Verifying...' : 'Log In as Admin'}</button>
        </form>
        <div style={{textAlign:'center',marginTop:'2rem',paddingTop:'2rem',borderTop:'1px solid var(--border-color)'}}>
          <p><Link to="/login" style={{color:'var(--accent-primary)',textDecoration:'none'}}>← Back to regular login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
