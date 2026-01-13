import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Users, MessageCircle, Image, Heart, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const features = [
    { icon: <Users size={32} />, title: 'Connect with Friends', desc: 'Build your network and stay connected' },
    { icon: <MessageCircle size={32} />, title: 'Share Updates', desc: 'Post your thoughts in 280 characters' },
    { icon: <Image size={32} />, title: 'Photo Galleries', desc: 'Create albums and share memories' },
    { icon: <Heart size={32} />, title: 'Engage & Interact', desc: 'Like and comment on posts' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="font-display text-3xl text-gradient">ConnectHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2">
              <Search size={20} />
              <span>Search Users</span>
            </Link>
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl mb-6">
            <span className="text-gradient">Connect.</span>
            <br />
            <span className="text-gray-800">Share. Inspire.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-light">
            Join a vibrant community where friendships flourish and memories are made
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
              <span>Join ConnectHub</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/search" className="btn-secondary text-lg px-8 py-4">
              Browse Profiles
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-gray-500 text-sm">
        <p>© 2024 ConnectHub. All rights reserved.</p>
      </div>
    </div>
  );
};

export default WelcomePage;
