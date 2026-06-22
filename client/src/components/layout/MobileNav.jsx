import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, History, BarChart3 } from 'lucide-react';

export default function MobileNav({ isOpen, onClose }) {
  const activeStyle = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold text-lg transition-all ${
      isActive
        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 left-0 right-0 z-30 bg-white dark:bg-zinc-950 border-b border-slate-200/50 dark:border-zinc-800/50 p-6 md:hidden flex flex-col gap-2 shadow-2xl"
          >
            <NavLink to="/" className={activeStyle} onClick={onClose}>
              <Home className="w-5 h-5" />
              Home
            </NavLink>
            <NavLink to="/favorites" className={activeStyle} onClick={onClose}>
              <Heart className="w-5 h-5" />
              Favorites
            </NavLink>
            <NavLink to="/history" className={activeStyle} onClick={onClose}>
              <History className="w-5 h-5" />
              History
            </NavLink>
            <NavLink to="/stats" className={activeStyle} onClick={onClose}>
              <BarChart3 className="w-5 h-5" />
              Stats
            </NavLink>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
