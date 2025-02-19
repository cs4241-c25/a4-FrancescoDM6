// src/utils/game-utils.ts
export const calculatePlayScore = (game: {
    status: string;
    hours: number;
    priority: number;
}) => {
    const statusWeights = {
        "In Progress": 1.3,
        "Not Started": 1.0,
        "Completed": 0.7,
    };
    const hoursModifier = Math.log2(100 / (game.hours + 10)) * 5;
    const priorityScore = game.priority * 15;
    return Math.round(priorityScore * statusWeights[game.status as keyof typeof statusWeights] + hoursModifier);
};