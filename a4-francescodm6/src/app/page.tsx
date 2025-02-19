// src/app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1>Welcome to Game Backlog Manager</h1>
        <p>Logged in as: {session.user?.name}</p>
      </main>
  );
}