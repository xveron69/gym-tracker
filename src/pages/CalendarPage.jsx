import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CalendarPage = () => {
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const workoutDates = user?.history?.map(h => new Date(h.date)) || [];

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const daysOfWeek = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const hasWorkout = (date) => {
        return workoutDates.some(workoutDate => isSameDay(date, workoutDate));
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <header>
                <h1 className="text-2xl font-bold">Kalendarz</h1>
                <p className="text-gray-400">Twoja regularność</p>
            </header>

            <Card className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft /></button>
                    <h2 className="text-lg font-bold capitalize">
                        {format(currentMonth, 'MMMM yyyy', { locale: pl })}
                    </h2>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full"><ChevronRight /></button>
                </div>

                <div className="grid grid-cols-7 mb-2 text-center text-gray-400 text-sm font-medium">
                    {daysOfWeek.map(day => (
                        <div key={day} className="py-2">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, i) => {
                        const isWorkoutDay = hasWorkout(date);
                        const isCurrentMonth = isSameMonth(date, monthStart);

                        return (
                            <div
                                key={i}
                                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm relative
                  ${!isCurrentMonth ? 'text-gray-600' : 'text-white'}
                  ${isWorkoutDay ? 'bg-primary/20 text-primary font-bold border border-primary/30' : ''}
                `}
                            >
                                {format(date, 'd')}
                                {isWorkoutDay && (
                                    <motion.div
                                        layoutId="workout-dot"
                                        className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <div className="flex gap-4 text-sm text-gray-400 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/20 border border-primary/30 rounded"></div>
                    <span>Dzień treningowy</span>
                </div>
            </div>
        </div>
    );
};
