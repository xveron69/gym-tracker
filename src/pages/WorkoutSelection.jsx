import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const WorkoutSelection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const startWorkout = (plan) => {
        navigate('/workout/active', { state: { plan } });
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header>
                <h1 className="text-2xl font-bold">Wybierz Trening</h1>
                <p className="text-gray-400">Jaki plan dzisiaj realizujemy?</p>
            </header>

            <div className="flex flex-col gap-4">
                {user?.plans?.length > 0 ? (
                    user.plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="flex items-center justify-between group hover:bg-surface/60 transition-colors">
                                <div>
                                    <h3 className="font-bold text-lg">{plan.name}</h3>
                                    <p className="text-sm text-gray-400">{plan.exercises.length} ćwiczeń</p>
                                </div>
                                <Button
                                    onClick={() => startWorkout(plan)}
                                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-primary shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform"
                                >
                                    <Play size={20} className="ml-1" />
                                </Button>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-10 flex flex-col items-center gap-4">
                        <p className="text-gray-400">Nie masz jeszcze żadnych planów.</p>
                        <Button onClick={() => navigate('/plans/new')}>
                            <Plus size={20} /> Stwórz pierwszy plan
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
