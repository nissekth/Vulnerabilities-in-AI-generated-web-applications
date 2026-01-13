// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project configuration

const firebaseConfig = {
  apiKey: "AIzaSyArIlxTuVqA3NR_g1t-FQ0aE2qJQuvhauk",
  authDomain: "claude2-93180.firebaseapp.com",
  projectId: "claude2-93180",
  storageBucket: "claude2-93180.firebasestorage.app",
  messagingSenderId: "608048125110",
  appId: "1:608048125110:web:cd2e2f43ab5ea4c5da4217"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
