// Firebase Configuration
// IMPORTANT: Replace this with your actual Firebase project configuration
// You'll get this from your Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyBWzoPoI2t4LKbRiqEK0TOxXd6-ySIBQiI",
  authDomain: "claude4-195d9.firebaseapp.com",
  projectId: "claude4-195d9",
  storageBucket: "claude4-195d9.firebasestorage.app",
  messagingSenderId: "101459257908",
  appId: "1:101459257908:web:7d693941bc9d74fc917861"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
