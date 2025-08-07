import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Menu, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate, useNavigation } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import { CourseFileTree } from '~/features/courses/components/course-filee-tree';
import { dataCourses } from '~/features/courses/data';
import { courseQueryOption } from '~/features/courses/hooks/get-course';
import { useSequentialNavigation } from '~/features/courses/hooks/sequential-navigation';
import { dataEnrollment } from '~/features/enrollments/data';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import type { ProgressionInput } from '~/features/shared/schemas';
import { cn } from '~/lib/utils';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/layout';

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) throw new Response('Unauthorized', { status: 401 });

  const course = await dataCourses.withContents(args.params.slug);
  if (!course) throw new Response('Course Not Found', { status: 404 });

  const enrollment = await dataEnrollment.oneByUserId(
    currentSession._id || '',
    course.slug?.current || ''
  );
  if (!enrollment) throw new Response('User not enrolled', { status: 403 });

  return { course, enrollment, currentSession };
}

function MobileOverlay({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-label="Close navigation menu"
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      type="button"
    />
  );
}

function MobileSidebar({
  open,
  course,
  enrollment,
  onClose,
}: {
  open: boolean;
  course: CourseContentsQueryResult | undefined;
  enrollment: EnrollmentQueryResult | undefined;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {course && enrollment ? (
        <CourseFileTree course={course} enrollment={enrollment} />
      ) : null}

      <Button
        className="absolute top-4 right-4 z-10 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={onClose}
        size="sm"
        variant="ghost"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function CoursesLayout(args: Route.ComponentProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [courseQuery, enrollmentQuery] = useQueries({
    queries: [
      courseQueryOption(args.params.slug, args.loaderData.course),
      enrollmentQueryOption(
        args.loaderData.currentSession._id,
        args.params.slug
      ),
    ],
  });

  const isFetching = courseQuery.isLoading || enrollmentQuery.isLoading;
  const course = courseQuery.data as CourseContentsQueryResult | undefined;
  const enrollment = enrollmentQuery.data as EnrollmentQueryResult | undefined;

  const sequentialNavigationState = useSequentialNavigation(
    course as CourseContentsQueryResult,
    enrollment as EnrollmentQueryResult
  );

  const canInteract = navigation.state === 'idle';
  const hasNext = Boolean(sequentialNavigationState.nextItem);
  const canPrev = sequentialNavigationState.canGoPrevious;

  const shouldShowComplete = useMemo(() => {
    const current = sequentialNavigationState.currentItem;
    return Boolean(
      current &&
        current.type !== 'chapter' &&
        !sequentialNavigationState.isCurrentCompleted &&
        current.contentId
    );
  }, [
    sequentialNavigationState.currentItem,
    sequentialNavigationState.isCurrentCompleted,
  ]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProgressionInput) =>
      usecaseEnrollments.addProgression(data),
    onSettled: () => {
      queryClient.invalidateQueries(
        enrollmentQueryOption(
          args.loaderData.currentSession._id,
          args.params.slug
        )
      );
    },
    onSuccess: (data) => {
      if (data.success && data.nextPath) navigate(data.nextPath);
    },
  });

  const buildNextPath = useCallback(() => {
    if (!(course && sequentialNavigationState.nextItem)) return '';
    const { chapterSlug, contentSlug } = sequentialNavigationState.nextItem;
    const base = `/courses/${course.slug?.current}/${chapterSlug}`;
    return contentSlug ? `${base}/lessons/${contentSlug}` : base;
  }, [course, sequentialNavigationState.nextItem]);

  const handlePrevious = useCallback(() => {
    if (canPrev && canInteract) sequentialNavigationState.goToPrevious();
  }, [canPrev, canInteract, sequentialNavigationState]);

  const handleNext = useCallback(() => {
    if (!(hasNext && canInteract)) return;

    if (
      sequentialNavigationState.isCurrentCompleted &&
      sequentialNavigationState.canGoNext
    ) {
      sequentialNavigationState.goToNext();
      return;
    }

    if (!course) return;

    mutate({
      userId: args.loaderData.currentSession._id,
      courseId: course._id,
      contentId:
        sequentialNavigationState.currentItem?.contentId?.toString() || '',
      nextPath: buildNextPath(),
      courseSlug: course.slug?.current as string,
    });
  }, [
    hasNext,
    canInteract,
    sequentialNavigationState.isCurrentCompleted,
    sequentialNavigationState.canGoNext,
    sequentialNavigationState.currentItem,
    course,
    args.loaderData.currentSession._id,
    mutate,
    buildNextPath,
  ]);

  if (isFetching || !(course && enrollment)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex min-h-screen bg-background">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <CourseFileTree course={course} enrollment={enrollment} />
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileNavOpen && (
          <MobileOverlay onClose={() => setIsMobileNavOpen(false)} />
        )}

        {/* Mobile Navigation Sidebar */}
        <MobileSidebar
          course={course}
          enrollment={enrollment}
          onClose={() => setIsMobileNavOpen(false)}
          open={isMobileNavOpen}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Menu Button */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <Button
                className="h-9 w-9 p-0"
                onClick={() => setIsMobileNavOpen(true)}
                size="sm"
                variant="ghost"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
              <h1 className="truncate font-semibold text-lg">
                {course?.title}
              </h1>
              <div className="w-9" />
            </div>
          </div>

          <div className="container mx-auto mb-28 max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />

            <div className="flex items-center justify-between border-t pt-6 sm:pt-6">
              {canPrev ? (
                <Button
                  disabled={!canInteract}
                  onClick={handlePrevious}
                  variant="outline"
                >
                  <ArrowLeft />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              <Button
                className={cn(!hasNext && 'hidden')}
                disabled={!canInteract || (shouldShowComplete && isPending)}
                onClick={handleNext}
              >
                {shouldShowComplete ? 'Complete and Next' : 'Next'}{' '}
                <ArrowRight />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
