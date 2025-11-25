import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, onClick, variant = 'primary', className, type = 'button', disabled = false }) => {
    const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]",
        secondary: "bg-surface border border-white/10 text-white hover:bg-white/5",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={twMerge(baseStyles, variants[variant], className)}
        >
            {children}
        </motion.button>
    );
};
