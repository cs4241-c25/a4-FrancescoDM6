import React from 'react';

const Login = () => {
    const handleLogin = () => {
        // Redirect to the GitHub authentication route on the server
        window.location.href = '/auth/github';
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold">Game Backlog Manager</h1>
                    <p className="text-muted mt-2">Sign in to manage your games</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md">
                    <button
                        onClick={handleLogin}
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                    >
                        Login with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
