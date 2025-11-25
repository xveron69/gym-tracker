import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const EditPlan = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { planId } = useParams();

    const [planName, setPlanName] = useState('');
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.plans) {
            const plan = user.plans.find(p => p.id === planId);
            if (plan) {
                setPlanName(plan.name);
                setExercises(plan.exercises);
            } else {
                navigate('/plans');
            }
            setLoading(false);
        }
    }, [user, planId, navigate]);

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

        const updatedPlan = {
            id: planId,
            name: planName,
            exercises
        };

        try {
            await fetch(`/api/user/${user.id}/plans/${planId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPlan)
            });

            await refreshUser();
            navigate('/plans');
        } catch (error) {
            console.error('Failed to update plan', error);
        }
    };

    if (loading) return <div className="p-6 text-center">Ładowanie...</div>;

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate('/plans')} className="p-2 hover:bg-white/5 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Edytuj Plan</h1>
                    <p className="text-gray-400">Dostosuj swoją rutynę</p>
                </div>
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
                                <Input
                                    placeholder="Nazwa ćwiczenia"
                                    value={exercise.name}
                                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
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
                <Save size={20} /> Zapisz Zmiany
            </Button>
        </div>
    );
};
