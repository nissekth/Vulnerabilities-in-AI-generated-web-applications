"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div>
      <h1>Admin login</h1>
      <p style={{ color: "#666" }}>Admins must have the admin claim to access the admin panel.</p>

      <label>Email<br/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      </label><br/><br/>
      <label>Password<br/>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </label><br/><br/>
      <label>
        <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
        {" "}Remember me
      </label><br/><br/>

      <button onClick={async ()=>{
        setError("");
        try {
          await login(email, password, remember);
          router.push("/admin");
        } catch (e:any) {
          setError(e?.message ?? "Failed");
        }
      }}>
        Sign in as admin
      </button>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}

