import { BookOpen, Clock, Trophy } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';
import {
  formatQuizScore,
  formatTimeAgo,
  getQuizGrade,
} from '../utils/progressCalculations';

interface QuizAttempt {
  _id: string;
  score?: number | null;
  percentage?: number | null;
  totalQuestions?: number | null;
  correctCount?: number | null;
  submittedAt?: string | null;
  quiz?: { _id: string; title: string; slug: string } | null;
  course?: { _id: string; title: string; slug: string } | null;
}

interface CompletedContent {
  _id: string;
  recentCompletions?: Array<{
    _id: string;
    _type: string;
    title: string;
    slug: string;
    parentCourse?: { _id: string; title: string; slug: string } | null;
  }>;
  course?: { _id: string; title: string; slug: string } | null;
}

interface ActivityFeedProps {
  recentQuizAttempts: QuizAttempt[];
  recentlyCompletedContent: CompletedContent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  recentQuizAttempts,
  recentlyCompletedContent,
}) => {
  const activities = React.useMemo(() => {
    const quizActivities = recentQuizAttempts.map((attempt) => ({
      id: attempt._id,
      type: 'quiz' as const,
      title: `Quiz: ${attempt.quiz?.title || 'Unknown Quiz'}`,
      course: attempt.course?.title || 'Unknown Course',
      courseSlug: attempt.course?.slug,
      timestamp: attempt.submittedAt
        ? new Date(attempt.submittedAt)
        : new Date(),
      data: {
        percentage: attempt.percentage ?? 0,
        score: attempt.correctCount ?? 0,
        total: attempt.totalQuestions ?? 0,
      },
    }));

    const contentActivities = recentlyCompletedContent.flatMap((enrollment) =>
      (enrollment.recentCompletions || []).map((content) => ({
        id: content._id,
        type: 'content' as const,
        title: `${content._type === 'lesson' ? 'Lesson' : 'Quiz'}: ${content.title}`,
        course:
          content.parentCourse?.title ||
          enrollment.course?.title ||
          'Unknown Course',
        courseSlug: content.parentCourse?.slug || enrollment.course?.slug,
        timestamp: new Date(), // We don't have completion timestamp in current schema
        data: {
          contentType: content._type,
        },
      }))
    );

    return [...quizActivities, ...contentActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }, [recentQuizAttempts, recentlyCompletedContent]);

  if (activities.length === 0) {
    return (
      <div className="tinted-blur-subtle rounded-2xl p-6">
        <h3 className="mb-4 font-medium text-lg text-text-primary">
          Recent Activity
        </h3>
        <div className="py-8 text-center">
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-text-muted" />
          <p className="text-sm text-text-secondary">
            No recent activity yet. Start learning to see your progress here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tinted-blur-subtle rounded-2xl p-6">
      <h3 className="mb-4 font-medium text-lg text-text-primary">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            className="flex items-start gap-3 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
            key={activity.id}
          >
            <div className="mt-0.5 flex-shrink-0">
              {activity.type === 'quiz' ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <Trophy className="h-4 w-4 text-accent" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="line-clamp-1 font-medium text-sm text-text-primary">
                    {activity.title}
                  </h4>
                  {activity.courseSlug ? (
                    <Link
                      className="text-text-secondary text-xs transition-colors hover:text-accent"
                      to={`/courses/${activity.courseSlug}`}
                    >
                      {activity.course}
                    </Link>
                  ) : (
                    <p className="text-text-secondary text-xs">
                      {activity.course}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 whitespace-nowrap text-text-muted text-xs">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>

              {activity.type === 'quiz' && (
                <div className="mt-2 flex items-center gap-2">
                  {(() => {
                    const { grade, color } = getQuizGrade(
                      activity.data.percentage
                    );
                    return (
                      <div className="flex items-center gap-1">
                        <span className={`font-bold text-xs ${color}`}>
                          {grade}
                        </span>
                        <span className="text-text-muted text-xs">
                          {formatQuizScore(
                            activity.data.score,
                            activity.data.total
                          )}
                          ({activity.data.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
