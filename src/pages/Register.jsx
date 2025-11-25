import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Hasła nie są identyczne');
            return;
        }

        const result = await register(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Rejestracja nieudana');
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
                    <div className="w-16 h-16 bg-surface border border-white/10 rounded-2xl flex items-center justify-center">
                        <UserPlus size={32} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Stwórz konto
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <Input
                        label="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Wybierz login"
                    />
                    <Input
                        label="Hasło"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wybierz hasło"
                    />
                    <Input
                        label="Potwierdź hasło"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Powtórz hasło"
                    />

                    {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</div>}

                    <Button type="submit" className="mt-4">
                        Zarejestruj się
                    </Button>
                </form>

                <p className="text-gray-400 text-sm">
                    Masz już konto?{' '}
                    <Link to="/login" className="text-primary hover:text-accent font-medium transition-colors">
                        Zaloguj się
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};
