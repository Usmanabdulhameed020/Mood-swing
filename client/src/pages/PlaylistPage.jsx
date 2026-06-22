import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Music } from 'lucide-react';
import { usePlaylist } from '../hooks/usePlaylist';
import PlaylistCover from '../components/playlist/PlaylistCover';
import PlaylistHeader from '../components/playlist/PlaylistHeader';
import SongList from '../components/playlist/SongList';
import PlaylistActions from '../components/playlist/PlaylistActions';
import ListeningTips from '../components/playlist/ListeningTips';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function PlaylistPage() {
  const { currentPlaylist, toggleFavorite, favorites, setSelectedMood, setCurrentPlaylist } = usePlaylist();
  const navigate = useNavigate();

  if (!currentPlaylist) {
    return (
      <EmptyState
        title="No playlist suggestions yet"
        message="You haven't generated a playlist during this session. Select a mood on the home page to start!"
        icon={Music}
      >
        <Button
          onClick={() => navigate('/')}
          variant="primary"
          icon={<Sparkles className="w-4 h-4" />}
        >
          Go to Mood Selector
        </Button>
      </EmptyState>
    );
  }

  const isFav = favorites.some(fav => fav.id === currentPlaylist.id);

  const handleGenerateAnother = () => {
    // Clear current selection and navigate home
    setSelectedMood('');
    setCurrentPlaylist(null);
    navigate('/');
  };

  const handleToggleFav = () => {
    toggleFavorite(currentPlaylist);
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Back button or page subheader */}
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={handleGenerateAnother} variant="secondary" className="px-4 py-2">
          &larr; Back to Selection
        </Button>
      </div>

      {/* Playlist Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Art and Meta - spans 4 cols */}
        <div className="lg:col-span-4 flex flex-col gap-6 text-center lg:text-left">
          <PlaylistCover
            mood={currentPlaylist.mood}
            name={currentPlaylist.name}
            coverGradient={currentPlaylist.coverGradient}
            songs={currentPlaylist.songs}
          />
          <PlaylistHeader
            name={currentPlaylist.name}
            mood={currentPlaylist.mood}
            description={currentPlaylist.description}
            createdAt={currentPlaylist.createdAt}
          />
        </div>

        {/* Right Songs List - spans 8 cols */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-150 uppercase tracking-wider text-left pl-1">
            Matching Suggestions
          </h2>
          <SongList songs={currentPlaylist.songs} />
        </div>
      </div>

      {/* Footer Details: Actions and Listening Tips */}
      <div className="mt-8 border-t border-slate-200/50 dark:border-zinc-800/40 pt-8">
        <PlaylistActions
          playlist={currentPlaylist}
          onGenerateAnother={handleGenerateAnother}
          isFavorite={isFav}
          onToggleFavorite={handleToggleFav}
        />
        
        <ListeningTips tips={currentPlaylist.tips} />
      </div>
    </div>
  );
}
