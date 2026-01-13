import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import FriendsPage from './pages/FriendsPage';
import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import OwnerPage from './pages/OwnerPage';
import BillingPage from './pages/BillingPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  return currentUser && userProfile?.isAdmin ? children : <Navigate to="/" />;
};

// Owner Route Component (you'll need to set this up in Firebase)
const OwnerRoute = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  // Replace with your actual owner email
  const isOwner = currentUser?.email === 'owner@yourdomain.com' || userProfile?.isOwner;
  return isOwner ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(230, 57, 80, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(230, 57, 80, 0.1)',
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Protected Routes */}
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/messages/:userId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              
              {/* Owner Routes */}
              <Route path="/owner" element={<OwnerRoute><OwnerPage /></OwnerRoute>} />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
