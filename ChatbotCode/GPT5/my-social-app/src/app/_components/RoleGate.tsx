"use client";

import { useEffect, useState } from "react";
import { AuthGate } from "./AuthGate";
import { getClaims } from "@/lib/roles";

export function RoleGate({ role, children }: { role: "admin"|"owner"; children: React.ReactNode }) {
  return (
    <AuthGate>
      {()=> <Inner role={role}>{children}</Inner>}
    </AuthGate>
  );
}

function Inner({ role, children }: { role: "admin"|"owner"; children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(()=>{
    (async ()=>{
      const claims = await getClaims();
      setOk(role === "owner" ? claims.owner : claims.admin || claims.owner);
    })();
  }, [role]);

  if (ok === null) return <p>Checking permissions…</p>;
  if (!ok) return <p>Access denied.</p>;
  return <>{children}</>;
}

