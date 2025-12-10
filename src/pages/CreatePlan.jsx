import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ExerciseSelector } from '../components/ExerciseSelector';
import { Card } from '../components/ui/Card';
import { Plus, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const CreatePlan = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [planName, setPlanName] = useState('');
    const [exercises, setExercises] = useState([{ name: '', sets: 3, reps: 10 }]);

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: 3, reps: 10 }]);
    };

    const removeExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const updateExercise = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const savePlan = async () => {
        if (!planName || exercises.some(e => !e.name)) return;

        const newPlan = {
            id: Date.now().toString(),
            name: planName,
            exercises
        };

        // Save to backend using new endpoint
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            await fetch(`${apiUrl}/api/user/${user.id}/plans/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlan)
            });

            // Refresh user data to update context
            await refreshUser();

            navigate('/');
        } catch (error) {
            console.error('Failed to save plan', error);
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header>
                <h1 className="text-2xl font-bold">Nowy Plan</h1>
                <p className="text-gray-400">Stwórz swoją rutynę treningową</p>
            </header>

            <Input
                label="Nazwa Planu"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="np. FBW A, Push, Pull"
            />

            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Ćwiczenia</h2>
                {exercises.map((exercise, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="relative pt-8">
                            <button
                                onClick={() => removeExercise(index)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-2"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex flex-col gap-3">
                                <ExerciseSelector
                                    placeholder="Nazwa ćwiczenia"
                                    value={exercise.name}
                                    onChange={(value) => updateExercise(index, 'name', value)}
                                />
                                <div className="flex gap-4">
                                    <Input
                                        label="Serie"
                                        type="number"
                                        value={exercise.sets}
                                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                                    />
                                    <Input
                                        label="Powtórzenia"
                                        type="number"
                                        value={exercise.reps}
                                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                <Button variant="secondary" onClick={addExercise} className="w-full border-dashed border-2">
                    <Plus size={20} /> Dodaj ćwiczenie
                </Button>
            </div>

            <Button onClick={savePlan} className="fixed bottom-24 left-6 right-6 max-w-md mx-auto shadow-2xl z-40">
                <Save size={20} /> Zapisz Plan
            </Button>
        </div>
    );
};
