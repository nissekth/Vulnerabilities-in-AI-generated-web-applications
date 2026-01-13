import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register new user
  const signup = async (email, password, displayName, rememberMe = true) => {
    // Set persistence based on "remember me"
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      name: displayName,
      age: null,
      city: '',
      country: '',
      bio: '',
      profilePicture: '',
      banner: 'gradient1',
      theme: 'default',
      colorScheme: 'rose',
      friends: [],
      friendRequests: [],
      referralCode: generateReferralCode(),
      referralPoints: 0,
      referralsUsed: 0,
      referralOptOut: false,
      createdAt: serverTimestamp(),
      isAdmin: false
    });

    return user;
  };

  // Login
  const login = async (email, password, rememberMe = true) => {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Generate unique referral code
  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserProfile(docSnap.data());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
