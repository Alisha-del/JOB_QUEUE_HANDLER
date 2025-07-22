import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Welcome to the Job Importer Admin</h1>
      <Link href="/admin">
        <button>Go to Admin Dashboard</button>
      </Link>
    </main>
  );
}
