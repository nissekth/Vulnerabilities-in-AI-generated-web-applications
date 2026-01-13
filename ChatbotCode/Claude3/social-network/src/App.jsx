import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import AdminPanel from './pages/AdminPanel';
import OwnerDashboard from './pages/OwnerDashboard';
import Billing from './pages/Billing';

function ProtectedRoute({ children, adminOnly = false, ownerOnly = false }) {
  const { currentUser, isAdmin, isOwner } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (ownerOnly && !isOwner) return <Navigate to="/home" />;
  if (adminOnly && !isAdmin && !isOwner) return <Navigate to="/home" />;

  return children;
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Navigate to="/home" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      <Route path="/owner" element={<ProtectedRoute ownerOnly><OwnerDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
