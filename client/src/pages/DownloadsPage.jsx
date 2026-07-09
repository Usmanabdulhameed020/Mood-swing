import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Download, Music, Play, Pause, Trash2, WifiOff } from 'lucide-react';
import { getOfflineSongs, deleteOfflineSong } from '../utils/offlineDb';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlaylistContext } from '../context/PlaylistContext';

export default function DownloadsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    currentOfflineSong,
    isOfflinePlaying,
    playOfflineSong,
    stopOfflinePlayback
  } = useContext(PlaylistContext);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    setLoading(true);
    const saved = await getOfflineSongs();
    setSongs(saved);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteOfflineSong(id);
    if (currentOfflineSong && currentOfflineSong.id === id) {
      stopOfflinePlayback();
    }
    loadSongs();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
                currentOfflineSong?.id === song.id
                  ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/30 shadow-lg'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
              onClick={() => playOfflineSong(song)}
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
                  currentOfflineSong?.id === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {currentOfflineSong?.id === song.id && isOfflinePlaying ? (
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
    </div>
  );
}
