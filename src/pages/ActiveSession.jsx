import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { CheckCircle, Save, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ActiveSession = () => {
    const { state } = useLocation();
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const plan = state?.plan;

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [workoutData, setWorkoutData] = useState([]);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [previousStats, setPreviousStats] = useState(null);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    // Initialize workout data structure with history
    useEffect(() => {
        if (plan && user) {
            // Find last workout with this plan name
            const lastWorkout = user.history ? [...user.history].reverse().find(h => h.planName === plan.name) : null;

            const initialData = plan.exercises.map(ex => {
                // Find same exercise in last workout
                const prevExercise = lastWorkout ? lastWorkout.exercises.find(e => e.name === ex.name) : null;

                return {
                    name: ex.name,
                    sets: Array.from({ length: ex.sets }, (_, i) => {
                        // Try to get stats from previous workout set at same index
                        const prevSet = prevExercise && prevExercise.sets[i];
                        return {
                            reps: prevSet ? prevSet.reps : ex.reps,
                            weight: prevSet ? prevSet.weight : 0,
                            completed: false
                        };
                    })
                };
            });
            setWorkoutData(initialData);
        }
    }, [plan, user]);

    // Find previous stats for current exercise
    useEffect(() => {
        if (!user?.history || !plan) return;

        // Find last workout with this plan name
        const lastWorkout = [...user.history].reverse().find(h => h.planName === plan.name);

        if (lastWorkout) {
            const currentExerciseName = plan.exercises[currentExerciseIndex].name;
            const prevExercise = lastWorkout.exercises.find(e => e.name === currentExerciseName);
            setPreviousStats(prevExercise);
        } else {
            setPreviousStats(null);
        }
    }, [currentExerciseIndex, user, plan]);

    if (!plan) return <div className="p-6 text-center">Brak wybranego planu.</div>;

    const currentExercise = plan.exercises[currentExerciseIndex];
    const currentSets = workoutData[currentExerciseIndex]?.sets || [];

    const updateSet = (setIndex, field, value) => {
        setWorkoutData(prevData => {
            const newData = [...prevData];
            const newSets = [...newData[currentExerciseIndex].sets];
            newSets[setIndex] = { ...newSets[setIndex], [field]: value };
            newData[currentExerciseIndex] = { ...newData[currentExerciseIndex], sets: newSets };
            return newData;
        });
    };

    const toggleSetComplete = (setIndex) => {
        setWorkoutData(prevData => {
            const newData = [...prevData];
            const newSets = [...newData[currentExerciseIndex].sets];
            newSets[setIndex] = { ...newSets[setIndex], completed: !newSets[setIndex].completed };
            newData[currentExerciseIndex] = { ...newData[currentExerciseIndex], sets: newSets };
            return newData;
        });
    };

    const finishWorkout = async () => {
        if (!user || !user.id) {
            alert('Błąd: Nie znaleziono danych użytkownika. Spróbuj się przelogować.');
            return;
        }

        const duration = Math.floor((Date.now() - startTime) / 60000); // in minutes

        const newHistoryItem = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            planName: plan.name,
            duration,
            exercises: workoutData
        };

        try {
            console.log('Saving workout for user:', user.id);
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const saveResponse = await fetch(`${apiUrl}/api/user/${user.id}/history/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHistoryItem)
            });

            if (!saveResponse.ok) {
                const errorText = await saveResponse.text();
                throw new Error(`Błąd serwera: ${saveResponse.status} ${saveResponse.statusText} - ${errorText}`);
            }

            // Force update local storage with fresh data from server
            // Add timestamp to prevent caching
            const userResponse = await fetch(`${apiUrl}/api/user/${user.id}?t=${Date.now()}`);
            const userData = await userResponse.json();

            if (userData && !userData.error) {
                localStorage.setItem('gym_tracker_user', JSON.stringify(userData));
                // Navigate to history page (client-side routing)
                navigate('/history');
            } else {
                console.error('Failed to fetch updated user data');
                navigate('/history'); // Fallback
            }
        } catch (error) {
            console.error('Failed to save workout', error);
            alert(`Wystąpił błąd podczas zapisywania treningu:\n${error.message}\n\nSprawdź czy serwer działa (port 3001).`);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex flex-col h-screen pb-20 bg-background">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center bg-surface/30 backdrop-blur-md border-b border-white/5 sticky top-0 z-10">
                <div>
                    <h2 className="font-bold text-lg">{plan.name}</h2>
                    <div className="flex items-center gap-2 text-primary text-sm font-mono">
                        <Clock size={14} /> {formatTime(elapsedTime)}
                    </div>
                </div>
                <Button variant="ghost" onClick={() => navigate('/')} className="text-sm px-2">Anuluj</Button>
            </div>

            {/* Exercise Navigation */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        disabled={currentExerciseIndex === 0}
                        onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
                        className="p-2 rounded-full bg-surface disabled:opacity-30"
                    >
                        <ChevronLeft />
                    </button>
                    <div className="text-center">
                        <span className="text-xs text-gray-400">Ćwiczenie {currentExerciseIndex + 1} z {plan.exercises.length}</span>
                        <h3 className="text-xl font-bold">{currentExercise.name}</h3>
                    </div>
                    <button
                        disabled={currentExerciseIndex === plan.exercises.length - 1}
                        onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                        className="p-2 rounded-full bg-surface disabled:opacity-30"
                    >
                        <ChevronRight />
                    </button>
                </div>

                {/* Previous Stats Alert */}
                {previousStats && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                        <p className="text-xs text-primary font-bold mb-2 uppercase tracking-wider">Ostatni wynik</p>
                        <div className="flex gap-4 text-sm text-gray-300">
                            {previousStats.sets.slice(0, 3).map((s, i) => (
                                <span key={i}>{s.weight}kg x {s.reps}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sets */}
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-10 gap-2 text-xs text-gray-400 font-medium text-center mb-1">
                        <div className="col-span-2">SERIA</div>
                        <div className="col-span-3">KG</div>
                        <div className="col-span-3">POWT.</div>
                        <div className="col-span-2">OK</div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentExerciseIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col gap-3"
                        >
                            {currentSets.map((set, index) => (
                                <Card key={index} className={`grid grid-cols-10 gap-2 items-center p-3 ${set.completed ? 'bg-green-500/10 border-green-500/30' : ''}`}>
                                    <div className="col-span-2 text-center font-bold text-gray-400">#{index + 1}</div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            value={set.weight}
                                            onChange={(e) => updateSet(index, 'weight', e.target.value)}
                                            className="w-full bg-black/20 rounded-lg p-2 text-center text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            value={set.reps}
                                            onChange={(e) => updateSet(index, 'reps', e.target.value)}
                                            className="w-full bg-black/20 rounded-lg p-2 text-center text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <button
                                            onClick={() => toggleSetComplete(index)}
                                            className={`p-2 rounded-full transition-colors ${set.completed ? 'text-green-400 bg-green-400/20' : 'text-gray-500 bg-gray-700/50'}`}
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-gradient-to-t from-background to-transparent sticky bottom-0">
                {currentExerciseIndex < plan.exercises.length - 1 ? (
                    <Button onClick={() => setCurrentExerciseIndex(prev => prev + 1)} className="w-full">
                        Następne ćwiczenie <ChevronRight size={18} />
                    </Button>
                ) : (
                    <Button onClick={finishWorkout} className="w-full bg-green-600 hover:bg-green-500 shadow-green-500/30">
                        <Save size={18} /> Zakończ Trening
                    </Button>
                )}
            </div>
        </div>
    );
};
