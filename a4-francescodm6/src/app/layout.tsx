// src/app/layout.tsx
import type { Metadata } from "next";
import { Roboto, Quicksand } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/app/components/providers/SessionProvider";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
});

const quicksand = Quicksand({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-quicksand",
});

export const metadata: Metadata = {
    title: "Game Backlog Manager",
    description: "Manage your game backlog",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    return (
        <html lang="en" className="dark">
        <body className={`${roboto.variable} ${quicksand.variable}`}>
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
        </body>
        </html>
    );
}