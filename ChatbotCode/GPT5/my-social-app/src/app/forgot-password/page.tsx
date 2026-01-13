"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <h1>Reset password</h1>
      <label>Email<br/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      </label><br/><br/>

      <button
        onClick={async ()=>{
          setError(""); setMsg("");
          try {
            await forgotPassword(email);
            setMsg("Password reset email sent.");
          } catch (e:any) {
            setError(e?.message ?? "Failed");
          }
        }}
      >
        Send reset email
      </button>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}

