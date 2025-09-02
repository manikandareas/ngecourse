import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useNavigation } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { CourseCompletionModal } from '~/features/achievements';
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

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  courseSlug,
  userId,
}) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { completeLesson } = useEventTracking();

  const courseQuery = useQuery(courseQueryOption(courseSlug));

  const enrollmentQuery = useQuery(enrollmentQueryOption(userId, courseSlug));

  const sequentialNavigationState = useSequentialNavigation(
    courseQuery.data as CourseContentsQueryResult,
    enrollmentQuery.data as EnrollmentQueryResult
  );

  const canInteract = navigation.state === 'idle';
  const hasNext = Boolean(sequentialNavigationState.nextItem);
  const canPrev = sequentialNavigationState.canGoPrevious;

  const shouldShowComplete = useMemo(() => {
    const current = sequentialNavigationState.currentItem;
    return Boolean(
      current &&
        !sequentialNavigationState.isCurrentCompleted &&
        current.contentId
    );
  }, [
    sequentialNavigationState.currentItem,
    sequentialNavigationState.isCurrentCompleted,
  ]);

  const isFinalContent =
    !hasNext && Boolean(sequentialNavigationState.currentItem);
  const shouldShowCompleteButton = useMemo(() => {
    // For non-final content, show button if not completed
    if (hasNext) {
      return shouldShowComplete || sequentialNavigationState.isCurrentCompleted;
    }
    // For final content, only show button if not completed
    if (isFinalContent) {
      return !sequentialNavigationState.isCurrentCompleted;
    }
    return false;
  }, [
    hasNext,
    isFinalContent,
    shouldShowComplete,
    sequentialNavigationState.isCurrentCompleted,
  ]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProgressionInput) =>
      usecaseEnrollments.addProgression(data),
    onSettled: () => {
      queryClient.invalidateQueries(enrollmentQueryOption(userId, courseSlug));
    },
    onSuccess: async (data) => {
      if (data.success) {
        // Track lesson completion analytics
        const currentContent = sequentialNavigationState.currentItem;
        if (currentContent?.contentId && courseQuery.data) {
          await completeLesson(
            currentContent.contentId.toString(),
            courseQuery.data._id,
            {
              contentType: currentContent.type,
              isCourseFinal: data.isCompleted,
              difficulty: courseQuery.data.difficulty,
            }
          );
        }

        // Check if course was completed
        if (data.isCompleted) {
          setShowCompletionModal(true);
        } else if (data.nextPath) {
          // Navigate to next content if course is not completed
          navigate(data.nextPath);
        }
      }
    },
  });

  const buildNextPath = useCallback(() => {
    // For final content, redirect to course page or stay on current page
    if (isFinalContent) {
      return `/courses/${courseSlug}`;
    }
    return sequentialNavigationState.nextItem?.path ?? '';
  }, [sequentialNavigationState.nextItem, isFinalContent, courseSlug]);

  const handlePrevious = useCallback(() => {
    if (canPrev && canInteract) sequentialNavigationState.goToPrevious();
  }, [canPrev, canInteract, sequentialNavigationState]);

  const handleNext = useCallback(() => {
    if (!canInteract) return;

    // If content is already completed and we can go next, just navigate
    if (
      sequentialNavigationState.isCurrentCompleted &&
      sequentialNavigationState.canGoNext
    ) {
      sequentialNavigationState.goToNext();
      return;
    }

    // For uncompleted content or final content, mark as completed
    if (!sequentialNavigationState.isCurrentCompleted || isFinalContent) {
      if (!courseQuery.data) return;

      mutate({
        userId,
        courseId: courseQuery.data._id,
        contentId:
          sequentialNavigationState.currentItem?.contentId?.toString() || '',
        nextPath: buildNextPath(),
        courseSlug,
      });
    }
  }, [
    canInteract,
    sequentialNavigationState.isCurrentCompleted,
    sequentialNavigationState.canGoNext,
    sequentialNavigationState.currentItem,
    isFinalContent,
    courseQuery.data,
    userId,
    mutate,
    buildNextPath,
    courseSlug,
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
          <button
            className="btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canInteract}
            onClick={handlePrevious}
            type="button"
          >
            <ArrowLeft size={16} />
            <span className="ml-2">Previous</span>
          </button>
        ) : (
          <div />
        )}

        {shouldShowCompleteButton && (
          <button
            className={cn(
              'btn-primary',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            disabled={!canInteract || isPending}
            onClick={handleNext}
            type="button"
          >
            <span className="mr-2">
              {isFinalContent
                ? 'Complete Course'
                : shouldShowComplete
                  ? 'Complete and Next'
                  : 'Next'}
            </span>
            <ArrowRight size={16} />
          </button>
        )}
      </nav>
    </>
  );
};
