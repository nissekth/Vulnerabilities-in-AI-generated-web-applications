import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Save, Trash2, Download, Upload } from 'lucide-react';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { currentUser, userProfile, fetchUserProfile, logout } = useAuth();
  const { themes, colorSchemes, currentTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    name: userProfile?.name || '',
    age: userProfile?.age || '',
    city: userProfile?.city || '',
    country: userProfile?.country || '',
    bio: userProfile?.bio || '',
    theme: userProfile?.theme || 'default',
    colorScheme: userProfile?.colorScheme || 'rose',
    banner: userProfile?.banner || 'gradient1'
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      const imageRef = ref(storage, `profiles/${currentUser.uid}/profile-pic`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      
      await updateDoc(doc(db, 'users', currentUser.uid), { profilePicture: url });
      await fetchUserProfile(currentUser.uid);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), formData);
      await fetchUserProfile(currentUser.uid);
      toast.success('Settings saved!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
    setLoading(false);
  };

  const handleDownloadData = async () => {
    try {
      const userData = await getDoc(doc(db, 'users', currentUser.uid));
      const blob = new Blob([JSON.stringify(userData.data(), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `connecthub-data-${currentUser.uid}.json`;
      a.click();
      toast.success('Data downloaded!');
    } catch (error) {
      toast.error('Failed to download data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid));
      await currentUser.delete();
      toast.success('Account deleted');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account. You may need to re-login.');
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-gray-800 mb-8">Settings</h1>

        {/* Profile Settings */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <img
                src={userProfile?.profilePicture || `https://ui-avatars.com/api/?name=${userProfile?.displayName}&background=e63950&color=fff&size=128`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="btn-secondary flex items-center space-x-2"
              >
                <Upload size={18} />
                <span>Upload New</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePicture}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field resize-none"
              rows="3"
              maxLength="200"
            />
            <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/200</p>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select name="theme" value={formData.theme} onChange={handleChange} className="input-field">
                {Object.entries(themes).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
              <select name="colorScheme" value={formData.colorScheme} onChange={handleChange} className="input-field">
                <option value="rose">Rose</option>
                <option value="purple">Purple</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Banner</label>
              <select name="banner" value={formData.banner} onChange={handleChange} className="input-field">
                <option value="gradient1">Purple-Pink-Red</option>
                <option value="gradient2">Blue-Cyan-Teal</option>
                <option value="gradient3">Orange-Red-Pink</option>
                <option value="gradient4">Green-Emerald-Cyan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-6"
        >
          <Save size={20} />
          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
        </button>

        {/* Data & Account */}
        <div className="card bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">Data & Account</h2>
          
          <button
            onClick={handleDownloadData}
            className="btn-secondary w-full flex items-center justify-center space-x-2 mb-4"
          >
            <Download size={20} />
            <span>Download My Data</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
          >
            <Trash2 size={20} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;