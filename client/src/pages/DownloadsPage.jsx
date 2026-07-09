import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Music, Play, Pause, Trash2, X, WifiOff } from 'lucide-react';
import { getOfflineSongs, deleteOfflineSong } from '../utils/offlineDb';
import LoadingSpinner from '../components/common/LoadingSpinner';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function DownloadsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    setLoading(true);
    const saved = await getOfflineSongs();
    setSongs(saved);
    setLoading(false);
  };

  const playSong = (song) => {
    // Clean up previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(song.blob);
    objectUrlRef.current = url;
    setPlayingSong(song);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  };

  const handleDelete = async (id) => {
    await deleteOfflineSong(id);
    if (playingSong && playingSong.id === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setPlayingSong(null);
      setIsPlaying(false);
    }
    loadSongs();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onDurationChange={(e) => setDuration(e.target.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 mb-4 shadow-xl shadow-purple-500/20">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
          Downloads
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          Your offline music library — play anytime, anywhere
        </p>
      </motion.div>

      {/* Song List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="large" />
        </div>
      ) : songs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
            <Music className="w-10 h-10 text-slate-400 dark:text-zinc-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 dark:text-zinc-300 mb-2">
            No downloads yet
          </h2>
          <p className="text-slate-500 dark:text-zinc-500 max-w-sm mx-auto">
            Go to Explore, play a song, and hit the download button to save it for offline listening!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {songs.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                playingSong?.id === song.id
                  ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/30 shadow-lg'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
              onClick={() => playSong(song)}
            >
              {/* Artwork */}
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative shadow-md">
                {song.albumArtwork ? (
                  <img src={song.albumArtwork} alt={song.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <Music className="w-6 h-6 text-white/60" />
                  </div>
                )}
                {/* Play overlay */}
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${
                  playingSong?.id === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {playingSong?.id === song.id && isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">{song.title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">{song.artist}</p>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(song.id); }}
                className="p-2 rounded-full text-slate-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Remove download"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom Player Bar */}
      <AnimatePresence>
        {playingSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 shadow-2xl shadow-black/10"
          >
            <div className="max-w-4xl mx-auto px-4 py-3">
              {/* Progress bar at top of player */}
              <div
                onClick={handleSeek}
                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full cursor-pointer mb-3 group relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-100 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Album art */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                  {playingSong.albumArtwork ? (
                    <img src={playingSong.albumArtwork} alt={playingSong.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <Music className="w-5 h-5 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Song info */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{playingSong.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{playingSong.artist}</p>
                </div>

                {/* Time */}
                <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 hidden sm:block">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Close */}
                <button
                  onClick={() => {
                    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
                    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
                    setPlayingSong(null);
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
