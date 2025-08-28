import React from 'react';
import type { User } from 'sanity.types';
import { AchievementsBadges } from '~/features/progress/components/achievements-badges';
import { ActivityFeed } from '~/features/progress/components/activity-feed';
import { EnrolledCourseCard } from '~/features/progress/components/enrolled-course-card';
import { ProgressOverview } from '~/features/progress/components/progress-overview';
import {
  useRecentlyCompletedContent,
  useRecentQuizAttempts,
  useUserActivityStats,
  useUserEnrollments,
  useUserProgressData,
} from '~/features/progress/hooks/useProgressData';
import { generateDummyAchievements } from '~/features/progress/utils/progressCalculations';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/progress';

interface Enrollment {
  _id: string;
  percentComplete: number;
  dateCompleted?: string;
  course: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    thumbnail?: any;
    topics?: Array<{ _id: string; title: string; slug: string }>;
  };
}

export function meta() {
  return [
    { title: 'Genii | Progress' },
    {
      name: 'description',
      content: 'Track your learning progress and achievements',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);

  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return {
    session: currentSession,
  };
}

export default function ProgressPage(props: Route.ComponentProps) {
  const { session } = props.loaderData;

  // Fetch all progress data
  const { data: userData, isLoading: userLoading } = useUserProgressData(
    session.clerkId || ''
  );
  const { data: enrollments, isLoading: enrollmentsLoading } =
    useUserEnrollments(session._id);
  const { data: recentQuizAttempts, isLoading: quizAttemptsLoading } =
    useRecentQuizAttempts(session._id);
  const { data: recentlyCompleted, isLoading: recentlyCompletedLoading } =
    useRecentlyCompletedContent(session._id);
  const { data: activityStats, isLoading: activityStatsLoading } =
    useUserActivityStats(session._id);

  // Generate dummy data for features not yet in Sanity
  const dummyAchievements = React.useMemo(
    () => generateDummyAchievements(),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-6 py-8 xl:px-0">
        <div className="space-y-8">
          {/* Progress Overview Section */}
          <ProgressOverview
            activityStats={activityStats}
            isLoading={userLoading || activityStatsLoading}
            user={(userData as User) ?? null}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {/* Left Column - Enrolled Courses */}
            <div className="space-y-6 xl:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-text-primary text-xl">
                  My Courses
                </h2>
                {enrollments && enrollments.length > 3 && (
                  <button
                    className="font-medium text-accent text-sm transition-colors hover:text-accent/80"
                    type="button"
                  >
                    View All ({enrollments.length})
                  </button>
                )}
              </div>

              {enrollmentsLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      className="tinted-blur-subtle h-80 animate-pulse rounded-2xl"
                      key={`loading-${i.toString()}`}
                    >
                      <div className="mb-4 aspect-video w-full rounded-t-2xl bg-white/10" />
                      <div className="space-y-3 p-6">
                        <div className="h-4 w-3/4 rounded bg-white/10" />
                        <div className="h-3 w-full rounded bg-white/10" />
                        <div className="h-3 w-2/3 rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {(enrollments as Enrollment[])
                    ?.slice(0, 4)
                    .map((enrollment) => (
                      <EnrolledCourseCard
                        course={enrollment.course}
                        dateCompleted={enrollment.dateCompleted}
                        key={enrollment._id}
                        percentComplete={enrollment.percentComplete || 0}
                      />
                    ))}
                </div>
              ) : (
                <div className="tinted-blur-subtle rounded-2xl p-12 text-center">
                  <div className="mb-4 text-6xl">📚</div>
                  <h3 className="mb-2 font-medium text-lg text-text-primary">
                    No courses yet
                  </h3>
                  <p className="mb-6 text-text-secondary">
                    Start your learning journey by enrolling in your first
                    course!
                  </p>
                  <a
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-accent/90"
                    href="/courses"
                  >
                    Browse Courses →
                  </a>
                </div>
              )}
            </div>

            {/* Right Column - Activity Feed & Features */}
            <div className="space-y-6">
              <ActivityFeed
                recentlyCompletedContent={recentlyCompleted || []}
                recentQuizAttempts={recentQuizAttempts || []}
              />

              {/* Achievements Section (Dummy Data) */}
              <AchievementsBadges achievements={dummyAchievements} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
