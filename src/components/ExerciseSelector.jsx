import React, { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

export const ExerciseSelector = ({ value, onChange, placeholder }) => {
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const response = await fetch(`${apiUrl}/api/exercises`);
                if (response.ok) {
                    const data = await response.json();
                    setExercises(data);
                }
            } catch (error) {
                console.error('Failed to fetch exercises:', error);
            }
        };
        fetchExercises();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const query = e.target.value;
        onChange(query);

        if (query.length > 0) {
            const filtered = exercises.filter(ex =>
                ex.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredExercises(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectExercise = (exercise) => {
        onChange(exercise.name);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => value && handleInputChange({ target: { value } })}
                    placeholder={placeholder}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {/* Show info icon if current value matches a known exercise with URL */}
                {exercises.find(ex => ex.name === value && ex.url) && (
                    <a
                        href={exercises.find(ex => ex.name === value).url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                        title="Zobacz instrukcję ćwiczenia"
                    >
                        <Info size={20} />
                    </a>
                )}
            </div>

            {showDropdown && filteredExercises.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-surface border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto backdrop-blur-xl">
                    {filteredExercises.map((exercise) => (
                        <div
                            key={exercise._id || exercise.name}
                            className="px-4 py-3 hover:bg-white/5 cursor-pointer flex justify-between items-center group"
                            onClick={() => handleSelectExercise(exercise)}
                        >
                            <span className="text-sm">{exercise.name}</span>
                            {exercise.url && (
                                <Info size={14} className="text-gray-500 group-hover:text-primary opacity-50 group-hover:opacity-100" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
