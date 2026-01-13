import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Register() {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', displayName: '', age: '', city: '', country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const generateInviteCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        displayName: formData.displayName,
        age: formData.age ? parseInt(formData.age) : null,
        city: formData.city || '',
        country: formData.country || '',
        aboutMe: '',
        photoURL: '',
        bannerTheme: 'default',
        createdAt: new Date().toISOString(),
        role: 'user',
        theme: 'default',
        referralPoints: 0,
        referralOptIn: true
      });
      await setDoc(doc(db, 'friends', userCredential.user.uid), {
        friendIds: [],
        pendingRequests: [],
        sentRequests: []
      });
      await setDoc(doc(db, 'referrals', userCredential.user.uid), {
        inviteCode: generateInviteCode(),
        usedInvites: 0,
        monthlyInvites: 5,
        lastResetDate: new Date().toISOString(),
        referredUsers: []
      });
      navigate('/home');
    } catch (error) {
      setError(error.code === 'auth/email-already-in-use' ? 'This email is already registered.' : 'Failed to create account.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)'}}>
      <div className="card fade-in" style={{width:'100%',maxWidth:'480px'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link to="/" style={{textDecoration:'none'}}><h2 style={{color:'var(--accent-primary)',margin:0}}>SocialNet</h2></Link>
          <h1 style={{fontSize:'2rem',marginTop:'1rem'}}>Create Account</h1>
          <p style={{color:'var(--text-muted)'}}>Join our community today</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div>
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="displayName">Display Name *</label>
            <input type="text" id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} required placeholder="Your name" />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div>
              <label htmlFor="age">Age</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="13" max="120" placeholder="18" />
            </div>
            <div>
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
            </div>
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
          </div>
          <div>
            <label htmlFor="password">Password *</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="At least 6 characters" />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</button>
        </form>
        <div style={{textAlign:'center',marginTop:'2rem',paddingTop:'2rem',borderTop:'1px solid var(--border-color)'}}>
          <p>Already have an account? <Link to="/login" style={{color:'var(--accent-primary)',textDecoration:'none',fontWeight:'500'}}>Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
