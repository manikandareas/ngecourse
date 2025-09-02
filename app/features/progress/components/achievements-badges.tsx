import { Trophy } from 'lucide-react';
import type React from 'react';
import { formatTimeAgo } from '../utils/progressCalculations';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  target?: number;
}

interface AchievementsBadgesProps {
  achievements: Achievement[];
}

export const AchievementsBadges: React.FC<AchievementsBadgesProps> = ({
  achievements,
}) => {
  const earnedCount = achievements.filter((a) => a.earned).length;
  
  // Get recent achievements - prioritize earned ones, limit to 3
  const recentAchievements = [...achievements]
    .sort((a, b) => {
      // First sort by earned status
      if (a.earned !== b.earned) {
        return b.earned ? 1 : -1;
      }
      // Then sort by earnedAt date for earned achievements
      if (a.earned && b.earned && a.earnedAt && b.earnedAt) {
        return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
      }
      // For unearned, sort by progress percentage
      if (!a.earned && !b.earned) {
        const aProgress = a.progress && a.target ? a.progress / a.target : 0;
        const bProgress = b.progress && b.target ? b.progress / b.target : 0;
        return bProgress - aProgress;
      }
      return 0;
    })
    .slice(0, 3);

  const hasMoreAchievements = achievements.length > 3;

  return (
    <div className="tinted-blur-subtle rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-medium text-lg text-text-primary">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Achievements
        </h3>
        <div className="text-sm text-text-secondary">
          {earnedCount} earned
        </div>
      </div>

      <div className="space-y-3">
        {recentAchievements.map((achievement) => (
          <div
            className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
              achievement.earned
                ? 'border border-success/20 bg-success/10'
                : 'border border-hairline bg-white/5'
            }`}
            key={achievement.id}
          >
            {/* Icon */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm ${
                achievement.earned ? 'bg-success/20' : 'bg-white/10'
              }`}
            >
              {achievement.icon}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <h4
                className={`font-medium text-sm ${
                  achievement.earned
                    ? 'text-success'
                    : 'text-text-primary'
                }`}
              >
                {achievement.title}
              </h4>
              <p className="text-text-secondary text-xs">
                {achievement.description}
              </p>
              
              {/* Simplified progress for unearned */}
              {!achievement.earned &&
                achievement.progress !== undefined &&
                achievement.target && (
                  <div className="mt-1">
                    <div className="h-1 w-full rounded-full bg-white/10">
                      <div
                        className="h-1 rounded-full bg-accent transition-all duration-300"
                        style={{
                          width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>

            {achievement.earned && achievement.earnedAt && (
              <div className="text-success text-xs">
                {formatTimeAgo(achievement.earnedAt)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {hasMoreAchievements && (
        <div className="mt-4 text-center">
          <button
            className="font-medium text-accent text-sm transition-colors hover:text-accent/80"
            type="button"
          >
            View All Achievements ({achievements.length})
          </button>
        </div>
      )}
    </div>
  );
};
