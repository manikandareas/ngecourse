import { Trophy, X } from 'lucide-react';
import type React from 'react';
import { QUIZ_RESULT_COPY } from '~/features/quizzes/constants/quiz-result-copy';
import type { Achievement } from '../types';

interface CourseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  completionStats?: {
    totalTime?: string;
    completedLessons?: number;
    averageQuizScore?: number;
  };
  earnedAchievements?: Achievement[];
}

export const CourseCompletionModal: React.FC<CourseCompletionModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  completionStats,
  earnedAchievements = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-hairline bg-background/95 shadow-2xl backdrop-blur-lg">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 rounded-full p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {/* Celebration Header */}
          <div className="mb-6 text-center">
            <div className="mb-4 text-6xl">{QUIZ_RESULT_COPY.completion.celebration.emoji}</div>
            <h2 className="mb-2 font-bold text-2xl text-text-primary">
              {QUIZ_RESULT_COPY.completion.celebration.title}
            </h2>
            <p className="text-text-secondary">
              {QUIZ_RESULT_COPY.completion.celebration.subtitle(courseTitle)}
            </p>
          </div>

          {/* Stats Section */}
          {completionStats && (
            <div className="mb-6 grid grid-cols-3 gap-4 rounded-xl border border-hairline bg-white/5 p-4">
              {completionStats.totalTime && (
                <div className="text-center">
                  <div className="font-bold text-lg text-text-primary">
                    {completionStats.totalTime}
                  </div>
                  <div className="text-text-muted text-xs">{QUIZ_RESULT_COPY.completion.stats.timeSpent}</div>
                </div>
              )}
              {completionStats.completedLessons && (
                <div className="text-center">
                  <div className="font-bold text-lg text-text-primary">
                    {completionStats.completedLessons}
                  </div>
                  <div className="text-text-muted text-xs">{QUIZ_RESULT_COPY.completion.stats.lessonsCompleted}</div>
                </div>
              )}
              {completionStats.averageQuizScore && (
                <div className="text-center">
                  <div className="font-bold text-lg text-text-primary">
                    {Math.round(completionStats.averageQuizScore)}%
                  </div>
                  <div className="text-text-muted text-xs">{QUIZ_RESULT_COPY.completion.stats.averageScore}</div>
                </div>
              )}
            </div>
          )}

          {/* Earned Achievements */}
          {earnedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 font-medium text-text-primary">
                <Trophy className="h-4 w-4 text-yellow-400" />
                {QUIZ_RESULT_COPY.completion.achievements.title}
              </h3>
              <div className="space-y-2">
                {earnedAchievements.map((achievement) => (
                  <div
                    className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3"
                    key={achievement.id}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/20 text-sm">
                      {achievement.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-green-400 text-sm">
                        {achievement.title}
                      </div>
                      <div className="text-text-secondary text-xs">
                        {achievement.description}
                      </div>
                    </div>
                    <div className="text-accent text-xs">
                      +{achievement.points} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 rounded-lg bg-accent px-4 py-3 font-medium text-sm text-white transition-colors hover:bg-accent/90"
              onClick={onClose}
              type="button"
            >
              {QUIZ_RESULT_COPY.completion.actions.continueLearning}
            </button>
            <button
              className="rounded-lg border border-hairline px-4 py-3 font-medium text-sm text-text-primary transition-colors hover:bg-white/5"
              onClick={() => {
                window.location.href = '/progress';
              }}
              type="button"
            >
              {QUIZ_RESULT_COPY.completion.actions.viewProgress}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
