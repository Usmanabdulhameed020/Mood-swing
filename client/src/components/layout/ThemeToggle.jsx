import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-slate-200/50 dark:bg-zinc-800/50 border border-slate-300/30 dark:border-zinc-700/30 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden cursor-pointer w-10 h-10 flex items-center justify-center transition-colors"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-amber-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-indigo-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
