import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, onClick }) => {
    return (
        <motion.div
            whileHover={onClick ? { y: -2 } : {}}
            onClick={onClick}
            className={twMerge(
                "bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-xl",
                onClick && "cursor-pointer hover:bg-surface/60 hover:border-white/10 transition-colors",
                className
            )}
        >
            {children}
        </motion.div>
    );
};
