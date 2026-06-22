import React from 'react';
import { motion } from 'framer-motion';
import VinylSpinner from './VinylSpinner';
import MusicNotes from './MusicNotes';

export default function LoadingScreen({ message, progress }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/95 dark:bg-zinc-950/95 backdrop-blur-md">
      <div className="relative max-w-sm w-full px-6 text-center">
        {/* Animated Music Notes */}
        <MusicNotes />

        {/* Vinyl Record */}
        <div className="mb-8">
          <VinylSpinner />
        </div>

        {/* Progress Text */}
        <motion.h2 
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-extrabold text-slate-800 dark:text-zinc-100 mb-6 h-8"
        >
          {message}
        </motion.h2>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner relative">
          {/* Progress Indicator */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-full"
          />
        </div>

        {/* Progress Percent */}
        <span className="inline-block mt-3 text-xs font-bold text-slate-400 dark:text-zinc-500">
          {Math.round(progress)}% Completed
        </span>
      </div>
    </div>
  );
}
