"use client";

import { RoleGate } from "@/app/_components/RoleGate";
import { db, functions } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";

export default function AdminPage() {
  return (
    <RoleGate role="admin">
      <AdminInner />
    </RoleGate>
  );
}

function AdminInner() {
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(()=>{
    (async ()=>{
      const us = await getDocs(collection(db, "users"));
      setUsers(us.docs.map(d=>d.data()));

      const ps = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(100)));
      setPosts(ps.docs.map(d=>({ id: d.id, ...d.data() })));

      const fn = httpsCallable(functions, "listAdmins");
      const res: any = await fn({});
      setAdmins(res.data.admins || []);
    })();
  }, []);

  async function removePost(postId: string) {
    setError("");
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (e:any) {
      setError(e?.message ?? "Failed");
    }
  }

  async function removeUser(uid: string) {
    setError("");
    try {
      const fn = httpsCallable(functions, "adminRemoveUser");
      await fn({ uid });
      alert("User removed.");
    } catch (e:any) {
      setError(e?.message ?? "Failed");
    }
  }

  return (
    <div>
      <h1>Admin panel</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <h2>Users</h2>
      {users.map((u)=>(
        <div key={u.uid} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <b>{u.name}</b> — {u.uid}
          <button style={{ marginLeft: 12, color: "crimson" }} onClick={()=>removeUser(u.uid)}>Remove user</button>
        </div>
      ))}

      <hr />
      <h2>Admins</h2>
      {admins.map((a:any)=>(
        <div key={a.uid} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <b>{a.email}</b> — {a.uid}
        </div>
      ))}

      <hr />
      <h2>Moderate posts</h2>
      {posts.map((p)=>(
        <div key={p.id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <b>{p.authorName}</b>: {p.text}
          <button style={{ marginLeft: 12, color: "crimson" }} onClick={()=>removePost(p.id)}>Delete post</button>
        </div>
      ))}
    </div>
  );
}

