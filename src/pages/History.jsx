import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Calendar, Clock, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

export const History = () => {
    const { user, refreshUser } = useAuth();

    // Refresh user data on mount to ensure history is up to date
    React.useEffect(() => {
        refreshUser();
    }, []);

    const history = user?.history ? [...user.history].reverse() : [];

    const calculateVolume = (exercises) => {
        return exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((setTotal, set) => {
                return setTotal + (set.completed ? (set.weight * set.reps) : 0);
            }, 0);
        }, 0);
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header>
                <h1 className="text-2xl font-bold">Historia Treningów</h1>
                <p className="text-gray-400">Twoje dotychczasowe osiągnięcia</p>
            </header>

            <div className="flex flex-col gap-4">
                {history.length > 0 ? (
                    history.map((workout, index) => (
                        <motion.div
                            key={workout.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-primary">{workout.planName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Calendar size={14} />
                                            {new Date(workout.date).toLocaleDateString()} o {new Date(workout.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            <Clock size={14} /> {workout.duration} min
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5" />

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <Dumbbell size={16} />
                                        <span>Objętość: {calculateVolume(workout.exercises)} kg</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{workout.exercises.length} ćwiczeń</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        Brak historii treningów.
                    </div>
                )}
            </div>
        </div>
    );
};
