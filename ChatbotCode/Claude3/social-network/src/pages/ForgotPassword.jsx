import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      setError(error.code === 'auth/user-not-found' ? 'No account found with this email.' : 'Failed to send reset email.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'}}>
      <div className="card fade-in" style={{width:'100%',maxWidth:'480px'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link to="/" style={{textDecoration:'none'}}><h2 style={{color:'var(--accent-primary)',margin:0}}>SocialNet</h2></Link>
          <h1 style={{fontSize:'2rem',marginTop:'1rem'}}>Reset Password</h1>
          <p style={{color:'var(--text-muted)'}}>Enter your email to receive a password reset link</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Password reset email sent! Check your inbox.</div>}
        {!success && (
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
            <div>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
        )}
        <div style={{textAlign:'center',marginTop:'2rem',paddingTop:'2rem',borderTop:'1px solid var(--border-color)'}}>
          <p><Link to="/login" style={{color:'var(--accent-primary)',textDecoration:'none'}}>← Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
