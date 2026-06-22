import React from 'react';
import { motion } from 'framer-motion';

export default function MoodCard({ mood, isSelected, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(mood.id)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer overflow-hidden group ${
        isSelected
          ? `bg-gradient-to-r ${mood.gradient} border-transparent text-white shadow-xl shadow-purple-600/20`
          : 'bg-white dark:bg-zinc-900 border-slate-200/60 dark:border-zinc-800/40 text-slate-800 dark:text-zinc-100 hover:border-purple-300 dark:hover:border-purple-900/50 shadow-sm'
      }`}
    >
      {/* Background Glow on Hover */}
      {!isSelected && (
        <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-r ${mood.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 rounded-full`} />
      )}

      {/* Emoji container */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 ${
        isSelected 
          ? 'bg-white/20' 
          : 'bg-slate-100 dark:bg-zinc-850'
      }`}>
        {mood.emoji}
      </div>

      {/* Texts */}
      <div>
        <h3 className="font-bold text-base leading-tight capitalize">{mood.label}</h3>
        <p className={`text-xs mt-0.5 leading-snug transition-colors ${
          isSelected 
            ? 'text-white/80' 
            : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-500 dark:group-hover:text-zinc-400'
        }`}>
          {mood.description}
        </p>
      </div>
    </motion.button>
  );
}
