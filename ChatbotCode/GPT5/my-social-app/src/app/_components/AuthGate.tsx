"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

export function AuthGate({ children }: { children: (u: User)=>React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    return onAuthStateChanged(auth, (u)=>{
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (!user) {
    return (
      <div>
        <p>You must be logged in for this page.</p>
        <p><Link href="/login">Go to login</Link></p>
      </div>
    );
  }
  return <>{children(user)}</>;
}

