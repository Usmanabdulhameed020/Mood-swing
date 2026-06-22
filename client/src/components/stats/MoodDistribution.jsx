import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import { MOODS } from '../../utils/constants';

export default function MoodDistribution({ distribution }) {
  if (!distribution || distribution.length === 0) {
    return null;
  }

  // Find max count to normalize bar lengths
  const maxCount = Math.max(...distribution.map(item => item.count));

  const getMoodDetails = (moodId) => {
    return MOODS.find(m => m.id === moodId.toLowerCase()) || {
      emoji: '🎵',
      gradient: 'from-purple-500 to-pink-500',
      label: moodId
    };
  };

  return (
    <Card className="max-w-2xl mx-auto w-full" hoverEffect={false}>
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-150 mb-6 text-left border-b border-slate-200/50 dark:border-zinc-800/40 pb-3 uppercase tracking-wider text-xs">
        Mood Frequency Distribution
      </h3>

      <div className="flex flex-col gap-4">
        {distribution.map((item, idx) => {
          const mood = getMoodDetails(item.mood);
          const percent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div key={idx} className="flex items-center gap-4">
              {/* Mood Badge label */}
              <div className="w-24 text-left flex items-center gap-2 flex-shrink-0 text-sm font-bold text-slate-700 dark:text-zinc-300">
                <span>{mood.emoji}</span>
                <span className="capitalize truncate">{mood.label}</span>
              </div>

              {/* Progress Track */}
              <div className="flex-grow h-6 bg-slate-100 dark:bg-zinc-800/50 rounded-full relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${mood.gradient} rounded-full`}
                />
              </div>

              {/* Count */}
              <span className="w-8 text-right font-black text-sm text-slate-500 dark:text-zinc-400">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
