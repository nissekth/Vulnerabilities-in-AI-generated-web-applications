"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    const t = term.trim();
    if (!t) return;

    // Simple prefix search by displayNameLower (we store it via settings update; see below).
    const q = query(collection(db, "users"), where("displayNameLower", ">=", t.toLowerCase()), where("displayNameLower", "<=", t.toLowerCase() + "\uf8ff"));
    try {
      const snap = await getDocs(q);
      setResults(snap.docs.map(d=>d.data()));
    } catch (e:any) {
      setError(e?.message ?? "Search failed");
    }
  }

  return (
    <div>
      <h1>Search users</h1>
      <input value={term} onChange={(e)=>setTerm(e.target.value)} placeholder="Type a name…" />
      <button onClick={run}>Search</button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul>
        {results.map((u)=>(
          <li key={u.uid}>
            <Link href={`/profile/${u.uid}`}>{u.name} ({u.city}, {u.country})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

