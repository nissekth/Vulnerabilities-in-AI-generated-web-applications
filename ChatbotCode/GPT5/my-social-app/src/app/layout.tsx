import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Firebase Social App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        <header style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
          <Link href="/">Home</Link>
          <Link href="/search">Search</Link>
          <Link href="/feed">Feed</Link>
          <Link href="/friends">Friends</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/admin/login">Admin</Link>
          <Link href="/owner">Owner</Link>
        </header>
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}

