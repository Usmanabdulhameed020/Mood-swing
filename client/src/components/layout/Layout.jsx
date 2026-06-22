import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
      <Header />
      
      {/* Background glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 dark:bg-pink-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
