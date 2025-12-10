import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Dumbbell, ArrowLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Dostępne kategorie (na razie tylko te, dla których mamy dane)
    const categories = [
        { id: 'Klatka piersiowa', name: 'Klatka piersiowa', count: 107, color: 'from-blue-500 to-cyan-500' },
        { id: 'Plecy', name: 'Plecy', count: 115, color: 'from-purple-500 to-indigo-500' },
        { id: 'Barki', name: 'Barki', count: 93, color: 'from-orange-500 to-red-500' },
        { id: 'Nogi', name: 'Nogi', count: 206, color: 'from-emerald-500 to-green-500' },
        { id: 'Biceps', name: 'Biceps', count: 54, color: 'from-pink-500 to-rose-500' },
        { id: 'Triceps', name: 'Triceps', count: 60, color: 'from-yellow-500 to-amber-500' },
        { id: 'Brzuch', name: 'Brzuch', count: 102, color: 'from-teal-500 to-cyan-500' },
        { id: 'Przedramiona', name: 'Przedramiona', count: 28, color: 'from-gray-500 to-slate-500' },
    ];

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exercises`);
                if (!response.ok) throw new Error('Failed to fetch exercises');
                const data = await response.json();
                setExercises(data);
            } catch (err) {
                console.error('Error fetching exercises:', err);
                setError('Nie udało się pobrać listy ćwiczeń.');
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    useEffect(() => {
        if (!selectedCategory) {
            setFilteredExercises([]);
            return;
        }

        const filtered = exercises.filter(ex =>
            ex.category === selectedCategory &&
            ex.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredExercises(filtered);
    }, [searchQuery, exercises, selectedCategory]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSearchQuery('');
    };

    const handleBack = () => {
        setSelectedCategory(null);
        setSearchQuery('');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-gray-400 mt-4">Ładowanie atlasu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-center">
                {error}
            </div>
        );
    }

    // Widok Kategorii
    if (!selectedCategory) {
        return (
            <div className="space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Dumbbell className="w-8 h-8 text-primary" />
                        Atlas Ćwiczeń
                    </h1>
                    <p className="text-gray-400 mt-1">Wybierz partię mięśniową, którą chcesz trenować</p>
                </header>

                <div className="grid grid-cols-1 gap-4">
                    {categories.map((cat) => (
                        <Card
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className="group relative overflow-hidden border-0 bg-surface/30 hover:bg-surface/50 transition-all cursor-pointer"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                                        <Dumbbell className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{cat.name}</h3>
                                        <p className="text-sm text-gray-400">{cat.count > 0 ? `${cat.count} ćwiczeń` : 'Wkrótce'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Widok Listy Ćwiczeń
    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
                >
                    <ArrowLeft size={20} />
                    Powrót do kategorii
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {selectedCategory}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {filteredExercises.length} dostępnych ćwiczeń
                        </p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Szukaj w tej kategorii..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-3">
                {filteredExercises.map((exercise) => (
                    <a
                        key={exercise._id}
                        href={exercise.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-surface/40 p-4 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-surface/60 transition-all duration-200 flex items-center justify-between"
                    >
                        <div className="flex-1 pr-4">
                            <h3 className="font-medium text-white group-hover:text-primary transition-colors line-clamp-2">
                                {exercise.name}
                            </h3>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                ))}

                {filteredExercises.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-surface/20 rounded-xl border border-dashed border-white/10">
                        Nie znaleziono ćwiczeń pasujących do wyszukiwania.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseLibrary;
