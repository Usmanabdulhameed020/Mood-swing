import React from 'react';
import { HelpCircle, Star } from 'lucide-react';
import Card from '../common/Card';

export default function ListeningTips({ tips }) {
  if (!tips || tips.length === 0) return null;

  return (
    <Card className="max-w-2xl mx-auto mt-8 border-purple-200/40 dark:border-purple-900/10 bg-gradient-to-tr from-purple-500/5 to-pink-500/5">
      <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400">
        <HelpCircle className="w-5 h-5" />
        <h3 className="font-extrabold text-sm uppercase tracking-wider">Listening Tips</h3>
      </div>
      <ul className="flex flex-col gap-2.5 text-left">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
            <Star className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" fill="currentColor" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
