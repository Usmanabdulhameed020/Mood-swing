import React from 'react';
import { MOODS } from '../../utils/constants';

export default function PlaylistCover({ mood, name, coverGradient, songs }) {
  const selectedMood = MOODS.find(m => m.id === mood.toLowerCase()) || {
    emoji: '🎵',
    gradient: coverGradient || 'from-purple-600 to-pink-500'
  };

  const gradientClass = selectedMood.gradient;

  // Collect up to 4 artworks for collage
  const artworks = songs
    ? songs.filter(s => s.albumArtwork).map(s => s.albumArtwork).slice(0, 4)
    : [];

  const hasCollage = artworks.length >= 2;

  return (
    <div className={`aspect-square w-full max-w-[280px] sm:max-w-[320px] rounded-2xl bg-gradient-to-tr ${gradientClass} flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden group mx-auto`}>

      {/* Artwork collage (when available) */}
      {hasCollage ? (
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-60">
          {artworks.slice(0, 4).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
          {/* Gradient overlay so text remains readable */}
          <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-70`} />
        </div>
      ) : (
        <>
          {/* Vinyl Disc Background Peek on hover */}
          <div className="absolute right-[-10px] top-[-10px] w-36 h-36 rounded-full bg-zinc-950/20 border border-white/5 backdrop-blur-sm -z-10 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-500" />
          {/* Wave overlays */}
          <div className="absolute inset-0 bg-black/10 opacity-30 mix-blend-overlay pointer-events-none" />
        </>
      )}

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center p-6">
        {/* Mood Icon */}
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg shadow-black/20">
          <span className="text-4xl filter drop-shadow-md">{selectedMood.emoji}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-center truncate max-w-full drop-shadow-lg tracking-tight uppercase px-2 leading-tight">
          {name}
        </h2>

        {/* Tag */}
        <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full mt-3 shadow-inner">
          Mood Swing Suggestion
        </span>
      </div>
    </div>
  );
}
