"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div>
      <h1>Login</h1>
      <label>Email<br/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      </label><br/><br/>
      <label>Password<br/>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </label><br/><br/>

      <label>
        <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
        {" "}Remember me
      </label>

      <br/><br/>
      <button
        onClick={async ()=>{
          setError("");
          try {
            await login(email, password, remember);
            router.push("/feed");
          } catch (e:any) {
            setError(e?.message ?? "Login failed");
          }
        }}
      >
        Sign in
      </button>

      <p><a href="/forgot-password">Forgot password?</a></p>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}

