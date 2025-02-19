'use client';

// src/components/Header.tsx
import { signOut } from 'next-auth/react';

interface HeaderProps {
    username: string;
}

export default function Header({ username }: HeaderProps) {
    return (
        <header className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Game Backlog Manager</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {username}!</span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="action-button logout-button"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}