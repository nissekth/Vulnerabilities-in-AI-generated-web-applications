"use client";

import { useSearchParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

type UserProfile = {
  uid: string;
  displayName: string;
  age: number | null;
  city: string;
  country: string;
  aboutMe: string;
  bannerKey: string;
};

type Post = {
  id: string;
  authorUid: string;
  text: string;
};

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? auth.currentUser?.uid ?? null;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // Load profile
  useEffect(() => {
    if (!uid) return;

    getDoc(doc(db, "users", uid)).then(snap => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
    });
  }, [uid]);

  // Load posts
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "posts"),
      where("authorUid", "==", uid)
    );

    return onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Post, "id">),
      }));
      setPosts(all);
    });
  }, [uid]);

  if (!uid) return <p>No user selected.</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>{profile.displayName}</h1>
      <p>{profile.aboutMe}</p>

      <h2>Posts</h2>
      {posts.map(p => (
        <div key={p.id}>{p.text}</div>
      ))}
    </div>
  );
}

