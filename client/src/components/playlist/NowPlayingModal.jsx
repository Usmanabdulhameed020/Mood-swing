import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, AlertCircle, Play, Pause, Download, Check, Loader2 } from 'lucide-react';
import YouTube from 'react-youtube';
import LoadingSpinner from '../common/LoadingSpinner';
import { saveSongOffline } from '../../utils/offlineDb';

// Parse LRC format: "[mm:ss.xx] lyrics line" into { time: seconds, text: string }
function parseSyncedLyrics(lrc) {
  const lines = lrc.split('\n');
  const parsed = [];
  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s?(.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = parseInt(match[3], 10);
      const time = minutes * 60 + seconds + ms / (match[3].length === 3 ? 1000 : 100);
      const text = match[4].trim();
      if (text) {
        parsed.push({ time, text });
      }
    }
  }
  return parsed;
}

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function parseDurationToSeconds(durationStr) {
  if (!durationStr) return 240; // Default 4 minutes
  const parts = durationStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 240;
}

export default function NowPlayingModal({ song, isOpen, onClose }) {
  const [youtubeId, setYoutubeId] = useState(null);
  const [syncedLyrics, setSyncedLyrics] = useState(null);
  const [plainLyrics, setPlainLyrics] = useState(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(true);
  const [lyricsError, setLyricsError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle | downloading | done | error
  const [downloadProgress, setDownloadProgress] = useState(0);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const activeLineRef = useRef(null);
  const prevActiveLineRef = useRef(-1);

  useEffect(() => {
    if (isOpen && song) {
      // Reset all states
      setYoutubeId(null);
      setSyncedLyrics(null);
      setPlainLyrics(null);
      setIsLoadingVideo(true);
      setIsLoadingLyrics(true);
      setLyricsError(false);
      setIsPlaying(false);
      setActiveLine(-1);
      setCurrentTime(0);
      setDuration(0);
      setDownloadStatus('idle');
      setDownloadProgress(0);
      playerRef.current = null;
      prevActiveLineRef.current = -1;
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      // Fetch YouTube ID
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/api/youtube?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`)
        .then(res => res.json())
        .then(data => {
          if (data.youtubeId) setYoutubeId(data.youtubeId);
          else setIsLoadingVideo(false);
        })
        .catch(() => setIsLoadingVideo(false));
        
      // Fetch Synced Lyrics from lrclib.net
      fetch(`https://lrclib.net/api/search?track_name=${encodeURIComponent(song.title)}&artist_name=${encodeURIComponent(song.artist)}`)
        .then(res => {
          if (!res.ok) throw new Error("Lyrics not found");
          return res.json();
        })
        .then(data => {
          if (data && data.length > 0) {
            const best = data[0];
            if (best.syncedLyrics) {
              const parsed = parseSyncedLyrics(best.syncedLyrics);
              if (parsed.length > 0) {
                setSyncedLyrics(parsed);
                setIsLoadingLyrics(false);
                return;
              }
            }
            if (best.plainLyrics) {
              setPlainLyrics(best.plainLyrics);
              setIsLoadingLyrics(false);
              return;
            }
          }
          throw new Error("No lyrics in response");
        })
        .catch(() => {
          // Try fallback API
          fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.title)}`)
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
              if (data.lyrics) {
                setPlainLyrics(data.lyrics.replace(/Paroles de la chanson.*?(\r\n|\n)/i, ''));
              } else {
                setLyricsError(true);
              }
            })
            .catch(() => setLyricsError(true))
            .finally(() => setIsLoadingLyrics(false));
        });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, song]);

  // Auto-scroll to active lyric line only when it changes
  useEffect(() => {
    if (activeLine !== prevActiveLineRef.current && activeLine >= 0) {
      prevActiveLineRef.current = activeLine;
      if (activeLineRef.current && lyricsContainerRef.current) {
        activeLineRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeLine]);

  // Start polling YouTube player for current time and lyrics sync
  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const time = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        setCurrentTime(time);
        if (dur > 0) setDuration(dur);

        // Find active lyric line
        if (syncedLyrics) {
          let lineIndex = -1;
          for (let i = syncedLyrics.length - 1; i >= 0; i--) {
            if (time >= syncedLyrics[i].time - 0.3) {
              lineIndex = i;
              break;
            }
          }
          setActiveLine(lineIndex);
        }
      } catch (e) {
        // player might not be ready
      }
    }, 100); // Poll every 100ms for smooth progress and accurate sync
  }, [syncedLyrics]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Restart polling when syncedLyrics loads (might load after player starts)
  useEffect(() => {
    if (syncedLyrics && isPlaying && playerRef.current) {
      startPolling();
    }
  }, [syncedLyrics, isPlaying, startPolling]);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) { // playing
      setIsLoadingVideo(false);
      setIsPlaying(true);
      const dur = playerRef.current?.getDuration();
      if (dur > 0) setDuration(dur);
      startPolling();
    } else if (event.data === 2) { // paused
      setIsPlaying(false);
      stopPolling();
    } else if (event.data === 0) { // ended
      setIsPlaying(false);
      stopPolling();
      setCurrentTime(duration);
    }
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Seek via progress bar
  const handleSeek = (e) => {
    if (!playerRef.current || !duration) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = ratio * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  // Click a lyric line to seek
  const seekToLine = (index) => {
    if (!playerRef.current || !syncedLyrics) return;
    playerRef.current.seekTo(syncedLyrics[index].time, true);
    setActiveLine(index);
    setCurrentTime(syncedLyrics[index].time);
  };

  const handleClose = () => {
    stopPolling();
    if (playerRef.current) {
      try { playerRef.current.stopVideo(); } catch (e) {}
    }
    onClose();
  };

  const handleDownload = async () => {
    if (!youtubeId || downloadStatus === 'downloading') return;
    setDownloadStatus('downloading');
    setDownloadProgress(0);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/download/${youtubeId}`);
      if (!response.ok) throw new Error('Download failed');

      // Estimate total size
      const durationSecs = parseDurationToSeconds(song.duration);
      const estimatedTotalBytes = durationSecs * 192000 / 8; // Estimate using 192 kbps bitrate

      const reader = response.body.getReader();
      const chunks = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;
        
        // Calculate progress percentage, cap at 99% until complete
        const pct = Math.min(99, Math.round((receivedBytes / estimatedTotalBytes) * 100));
        setDownloadProgress(pct);
      }

      const blob = new Blob(chunks);
      await saveSongOffline({
        youtubeId,
        title: song.title,
        artist: song.artist,
        albumArtwork: song.albumArtwork
      }, blob);
      
      setDownloadProgress(100);
      setDownloadStatus('done');
    } catch (err) {
      console.error('Download error:', err);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  if (!isOpen || !song) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Column: Player & Controls */}
          <div className="w-full md:w-[45%] bg-slate-100 dark:bg-zinc-900 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-zinc-800 relative flex flex-col min-h-[400px]">
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition-colors z-10 md:hidden"
            >
              <X className="w-5 h-5 text-slate-800 dark:text-white" />
            </button>
            
            <div className="flex-grow flex flex-col items-center justify-center w-full my-auto py-8">
              {/* Album Art */}
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl mb-6 flex-shrink-0 relative">
                {song.albumArtwork ? (
                  <img src={song.albumArtwork.replace('500x500bb', '1000x1000bb')} alt={song.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <Music className="w-14 h-14 text-white/50" />
                  </div>
                )}
                {isLoadingVideo && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <LoadingSpinner size="large" />
                  </div>
                )}
              </div>

              {/* Song Info */}
              <div className="text-center w-full mb-6">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1 line-clamp-2">
                  {song.title}
                </h2>
                <p className="text-sm md:text-base font-medium text-slate-500 dark:text-zinc-400">
                  {song.artist}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-[280px] mb-8">
                <div
                  onClick={handleSeek}
                  className="w-full h-2 bg-slate-300 dark:bg-zinc-700 rounded-full cursor-pointer relative group"
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-100 relative"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Knob */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-zinc-200 rounded-full shadow-md border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-500 dark:text-zinc-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                <button
                  onClick={togglePlayPause}
                  disabled={isLoadingVideo}
                  className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoadingVideo ? (
                    <LoadingSpinner size="small" />
                  ) : isPlaying ? (
                    <Pause className="w-7 h-7" fill="currentColor" />
                  ) : (
                    <Play className="w-7 h-7 ml-1" fill="currentColor" />
                  )}
                </button>

                {youtubeId && (
                  <button
                    onClick={handleDownload}
                    disabled={downloadStatus === 'downloading'}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:cursor-wait ${
                      downloadStatus === 'done'
                        ? 'bg-green-500 text-white'
                        : downloadStatus === 'error'
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                    title={downloadStatus === 'done' ? 'Saved for offline!' : downloadStatus === 'error' ? 'Download failed' : 'Save for offline'}
                  >
                    {downloadStatus === 'downloading' ? (
                      <div className="flex flex-col items-center justify-center text-[10px] font-black text-purple-600 dark:text-purple-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin mb-0.5" />
                        <span>{downloadProgress}%</span>
                      </div>
                    ) : downloadStatus === 'done' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Hidden YouTube Player */}
            {youtubeId && (
              <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                <YouTube 
                  videoId={youtubeId} 
                  opts={{ height: '1', width: '1', playerVars: { autoplay: 1 } }} 
                  onReady={onPlayerReady} 
                  onStateChange={onPlayerStateChange} 
                />
              </div>
            )}
          </div>

          {/* Right Column: Lyrics */}
          <div className="w-full md:w-[55%] flex flex-col relative h-[50vh] md:h-[80vh]">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-full transition-colors z-10 hidden md:block"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 md:p-8 flex-grow flex flex-col h-full overflow-hidden">
              <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2 flex-shrink-0">
                <Music className="w-5 h-5 text-purple-500" />
                Lyrics
              </h3>
              
              <div 
                ref={lyricsContainerRef}
                className="flex-grow overflow-y-auto pr-2"
                style={{ scrollbarWidth: 'thin' }}
              >
                {isLoadingLyrics ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-zinc-500 space-y-4">
                    <LoadingSpinner size="medium" />
                    <p>Finding lyrics...</p>
                  </div>
                ) : syncedLyrics ? (
                  <div className="flex flex-col gap-0.5 pb-40 pt-4">
                    {syncedLyrics.map((line, i) => (
                      <button
                        key={i}
                        ref={i === activeLine ? activeLineRef : null}
                        onClick={() => seekToLine(i)}
                        className={`text-left px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer leading-relaxed ${
                          i === activeLine
                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-lg'
                            : i < activeLine
                              ? 'text-slate-400 dark:text-zinc-600 text-base font-medium'
                              : 'text-slate-700 dark:text-zinc-300 text-base font-medium hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        {line.text}
                      </button>
                    ))}
                  </div>
                ) : plainLyrics ? (
                  <div className="whitespace-pre-wrap font-medium text-base text-slate-700 dark:text-zinc-300 leading-relaxed pb-8">
                    {plainLyrics}
                  </div>
                ) : lyricsError ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-zinc-500 space-y-4 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-400 dark:text-zinc-600" />
                    <p className="text-lg font-semibold">No lyrics found for this song.</p>
                    <p className="text-sm">Just enjoy the music!</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
