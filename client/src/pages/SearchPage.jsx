import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music, AlertCircle } from 'lucide-react';
import SongCard from '../components/playlist/SongCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlaylistContext } from '../context/PlaylistContext';

export default function SearchPage() {
  const { playOnlineSong } = useContext(PlaylistContext);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      fetchSongs(searchTerm, 0, true);
    }
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced suggestions fetch
  const fetchSuggestions = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsFetchingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';
        const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q.trim())}&offset=0`);
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setSuggestions(data.slice(0, 6)); // Show max 6 suggestions
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 400);
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSuggestionClick = (song) => {
    setShowSuggestions(false);
    playOnlineSong(song);
  };

  const handleSuggestionSearch = (text) => {
    setQuery(text);
    setShowSuggestions(false);
    setSearchTerm(text);
  };

  const fetchSongs = async (q, currentOffset = 0, isNewSearch = false) => {
    if (!q) return;
    if (isNewSearch) {
      setIsLoading(true);
      setOffset(0);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);
    try {
      const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';
      const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}&offset=${currentOffset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      if (isNewSearch) {
        setSongs(data);
      } else {
        setSongs(prev => [...prev, ...data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim() && query.trim() !== searchTerm) {
      setSearchTerm(query.trim());
    }
  };

  const handleLoadMore = () => {
    const nextOffset = offset + 20;
    setOffset(nextOffset);
    fetchSongs(searchTerm, nextOffset, false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Explore <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Music</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-zinc-400">
          Search for your favorite tracks, artists, or genres and play full songs instantly.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto mb-12 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
        <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm">
          <Search className="w-6 h-6 text-slate-400 dark:text-zinc-500 ml-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            placeholder="Search for songs (e.g. The Weeknd, Lofi, Pop...)"
            className="flex-grow bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 px-4 py-3 text-lg"
            autoComplete="off"
          />
          {isFetchingSuggestions && (
            <div className="mr-2">
              <LoadingSpinner size="small" />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-md disabled:opacity-70 cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {suggestions.map((song, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestionClick(song)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors text-left cursor-pointer border-b border-slate-100 dark:border-zinc-800/50 last:border-0"
                >
                  {/* Mini artwork */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    {song.albumArtwork ? (
                      <img src={song.albumArtwork} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                        <Music className="w-4 h-4 text-white/60" />
                      </div>
                    )}
                  </div>
                  {/* Song info */}
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{song.title}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{song.artist}</p>
                  </div>
                  {/* Genre badge */}
                  {song.genre && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                      {song.genre}
                    </span>
                  )}
                </button>
              ))}
              {/* Search for all results */}
              <button
                type="button"
                onClick={() => handleSuggestionSearch(query.trim())}
                className="w-full px-4 py-3 text-center text-sm font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors cursor-pointer"
              >
                See all results for "{query.trim()}"
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-slate-500 dark:text-zinc-400 animate-pulse">Finding full tracks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-6 rounded-2xl flex items-center gap-4">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <p className="font-medium text-lg">{error}</p>
          </div>
        ) : songs.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl p-4 md:p-8 shadow-xl border border-white/20 dark:border-zinc-800/50"
          >
            <div className="flex items-center justify-between mb-6 px-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-500" />
                Results for "{searchTerm}"
              </h2>
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                {songs.length} Tracks
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              {songs.map((song, index) => (
                <SongCard key={index + '-' + song.title + '-' + song.artist} song={song} index={index} onPlay={playOnlineSong} />
              ))}
            </div>

            {/* Load More Button */}
            {songs.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingMore}
                  className="px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-full font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isFetchingMore ? (
                    <>
                      <LoadingSpinner size="small" />
                      Loading more...
                    </>
                  ) : (
                    'Load More Tracks'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        ) : !searchTerm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Search className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-200 mb-2">Search for any song</h3>
            <p className="text-slate-500 dark:text-zinc-500 max-w-md mx-auto">
              Type an artist name, song title, or genre above and hit Search to discover and play full tracks.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-8">
              {['Adele', 'Drake', 'Taylor Swift', 'The Weeknd', 'Ed Sheeran', 'Billie Eilish'].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); setSearchTerm(tag); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-full text-sm font-semibold transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <Music className="w-16 h-16 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-zinc-300">No songs found</h3>
            <p className="text-slate-500 dark:text-zinc-500 mt-2">Try a different search term to explore new music.</p>
          </div>
        )}
      </div>

    </div>
  );
}
