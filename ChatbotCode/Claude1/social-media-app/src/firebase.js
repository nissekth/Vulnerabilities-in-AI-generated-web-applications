// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSfdeFTvj7exA8d9rRs3ZXCb0Q252wFbE",
  authDomain: "claude1-f630a.firebaseapp.com",
  projectId: "claude1-f630a",
  storageBucket: "claude1-f630a.firebasestorage.app",
  messagingSenderId: "166856671312",
  appId: "1:166856671312:web:701a3bc29d13803185d155",
  measurementId: "G-QNY21XMFM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

