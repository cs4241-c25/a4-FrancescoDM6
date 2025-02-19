'use client';

// src/components/GameList.tsx
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Game } from '@/app/types/game';
import GameForm from './GameForm';

export default function GameList() {
    const { data: session, status } = useSession();  // Added status
    const [games, setGames] = useState<Game[]>([]);
    const [sortBy, setSortBy] = useState('title');
    // const [isLoading, setIsLoading] = useState(true);
    // const [setIsLoading] = useState(true);

    const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

    const fetchGames = useCallback(async () => {
        if (!session?.user?.username) return;

        try {
            // setIsLoading(true);
            const response = await fetch(`/api/games?user=${encodeURIComponent(session.user.username)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }

            let fetchedGames = await response.json();
            fetchedGames = sortGames(fetchedGames, sortBy);
            setGames(fetchedGames);
        } catch (error) {
            console.error('Error fetching games:', error);
            setGames([]); // Ensure we have an empty array on error
        }
        // } finally {
        //     setIsLoading(false);
        // }
    }, [session?.user?.username, sortBy]);

    // Handle session changes
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.username) {
            fetchGames();
        } else if (status === 'unauthenticated') {
            setGames([]);
        }
    }, [status, session?.user?.username, fetchGames]);

    const handleGameAdded = useCallback(() => {
        fetchGames();
    }, [fetchGames]);

    const sortGames = (gamesArray: Game[], criteria: string) => {
        return [...gamesArray].sort((a, b) => {
            switch (criteria) {
                case 'playScore':
                    return (b.playScore || 0) - (a.playScore || 0);
                case 'priority':
                    return b.priority - a.priority;
                case 'hours':
                    return a.hours - b.hours;
                case 'title':
                default:
                    return a.title.localeCompare(b.title);
            }
        });
    };

    const handleDelete = async (game: Game) => {
        if (!session?.user?.username) {
            alert('You must be logged in to delete games');
            return;
        }

        if (!game._id) {
            alert('Cannot delete game: Invalid game ID');
            return;
        }

        if (!confirm(`Are you sure you want to delete "${game.title}"?`)) {
            return;
        }

        try {
            const response = await fetch(
                `/api/games/${game._id.toString()}?user=${encodeURIComponent(session.user.username)}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                throw new Error('Failed to delete game');
            }

            // Refresh the games list after successful deletion
            await fetchGames();
        } catch (error) {
            console.error('Error deleting game:', error);
            alert('Failed to delete game. Please try again.');
        }
    };

    // Fetch games when session changes
    useEffect(() => {
        if (session?.user?.username) {
            fetchGames();
        }
    }, [session?.user?.username, fetchGames]);


    // if (isLoading) {
    //     return <div>Loading games...</div>;
    // }

    return (
        <>
            <div className="space-y-6">
                <section className="shadcn-card">
                    <h2 className="text-xl font-semibold mb-6">Add New Game</h2>
                    <GameForm onGameAdded={handleGameAdded}/>
                </section>
                {/* Sort controls */}
                <section className="shadcn-card">
                    <h2 className="text-xl font-semibold mb-6">Your Game Backlog</h2>

                    <div className="flex items-center gap-4 mb-6">
                        <label className="text-sm font-medium">Sort By:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="title">Title</option>
                            <option value="playScore">Play score</option>
                            <option value="priority">Priority</option>
                            <option value="hours">Estimated Hours</option>
                        </select>
                        <button
                            onClick={() => setGames(sortGames(games, sortBy))}
                            className="shadcn-button bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        >
                            Sort List
                        </button>
                    </div>

                    {/* Games table */}
                    {/*<div className="min-h-[200px]">*/}
                    {/*{isLoading && (*/}
                    {/*    <div className="text-center py-4">Loading games...</div>*/}
                    {/*)}*/}

                    {/*{!isLoading && games.length === 0 && (*/}
                    {/*    <div className="text-center py-4 text-muted-foreground">*/}
                    {/*        No games in your backlog yet. Add one above!*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/*{!isLoading && games.length > 0 && (*/}
                    <div className="overflow-x-auto">
                        <table className="game-table" role="table" aria-label="Game backlog table">
                            <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Hours</th>
                                <th scope="col">Genre</th>
                                <th scope="col">Status</th>
                                <th scope="col">Priority</th>
                                <th scope="col">Play Score</th>
                                <th scope="col" style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {games.map((game) => (
                                <tr key={game._id?.toString() || `temp-${game.title}`}>
                                    <td>{game.title}</td>
                                    <td>{game.hours}</td>
                                    <td>{game.genre}</td>
                                    <td>{game.status}</td>
                                    <td>{game.priority}</td>
                                    <td>{game.playScore}</td>
                                    <td>
                                        <div className="flex justify-center items-center gap-2">
                                            <button
                                                onClick={() => setGameToEdit(game)}
                                                className="action-button edit-button"
                                                aria-label={`Edit ${game.title}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(game)}
                                                className="action-button delete-button"
                                                aria-label={`Delete ${game.title}`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/*)}*/}
                    {/*</div>*/}
                </section>
            </div>

            {/* Edit Modal */}
            {gameToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-semibold mb-4">Edit Game</h2>
                        <GameForm
                            gameToEdit={gameToEdit}
                            onGameUpdated={() => {
                                setGameToEdit(null);
                                fetchGames();
                            }}
                        />
                        <button
                            onClick={() => setGameToEdit(null)}
                            className="mt-4 text-sm text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}