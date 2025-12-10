import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: String,
    url: String
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

const verifyExercises = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const total = await Exercise.countDocuments();
        console.log(`Total exercises: ${total}`);

        const byCategory = await Exercise.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        console.log('Exercises by category:');
        byCategory.forEach(cat => {
            console.log(`- ${cat._id}: ${cat.count}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error verifying exercises:', error);
        process.exit(1);
    }
};

verifyExercises();
