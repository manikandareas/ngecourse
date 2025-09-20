import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, useNavigation } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { Button } from '~/components/ui/button';
import { CourseCompletionModal } from '~/features/achievements';
import { LESSON_COPY } from '~/features/courses/constants/lesson-copy';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import type { ProgressionInput } from '~/features/shared/schemas';
import { useEventTracking } from '~/hooks/use-event-tracking';
import { cn } from '~/lib/utils';
import { courseQueryOption } from '../hooks/get-course';
import { useSequentialNavigation } from '../hooks/sequential-navigation';

type LessonNavigationProps = {
  courseSlug: string;
  userId: string;
};

type EnrollmentContentEntry = NonNullable<
  NonNullable<EnrollmentQueryResult>['contentsCompleted']
>[number];

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  courseSlug,
  userId,
}) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { completeLesson } = useEventTracking();

  const enrollmentQueryKey = useMemo(
    () => ['enrollment', userId, courseSlug] as const,
    [userId, courseSlug]
  );
  const optimisticNavigationRef = useRef<{ from?: string; to?: string } | null>(
    null
  );
  const lastCompletedContentRef = useRef<{
    contentId: string;
    contentType: 'lesson' | 'quiz';
    title: string | null;
    slug: string | null;
  } | null>(null);

  const courseQuery = useQuery(courseQueryOption(courseSlug));

  const enrollmentQuery = useQuery(enrollmentQueryOption(userId, courseSlug));

  const sequentialNavigationState = useSequentialNavigation(
    courseQuery.data as CourseContentsQueryResult,
    enrollmentQuery.data as EnrollmentQueryResult
  );

  const {
    currentItem,
    nextItem,
    canGoNext,
    canGoPrevious,
    goToPrevious,
    goToNext,
    isCurrentCompleted,
  } = sequentialNavigationState;

  const canInteract = navigation.state === 'idle';
  const hasNext = Boolean(nextItem);
  const canPrev = canGoPrevious;

  const shouldShowComplete = useMemo(() => {
    const current = currentItem;
    return Boolean(current && !isCurrentCompleted && current.contentId);
  }, [currentItem, isCurrentCompleted]);

  const totalContentCount = useMemo(() => {
    const chapters = courseQuery.data?.chapters ?? [];
    return chapters.reduce((total, chapter) => {
      const contents = chapter?.contents ?? [];
      return total + contents.filter((content) => Boolean(content?._id)).length;
    }, 0);
  }, [courseQuery.data]);

  const isFinalContent = !hasNext && Boolean(currentItem);
  const shouldShowCompleteButton = useMemo(() => {
    // For non-final content, show button if not completed
    if (hasNext) {
      return shouldShowComplete || isCurrentCompleted;
    }
    // For final content, only show button if not completed
    if (isFinalContent) {
      return !isCurrentCompleted;
    }
    return false;
  }, [hasNext, isFinalContent, shouldShowComplete, isCurrentCompleted]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProgressionInput) =>
      usecaseEnrollments.addProgression(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: enrollmentQueryKey });

      const previousEnrollment =
        queryClient.getQueryData<EnrollmentQueryResult | null>(
          enrollmentQueryKey
        );

      if (previousEnrollment) {
        const existingIds = new Set(
          (previousEnrollment.contentsCompleted ?? []).map((item) =>
            typeof item === 'object' && item?._id
              ? String(item._id)
              : String(item)
          )
        );

        if (!existingIds.has(variables.contentId)) {
          const nowIso = new Date().toISOString();
          const optimisticEntry: EnrollmentContentEntry = {
            _id: variables.contentId,
            _type: lastCompletedContentRef.current?.contentType ?? 'lesson',
            _createdAt: nowIso,
            _updatedAt: nowIso,
            title: lastCompletedContentRef.current?.title ?? null,
            slug: lastCompletedContentRef.current?.slug
              ? { _type: 'slug', current: lastCompletedContentRef.current.slug }
              : null,
          };

          const updatedContents: EnrollmentContentEntry[] = [
            ...((previousEnrollment.contentsCompleted ??
              []) as EnrollmentContentEntry[]),
            optimisticEntry,
          ];

          const completedCount = updatedContents.length;
          const nextPercent =
            totalContentCount > 0
              ? Math.min(
                  100,
                  Math.round((completedCount / totalContentCount) * 100)
                )
              : previousEnrollment.percentComplete;

          const optimisticEnrollment: EnrollmentQueryResult = {
            ...previousEnrollment,
            contentsCompleted: updatedContents,
            percentComplete:
              typeof nextPercent === 'number'
                ? nextPercent
                : previousEnrollment.percentComplete,
            dateCompleted:
              typeof nextPercent === 'number' && nextPercent >= 100
                ? new Date().toISOString()
                : previousEnrollment.dateCompleted,
          };

          queryClient.setQueryData(enrollmentQueryKey, optimisticEnrollment);
        }
      }

      return { previousEnrollment };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousEnrollment) {
        queryClient.setQueryData(
          enrollmentQueryKey,
          context.previousEnrollment
        );
      }

      const pendingNavigation = optimisticNavigationRef.current;
      if (pendingNavigation?.from) {
        navigate(pendingNavigation.from, { replace: true });
      }
      lastCompletedContentRef.current = null;
    },
    onSettled: () => {
      optimisticNavigationRef.current = null;
      lastCompletedContentRef.current = null;
      void queryClient.invalidateQueries({ queryKey: enrollmentQueryKey });
    },
    onSuccess: (data) => {
      if (data.success) {
        // Track lesson completion analytics
        const completedContent = lastCompletedContentRef.current;
        if (completedContent?.contentId && courseQuery.data) {
          queueMicrotask(() => {
            void completeLesson(
              completedContent.contentId,
              courseQuery.data?._id,
              {
                contentType: completedContent.contentType,
                isCourseFinal: data.isCompleted,
                difficulty: courseQuery.data?.difficulty,
                courseSlug,
              }
            );
          });
        }

        // Check if course was completed
        if (data.isCompleted) {
          setShowCompletionModal(true);
        }
      }
      lastCompletedContentRef.current = null;
    },
  });

  const buildNextPath = useCallback(() => {
    // For final content, redirect to course page or stay on current page
    if (isFinalContent) {
      return `/courses/${courseSlug}`;
    }
    return nextItem?.path ?? '';
  }, [nextItem, isFinalContent, courseSlug]);

  const handlePrevious = useCallback(() => {
    if (canPrev && canInteract) goToPrevious();
  }, [canPrev, canInteract, goToPrevious]);

  const handleNext = useCallback(() => {
    if (!canInteract) return;

    // If content is already completed and we can go next, just navigate
    if (isCurrentCompleted && canGoNext) {
      goToNext();
      return;
    }

    // For uncompleted content or final content, mark as completed
    if (!isCurrentCompleted || isFinalContent) {
      if (!courseQuery.data) return;

      const currentContent = currentItem;
      const contentId = currentContent?.contentId?.toString();
      if (!contentId) return;

      lastCompletedContentRef.current = {
        contentId,
        contentType: currentContent?.type ?? 'lesson',
        title: currentContent?.title ?? null,
        slug: currentContent?.contentSlug ?? null,
      };

      mutate({
        userId,
        courseId: courseQuery.data._id,
        contentId,
        nextPath: buildNextPath(),
        courseSlug,
      });

      if (!isFinalContent) {
        const nextPath = nextItem?.path ?? '';
        if (nextPath) {
          optimisticNavigationRef.current = {
            from: currentContent?.path,
            to: nextPath,
          };
          navigate(nextPath);
        }
      }
    }
  }, [
    canInteract,
    isCurrentCompleted,
    canGoNext,
    currentItem,
    isFinalContent,
    courseQuery.data,
    userId,
    mutate,
    buildNextPath,
    courseSlug,
    nextItem,
    navigate,
    goToNext,
  ]);

  return (
    <>
      <CourseCompletionModal
        completionStats={{
          totalTime: 'Recently completed',
          averageQuizScore: 100, // Default for lesson completion
        }}
        courseTitle={courseQuery.data?.title || 'Course'}
        isOpen={showCompletionModal}
        onClose={() => {
          setShowCompletionModal(false);
          // Navigate to course page after modal is closed
          navigate(`/courses/${courseSlug}`);
        }}
      />

      <nav className="flex items-center justify-between rounded-2xl border border-hairline bg-white/3 p-6 backdrop-blur-sm">
        {canPrev ? (
          <Button
            aria-label={LESSON_COPY.accessibility.previousButton}
            className="disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canInteract}
            onClick={handlePrevious}
            title={LESSON_COPY.navigation.previous.title}
            type="button"
            variant="outline"
          >
            <ArrowLeft size={16} />
            <span className="ml-2">
              {LESSON_COPY.navigation.previous.label}
            </span>
          </Button>
        ) : (
          <div />
        )}

        {shouldShowCompleteButton && (
          <Button
            aria-label={
              isFinalContent
                ? LESSON_COPY.accessibility.completeButton
                : shouldShowComplete
                  ? LESSON_COPY.accessibility.completeButton
                  : LESSON_COPY.accessibility.nextButton
            }
            className={cn('disabled:cursor-not-allowed disabled:opacity-50')}
            disabled={!canInteract || isPending}
            onClick={handleNext}
            title={
              isFinalContent
                ? LESSON_COPY.navigation.complete.courseTitle
                : shouldShowComplete
                  ? LESSON_COPY.navigation.complete.lessonTitle
                  : LESSON_COPY.navigation.next.title
            }
            type="button"
          >
            <span className="mr-2">
              {isPending
                ? LESSON_COPY.navigation.complete.inProgress
                : isFinalContent
                  ? LESSON_COPY.navigation.complete.course
                  : shouldShowComplete
                    ? LESSON_COPY.navigation.complete.lesson
                    : LESSON_COPY.navigation.next.label}
            </span>
            <ArrowRight size={16} />
          </Button>
        )}
      </nav>
    </>
  );
};
