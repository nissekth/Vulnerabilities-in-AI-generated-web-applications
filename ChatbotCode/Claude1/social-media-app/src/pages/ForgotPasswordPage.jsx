import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error('Failed to send reset email');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <span className="font-display text-4xl text-gradient">ConnectHub</span>
        </Link>

        <div className="card">
          {!sent ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display text-gray-800 mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your email to receive reset instructions</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-12"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-2">
              <ArrowLeft size={18} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
