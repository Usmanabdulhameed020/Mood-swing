import React from 'react';
import { motion } from 'framer-motion';

export default function VinylSpinner() {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      {/* Vinyl Record */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
        className="w-40 h-40 rounded-full bg-zinc-950 dark:bg-black border-4 border-zinc-800 shadow-2xl flex items-center justify-center relative overflow-hidden"
        style={{
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 0 25px rgba(0,0,0,0.8), 0 15px 30px rgba(0,0,0,0.4)'
        }}
      >
        {/* Grooves */}
        <div className="absolute inset-2 border border-zinc-900/60 rounded-full" />
        <div className="absolute inset-4 border border-zinc-900/60 rounded-full" />
        <div className="absolute inset-6 border border-zinc-800/50 rounded-full" />
        <div className="absolute inset-8 border border-zinc-850/50 rounded-full" />
        <div className="absolute inset-10 border border-zinc-800/40 rounded-full" />
        <div className="absolute inset-12 border border-zinc-900/40 rounded-full" />
        <div className="absolute inset-14 border border-zinc-900/40 rounded-full" />

        {/* Center Label */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center relative shadow-inner z-10">
          {/* Center Hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-50 dark:bg-zinc-950 border border-black/20" />
        </div>
      </motion.div>

      {/* Tonearm */}
      <div className="absolute top-2 right-4 w-12 h-24 origin-top-right pointer-events-none z-20">
        <svg viewBox="0 0 100 200" className="w-full h-full text-slate-400 dark:text-zinc-500 fill-none stroke-current stroke-[6px]">
          {/* Base */}
          <circle cx="80" cy="20" r="12" className="fill-slate-500 dark:fill-zinc-600 stroke-none" />
          {/* Arm */}
          <path d="M 80,20 L 40,110 L 25,140 L 32,152" strokeLinecap="round" strokeLinejoin="round" />
          {/* Cartridge */}
          <rect x="24" y="150" width="16" height="24" rx="3" className="fill-slate-600 dark:fill-zinc-700 stroke-none" />
        </svg>
      </div>
    </div>
  );
}
