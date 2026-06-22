import React from 'react';
import { Music, Flame, Sparkles, Heart, Disc, ListMusic } from 'lucide-react';
import Card from '../common/Card';
import { MOODS } from '../../utils/constants';

export default function StatsOverview({ stats }) {
  if (!stats) return null;

  const getMoodEmoji = (moodId) => {
    const mood = MOODS.find(m => m.id === moodId.toLowerCase());
    return mood ? mood.emoji : '🎵';
  };

  const getMoodLabel = (moodId) => {
    const mood = MOODS.find(m => m.id === moodId.toLowerCase());
    return mood ? mood.label : moodId;
  };

  const cards = [
    {
      title: "Playlists Created",
      value: stats.totalPlaylists,
      icon: Music,
      color: "text-purple-500",
      bg: "bg-purple-100/50 dark:bg-purple-950/20"
    },
    {
      title: "Favorites Saved",
      value: stats.totalFavorites || 0,
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-100/50 dark:bg-pink-950/20"
    },
    {
      title: "Most Selected Mood",
      value: stats.mostSelectedMood !== 'None' ? getMoodLabel(stats.mostSelectedMood) : 'None',
      emoji: stats.mostSelectedMood !== 'None' ? getMoodEmoji(stats.mostSelectedMood) : null,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-100/50 dark:bg-orange-950/20"
    },
    {
      title: "Favorite Mood",
      value: stats.favoriteMood !== 'None' ? getMoodLabel(stats.favoriteMood) : 'None',
      emoji: stats.favoriteMood !== 'None' ? getMoodEmoji(stats.favoriteMood) : null,
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-100/50 dark:bg-red-950/20"
    },
    {
      title: "Top Genre",
      value: stats.mostListenedGenre || 'None',
      icon: Disc,
      color: "text-blue-500",
      bg: "bg-blue-100/50 dark:bg-blue-950/20"
    },
    {
      title: "Avg Songs / Playlist",
      value: stats.avgSongsGenerated || 0,
      icon: ListMusic,
      color: "text-emerald-500",
      bg: "bg-emerald-100/50 dark:bg-emerald-950/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} hoverEffect={false} className="flex items-center gap-4 py-5 px-6 border-slate-200/50 dark:border-zinc-800/40">
            <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center flex-shrink-0 text-xl font-bold`}>
              {card.emoji ? <span>{card.emoji}</span> : <Icon className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-zinc-150 mt-1 capitalize leading-none truncate max-w-[200px]">
                {card.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
