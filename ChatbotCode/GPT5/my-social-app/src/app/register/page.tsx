"use client";

import { useState } from "react";
import { register } from "@/lib/auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refCode, setRefCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div>
      <h1>Register</h1>

      <label>Display name<br/>
        <input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} />
      </label><br/><br/>

      <label>Email<br/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      </label><br/><br/>

      <label>Password<br/>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </label><br/><br/>

      <label>Referral code (optional)<br/>
        <input value={refCode} onChange={(e)=>setRefCode(e.target.value)} />
      </label><br/><br/>

      <button
        onClick={async ()=>{
          setError("");
          try {
            await register(email, password, displayName);

            if (refCode.trim()) {
              // securely redeem referral via Cloud Function
              const redeem = httpsCallable(functions, "redeemReferralCode");
              await redeem({ code: refCode.trim() });
            }

            router.push("/feed");
          } catch (e:any) {
            setError(e?.message ?? "Registration failed");
          }
        }}
      >
        Create account
      </button>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}

