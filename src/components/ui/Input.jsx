import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = ({ label, type = 'text', value, onChange, placeholder, className, error }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={twMerge(
                    "bg-surface/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                    className
                )}
            />
            {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
        </div>
    );
};
