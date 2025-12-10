import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Play, Plus, Calendar as CalendarIcon, History as HistoryIcon, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const tiles = [
        {
            title: 'Rozpocznij Trening',
            icon: Play,
            path: '/workout',
            color: 'from-primary to-accent',
            desc: 'Wybierz plan i ćwicz'
        },
        {
            title: 'Moje Plany',
            icon: Plus,
            path: '/plans',
            color: 'from-secondary to-pink-600',
            desc: 'Zarządzaj rutynami'
        },
        {
            title: 'Kalendarz',
            icon: CalendarIcon,
            path: '/calendar',
            color: 'from-blue-500 to-cyan-500',
            desc: 'Twoja aktywność'
        },
        {
            title: 'Historia',
            icon: HistoryIcon,
            path: '/history',
            color: 'from-emerald-500 to-green-500',
            desc: 'Ostatnie treningi'
        },
        {
            title: 'Atlas Ćwiczeń',
            icon: BookOpen,
            path: '/library',
            color: 'from-purple-500 to-indigo-500',
            desc: 'Baza wiedzy'
        },
    ];

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Cześć, {user?.username}! 👋</h1>
                <p className="text-gray-400">Gotowy na dzisiejszy trening?</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                {tiles.map((tile, index) => (
                    <motion.div
                        key={tile.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            onClick={() => navigate(tile.path)}
                            className="h-40 flex flex-col justify-between relative overflow-hidden group border-0 bg-surface/30"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tile.color} flex items-center justify-center shadow-lg`}>
                                <tile.icon size={20} className="text-white" />
                            </div>

                            <div>
                                <h3 className="font-bold text-lg leading-tight mb-1">{tile.title}</h3>
                                <p className="text-xs text-gray-400">{tile.desc}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <section>
                <h2 className="text-lg font-semibold mb-3">Ostatnia aktywność</h2>
                {user?.history?.length > 0 ? (
                    <Card className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium">{user.history[user.history.length - 1].planName}</h4>
                            <p className="text-sm text-gray-400">{new Date(user.history[user.history.length - 1].date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-primary font-bold">
                            {user.history[user.history.length - 1].duration} min
                        </div>
                    </Card>
                ) : (
                    <Card className="text-center py-8 text-gray-400">
                        Brak ostatnich treningów. Czas zacząć!
                    </Card>
                )}
            </section>
        </div>
    );
};
