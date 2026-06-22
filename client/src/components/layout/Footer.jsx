import React from 'react';
import { Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 border-t border-slate-200/30 dark:border-zinc-800/30 bg-slate-50/50 dark:bg-zinc-950/20 text-slate-500 dark:text-zinc-500 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white">
            <Music className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-sm bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Mood Swing
          </span>
        </div>
        <p className="text-xs text-center md:text-right">
          &copy; {new Date().getFullYear()} Mood Swing. AI-powered playlist recommendations matching your mood.
        </p>
      </div>
    </footer>
  );
}
