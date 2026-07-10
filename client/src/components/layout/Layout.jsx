import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { PlaylistContext } from '../../context/PlaylistContext';
import NowPlayingModal from '../playlist/NowPlayingModal';
import { Play, Pause, X, Music } from 'lucide-react';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Layout() {
  const location = useLocation();
  const {
    currentOnlineSong,
    isOnlinePlayerOpen,
    setIsOnlinePlayerOpen,
    closeOnlinePlayer,
    isOnlinePlaying,
    onlineCurrentTime,
    onlineDuration,
    toggleOnlinePlayPause,
    seekOnline,
    stopOnlinePlayback,
    currentOfflineSong,
    isOfflinePlaying,
    offlineCurrentTime,
    offlineDuration,
    toggleOfflinePlayPause,
    seekOffline,
    stopOfflinePlayback
  } = useContext(PlaylistContext);

  const handleSeekOffline = (e) => {
    if (!offlineDuration) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekOffline(ratio * offlineDuration);
  };

  const handleSeekOnline = (e) => {
    if (!onlineDuration) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekOnline(ratio * onlineDuration);
  };

  const offlineProgress = offlineDuration > 0 ? (offlineCurrentTime / offlineDuration) * 100 : 0;
  const onlineProgress = onlineDuration > 0 ? (onlineCurrentTime / onlineDuration) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
      <Header />
      
      {/* Background glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 dark:bg-pink-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Online Player Modal */}
      <NowPlayingModal
        song={currentOnlineSong}
        isOpen={isOnlinePlayerOpen}
        onClose={closeOnlinePlayer}
      />

      {/* Global Bottom Offline Player Bar */}
      <AnimatePresence>
        {currentOfflineSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 shadow-2xl shadow-black/10"
          >
            <div className="max-w-4xl mx-auto px-4 py-3">
              {/* Progress bar at top of player */}
              <div
                onClick={handleSeekOffline}
                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full cursor-pointer mb-3 group relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-100 relative"
                  style={{ width: `${offlineProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Album art */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                  {currentOfflineSong.albumArtwork ? (
                    <img src={currentOfflineSong.albumArtwork} alt={currentOfflineSong.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <Music className="w-5 h-5 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Song info */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentOfflineSong.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{currentOfflineSong.artist}</p>
                </div>

                {/* Time */}
                <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 hidden sm:block">
                  {formatTime(offlineCurrentTime)} / {formatTime(offlineDuration)}
                </div>

                {/* Play/Pause */}
                <button
                  onClick={toggleOfflinePlayPause}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isOfflinePlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Close */}
                <button
                  onClick={stopOfflinePlayback}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Bottom Online Player Bar */}
      <AnimatePresence>
        {currentOnlineSong && !isOnlinePlayerOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 shadow-2xl shadow-black/10"
          >
            <div className="max-w-4xl mx-auto px-4 py-3">
              {/* Progress bar at top of player */}
              <div
                onClick={handleSeekOnline}
                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full cursor-pointer mb-3 group relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-100 relative"
                  style={{ width: `${onlineProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Album art (Click to maximize) */}
                <div 
                  onClick={() => setIsOnlinePlayerOpen(true)}
                  className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md cursor-pointer hover:scale-105 transition-transform"
                >
                  {currentOnlineSong.albumArtwork ? (
                    <img src={currentOnlineSong.albumArtwork} alt={currentOnlineSong.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <Music className="w-5 h-5 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Song info (Click to maximize) */}
                <div 
                  onClick={() => setIsOnlinePlayerOpen(true)}
                  className="flex-grow min-w-0 cursor-pointer"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{currentOnlineSong.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{currentOnlineSong.artist}</p>
                </div>

                {/* Time */}
                <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 hidden sm:block">
                  {formatTime(onlineCurrentTime)} / {formatTime(onlineDuration)}
                </div>

                {/* Play/Pause */}
                <button
                  onClick={toggleOnlinePlayPause}
                  className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isOnlinePlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Close */}
                <button
                  onClick={stopOnlinePlayback}
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
