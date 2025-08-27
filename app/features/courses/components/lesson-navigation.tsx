import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useNavigate, useNavigation } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import type { ProgressionInput } from '~/features/shared/schemas';
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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProgressionInput) =>
      usecaseEnrollments.addProgression(data),
    onSettled: () => {
      queryClient.invalidateQueries(enrollmentQueryOption(userId, courseSlug));
    },
    onSuccess: (data) => {
      if (data.success && data.nextPath) navigate(data.nextPath);
    },
  });

  const buildNextPath = useCallback(() => {
    return sequentialNavigationState.nextItem?.path ?? '';
  }, [sequentialNavigationState.nextItem]);

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

    if (!courseQuery.data) return;

    mutate({
      userId,
      courseId: courseQuery.data._id,
      contentId:
        sequentialNavigationState.currentItem?.contentId?.toString() || '',
      nextPath: buildNextPath(),
      courseSlug,
    });
  }, [
    hasNext,
    canInteract,
    sequentialNavigationState.isCurrentCompleted,
    sequentialNavigationState.canGoNext,
    sequentialNavigationState.currentItem,
    courseQuery.data,
    userId,
    mutate,
    buildNextPath,
  ]);

  return (
    <nav className="flex items-center justify-between rounded-2xl border border-hairline bg-white/3 p-6 backdrop-blur-sm">
      {canPrev ? (
        <button
          className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
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

      {hasNext && (
        <button
          className={cn(
            shouldShowComplete ? 'btn-primary' : 'btn-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          disabled={!canInteract || (shouldShowComplete && isPending)}
          onClick={handleNext}
          type="button"
        >
          <span className="mr-2">
            {shouldShowComplete ? 'Complete and Next' : 'Next'}
          </span>
          <ArrowRight size={16} />
        </button>
      )}
    </nav>
  );
};
