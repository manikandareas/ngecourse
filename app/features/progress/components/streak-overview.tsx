import { Calendar, Flame, Target, TrendingUp } from 'lucide-react';
import type { User } from 'sanity.types';
import { cn } from '~/lib/utils';

interface StreakOverviewProps {
  user: User | null;
  className?: string;
}

export function StreakOverview({ user, className }: StreakOverviewProps) {
  const currentStreak = user?.studyStreak || 0;
  const streakStartDate = user?.streakStartDate;
  const analytics = user?.analytics;
  
  // Calculate longest streak (for now, we'll use current streak as longest)
  // In a real app, you might store this separately or calculate from historical data
  const longestStreak = currentStreak; // This would come from analytics data
  
  const streakStats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak}`,
      unit: 'days',
      color: currentStreak > 0 ? 'text-accent' : 'text-text-secondary',
    },
    {
      icon: TrendingUp,
      label: 'Longest Streak',
      value: `${longestStreak}`,
      unit: 'days',
      color: longestStreak > 7 ? 'text-success' : 'text-text-secondary',
    },
    {
      icon: Target,
      label: 'XP Earned',
      value: `${analytics?.totalXP || 0}`,
      unit: 'XP',
      color: 'text-info',
    },
    {
      icon: Calendar,
      label: 'Study Time',
      value: `${Math.floor((analytics?.totalStudyTimeMinutes || 0) / 60)}`,
      unit: 'hours',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main streak display */}
      <div className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Flame className={cn('h-8 w-8', currentStreak > 0 ? 'text-accent' : 'text-text-secondary')} />
          <span className="font-bold text-4xl text-text-primary">
            {currentStreak}
          </span>
        </div>
        <p className="text-text-secondary">
          {currentStreak === 0 
            ? "Start your learning streak today!" 
            : currentStreak === 1
              ? "Great start! Keep it going."
              : `${currentStreak} day learning streak! 🎉`
          }
        </p>
        {streakStartDate && currentStreak > 0 && (
          <p className="mt-1 text-xs text-text-secondary">
            Started {new Date(streakStartDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {streakStats.map((stat) => (
          <div
            key={stat.label}
            className="tinted-blur-subtle rounded-xl p-4 text-center"
          >
            <stat.icon className={cn('mx-auto mb-2 h-5 w-5', stat.color)} />
            <div className={cn('font-bold text-lg', stat.color)}>
              {stat.value}
              <span className="ml-1 font-normal text-sm text-text-secondary">
                {stat.unit}
              </span>
            </div>
            <p className="text-text-secondary text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Streak motivation */}
      {currentStreak > 0 && (
        <div className="tinted-blur-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm text-text-primary">
              Keep Going!
            </span>
          </div>
          <p className="text-text-secondary text-xs">
            {currentStreak < 7
              ? `${7 - currentStreak} more days to reach a week streak!`
              : currentStreak < 30
                ? `${30 - currentStreak} more days to reach a month streak!`
                : "You're on an amazing learning journey! 🚀"
            }
          </p>
        </div>
      )}

      {/* First-time user encouragement */}
      {currentStreak === 0 && (
        <div className="tinted-blur-subtle rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm text-text-primary">
              Start Your Streak
            </span>
          </div>
          <p className="text-text-secondary text-xs">
            Complete a lesson or quiz today to begin your learning streak!
          </p>
        </div>
      )}
    </div>
  );
}