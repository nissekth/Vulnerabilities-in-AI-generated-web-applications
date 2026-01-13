import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, User, Users, MessageCircle, Settings, LogOut, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  if (!currentUser) return null;

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-display text-2xl text-gradient hidden sm:block">ConnectHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <NavLink to="/home" icon={<Home size={20} />} label="Home" />
            <NavLink to={`/profile/${currentUser.uid}`} icon={<User size={20} />} label="Profile" />
            <NavLink to="/friends" icon={<Users size={20} />} label="Friends" />
            <NavLink to="/messages" icon={<MessageCircle size={20} />} label="Messages" />
            <NavLink to="/search" icon={<Search size={20} />} label="Search" />
            <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-primary-600 hover:bg-white/50 transition-all duration-200"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden lg:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-1 px-3 py-2 rounded-lg text-primary-600 hover:bg-white/50 transition-all duration-200"
      title={label}
    >
      {icon}
      <span className="hidden lg:inline text-sm font-medium">{label}</span>
    </Link>
  );
};

export default Navbar;
