import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { exercises } from './exercises.js';

dotenv.config();

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    url: String
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

const resetExercises = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Clear existing exercises
        await Exercise.deleteMany({});
        console.log('🗑️ Cleared existing exercises');

        // Insert verified exercises
        await Exercise.insertMany(exercises);
        console.log(`✅ Inserted ${exercises.length} verified exercises`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting exercises:', error);
        process.exit(1);
    }
};

resetExercises();
