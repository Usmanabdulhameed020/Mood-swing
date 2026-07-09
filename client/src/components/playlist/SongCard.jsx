import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Copy, Check, Music } from 'lucide-react';

// Inline YouTube SVG (not available in this version of lucide-react)
function YoutubeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function SongCard({ song, index, onPlay }) {
  const [isLiked, setIsLiked] = useState(() => {
    const saved = localStorage.getItem(`liked_song_${song.title}_${song.artist}`);
    return saved === 'true';
  });
  const [copied, setCopied] = useState(false);



  // Generate a distinct gradient placeholder based on song title length/char codes
  const generateSongGradient = () => {
    const code = song.title.charCodeAt(0) + (song.artist ? song.artist.charCodeAt(0) : 0);
    const gradients = [
      'from-purple-500 to-indigo-500',
      'from-pink-500 to-rose-500',
      'from-teal-500 to-emerald-500',
      'from-amber-500 to-orange-500',
      'from-blue-500 to-cyan-500'
    ];
    return gradients[code % gradients.length];
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`🎵 ${song.title} - ${song.artist} (Album: ${song.album}, ${song.releaseYear})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareText = `Check out this song: "${song.title}" by ${song.artist} from the album "${song.album}" (${song.releaseYear})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: song.title,
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    localStorage.setItem(`liked_song_${song.title}_${song.artist}`, String(newLiked));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      whileHover={{ scale: 1.01, x: 4 }}
      onClick={() => onPlay && onPlay(song)}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 border border-transparent hover:border-slate-200/50 dark:hover:border-zinc-800/30 transition-all duration-200 group cursor-pointer"
    >
      {/* Index / Active Wave Animation */}
      <div className="w-4 text-center flex-shrink-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-400 dark:text-zinc-650">
          {index + 1}
        </span>
      </div>

      {/* Album Art Cover with hover Play/Pause overlay */}
      <div className="w-12 h-12 rounded-lg relative overflow-hidden group-hover:shadow-lg shadow-black/10 flex-shrink-0 flex items-center justify-center bg-slate-200 dark:bg-zinc-850">
        {song.albumArtwork ? (
          <img src={song.albumArtwork} alt={song.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${generateSongGradient()} flex items-center justify-center text-white/95`}>
            <Music className="w-5 h-5" />
          </div>
        )}
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="w-5 h-5 text-white translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Song Details */}
      <div className="flex-grow min-w-0 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
        {/* Title & Artist */}
        <div className="md:col-span-6 min-w-0">
          <h3 className="font-bold text-slate-800 dark:text-zinc-150 text-base truncate pr-2">
            {song.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium truncate pr-2 mt-0.5">
            {song.artist}
          </p>
        </div>

        {/* Album */}
        <div className="hidden md:block md:col-span-3 text-sm font-medium text-slate-500 dark:text-zinc-400 truncate pr-2">
          {song.album}
        </div>

        {/* Year & Genre */}
        <div className="hidden lg:flex md:col-span-2 text-xs font-semibold text-slate-400 dark:text-zinc-500 flex-col">
          <span>{song.genre}</span>
          <span className="mt-0.5">{song.releaseYear}</span>
        </div>

        {/* Duration */}
        <div className="md:col-span-1 text-right text-sm font-bold text-slate-500 dark:text-zinc-400 pr-2">
          {song.duration}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Play/Pause Button for mobile (hidden on hover devices because they use overlay) */}
        <button
          className="lg:hidden p-2 rounded-full cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-200/50 dark:hover:bg-zinc-700/50 transition-colors"
          title="Play"
        >
          <svg className="w-4 h-4 translate-x-[0.5px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* YouTube Link */}
        {song.youtubeLink && (
          <a
            href={song.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-red-500 hover:bg-slate-200/50 dark:hover:bg-zinc-700/50 transition-colors"
            title="Open in YouTube"
          >
            <YoutubeIcon className="w-4 h-4" />
          </a>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleLike}
          className={`p-2 rounded-full cursor-pointer hover:bg-slate-200/50 dark:hover:bg-zinc-700/50 transition-colors ${
            isLiked ? 'text-red-500' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
          }`}
          title="Favorite song"
        >
          <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-2 rounded-full cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-200/50 dark:hover:bg-zinc-700/50 transition-colors"
          title="Copy song details"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-2 rounded-full cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-200/50 dark:hover:bg-zinc-700/50 transition-colors"
          title="Share song"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
