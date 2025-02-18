// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URI (ensure your credentials here are valid for testing)
const uri = process.env.MONGODB_URI || "your_default_mongodb_uri_here";
const client = new MongoClient(uri);
let db;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// We can still use sessions if needed, though for now it's not strictly necessary.
app.use(session({
    secret: 'your_secret_here',
    resave: false,
    saveUninitialized: false
}));

// For now, skip Passport initialization and auth routes.

// Dummy authentication middleware for testing
function ensureAuthenticated(req, res, next) {
    // Bypass auth by always setting a default user.
    req.user = { username: 'test' };
    next();
}

// Connect to MongoDB and start the server
async function connectDB() {
    try {
        await client.connect();
        db = client.db("cs4241");
        console.log("Connected to MongoDB!");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
}

connectDB();

// Example game API endpoints (using the dummy auth middleware)
app.get('/games', ensureAuthenticated, async (req, res) => {
    try {
        const username = req.user.username;
        const games = await db.collection('games').find({ username }).toArray();
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

app.post('/games', ensureAuthenticated, async (req, res) => {
    try {
        const game = {
            username: req.user.username, // will be 'test'
            title: req.body.gameTitle,
            hours: parseInt(req.body.hoursToComplete),
            genre: req.body.genre,
            status: req.body.status,
            priority: parseInt(req.body.priority),
            createdAt: new Date()
        };

        game.playScore = calculatePlayScore(game);
        const result = await db.collection('games').insertOne(game);
        game._id = result.insertedId;
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ error: "Failed to create game" });
    }
});

app.put('/games/:id', ensureAuthenticated, async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const username = req.user.username;
        const existing = await db.collection('games').findOne({ _id: id, username });
        if (!existing) {
            return res.status(404).json({ error: "Game not found" });
        }

        const game = {
            username,
            title: req.body.gameTitle,
            hours: parseInt(req.body.hoursToComplete),
            genre: req.body.genre,
            status: req.body.status,
            priority: parseInt(req.body.priority)
        };

        game.playScore = calculatePlayScore(game);
        await db.collection('games').updateOne({ _id: id, username }, { $set: game });
        res.json({ ...game, _id: id });
    } catch (error) {
        res.status(400).json({ error: "Failed to update game" });
    }
});

app.delete('/games/:id', ensureAuthenticated, async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const username = req.user.username;
        const result = await db.collection('games').deleteOne({ _id: id, username });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Game not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: "Failed to delete game" });
    }
});

// Original playScore function from A3
const calculatePlayScore = (game) => {
    const statusWeights = {
        "In Progress": 1.3,
        "Not Started": 1.0,
        "Completed": 0.7,
    };
    const hoursModifier = Math.log2(100 / (game.hours + 10)) * 5;
    const priorityScore = game.priority * 15;
    return Math.round(priorityScore * statusWeights[game.status] + hoursModifier);
};
