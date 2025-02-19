'use client';

// src/components/LoginForm.tsx
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            const res = await signIn('credentials', {
                username: formData.get('username'),
                password: formData.get('password'),
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Failed to login');
        }
    };

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold">Game Backlog Manager</h1>
                <p className="mt-2">Sign in to manage your games</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        className="w-full rounded-md border p-2"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="w-full rounded-md border p-2"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                    type="submit"
                    className="w-full rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                    Sign In
                </button>
            </form>

            <div className="mt-6 pt-4 border-t text-center">
                <div className="text-sm text-gray-500">
                    Available test accounts:
                </div>
                <div className="mt-2 text-sm space-y-1 text-gray-400">
                    <div>admin / admin123</div>
                    <div>demo / demo123</div>
                    <div>test / test123</div>
                </div>
            </div>
        </div>
    );
}