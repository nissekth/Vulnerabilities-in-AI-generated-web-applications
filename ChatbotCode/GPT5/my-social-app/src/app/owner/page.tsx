"use client";

import { RoleGate } from "@/app/_components/RoleGate";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";

export default function OwnerPage() {
  return (
    <RoleGate role="owner">
      <OwnerInner />
    </RoleGate>
  );
}

function OwnerInner() {
  const [stats, setStats] = useState<any>(null);
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    (async ()=>{
      const fn = httpsCallable(functions, "getOwnerStats");
      const res: any = await fn({});
      setStats(res.data);
    })();
  }, []);

  async function refreshClaimsHint() {
    setMsg("If you just changed admin/owner permissions, sign out and sign in again to refresh claims.");
  }

  return (
    <div>
      <h1>Owner dashboard</h1>

      {stats ? (
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <p>Registered users: <b>{stats.userCount}</b></p>
          <p>Total posts: <b>{stats.postCount}</b></p>
          <p>Total comments: <b>{stats.commentCount}</b></p>
        </div>
      ) : <p>Loading stats…</p>}

      <hr />

      <h2>Owner safety (“never lose access”)</h2>
      <ol>
        <li>Your owner account is protected by an <b>owner custom claim</b> that only a current owner can assign.</li>
        <li>We also provide a <b>break-glass script</b> (below) using the Admin SDK that can restore owner access if you change email or lose password.</li>
      </ol>

      <button onClick={refreshClaimsHint}>Help: permissions not updating</button>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}

