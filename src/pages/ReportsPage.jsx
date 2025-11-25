import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

export const ReportsPage = () => {
    const { user } = useAuth();
    const history = user?.history || [];

    // Prepare data for charts
    const data = history.map(h => ({
        date: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        duration: h.duration,
        volume: h.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((setTotal, set) => {
                return setTotal + (set.completed ? (set.weight * set.reps) : 0);
            }, 0);
        }, 0)
    })).slice(-10); // Last 10 workouts

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header>
                <h1 className="text-2xl font-bold">Raporty</h1>
                <p className="text-gray-400">Twoje postępy w liczbach</p>
            </header>

            {history.length > 1 ? (
                <div className="flex flex-col gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card>
                            <h3 className="font-bold mb-4 text-primary">Czas treningu (min)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line type="monotone" dataKey="duration" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <h3 className="font-bold mb-4 text-secondary">Objętość (kg)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="volume" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            ) : (
                <div className="text-center py-10 text-gray-400">
                    Zrób więcej treningów, aby zobaczyć wykresy!
                </div>
            )}
        </div>
    );
};
