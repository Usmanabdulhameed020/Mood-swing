import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Play, Heart, Calendar, Clock } from 'lucide-react';
import { usePlaylist } from '../hooks/usePlaylist';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function HistoryPage() {
  const { history, favorites, toggleFavorite, setCurrentPlaylist } = usePlaylist();
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState('');
  const navigate = useNavigate();

  const handleSelectPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    navigate('/playlist');
  };

  const handleToggleFav = (e, playlist) => {
    e.stopPropagation();
    toggleFavorite(playlist);
  };

  const isFavorite = (id) => favorites.some(fav => fav.id === id);

  // Filter & Search logic
  const filteredHistory = history.filter(pl => {
    const matchesMood = filterMood ? pl.mood.toLowerCase() === filterMood.toLowerCase() : true;
    
    const searchLower = search.toLowerCase();
    const matchesSearch = searchLower
      ? pl.name.toLowerCase().includes(searchLower) ||
        pl.description.toLowerCase().includes(searchLower) ||
        pl.songs.some(s => s.title.toLowerCase().includes(searchLower) || s.artist.toLowerCase().includes(searchLower))
      : true;

    return matchesMood && matchesSearch;
  });

  if (history.length === 0) {
    return (
      <EmptyState
        title="No history yet"
        message="You haven't generated any playlists yet. Head over to the home page to create your first one!"
        icon={History}
      >
        <Button onClick={() => navigate('/')} variant="primary">
          Create Playlist
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Title */}
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-zinc-50 tracking-tight uppercase flex items-center justify-center md:justify-start gap-3">
          <History className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          Recently Generated Playlists
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
          A list of all playlist suggestions you have generated.
        </p>
      </div>

      {/* Search and Filters */}
      <SearchBar
        value={search}
        onChange={setSearch}
        selectedFilter={filterMood}
        onFilterChange={setFilterMood}
        placeholder="Search playlist name, artist or song..."
      />

      {/* Grid List */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          title="No search results"
          message="We couldn't find any playlists matching your search criteria. Try a different query."
          icon={History}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredHistory.map((pl) => {
            const isFav = isFavorite(pl.id);
            return (
              <Card
                key={pl.id}
                onClick={() => handleSelectPlaylist(pl)}
                className="group cursor-pointer flex flex-col justify-between border-slate-200/50 dark:border-zinc-800/40 relative"
              >
                {/* Card top cover gradient strip */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${pl.coverGradient}`} />
                
                <div className="pt-2">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <Badge mood={pl.mood} />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(pl.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-black text-slate-800 dark:text-zinc-150 uppercase truncate leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {pl.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {pl.description}
                  </p>

                  {/* Song list preview */}
                  <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-100 dark:border-zinc-800/50 pt-3">
                    {pl.songs.slice(0, 3).map((song, i) => (
                      <div key={i} className="text-xs font-semibold text-slate-500 dark:text-zinc-400 truncate flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 dark:text-zinc-650">{i + 1}</span>
                        <span className="font-bold text-slate-700 dark:text-zinc-350">{song.title}</span>
                        <span className="text-slate-400 dark:text-zinc-500">&bull;</span>
                        <span className="truncate">{song.artist}</span>
                      </div>
                    ))}
                    {pl.songs.length > 3 && (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold mt-1">
                        + {pl.songs.length - 3} more songs
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions footer */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/50 pt-3">
                  <Button
                    variant="outline"
                    className="px-3 py-1.5 text-xs rounded-lg"
                    icon={<Play className="w-3.5 h-3.5" fill="currentColor" />}
                    onClick={() => handleSelectPlaylist(pl)}
                  >
                    View Playlist
                  </Button>
                  
                  <button
                    onClick={(e) => handleToggleFav(e, pl)}
                    className={`p-2 rounded-full cursor-pointer transition-colors ${
                      isFav 
                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20' 
                        : 'text-slate-400 dark:text-zinc-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-zinc-800/40'
                    }`}
                    title={isFav ? "Remove from favorites" : "Save to favorites"}
                  >
                    <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
