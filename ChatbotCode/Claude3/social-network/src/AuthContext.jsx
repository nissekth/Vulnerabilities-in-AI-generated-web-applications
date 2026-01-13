import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfile(userData);
            
            // Apply user's theme
            if (userData.theme) {
              document.documentElement.setAttribute('data-theme', userData.theme);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
        document.documentElement.removeAttribute('data-theme');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      document.documentElement.removeAttribute('data-theme');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserTheme = async (theme) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { theme });
      document.documentElement.setAttribute('data-theme', theme);
      await refreshUserProfile();
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const value = {
    currentUser,
    userProfile,
    signOut,
    refreshUserProfile,
    updateUserTheme,
    isAdmin: userProfile?.role === 'admin',
    isOwner: userProfile?.role === 'owner'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
