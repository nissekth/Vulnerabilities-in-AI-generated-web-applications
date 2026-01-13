"use client";

import { AuthGate } from "@/app/_components/AuthGate";
import { db, functions } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FriendsPage() {
  return (
    <AuthGate>{(u)=> <FriendsInner uid={u.uid} />}</AuthGate>
  );
}

function FriendsInner({ uid }: { uid: string }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      // load friends
      const f = await getDocs(collection(db, "users", uid, "friends"));
      const items: any[] = [];
      for (const d of f.docs) {
        const friendUid = d.id;
        const u = await getDoc(doc(db, "users", friendUid));
        if (u.exists()) items.push(u.data());
      }
      setFriends(items);

      // recommendations by mutual friends (Cloud Function)
      const fn = httpsCallable(functions, "recommendFriends");
      const res: any = await fn({});
      setRecs(res.data.recommendations || []);
    })();
  }, [uid]);

  return (
    <div>
      <h1>Friends</h1>
      <h2>Your friends</h2>
      {friends.map((u)=>(
        <div key={u.uid} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <b>{u.name}</b> — {u.age ?? "?"} — {u.city}, {u.country} — <Link href={`/profile/${u.uid}`}>Profile</Link>
        </div>
      ))}

      <hr />
      <h2>People you might know (mutual friends)</h2>
      {recs.map((u:any)=>(
        <div key={u.uid} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <b>{u.name}</b> — mutual friends: {u.mutualCount} — <Link href={`/profile/${u.uid}`}>Profile</Link>
        </div>
      ))}
    </div>
  );
}

