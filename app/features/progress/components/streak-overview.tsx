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

  // Generate 7-day streak indicator
  const generateWeeklyStreak = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Simplified logic: if current streak is greater than days ago, mark as active
      // In real implementation, you'd have daily completion data
      const isActive = currentStreak > i;
      const isToday = i === 0;

      days.push({
        date,
        isActive,
        isToday,
        dayName: date
          .toLocaleDateString('en', { weekday: 'short' })
          .substring(0, 1),
      });
    }
    return days;
  };

  const weeklyStreak = generateWeeklyStreak();

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
          <Flame
            className={cn(
              'h-8 w-8',
              currentStreak > 0 ? 'text-accent' : 'text-text-secondary'
            )}
          />
          <span className="font-bold text-4xl text-text-primary">
            {currentStreak}
          </span>
        </div>
        <p className="text-text-secondary">
          {currentStreak === 0
            ? 'Start your learning streak today!'
            : currentStreak === 1
              ? 'Great start! Keep it going.'
              : `${currentStreak} day learning streak! 🎉`}
        </p>
        {streakStartDate && currentStreak > 0 && (
          <p className="mt-1 text-text-secondary text-xs">
            Started {new Date(streakStartDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* 7-Day Streak Indicator */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-text-primary">This Week</h4>
        <div className="flex justify-between gap-1">
          {weeklyStreak.map((day, index) => (
            <div className="flex flex-col items-center gap-2" key={index}>
              <div className="font-medium text-text-secondary text-xs">
                {day.dayName}
              </div>
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200',
                  day.isActive
                    ? 'border-accent bg-accent'
                    : 'border-hairline bg-transparent',
                  day.isToday &&
                    'ring-2 ring-accent ring-offset-2 ring-offset-background'
                )}
              >
                {day.isActive && <Flame className="h-4 w-4 text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified stats - reduced from 4 to 2 cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="tinted-blur-subtle rounded-xl p-4 text-center">
          <TrendingUp className="mx-auto mb-2 h-5 w-5 text-success" />
          <div className="font-bold text-lg text-success">
            {longestStreak}
            <span className="ml-1 font-normal text-sm text-text-secondary">
              days
            </span>
          </div>
          <p className="text-text-secondary text-xs">Best Streak</p>
        </div>
        <div className="tinted-blur-subtle rounded-xl p-4 text-center">
          <Calendar className="mx-auto mb-2 h-5 w-5 text-info" />
          <div className="font-bold text-info text-lg">
            {Math.floor((analytics?.totalStudyTimeMinutes || 0) / 60)}
            <span className="ml-1 font-normal text-sm text-text-secondary">
              hours
            </span>
          </div>
          <p className="text-text-secondary text-xs">Total Time</p>
        </div>
      </div>

      {/* Streak motivation */}
      {currentStreak > 0 && (
        <div className="tinted-blur-subtle rounded-xl p-4">
          <div className="mb-2 flex items-center gap-2">
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
                : "You're on an amazing learning journey! 🚀"}
          </p>
        </div>
      )}

      {/* First-time user encouragement */}
      {currentStreak === 0 && (
        <div className="tinted-blur-subtle rounded-xl p-4">
          <div className="mb-2 flex items-center gap-2">
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
