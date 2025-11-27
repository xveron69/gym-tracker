import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyPlans = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const deletePlan = async (planId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten plan?')) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            await fetch(`${apiUrl}/api/user/${user.id}/plans/${planId}`, {
                method: 'DELETE',
            });
            await refreshUser();
        } catch (error) {
            console.error('Failed to delete plan', error);
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Moje Plany</h1>
                    <p className="text-gray-400">Zarządzaj swoimi rutynami</p>
                </div>
                <Button onClick={() => navigate('/plans/new')} className="p-2 rounded-full w-10 h-10 flex items-center justify-center">
                    <Plus size={20} />
                </Button>
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
                            <Card className="flex items-center justify-between group">
                                <div>
                                    <h3 className="font-bold text-lg">{plan.name}</h3>
                                    <p className="text-sm text-gray-400">{plan.exercises.length} ćwiczeń</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate(`/plans/edit/${plan.id}`)}
                                        className="p-2 rounded-lg w-10 h-10 flex items-center justify-center bg-surface hover:bg-white/10"
                                    >
                                        <Edit2 size={18} className="text-primary" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => deletePlan(plan.id)}
                                        className="p-2 rounded-lg w-10 h-10 flex items-center justify-center bg-surface hover:bg-red-500/20"
                                    >
                                        <Trash2 size={18} className="text-red-400" />
                                    </Button>
                                </div>
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
