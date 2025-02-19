// src/app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
// import GameForm from "@/app/components/GameForm";
import GameList from "@/app/components/GameList";
import Footer from "@/app/components/Footer";

export default async function Home() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="page-container flex flex-col min-h-screen">
            <Header username={session.user?.name || ''} />

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 flex-grow w-full">
                {/*<section className="shadcn-card">*/}
                {/*    <h2 className="text-xl font-semibold mb-6">Add New Game</h2>*/}
                {/*    <GameForm />*/}
                {/*</section>*/}

                {/*<section className="shadcn-card">*/}
                {/*<h2 className="text-xl font-semibold mb-6">Your Game Backlog</h2>*/}
                <GameList />
                {/*</section>*/}
            </main>

            <Footer />
        </div>
    );
}