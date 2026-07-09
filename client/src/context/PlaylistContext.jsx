import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';

export const PlaylistContext = createContext();

const LOADING_STAGES = [
  "Analyzing your mood...",
  "Finding matching songs...",
  "Creating your playlist...",
  "Almost done..."
];

export const PlaylistProvider = ({ children }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedMood, setSelectedMood] = useState(() => {
    return localStorage.getItem('selectedMood') || '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [activeTrackUrl, setActiveTrackUrl] = useState(null);

  // Global Online Playback State
  const [currentOnlineSong, setCurrentOnlineSong] = useState(null);
  const [isOnlinePlayerOpen, setIsOnlinePlayerOpen] = useState(false);

  // Global Offline Playback State
  const [currentOfflineSong, setCurrentOfflineSong] = useState(null);
  const [isOfflinePlaying, setIsOfflinePlaying] = useState(false);
  const [offlineCurrentTime, setOfflineCurrentTime] = useState(0);
  const [offlineDuration, setOfflineDuration] = useState(0);

  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);

  if (!audioRef.current && typeof window !== 'undefined') {
    audioRef.current = new Audio();
  }

  // Handle offline audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setOfflineCurrentTime(audio.currentTime);
    };
    const handleDurationChange = () => {
      setOfflineDuration(audio.duration || 0);
    };
    const handleEnded = () => {
      setIsOfflinePlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // Playback Control Functions
  const playOfflineSong = useCallback((song) => {
    // Pause online player if playing
    setIsOnlinePlayerOpen(false);

    const audio = audioRef.current;
    if (!audio) return;

    // Toggle play/pause if the same song is clicked
    if (currentOfflineSong && currentOfflineSong.id === song.id) {
      if (isOfflinePlaying) {
        audio.pause();
        setIsOfflinePlaying(false);
      } else {
        audio.play().catch(err => console.error("Audio playback error:", err));
        setIsOfflinePlaying(true);
      }
      return;
    }

    // Revoke old blob URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(song.blob);
    objectUrlRef.current = url;

    setCurrentOfflineSong(song);
    setOfflineCurrentTime(0);
    setOfflineDuration(0);

    audio.src = url;
    audio.play()
      .then(() => {
        setIsOfflinePlaying(true);
      })
      .catch(err => {
        console.error("Failed to play offline audio:", err);
        setIsOfflinePlaying(false);
      });
  }, [currentOfflineSong, isOfflinePlaying]);

  const toggleOfflinePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentOfflineSong) return;

    if (isOfflinePlaying) {
      audio.pause();
      setIsOfflinePlaying(false);
    } else {
      audio.play().catch(err => console.error("Audio playback error:", err));
      setIsOfflinePlaying(true);
    }
  }, [currentOfflineSong, isOfflinePlaying]);

  const seekOffline = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setOfflineCurrentTime(time);
  }, []);

  const stopOfflinePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setCurrentOfflineSong(null);
    setIsOfflinePlaying(false);
    setOfflineCurrentTime(0);
    setOfflineDuration(0);
  }, []);

  const playOnlineSong = useCallback((song) => {
    // Stop offline playback
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsOfflinePlaying(false);

    setCurrentOnlineSong(song);
    setIsOnlinePlayerOpen(true);
  }, []);

  const closeOnlinePlayer = useCallback(() => {
    setIsOnlinePlayerOpen(false);
  }, []);

  // Persistence of selected mood
  useEffect(() => {
    if (selectedMood) {
      localStorage.setItem('selectedMood', selectedMood);
    } else {
      localStorage.removeItem('selectedMood');
    }
  }, [selectedMood]);

  // Load initial data
  const fetchHistory = useCallback(async () => {
    try {
      const data = await api.get('/history');
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await api.get('/favorites');
      setFavorites(data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.get('/statistics');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchFavorites();
    fetchStats();
  }, [fetchHistory, fetchFavorites, fetchStats]);

  // Generate playlist function
  const generatePlaylist = async (mood) => {
    if (!mood) return;
    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingMessage(LOADING_STAGES[0]);

    // Animate the loading screen steps
    const intervalTime = 600; // Total duration around 2.4s (4 steps)
    let stage = 0;

    const loadingInterval = setInterval(() => {
      stage += 1;
      if (stage < LOADING_STAGES.length) {
        setLoadingMessage(LOADING_STAGES[stage]);
        setLoadingProgress((stage / LOADING_STAGES.length) * 100);
      } else {
        setLoadingProgress(100);
        clearInterval(loadingInterval);
      }
    }, intervalTime);

    try {
      const playlist = await api.post('/playlists/generate', { mood });
      setCurrentPlaylist(playlist);
      
      // Update history and stats immediately
      fetchHistory();
      fetchStats();
    } catch (err) {
      setError('Could not generate playlist. Please make sure the backend is running.');
      console.error(err);
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
    }
  };

  // Favorite toggle function
  const toggleFavorite = async (playlist) => {
    const isFav = favorites.some(fav => fav.id === playlist.id);
    try {
      if (isFav) {
        await api.delete(`/favorites/${playlist.id}`);
        setFavorites(prev => prev.filter(fav => fav.id !== playlist.id));
      } else {
        await api.post('/favorites', { playlist });
        setFavorites(prev => [playlist, ...prev]);
      }
      // Update stats as favorited mood might change
      fetchStats();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        currentPlaylist,
        setCurrentPlaylist,
        history,
        favorites,
        stats,
        selectedMood,
        setSelectedMood,
        isLoading,
        loadingMessage,
        loadingProgress,
        error,
        activeTrackUrl,
        setActiveTrackUrl,
        generatePlaylist,
        toggleFavorite,
        fetchHistory,
        fetchFavorites,
        fetchStats,
        currentOnlineSong,
        setCurrentOnlineSong,
        isOnlinePlayerOpen,
        setIsOnlinePlayerOpen,
        currentOfflineSong,
        setCurrentOfflineSong,
        isOfflinePlaying,
        setIsOfflinePlaying,
        offlineCurrentTime,
        offlineDuration,
        playOfflineSong,
        toggleOfflinePlayPause,
        seekOffline,
        stopOfflinePlayback,
        playOnlineSong,
        closeOnlinePlayer
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
