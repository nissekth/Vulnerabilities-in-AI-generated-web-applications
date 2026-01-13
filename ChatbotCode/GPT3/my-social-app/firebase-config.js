// firebase-config.js
// Replace all the YOUR_... strings with your actual config from Firebase console

// Using compat SDK which is easier if you’re not a programmer
// Scripts for this are loaded in index.html and admin.html

const firebaseConfig = {
  apiKey: "AIzaSyD9BdlTMLN2LRz4qMKHzMNumAywBLW0rYs",
  authDomain: "gpt-3-3dd1e.firebaseapp.com",
  projectId: "gpt-3-3dd1e",
  storageBucket: "gpt-3-3dd1e.firebasestorage.app",
  messagingSenderId: "881982801092",
  appId: "1:881982801092:web:ecf5136908907aa2043591"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

