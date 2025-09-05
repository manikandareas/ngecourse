import React from 'react';
import type { User } from 'sanity.types';
import { PageBackground } from '~/components/ui/page-background';
import {
  transformUserAchievementsToDisplay,
  useUserAchievements,
} from '~/features/achievements/hooks';
import { ActivityTabs } from '~/features/progress/components/activity-tabs';
import { EnrolledCourseCard } from '~/features/progress/components/enrolled-course-card';
import { ProgressOverview } from '~/features/progress/components/progress-overview';
import { PROGRESS_COPY } from '~/features/progress/constants/copy';
import {
  useRecentActivities,
  useUserEnrollments,
  useUserProgressAndActivity,
} from '~/features/progress/hooks/useProgressData';
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
    { title: PROGRESS_COPY.meta.title },
    {
      name: 'description',
      content: PROGRESS_COPY.meta.description,
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

  // Consolidated data fetching with optimized queries
  const {
    data: progressAndActivity,
    isLoading: progressActivityLoading,
    error: progressError,
  } = useUserProgressAndActivity(session.clerkId || '', session._id);
  const {
    data: enrollments,
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
  } = useUserEnrollments(session._id);
  const { data: recentActivitiesData, error: activitiesError } =
    useRecentActivities(session._id);
  const {
    data: userAchievements,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useUserAchievements(session._id);

  // Extract data from consolidated response
  const userData = progressAndActivity?.userData;
  const activityStats = progressAndActivity?.activityStats;
  const recentQuizAttempts = recentActivitiesData?.recentQuizAttempts;
  const recentlyCompleted = recentActivitiesData?.recentlyCompleted;

  // Global loading and error states
  const isInitialLoading = progressActivityLoading && !progressAndActivity;
  const hasError =
    progressError || enrollmentsError || activitiesError || achievementsError;

  // Transform achievements for display
  const achievementsForDisplay = React.useMemo(
    () =>
      userAchievements
        ? transformUserAchievementsToDisplay(userAchievements)
        : [],
    [userAchievements]
  );

  // Show full page loading state for initial load
  if (isInitialLoading) {
    return (
      <PageBackground variant="purple-cyan">
        <div className="mx-auto max-w-7xl px-6 py-8 xl:px-0">
          <div className="space-y-8">
            {/* Loading skeleton */}
            <div className="glass-card animate-pulse rounded-2xl p-8">
              <div className="space-y-4">
                <div className="h-8 w-64 rounded bg-white/10" />
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      className="h-20 rounded bg-white/10"
                      key={`overview-loading-${i.toString()}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageBackground>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <PageBackground variant="purple-cyan">
        <div className="mx-auto max-w-7xl px-6 py-8 xl:px-0">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 font-bold text-text-primary text-xl">
              {PROGRESS_COPY.errors.networkError.title}
            </h2>
            <p className="mb-6 text-text-secondary">
              {PROGRESS_COPY.errors.networkError.description}
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-accent/90"
              onClick={() => window.location.reload()}
              type="button"
            >
              {PROGRESS_COPY.errors.networkError.retryButton}
            </button>
          </div>
        </div>
      </PageBackground>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 xl:px-0">
      <div className="space-y-8">
        {/* Progress Overview Section */}
        <ProgressOverview
          activityStats={activityStats}
          isLoading={progressActivityLoading}
          user={(userData as User) ?? null}
        />

        {/* Main Content Grid - Enhanced Responsive */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-5 xl:gap-12">
          {/* Left Column - Courses (3/5 width on xl) */}
          <div className="space-y-8 xl:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-2 font-bold text-2xl text-text-primary">
                  {PROGRESS_COPY.sections.enrolledCourses.title}
                </h2>
                <p className="max-w-xl text-sm text-text-secondary">
                  {PROGRESS_COPY.sections.enrolledCourses.description}
                </p>
              </div>
              {enrollments && enrollments.length > 4 && (
                <button
                  className="group flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 font-medium text-muted-foreground text-sm transition-all duration-200 hover:scale-105 hover:bg-accent/20"
                  type="button"
                >
                  {PROGRESS_COPY.sections.enrolledCourses.viewAllButton(
                    enrollments.length
                  )}
                  <div className="transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </div>
                </button>
              )}
            </div>

            {enrollmentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    className="group relative animate-pulse overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl"
                    key={`loading-course-${i.toString()}`}
                  >
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-xl bg-white/10" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-3/4 rounded-lg bg-white/10" />
                        <div className="h-3 w-full rounded bg-white/10" />
                        <div className="h-2 w-1/2 rounded bg-white/10" />
                      </div>
                      <div className="h-12 w-12 rounded-full bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : enrollments && enrollments.length > 0 ? (
              <div
                className={`grid gap-4 2xl:gap-6 ${
                  enrollments.length === 1
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {(enrollments as Enrollment[])
                  ?.slice(0, 4) // Show up to 4 courses (2 rows x 2 columns)
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
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.05] p-12 text-center backdrop-blur-xl">
                {/* Background decoration */}
                <div className="-right-6 -top-6 absolute h-24 w-24 rounded-full bg-accent/5 blur-2xl" />
                <div className="-bottom-6 -left-6 absolute h-20 w-20 rounded-full bg-purple-500/5 blur-xl" />

                <div className="relative">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 text-4xl backdrop-blur-sm">
                    📚
                  </div>
                  <h3 className="mb-3 font-bold text-text-primary text-xl">
                    {PROGRESS_COPY.emptyStates.noCourses.title}
                  </h3>
                  <p className="mx-auto mb-8 max-w-sm text-text-secondary/90 leading-relaxed">
                    {PROGRESS_COPY.emptyStates.noCourses.description}
                  </p>
                  <a
                    className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent to-accent/90 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-accent/25 hover:shadow-lg"
                    href="/courses"
                  >
                    {PROGRESS_COPY.emptyStates.noCourses.ctaButton}
                    <div className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Activity Tabs (2/5 width on xl) */}
          <div className="xl:col-span-2">
            <ActivityTabs
              achievements={achievementsForDisplay}
              isLoading={progressActivityLoading || achievementsLoading}
              recentlyCompleted={recentlyCompleted || []}
              recentQuizAttempts={recentQuizAttempts || []}
              user={(userData as User) ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
