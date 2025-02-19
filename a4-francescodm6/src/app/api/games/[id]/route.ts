// src/app/api/games/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { calculatePlayScore } from '@/app/utils/game-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/authOptions';
import clientPromise from '@/app/utils/mongodb';
import { Game, GameFormData } from '@/app/types/game';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        const objectId = new ObjectId(id);
        const body = await request.json() as GameFormData;

        const client = await clientPromise;
        const db = client.db("cs4241");

        // Check if game belongs to user
        const existing = await db.collection('games').findOne<Game>({
            _id: objectId,
            username: body.username
        });

        if (!existing) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        const game: Omit<Game, '_id'> = {
            username: body.username,
            title: body.gameTitle,
            hours: Number(body.hoursToComplete),
            genre: body.genre,
            status: body.status,
            priority: Number(body.priority)
        };

        game.playScore = calculatePlayScore(game);

        await db.collection('games').updateOne(
            { _id: objectId, username: body.username },
            { $set: game }
        );

        return NextResponse.json({ ...game, _id: objectId.toString() });
    } catch (error: unknown) {
        console.error('Failed to update game:', error);
        return NextResponse.json({ error: "Failed to update game" }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.username) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;

        const objectId = new ObjectId(id);
        const username = request.nextUrl.searchParams.get('user');

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("cs4241");

        const result = await db.collection('games').deleteOne({
            _id: objectId,
            username
        });
//diff
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error: unknown) {
        console.error('Failed to delete game:', error);
        return NextResponse.json({ error: "Failed to delete game" }, { status: 400 });
    }
}