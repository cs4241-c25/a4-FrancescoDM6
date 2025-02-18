// client/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('title');
    const [formData, setFormData] = useState({
        gameId: '',
        gameTitle: '',
        hoursToComplete: '',
        genre: '',
        status: '',
        priority: 3,
    });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch games from the backend
    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/games`);
            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error(error);
            alert('Error fetching games: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    // Input change handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriorityChange = (e) => {
        setFormData((prev) => ({ ...prev, priority: parseInt(e.target.value) }));
    };

    // Handle form submission for add/update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { gameId, gameTitle, hoursToComplete, genre, status, priority } = formData;
        if (!gameTitle || !hoursToComplete || !genre || !status) {
            alert('Please fill in all fields.');
            return;
        }
        const method = gameId ? 'PUT' : 'POST';
        const url = gameId ? `/games/${gameId}` : '/games';
        const payload = {
            gameTitle,
            hoursToComplete: parseInt(hoursToComplete),
            genre,
            status,
            priority,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save game');
            }
            await fetchGames();
            // Reset form and editing state
            setFormData({
                gameId: '',
                gameTitle: '',
                hoursToComplete: '',
                genre: '',
                status: '',
                priority: 3,
            });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // Prefill form for editing
    const handleEdit = (game) => {
        setFormData({
            gameId: game._id,
            gameTitle: game.title,
            hoursToComplete: game.hours,
            genre: game.genre,
            status: game.status,
            priority: game.priority,
        });
        setIsEditing(true);
    };

    // Delete game
    const handleDelete = async (gameId) => {
        if (!window.confirm('Are you sure you want to delete this game?')) return;
        try {
            const response = await fetch(`/games/${gameId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete game');
            await fetchGames();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // Sort change handler
    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    // Sorting games (same as A3 logic)
    const sortedGames = [...games].sort((a, b) => {
        if (sortCriteria === 'playScore') return b.playScore - a.playScore;
        if (sortCriteria === 'priority') return b.priority - a.priority;
        if (sortCriteria === 'hours') return a.hours - b.hours;
        return a.title.localeCompare(b.title);
    });

    return (
        <div className="page-container">
            {/* Header similar to A3 index.html */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Game Backlog Manager</h1>
                    <div className="flex items-center gap-4">
                        <span id="userDisplay">Welcome, test!</span>
                        <button
                            id="logoutBtn"
                            className="action-button logout-button"
                            onClick={() => {
                                // Implement logout if needed later
                                alert('Logout clicked');
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Game form section */}
                <section className="shadcn-card">
                    <h2 className="text-xl font-semibold mb-6">Add New Game</h2>
                    <form id="gameForm" className="space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="gameId" value={formData.gameId} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="gameTitle" className="text-sm font-medium">Game Title</label>
                                <input
                                    type="text"
                                    id="gameTitle"
                                    name="gameTitle"
                                    placeholder="Name of the game..."
                                    required
                                    value={formData.gameTitle}
                                    onChange={handleInputChange}
                                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="hoursToComplete" className="text-sm font-medium">Estimated Hours</label>
                                <input
                                    type="number"
                                    id="hoursToComplete"
                                    name="hoursToComplete"
                                    min="1"
                                    max="1000"
                                    placeholder="How long to beat..."
                                    required
                                    value={formData.hoursToComplete}
                                    onChange={handleInputChange}
                                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="genre" className="text-sm font-medium">Genre</label>
                                <select
                                    id="genre"
                                    name="genre"
                                    required
                                    value={formData.genre}
                                    onChange={handleInputChange}
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
                                <label htmlFor="status" className="text-sm font-medium">Current Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    required
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">Select status</option>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label htmlFor="priority" className="text-sm font-medium">Priority (1-5)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        id="priority"
                                        name="priority"
                                        min="1"
                                        max="5"
                                        value={formData.priority}
                                        onChange={handlePriorityChange}
                                        className="flex h-2 w-full rounded-lg bg-secondary"
                                    />
                                    <span id="priorityValue" className="text-sm font-medium w-8 text-center">{formData.priority}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="shadcn-button shadcn-button-primary" id="submitBtn">
                                {isEditing ? 'Update Game' : 'Add Game'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Game list section */}
                <section className="shadcn-card">
                    <h2 className="text-xl font-semibold mb-6">Your Game Backlog</h2>
                    <div className="flex items-center gap-4 mb-6">
                        <label className="text-sm font-medium">Sort By:</label>
                        <select
                            id="sortBy"
                            value={sortCriteria}
                            onChange={handleSortChange}
                            className="flex h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="title">Title</option>
                            <option value="playScore">Play Score</option>
                            <option value="priority">Priority</option>
                            <option value="hours">Estimated Hours</option>
                        </select>
                        <button id="sort-btn" onClick={() => setGames([...sortedGames])} className="shadcn-button bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            Sort List
                        </button>
                    </div>
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
                                <th scope="col" style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody id="gameList">
                            {sortedGames.map((game) => (
                                <tr key={game._id}>
                                    <td>{game.title}</td>
                                    <td>{game.hours}</td>
                                    <td>{game.genre}</td>
                                    <td>{game.status}</td>
                                    <td>{game.priority}</td>
                                    <td>{game.playScore}</td>
                                    <td className="text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button className="action-button edit-button" onClick={() => handleEdit(game)}>
                                                Edit
                                            </button>
                                            <button className="action-button delete-button" onClick={() => handleDelete(game._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Footer similar to A3 index.html */}
            <footer className="mt-auto border-t border-border">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center">
                    <p className="text-lg font-semibold opacity-0 transition-opacity duration-500 delay-100">
                        Play Score = (Priority × 15 × Status weight) + Time to beat
                    </p>
                    <script>
                        {`
              document.addEventListener("DOMContentLoaded", function() {
                document.querySelector("p").classList.remove("opacity-0");
              });
            `}
                    </script>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
