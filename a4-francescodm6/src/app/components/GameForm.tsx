'use client';

// src/components/GameForm.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Game, GameFormData, GameStatus } from '@/app/types/game';

interface GameFormProps {
    onGameAdded?: () => void;
    gameToEdit?: Game;
    onGameUpdated?: () => void;
}

export default function GameForm({ onGameAdded, gameToEdit, onGameUpdated }: GameFormProps) {
    const { data: session } = useSession();
    const [priority, setPriority] = useState('3');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set initial priority when editing
    useEffect(() => {
        if (gameToEdit) {
            setPriority(gameToEdit.priority.toString());
        }
    }, [gameToEdit]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session?.user?.username) {
            console.log('No username in session:', session);
            return;
        }

        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        const status = formData.get('status');
        if (!status || typeof status !== 'string' || !['Not Started', 'In Progress', 'Completed'].includes(status)) {
            alert('Invalid status');
            setIsSubmitting(false);
            return;
        }

        const gameData: GameFormData = {
            username: session.user.username,
            gameTitle: formData.get('gameTitle') as string,
            hoursToComplete: formData.get('hoursToComplete') as string,
            genre: formData.get('genre') as string,
            status: status as GameStatus,
            priority: formData.get('priority') as string,
        };
        console.log('Submitting game data:', gameData);


        try {
            if (gameToEdit && !gameToEdit._id) {
                throw new Error('Game ID is missing');
            }

            const url = gameToEdit
                ? `/api/games/${gameToEdit._id?.toString()}`
                : '/api/games';

            const method = gameToEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData),
            });

            if (!response.ok) {
                throw new Error('Failed to save game');
            }

            if (gameToEdit) {
                onGameUpdated?.();
            } else {
                form.reset();
                setPriority('3');
                onGameAdded?.();
            }
        } catch (error) {
            console.error('Error saving game:', error);
            alert('Failed to save game. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="gameTitle" className="text-sm font-medium">
                        Game Title
                    </label>
                    <input
                        type="text"
                        id="gameTitle"
                        name="gameTitle"
                        defaultValue={gameToEdit?.title}
                        placeholder="Name of the game..."
                        required
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="hoursToComplete" className="text-sm font-medium">
                        Estimated Hours
                    </label>
                    <input
                        type="number"
                        id="hoursToComplete"
                        name="hoursToComplete"
                        defaultValue={gameToEdit?.hours}
                        min="1"
                        max="1000"
                        placeholder="How long to beat..."
                        required
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="genre" className="text-sm font-medium">Genre</label>
                    <select
                        id="genre"
                        name="genre"
                        defaultValue={gameToEdit?.genre}
                        required
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="">Select genre</option>
                        <option value="Action">Action</option>
                        <option value="RPG">RPG</option>
                        <option value="Strategy">Strategy</option>
                        <option value="Adventure">Adventure</option>
                        <option value="FPS">FPS</option>
                        <option value="Sports">Sports</option>
                        <option value="Simulation">Simulation</option>
                        <option value="Racing">Racing</option>
                        <option value="Puzzle">Puzzle</option>
                        <option value="Platformer">Platformer</option>
                        <option value="Fighting">Fighting</option>
                        <option value="Horror">Horror</option>
                        <option value="Visual Novel">Visual Novel</option>
                        <option value="MMO">MMO</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">
                        Current Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={gameToEdit?.status}
                        required
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="">Select status</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="col-span-2 space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                        Priority (1-5)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            id="priority"
                            name="priority"
                            min="1"
                            max="5"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="flex h-2 w-full rounded-lg bg-secondary"
                        />
                        <span className="text-sm font-medium w-8 text-center">
                            {priority}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="shadcn-button shadcn-button-primary"
                >
                    {isSubmitting
                        ? 'Saving...'
                        : gameToEdit
                            ? 'Update Game'
                            : 'Add Game'
                    }
                </button>
            </div>
        </form>
    );
}