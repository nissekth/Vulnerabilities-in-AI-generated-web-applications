import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navigation() {
  const { currentUser, userProfile, signOut, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav>
      <div className="container">
        <Link to="/home" className="nav-brand">SocialNet</Link>
        
        <ul className="nav-links">
          <li><Link to="/home" className={isActive('/home')}>Home</Link></li>
          <li><Link to={`/profile/${currentUser?.uid}`} className={isActive(`/profile/${currentUser?.uid}`)}>Profile</Link></li>
          <li><Link to="/friends" className={isActive('/friends')}>Friends</Link></li>
          <li><Link to="/messages" className={isActive('/messages')}>Messages</Link></li>
          {(isAdmin || isOwner) && (
            <li><Link to="/admin" className={isActive('/admin')}>Admin</Link></li>
          )}
          {isOwner && (
            <li><Link to="/owner" className={isActive('/owner')}>Owner</Link></li>
          )}
          <li><Link to="/settings" className={isActive('/settings')}>Settings</Link></li>
          <li><button onClick={handleSignOut} className="btn btn-secondary">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
