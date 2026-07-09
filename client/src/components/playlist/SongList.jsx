import React, { useState } from 'react';
import SongCard from './SongCard';
import NowPlayingModal from './NowPlayingModal';

export default function SongList({ songs }) {
  const [selectedSong, setSelectedSong] = useState(null);

  if (!songs || songs.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-1 w-full bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm rounded-2xl p-2 border border-slate-200/40 dark:border-zinc-800/20 shadow-inner">
        {/* Table Header for medium+ screens */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-650">
          <span className="w-4 text-center">#</span>
          <div className="w-12" /> {/* Artwork spacer */}
          <div className="flex-grow grid grid-cols-12 gap-2">
            <span className="col-span-6">Title</span>
            <span className="col-span-3">Album</span>
            <span className="hidden lg:block col-span-2">Genre / Year</span>
            <span className="col-span-1 text-right pr-2">Duration</span>
          </div>
          <div className="w-24 text-right" /> {/* Actions spacer */}
        </div>

        {/* Songs Grid */}
        <div className="flex flex-col gap-0.5">
          {songs.map((song, index) => (
            <SongCard
              key={`${song.title}-${index}`}
              song={song}
              index={index}
              onPlay={(s) => setSelectedSong(s)}
            />
          ))}
        </div>
      </div>

      <NowPlayingModal 
        song={selectedSong} 
        isOpen={!!selectedSong} 
        onClose={() => setSelectedSong(null)} 
      />
    </>
  );
}
