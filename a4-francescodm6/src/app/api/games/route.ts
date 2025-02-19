// src/app/api/games/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { calculatePlayScore } from '@/app/utils/game-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import clientPromise from '@/app/utils/mongodb';
import { Game, GameFormData } from '@/app/types/game';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.name) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const username = searchParams.get('user');

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("cs4241");
        const games = await db.collection<Game>('games')
            .find({ username })
            .toArray();

        return NextResponse.json(games);
    } catch (error: unknown) {
        console.error('Failed to fetch games:', error);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json() as GameFormData;

        const game: Game = {
            username: body.username,
            title: body.gameTitle,
            hours: Number(body.hoursToComplete),
            genre: body.genre,
            status: body.status,
            priority: Number(body.priority),
            createdAt: new Date()
        };

        game.playScore = calculatePlayScore(game);

        const client = await clientPromise;
        const db = client.db("cs4241");
        const result = await db.collection<Game>('games').insertOne(game);

        return NextResponse.json({ ...game, _id: result.insertedId }, { status: 201 });
    } catch (error: unknown) {
        console.error('Failed to create game:', error);
        return NextResponse.json({ error: "Failed to create game" }, { status: 400 });
    }
}