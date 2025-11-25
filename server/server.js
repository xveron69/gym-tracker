import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    // We don't exit here to allow the server to start and serve static files,
    // but API calls will fail.
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// Schemas
const UserSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true }, // Custom ID from frontend
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    plans: { type: Array, default: [] }, // Flexible array for plans
    history: { type: Array, default: [] } // Flexible array for history
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// --- API Routes ---

// Register User
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({
            id: Date.now().toString(),
            username,
            password, // In a real app, hash this!
            plans: [],
            history: []
        });

        await newUser.save();
        res.json({ success: true, user: { id: newUser.id, username: newUser.username } });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            const { password, _id, __v, ...safeUser } = user.toObject();
            res.json({ success: true, user: safeUser });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User Data
app.get('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ id });
        if (user) {
            const { password, _id, __v, ...safeUser } = user.toObject();
            res.json(safeUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add Plan
app.post('/api/user/:id/plans/add', async (req, res) => {
    const { id } = req.params;
    const newPlan = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { id },
            { $push: { plans: newPlan } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password, _id, __v, ...safeUser } = user.toObject();
        res.json({ success: true, user: safeUser });
    } catch (error) {
        console.error('Add Plan Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Plan
app.put('/api/user/:id/plans/:planId', async (req, res) => {
    const { id, planId } = req.params;
    const updatedPlan = req.body;

    try {
        // We use $set with array filter to update specific item in array
        // Note: This requires MongoDB 3.6+
        const user = await User.findOneAndUpdate(
            { id, "plans.id": planId },
            { $set: { "plans.$": updatedPlan } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User or Plan not found' });

        const { password, _id, __v, ...safeUser } = user.toObject();
        res.json({ success: true, user: safeUser });
    } catch (error) {
        console.error('Update Plan Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Plan
app.delete('/api/user/:id/plans/:planId', async (req, res) => {
    const { id, planId } = req.params;

    try {
        const user = await User.findOneAndUpdate(
            { id },
            { $pull: { plans: { id: planId } } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password, _id, __v, ...safeUser } = user.toObject();
        res.json({ success: true, user: safeUser });
    } catch (error) {
        console.error('Delete Plan Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add History Item
app.post('/api/user/:id/history/add', async (req, res) => {
    const { id } = req.params;
    const newHistoryItem = req.body;
    console.log(`[HISTORY] Adding history for user ${id}`, newHistoryItem);

    try {
        const user = await User.findOneAndUpdate(
            { id },
            { $push: { history: newHistoryItem } },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        console.log(`[HISTORY] History saved for user ${id}`);
        const { password, _id, __v, ...safeUser } = user.toObject();
        res.json({ success: true, user: safeUser });
    } catch (error) {
        console.error(`[HISTORY] Error saving history:`, error);
        res.status(500).json({ error: 'Server error' });
    }
});

console.log(`🚀 SERVER STARTED on http://localhost:${PORT}`);
console.log('----------------------------------------');
});
