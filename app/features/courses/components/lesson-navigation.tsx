import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useNavigate, useNavigation } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
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
      queryClient.invalidateQueries(enrollmentQueryOption(userId, courseSlug));
    },
    onSuccess: (data) => {
      if (data.success && data.nextPath) navigate(data.nextPath);
    },
  });

  const buildNextPath = useCallback(() => {
    if (!sequentialNavigationState.nextItem) return '';
    const { chapterSlug, contentSlug } = sequentialNavigationState.nextItem;
    const base = `/courses/${courseSlug}/${chapterSlug}`;
    return contentSlug ? `${base}/lessons/${contentSlug}` : base;
  }, [courseSlug, sequentialNavigationState.nextItem]);

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
        {shouldShowComplete ? 'Complete and Next' : 'Next'} <ArrowRight />
      </Button>
    </div>
  );
};
