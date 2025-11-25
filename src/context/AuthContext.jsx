import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted user
        const storedUser = localStorage.getItem('gym_tracker_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('gym_tracker_user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Błąd połączenia z serwerem' };
        }
    };

    const register = async (username, password) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('gym_tracker_user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Błąd połączenia z serwerem' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gym_tracker_user');
    };

    const refreshUser = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`/api/user/${user.id}?t=${Date.now()}`);
            const data = await response.json();
            if (data && !data.error) {
                setUser(data);
                localStorage.setItem('gym_tracker_user', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Failed to refresh user data', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
