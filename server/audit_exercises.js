import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    url: String
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

const auditExercises = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const exercises = await Exercise.find().sort({ name: 1 });

        console.log('\n--- Current Exercises in DB ---');
        exercises.forEach(ex => {
            console.log(`[${ex.category}] ${ex.name}: ${ex.url}`);
        });
        console.log('-------------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error auditing exercises:', error);
        process.exit(1);
    }
};

auditExercises();
