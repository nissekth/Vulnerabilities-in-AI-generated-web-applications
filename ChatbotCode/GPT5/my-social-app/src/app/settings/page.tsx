"use client";

import { AuthGate } from "@/app/_components/AuthGate";
import { auth, db, functions, storage } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { logout } from "@/lib/auth";

export default function SettingsPage() {
  return (
    <AuthGate>
      {(u)=> <SettingsInner uid={u.uid} />}
    </AuthGate>
  );
}

function SettingsInner({ uid }: { uid: string }) {
  const [profile, setProfile] = useState<any>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [bannerKey, setBannerKey] = useState("default");
  const [themeKey, setThemeKey] = useState("light");

  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [refOptOut, setRefOptOut] = useState(false);
  const [refPoints, setRefPoints] = useState(0);

  const [file, setFile] = useState<File|null>(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(()=>{
    (async ()=>{
      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.data();
      setProfile(data);
      setName(data?.name ?? "");
      setAge(data?.age?.toString?.() ?? "");
      setCity(data?.city ?? "");
      setCountry(data?.country ?? "");
      setAboutMe(data?.aboutMe ?? "");
      setBannerKey(data?.bannerKey ?? "default");
      setThemeKey(data?.themeKey ?? "light");
      setRefOptOut(Boolean(data?.referralOptOut));
      setRefPoints(Number(data?.referralPoints ?? 0));

      const bill = await getDoc(doc(db, "billing", uid));
      const b = bill.data() || {};
      setBillingName(b.name || "");
      setBillingAddress(b.address || "");
    })();
  }, [uid]);

  async function saveProfile() {
    setError(""); setMsg("");
    try {
      await updateDoc(doc(db, "users", uid), {
        name,
        age: age ? Number(age) : null,
        city,
        country,
        aboutMe,
        bannerKey,
        themeKey,
        displayNameLower: (name || "").toLowerCase(),
        updatedAt: serverTimestamp(),
        referralOptOut: refOptOut,
      });
      setMsg("Saved.");
    } catch (e:any) {
      setError(e?.message ?? "Failed to save");
    }
  }

  async function uploadProfilePic() {
    if (!file) return;
    setError(""); setMsg("");
    try {
      const path = `users/${uid}/profile/${crypto.randomUUID()}_${file.name}`;
      await uploadBytes(ref(storage, path), file);
      await updateDoc(doc(db, "users", uid), { profilePhotoPath: path, updatedAt: serverTimestamp() });
      setMsg("Profile picture updated.");
      setFile(null);
    } catch (e:any) {
      setError(e?.message ?? "Upload failed");
    }
  }

  async function saveBilling() {
    setError(""); setMsg("");
    try {
      await setDoc(doc(db, "billing", uid), {
        name: billingName,
        address: billingAddress,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setMsg("Billing updated.");
    } catch (e:any) {
      setError(e?.message ?? "Billing save failed");
    }
  }

  async function exportMyData() {
    setError(""); setMsg("");
    try {
      const fn = httpsCallable(functions, "exportUserData");
      const res: any = await fn({});
      setMsg(`Export created. Download URL: ${res.data.url}`);
    } catch (e:any) {
      setError(e?.message ?? "Export failed");
    }
  }

  async function deleteAccount() {
    if (!confirm("This will delete your account and data. Continue?")) return;
    setError(""); setMsg("");
    try {
      const fn = httpsCallable(functions, "deleteUserAccount");
      await fn({});
      setMsg("Account deletion requested. You will be signed out.");
      await logout();
      window.location.href = "/";
    } catch (e:any) {
      setError(e?.message ?? "Delete failed");
    }
  }

  async function createReferral() {
    setError(""); setMsg("");
    try {
      const fn = httpsCallable(functions, "createReferralCode");
      const res: any = await fn({});
      setMsg(`Referral code created: ${res.data.code}`);
    } catch (e:any) {
      setError(e?.message ?? "Referral create failed");
    }
  }

  async function optOutAndClearPoints() {
    setError(""); setMsg("");
    try {
      await updateDoc(doc(db, "users", uid), {
        referralOptOut: true,
        referralPoints: 0,
        updatedAt: serverTimestamp(),
      });
      setRefOptOut(true);
      setRefPoints(0);
      setMsg("You opted out and cleared points.");
    } catch (e:any) {
      setError(e?.message ?? "Failed");
    }
  }

  return (
    <div>
      <h1>Settings</h1>

      <h2>Profile</h2>
      <label>Displayed name<br/>
        <input value={name} onChange={(e)=>setName(e.target.value)} />
      </label><br/><br/>

      <label>Age<br/>
        <input value={age} onChange={(e)=>setAge(e.target.value)} />
      </label><br/><br/>

      <label>City<br/>
        <input value={city} onChange={(e)=>setCity(e.target.value)} />
      </label><br/><br/>

      <label>Country<br/>
        <input value={country} onChange={(e)=>setCountry(e.target.value)} />
      </label><br/><br/>

      <label>About me (public)<br/>
        <textarea value={aboutMe} onChange={(e)=>setAboutMe(e.target.value)} rows={3} style={{ width: "100%" }} />
      </label><br/><br/>

      <label>Banner<br/>
        <select value={bannerKey} onChange={(e)=>setBannerKey(e.target.value)}>
          <option value="default">Default</option>
          <option value="mountains">Mountains</option>
          <option value="ocean">Ocean</option>
          <option value="city">City</option>
        </select>
      </label><br/><br/>

      <label>Theme<br/>
        <select value={themeKey} onChange={(e)=>setThemeKey(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="blue">Blue</option>
        </select>
      </label><br/><br/>

      <button onClick={saveProfile}>Save profile</button>

      <h3>Profile picture</h3>
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button onClick={uploadProfilePic}>Upload</button>

      <hr />

      <h2>Billing</h2>
      <p style={{ color: "#666" }}>
        Payments are handled by another company; here we store and edit your billing info.
      </p>
      <label>Name<br/>
        <input value={billingName} onChange={(e)=>setBillingName(e.target.value)} />
      </label><br/><br/>
      <label>Address<br/>
        <textarea value={billingAddress} onChange={(e)=>setBillingAddress(e.target.value)} rows={3} style={{ width: "100%" }} />
      </label><br/><br/>
      <button onClick={saveBilling}>Save billing</button>

      <hr />

      <h2>Referral program</h2>
      <p>Points: <b>{refPoints}</b></p>
      <label>
        <input type="checkbox" checked={refOptOut} onChange={(e)=>setRefOptOut(e.target.checked)} />
        {" "}Opt out (no new invites)
      </label>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={createReferral}>Create invite code</button>
        <button onClick={optOutAndClearPoints}>Opt out and clear points</button>
      </div>

      <hr />

      <h2>Data</h2>
      <button onClick={exportMyData}>Download a copy of my data</button>

      <hr />

      <h2>Account</h2>
      <button onClick={deleteAccount} style={{ color: "crimson" }}>Delete my account</button>
      <div style={{ marginTop: 12 }}>
        <button onClick={async ()=>{ await logout(); window.location.href="/"; }}>Sign out</button>
      </div>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}

