import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import { CreditCard, AlertCircle } from 'lucide-react';

const BillingPage = () => {
  const { userProfile } = useAuth();
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-gray-800 mb-8 flex items-center space-x-3">
          <CreditCard size={40} />
          <span>Billing & Subscription</span>
        </h1>

        {/* Current Plan */}
        <div className="card mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Current Plan: Free Tier</h2>
              <p className="text-gray-600 mb-4">
                You're currently on our free plan. Enjoy unlimited access to all features!
              </p>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                ✓ Active
              </div>
            </div>
          </div>
        </div>

        {/* Billing Integration Notice */}
        <div className="card bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start space-x-4">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Billing Integration</h3>
              <p className="text-gray-700 mb-4">
                This page is ready for integration with your payment processor. Since billing is handled 
                by another company, you'll need to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Choose a payment processor (Stripe, PayPal, etc.)</li>
                <li>Get API credentials from your processor</li>
                <li>Integrate their SDK into this page</li>
                <li>Add webhook handlers for payment events</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Referral Points */}
        <div className="card mt-6">
          <h2 className="text-2xl font-semibold mb-4">Referral Rewards</h2>
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
            <div>
              <p className="text-gray-600 mb-2">Your Referral Points</p>
              <p className="text-4xl font-bold text-gradient">{userProfile?.referralPoints || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-2">Invites Used</p>
              <p className="text-2xl font-semibold text-gray-800">{userProfile?.referralsUsed || 0} / 5</p>
              <p className="text-sm text-gray-500">this month</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Earn points by inviting friends! Each successful referral gives you 1 point. 
            You can send up to 5 invites per month.
          </p>
        </div>

        {/* Placeholder Sections */}
        <div className="card mt-6 opacity-50">
          <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
          <p className="text-gray-600">No payment method on file</p>
          <button disabled className="btn-secondary mt-4 cursor-not-allowed">
            Add Payment Method
          </button>
        </div>

        <div className="card mt-6 opacity-50">
          <h3 className="text-xl font-semibold mb-4">Billing History</h3>
          <p className="text-gray-600">No billing history available</p>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
