import { useContext } from 'react';
import { PlaylistContext } from '../context/PlaylistContext';

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
