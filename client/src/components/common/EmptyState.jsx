import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import Card from './Card';

export default function EmptyState({
  title = "No playlists found",
  message = "Try generating a playlist based on how you are feeling right now.",
  icon: Icon = Inbox,
  children
}) {
  return (
    <Card className="max-w-md mx-auto text-center py-12 px-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-slate-400 dark:text-zinc-500"
      >
        <Icon className="w-8 h-8" />
      </motion.div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-150 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {children}
    </Card>
  );
}
