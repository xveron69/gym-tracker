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

const updateExercises = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        for (const exercise of exercises) {
            await Exercise.findOneAndUpdate(
                { name: exercise.name },
                { url: exercise.url },
                { upsert: true } // Create if not exists (though names should match)
            );
            console.log(`Updated URL for: ${exercise.name}`);
        }

        console.log('✅ All exercises updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating exercises:', error);
        process.exit(1);
    }
};

updateExercises();
