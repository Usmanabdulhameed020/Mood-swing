import React, { createContext, useState, useEffect, useCallback } from 'react';
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
        fetchStats
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
