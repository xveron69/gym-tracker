import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, History, BarChart2, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: Home, path: '/', label: 'Pulpit' },
        { icon: Calendar, path: '/calendar', label: 'Kalendarz' },
        { icon: PlusCircle, path: '/workout', label: 'Trening', highlight: true },
        { icon: History, path: '/history', label: 'Historia' },
        { icon: BarChart2, path: '/reports', label: 'Raporty' },
    ];

    return (
        <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-background shadow-2xl overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6 scrollbar-hide">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-white/5 px-6 py-4 flex justify-between items-center z-50 max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={clsx(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                isActive ? "text-primary scale-110" : "text-gray-400 hover:text-white",
                                item.highlight && "bg-primary text-white p-3 rounded-full -mt-8 shadow-lg shadow-primary/40 border-4 border-background"
                            )}
                        >
                            <Icon size={item.highlight ? 24 : 20} />
                            {!item.highlight && <span className="text-[10px] font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
