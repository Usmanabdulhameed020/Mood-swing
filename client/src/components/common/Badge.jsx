import React from 'react';
import { MOODS } from '../../utils/constants';

export default function Badge({ mood }) {
  const selectedMood = MOODS.find(m => m.id === mood.toLowerCase()) || {
    label: mood,
    emoji: '🎵',
    gradient: 'from-purple-500 to-pink-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${selectedMood.gradient} shadow-sm shadow-black/10 capitalize`}>
      <span>{selectedMood.emoji}</span>
      <span>{selectedMood.label}</span>
    </span>
  );
}
