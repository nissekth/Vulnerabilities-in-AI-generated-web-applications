import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>
        If you are new, you can register. If you already have an account, log in.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
        <Link href="/search">Search users</Link>
      </div>
      <hr />
      <p>
        You can browse public parts of profiles. To add friends, post, comment, like, or message,
        you must log in.
      </p>
    </div>
  );
}

