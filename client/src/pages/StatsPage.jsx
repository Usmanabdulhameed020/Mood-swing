import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlaylist } from '../hooks/usePlaylist';
import StatsOverview from '../components/stats/StatsOverview';
import MoodDistribution from '../components/stats/MoodDistribution';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

function WeeklyActivityChart({ weeklyActivity }) {
  if (!weeklyActivity || weeklyActivity.length === 0) return null;
  const maxCount = Math.max(...weeklyActivity.map(d => d.count), 1);

  return (
    <Card className="max-w-2xl mx-auto w-full mt-6" hoverEffect={false}>
      <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-6 pb-3 border-b border-slate-200/50 dark:border-zinc-800/40">
        Weekly Activity (Last 7 Days)
      </h3>
      <div className="flex items-end gap-3 h-32">
        {weeklyActivity.map((day, i) => {
          const heightPct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
          return (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                {day.count > 0 ? day.count : ''}
              </span>
              <div className="w-full bg-slate-100 dark:bg-zinc-800/50 rounded-lg overflow-hidden h-24 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPct, day.count > 0 ? 8 : 0)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
                  className="w-full rounded-lg bg-gradient-to-t from-purple-600 to-pink-500"
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default function StatsPage() {
  const { stats, fetchStats } = usePlaylist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const hasStats = stats && stats.totalPlaylists > 0;

  if (!hasStats) {
    return (
      <EmptyState
        title="No statistics available yet"
        message="Generate some playlist recommendations first so we can analyze your listening activity and mood trends."
        icon={BarChart3}
      >
        <Button
          onClick={() => navigate('/')}
          variant="primary"
          icon={<Sparkles className="w-4 h-4" />}
        >
          Create a Playlist
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Title */}
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-zinc-50 tracking-tight uppercase flex items-center justify-center md:justify-start gap-3">
          <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          Listening Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
          Real-time insights from your generated mood playlists.
        </p>
      </div>

      {/* Grid Summary Cards */}
      <StatsOverview stats={stats} />

      {/* Weekly Activity Bar Chart */}
      <WeeklyActivityChart weeklyActivity={stats.weeklyActivity} />

      {/* Mood Distribution bar chart */}
      <div className="mt-6">
        <MoodDistribution distribution={stats.moodDistribution} />
      </div>
    </div>
  );
}
