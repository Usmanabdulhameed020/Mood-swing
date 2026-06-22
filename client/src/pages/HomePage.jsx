import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import MoodSelector from '../components/home/MoodSelector';
import Button from '../components/common/Button';
import LoadingScreen from '../components/loading/LoadingScreen';
import { usePlaylist } from '../hooks/usePlaylist';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const {
    selectedMood,
    setSelectedMood,
    generatePlaylist,
    isLoading,
    loadingMessage,
    loadingProgress,
    currentPlaylist,
    error
  } = usePlaylist();
  
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (selectedMood) {
      generatePlaylist(selectedMood);
    }
  };

  // Redirect to playlist result page once it's generated
  useEffect(() => {
    if (currentPlaylist && !isLoading) {
      navigate('/playlist');
    }
  }, [currentPlaylist, isLoading, navigate]);

  return (
    <div className="flex flex-col items-center">
      {/* Loading Overlay */}
      {isLoading && (
        <LoadingScreen 
          message={loadingMessage} 
          progress={loadingProgress} 
        />
      )}

      {/* Hero Header */}
      <HeroSection />

      {/* Grid selector */}
      <div className="w-full max-w-6xl mb-8">
        <MoodSelector
          selectedMood={selectedMood}
          onSelect={setSelectedMood}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="text-red-500 font-bold text-sm mb-6 p-4 rounded-xl bg-red-100/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-center max-w-md">
          {error}
        </div>
      )}

      {/* Generate Action Button */}
      <div className="mt-4 mb-8">
        <Button
          onClick={handleGenerate}
          disabled={!selectedMood || isLoading}
          variant="primary"
          className="text-base px-8 py-4 shadow-xl"
          icon={<Sparkles className="w-5 h-5 animate-pulse" />}
        >
          Generate AI Playlist
        </Button>
      </div>
    </div>
  );
}
