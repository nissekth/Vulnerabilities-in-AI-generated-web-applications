import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      setError(error.code === 'auth/invalid-credential' ? 'Invalid email or password.' : 'Failed to log in.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'}}>
      <div className="card fade-in" style={{width:'100%',maxWidth:'480px'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link to="/" style={{textDecoration:'none'}}><h2 style={{color:'var(--accent-primary)',margin:0}}>SocialNet</h2></Link>
          <h1 style={{fontSize:'2rem',marginTop:'1rem'}}>Welcome Back</h1>
          <p style={{color:'var(--text-muted)'}}>Log in to your account</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <label style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer'}}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{width:'auto'}} />
              <span style={{fontSize:'0.9rem'}}>Remember me</span>
            </label>
            <Link to="/forgot-password" style={{color:'var(--accent-primary)',fontSize:'0.9rem',textDecoration:'none'}}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
        </form>
        <div style={{textAlign:'center',marginTop:'2rem',paddingTop:'2rem',borderTop:'1px solid var(--border-color)'}}>
          <p>Don't have an account? <Link to="/register" style={{color:'var(--accent-primary)',textDecoration:'none',fontWeight:'500'}}>Sign up</Link></p>
          <p style={{marginTop:'0.5rem',fontSize:'0.85rem',color:'var(--text-muted)'}}>Are you an admin? <Link to="/admin-login" style={{color:'var(--accent-primary)',textDecoration:'none'}}>Admin Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
