import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { MOODS } from '../../utils/constants';

export default function SearchBar({
  value,
  onChange,
  selectedFilter,
  onFilterChange,
  placeholder = "Search playlists..."
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto mb-8">
      {/* Search Input */}
      <div className="relative flex-grow">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-zinc-150 shadow-sm"
        />
      </div>

      {/* Filter Select */}
      <div className="relative min-w-[160px]">
        <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full pl-10 pr-8 py-3 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-700 dark:text-zinc-300 shadow-sm appearance-none cursor-pointer font-medium text-sm"
        >
          <option value="">All Moods</option>
          {MOODS.map((mood) => (
            <option key={mood.id} value={mood.id}>
              {mood.emoji} {mood.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 dark:border-t-zinc-400 w-0 h-0" />
      </div>
    </div>
  );
}
