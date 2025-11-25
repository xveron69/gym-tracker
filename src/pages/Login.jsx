import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Logowanie nieudane');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-8"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
                        <Dumbbell size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Gym Tracker
                    </h1>
                    <p className="text-gray-400 text-center">Zaloguj się, aby śledzić swoje postępy</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <Input
                        label="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Wpisz login"
                    />
                    <Input
                        label="Hasło"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wpisz hasło"
                    />

                    {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</div>}

                    <Button type="submit" className="mt-4">
                        Zaloguj się
                    </Button>
                </form>

                <p className="text-gray-400 text-sm">
                    Nie masz konta?{' '}
                    <Link to="/register" className="text-primary hover:text-accent font-medium transition-colors">
                        Zarejestruj się
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};
