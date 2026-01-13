import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

/**
 * "Remember me":
 * - checked => local persistence (stays logged in across browser restarts)
 * - unchecked => session persistence (clears when tab/browser closed)
 *
 * Firebase Auth persistence docs: setPersistence + browserLocalPersistence etc. :contentReference[oaicite:5]{index=5}
 */
export async function login(email: string, password: string, remember: boolean) {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  // Create user profile docs
  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    displayName,
    name: displayName,
    age: null,
    city: "",
    country: "",
    aboutMe: "",
    bannerKey: "default",
    themeKey: "light",
    referralPoints: 0,
    referralOptOut: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    profilePhotoPath: "",
  });

  return cred;
}

export async function logout() {
  return signOut(auth);
}

export async function forgotPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, loading };
}


