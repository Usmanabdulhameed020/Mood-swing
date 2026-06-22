import React from 'react';
import Badge from '../common/Badge';

export default function PlaylistHeader({ name, mood, description, createdAt }) {
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-4">
      {/* Mood Badge */}
      <Badge mood={mood} />

      {/* Playlist Name */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 dark:text-zinc-50 tracking-tight leading-tight uppercase">
        {name}
      </h1>

      {/* Description */}
      <p className="text-base text-slate-500 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
        {description}
      </p>

      {/* Meta Date */}
      {formattedDate && (
        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
          Generated on {formattedDate} &bull; 5 songs
        </span>
      )}
    </div>
  );
}
