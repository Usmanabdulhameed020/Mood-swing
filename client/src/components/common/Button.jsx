import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 border border-transparent',
    secondary: 'bg-slate-200/60 dark:bg-zinc-800/60 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-300/30 dark:border-zinc-700/30',
    outline: 'bg-transparent hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-600/30 dark:border-purple-400/30',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </motion.button>
  );
}
