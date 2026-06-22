import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  onClick,
  className = '',
  hoverEffect = true,
  animate = true
}) {
  const baseStyles = 'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/40 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none p-6 overflow-hidden';
  
  if (!animate) {
    return (
      <div 
        onClick={onClick} 
        className={`${baseStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect && onClick ? { y: -4, scale: 1.01 } : hoverEffect ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={`${baseStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
