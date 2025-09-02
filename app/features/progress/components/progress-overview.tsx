import type React from 'react';
import type { User } from 'sanity.types';
import {
  getLevelProgress,
  getStreakStatus,
} from '../utils/progressCalculations';
import { StatsCard } from './stats-card';

interface ActivityStats {
  totalEnrollments: number;
  completedCourses: number;
  totalQuizAttempts: number;
  averageQuizScore: number;
  totalContentCompleted: number;
}

interface ProgressOverviewProps {
  user: User | null;
  activityStats: ActivityStats | null;
  isLoading?: boolean;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  user,
  activityStats,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            className="tinted-blur-subtle animate-pulse rounded-2xl p-6"
            key={`loading-stat-${i.toString()}`}
          >
            <div className="mb-4 h-8 w-8 rounded bg-white/10" />
            <div className="mb-2 h-4 rounded bg-white/10" />
            <div className="h-3 w-2/3 rounded bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  const currentStreak = user?.studyStreak || 0;
  const streakStatus = getStreakStatus(currentStreak);
  const levelProgress = getLevelProgress(user?.level || 'beginner');

  return (
    <div className="space-y-10">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10 p-8 backdrop-blur-xl">
        {/* Background decoration */}
        <div className="-right-10 -top-10 absolute h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
        <div className="-bottom-10 -left-10 absolute h-32 w-32 rounded-full bg-purple-500/5 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 font-medium text-accent text-sm backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              {currentStreak > 0
                ? `${currentStreak} day streak!`
                : 'Start your streak'}
            </div>
            <h1 className="mb-3 font-bold text-3xl text-text-primary leading-tight">
              Welcome back, {user?.firstname || 'Learner'}!
              <span className="ml-2 text-2xl">👋</span>
            </h1>
            <p className="max-w-lg text-lg text-text-secondary/90">
              {streakStatus.message} Ready to continue your learning journey?
            </p>
          </div>

          {/* Enhanced Level Badge */}
          <div className="ml-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/20 to-purple-500/20 blur-lg" />
              <div className="relative rounded-2xl border border-white/20 bg-gradient-to-r from-accent/10 to-purple-500/10 p-6 backdrop-blur-sm">
                <div className="mb-2 text-3xl">
                  {levelProgress.current === 3 ? '👑' : '🎯'}
                </div>
                <div className="font-bold text-lg text-text-primary">
                  Level {levelProgress.current}
                </div>
                <div className="font-medium text-accent text-sm">
                  {user?.level || 'Beginner'}
                </div>
                <div className="mt-2 text-text-muted text-xs">
                  Next: {levelProgress.next}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          color={currentStreak > 0 ? 'text-orange-400' : 'text-gray-400'}
          description={streakStatus.message}
          icon={streakStatus.emoji}
          title="Study Streak"
          value={`${currentStreak} days`}
        />

        <StatsCard
          color="text-blue-400"
          description={`${activityStats?.completedCourses || 0} completed`}
          icon="📚"
          title="Courses Enrolled"
          value={activityStats?.totalEnrollments || 0}
        />

        <StatsCard
          color="text-green-400"
          description="Lessons and quizzes"
          icon="✅"
          title="Content Completed"
          value={activityStats?.totalContentCompleted || 0}
        />

        <StatsCard
          color={
            activityStats?.averageQuizScore
              ? activityStats.averageQuizScore >= 80
                ? 'text-green-400'
                : activityStats.averageQuizScore >= 60
                  ? 'text-yellow-400'
                  : 'text-red-400'
              : 'text-gray-400'
          }
          description={`${activityStats?.totalQuizAttempts || 0} attempts`}
          icon="🎯"
          title="Quiz Average"
          value={
            activityStats?.averageQuizScore
              ? `${Math.round(activityStats.averageQuizScore)}%`
              : 'N/A'
          }
        />
      </div>
    </div>
  );
};
