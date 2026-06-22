import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Trash2, Calendar, Music } from 'lucide-react';
import { usePlaylist } from '../hooks/usePlaylist';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, setCurrentPlaylist } = usePlaylist();
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState('');
  const navigate = useNavigate();

  const handleSelectPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    navigate('/playlist');
  };

  const handleRemove = (e, playlist) => {
    e.stopPropagation();
    toggleFavorite(playlist);
  };

  // Filter & Search logic
  const filteredFavorites = favorites.filter(fav => {
    const matchesMood = filterMood ? fav.mood.toLowerCase() === filterMood.toLowerCase() : true;
    
    const searchLower = search.toLowerCase();
    const matchesSearch = searchLower
      ? fav.name.toLowerCase().includes(searchLower) ||
        fav.description.toLowerCase().includes(searchLower) ||
        fav.songs.some(s => s.title.toLowerCase().includes(searchLower) || s.artist.toLowerCase().includes(searchLower))
      : true;

    return matchesMood && matchesSearch;
  });

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites saved"
        message="Browse your generated playlist results and save them to your library to view them here."
        icon={Heart}
      >
        <Button onClick={() => navigate('/')} variant="primary">
          Generate Playlists
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Title */}
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-zinc-50 tracking-tight uppercase flex items-center justify-center md:justify-start gap-3">
          <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
          Favorite Playlists
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
          Your curated selection of saved AI music recommendations.
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
      {filteredFavorites.length === 0 ? (
        <EmptyState
          title="No search results"
          message="We couldn't find any saved playlists matching your search criteria. Try a different query."
          icon={Heart}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredFavorites.map((fav) => (
            <Card
              key={fav.id}
              onClick={() => handleSelectPlaylist(fav)}
              className="group cursor-pointer flex flex-col justify-between border-slate-200/50 dark:border-zinc-800/40 relative"
            >
              {/* Card top cover gradient strip */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${fav.coverGradient}`} />
              
              <div className="pt-2">
                {/* Header */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <Badge mood={fav.mood} />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(fav.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-black text-slate-800 dark:text-zinc-150 uppercase truncate leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {fav.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {fav.description}
                </p>

                {/* Song list preview */}
                <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-100 dark:border-zinc-800/50 pt-3">
                  {fav.songs.slice(0, 3).map((song, i) => (
                    <div key={i} className="text-xs font-semibold text-slate-500 dark:text-zinc-400 truncate flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-650">{i + 1}</span>
                      <span className="font-bold text-slate-700 dark:text-zinc-350">{song.title}</span>
                      <span className="text-slate-400 dark:text-zinc-500">&bull;</span>
                      <span className="truncate">{song.artist}</span>
                    </div>
                  ))}
                  {fav.songs.length > 3 && (
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold mt-1">
                      + {fav.songs.length - 3} more songs
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
                  onClick={() => handleSelectPlaylist(fav)}
                >
                  Listen
                </Button>
                
                <button
                  onClick={(e) => handleRemove(e, fav)}
                  className="p-2 rounded-full cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
