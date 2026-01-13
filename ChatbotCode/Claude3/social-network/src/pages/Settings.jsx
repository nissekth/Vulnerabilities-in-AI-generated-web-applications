import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useAuth } from '../AuthContext';
import Navigation from '../components/Navigation';

function Settings() {
  const { currentUser, userProfile, updateUserTheme, refreshUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [selectedTheme, setSelectedTheme] = useState(userProfile?.theme || 'default');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { displayName });
      await refreshUserProfile();
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  const handleThemeChange = async (theme) => {
    setSelectedTheme(theme);
    await updateUserTheme(theme);
  };

  const handleDownloadData = async () => {
    try {
      const userData = { ...userProfile };
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('userId', '==', currentUser.uid));
      const postsSnapshot = await getDocs(q);
      const posts = postsSnapshot.docs.map(doc => doc.data());
      const dataStr = JSON.stringify({ user: userData, posts }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-data-${Date.now()}.json`;
      link.click();
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid));
      await deleteDoc(doc(db, 'friends', currentUser.uid));
      await deleteDoc(doc(db, 'referrals', currentUser.uid));
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('userId', '==', currentUser.uid));
      const postsSnapshot = await getDocs(q);
      await Promise.all(postsSnapshot.docs.map(doc => deleteDoc(doc.ref)));
      await deleteUser(currentUser);
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. You may need to log in again first.');
      setDeleting(false);
    }
  };

  const themes = [
    { id: 'default', name: 'Default', desc: 'Warm earth tones' },
    { id: 'dark', name: 'Dark', desc: 'Dark mode' },
    { id: 'modern', name: 'Modern', desc: 'Clean and minimal' },
    { id: 'ocean', name: 'Ocean', desc: 'Calming blues' },
    { id: 'forest', name: 'Forest', desc: 'Natural greens' }
  ];

  return (
    <>
      <Navigation />
      <div className="page-wrapper">
        <div className="container" style={{maxWidth:'700px'}}>
          <h1 className="fade-in">Settings</h1>

          <div className="card fade-in" style={{marginBottom:'2rem'}}>
            <h2>Profile Settings</h2>
            <div style={{marginTop:'1.5rem'}}>
              <label>Display Name</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <button onClick={handleSaveSettings} className="btn btn-primary" style={{marginTop:'1rem'}} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="card fade-in" style={{marginBottom:'2rem'}}>
            <h2>Theme</h2>
            <p style={{color:'var(--text-muted)',marginBottom:'1.5rem'}}>Choose your preferred color scheme</p>
            <div style={{display:'grid',gap:'1rem'}}>
              {themes.map(theme => (
                <div key={theme.id} 
                     onClick={() => handleThemeChange(theme.id)}
                     style={{
                       padding:'1rem',
                       border:`2px solid ${selectedTheme === theme.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                       borderRadius:'var(--radius-md)',
                       cursor:'pointer',
                       transition:'all var(--transition-fast)',
                       background: selectedTheme === theme.id ? 'var(--bg-secondary)' : 'transparent'
                     }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <h4 style={{margin:'0 0 0.25rem'}}>{theme.name}</h4>
                      <p style={{margin:0,fontSize:'0.85rem',color:'var(--text-muted)'}}>{theme.desc}</p>
                    </div>
                    {selectedTheme === theme.id && <span style={{fontSize:'1.5rem'}}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card fade-in" style={{marginBottom:'2rem'}}>
            <h2>Data & Privacy</h2>
            <button onClick={handleDownloadData} className="btn btn-secondary" style={{marginTop:'1rem'}}>
              Download My Data
            </button>
            <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginTop:'0.5rem'}}>
              Download a copy of your profile and posts
            </p>
          </div>

          <div className="card fade-in">
            <h2 style={{color:'#dc3545'}}>Danger Zone</h2>
            <p style={{color:'var(--text-muted)'}}>Once you delete your account, there is no going back.</p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger" style={{marginTop:'1rem'}}>
                Delete Account
              </button>
            ) : (
              <div style={{marginTop:'1rem',padding:'1rem',background:'#fee',borderRadius:'var(--radius-md)'}}>
                <p style={{fontWeight:'500',marginBottom:'1rem'}}>Are you absolutely sure?</p>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <button onClick={handleDeleteAccount} className="btn btn-danger" disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
