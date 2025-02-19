// src/types/game.ts
import { ObjectId } from 'mongodb';

export type GameStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Game {
    _id?: ObjectId;
    username: string;
    title: string;
    hours: number;
    genre: string;
    status: GameStatus;
    priority: number;
    playScore?: number;
    createdAt?: Date;
}

export interface GameFormData {
    username: string;
    gameTitle: string;
    hoursToComplete: string | number;
    genre: string;
    status: GameStatus;
    priority: string | number;
}