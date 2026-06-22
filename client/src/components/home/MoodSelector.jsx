import React from 'react';
import { motion } from 'framer-motion';
import MoodCard from './MoodCard';
import { MOODS } from '../../utils/constants';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full"
    >
      {MOODS.map((mood) => (
        <motion.div key={mood.id} variants={item}>
          <MoodCard
            mood={mood}
            isSelected={selectedMood === mood.id}
            onSelect={onSelect}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
