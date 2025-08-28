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

  return (
    <div className="tinted-blur-subtle rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-medium text-lg text-text-primary">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Achievements
        </h3>
        <div className="text-sm text-text-secondary">
          {earnedCount} of {achievements.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {achievements.map((achievement) => (
          <div
            className={`flex items-center gap-4 rounded-lg p-3 transition-all ${
              achievement.earned
                ? 'border border-green-500/20 bg-green-500/10'
                : 'border border-hairline bg-white/5'
            }`}
            key={achievement.id}
          >
            {/* Icon */}
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${
                achievement.earned ? 'bg-green-500/20' : 'bg-white/10'
              }`}
            >
              {achievement.icon}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4
                    className={`font-medium text-sm ${
                      achievement.earned
                        ? 'text-green-400'
                        : 'text-text-primary'
                    }`}
                  >
                    {achievement.title}
                  </h4>
                  <p className="mt-1 text-text-secondary text-xs">
                    {achievement.description}
                  </p>
                </div>

                {achievement.earned && achievement.earnedAt && (
                  <div className="whitespace-nowrap text-text-muted text-xs">
                    {formatTimeAgo(achievement.earnedAt)}
                  </div>
                )}
              </div>

              {/* Progress Bar for Unearned Achievements */}
              {!achievement.earned &&
                achievement.progress !== undefined &&
                achievement.target && (
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-text-secondary">
                        {achievement.progress} / {achievement.target}
                      </span>
                      <span className="text-text-muted">
                        {Math.round(
                          (achievement.progress / achievement.target) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-700">
                      <div
                        className="h-1.5 rounded-full bg-accent transition-all duration-300"
                        style={{
                          width: `${(achievement.progress / achievement.target) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
