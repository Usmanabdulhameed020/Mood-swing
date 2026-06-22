import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 mt-6">
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-4"
      >
        AI Music Companion
      </motion.span>
      
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6"
      >
        How are you{' '}
        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
          feeling today?
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-slate-500 dark:text-zinc-400 max-w-xl mx-auto font-medium"
      >
        Choose a mood below, and let our intelligent AI craft the perfect 5-song playlist complete with cover art and listening tips.
      </motion.p>
    </div>
  );
}
