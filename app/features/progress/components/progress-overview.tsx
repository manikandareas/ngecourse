import { Target } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="tinted-blur-subtle rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold text-2xl text-text-primary">
              Welcome back, {user?.firstname || 'Learner'}! 👋
            </h1>
            <p className="text-text-secondary">
              {streakStatus.message} Keep up the great work!
            </p>
          </div>

          {/* Level Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 font-medium text-accent text-sm">
              <span>{levelProgress.current === 3 ? '👑' : '🎯'}</span>
              Level {levelProgress.current} • {user?.level || 'Beginner'}
            </div>
            <div className="mt-2 text-text-muted text-xs">
              Next: {levelProgress.next}
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

      {/* Learning Goals Section */}
      {user?.learningGoals && user.learningGoals.length > 0 && (
        <div className="tinted-blur-subtle rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 font-medium text-lg text-text-primary">
            <Target className="h-5 w-5 text-accent" />
            Learning Goals
          </h3>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {user.learningGoals.map((goal, index) => (
              <div
                className="flex items-center gap-3 rounded-lg bg-white/5 p-3"
                key={`goal-${index.toString()}`}
              >
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm text-text-primary">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
