import React from 'react';
import { motion } from 'framer-motion';

const notes = ['♫', '♪', '♬', '♩', '🎶'];

export default function MusicNotes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {Array.from({ length: 8 }).map((_, index) => {
        const note = notes[index % notes.length];
        
        // Random horizontal positions and sizes
        const randomX = Math.floor(Math.random() * 120) - 60; // -60px to 60px from center
        const randomDelay = Math.random() * 2;
        const randomDuration = 2 + Math.random() * 2; // 2s to 4s
        const randomScale = 0.8 + Math.random() * 0.8;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 120, x: randomX, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.8, 0.8, 0], 
              y: -50, 
              x: [randomX, randomX + (index % 2 === 0 ? 30 : -30), randomX],
              scale: randomScale
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
              ease: 'easeOut'
            }}
            className="absolute left-1/2 bottom-0 text-purple-500/60 dark:text-purple-400/40 text-2xl font-bold font-serif"
          >
            {note}
          </motion.div>
        );
      })}
    </div>
  );
}
