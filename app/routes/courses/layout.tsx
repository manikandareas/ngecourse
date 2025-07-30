import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Outlet, useNavigate, useNavigation } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import { dataCourses } from '~/features/courses/data';
import { LearningLayout } from '~/features/courses/detail/chapters/learning-layout';
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

  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const courseWithContents = await dataCourses.withContents(args.params.slug);

  if (!courseWithContents) {
    throw new Response('Course Not Found', { status: 404 });
  }

  const enrollment = await dataEnrollment.oneByUserId(
    currentSession?._id || '',
    courseWithContents._id
  );

  if (!enrollment) {
    throw new Response('User not enrolled', { status: 403 });
  }

  return {
    course: courseWithContents,
    enrollment,
    currentSession,
  };
}

export default function CoursesLayout(args: Route.ComponentProps) {
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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProgressionInput) => {
      return usecaseEnrollments.addProgression(data);
    },
    onSettled: () =>
      queryClient.invalidateQueries(
        enrollmentQueryOption(
          args.loaderData.currentSession._id,
          args.params.slug
        )
      ),
    onSuccess: (data) => {
      if (data.success && data.nextPath) {
        navigate(data.nextPath);
      }
    },
  });

  const sequentialNavigationState = useSequentialNavigation(
    courseQuery.data as CourseContentsQueryResult,
    enrollmentQuery.data as EnrollmentQueryResult
  );

  // Check if current content is a lesson/quiz (not chapter) and not completed
  const isCurrentContent =
    sequentialNavigationState.currentItem &&
    sequentialNavigationState.currentItem.type !== 'chapter' &&
    !sequentialNavigationState.isCurrentCompleted;

  const shouldShowComplete =
    isCurrentContent && sequentialNavigationState.currentItem?.contentId;

  if (courseQuery.isLoading || enrollmentQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!(courseQuery.data && enrollmentQuery.data)) {
    return <div>Loading...</div>;
  }

  const handlePrevious = () => {
    if (
      sequentialNavigationState.canGoPrevious &&
      navigation.state === 'idle'
    ) {
      sequentialNavigationState.goToPrevious();
    }
  };

  const handleNext = () => {
    if (!sequentialNavigationState.nextItem || navigation.state !== 'idle') {
      console.warn('No next item or navigation is not idle');
      return;
    }
    if (
      sequentialNavigationState.isCurrentCompleted &&
      sequentialNavigationState.canGoNext
    ) {
      console.log('Navigating to next item:', sequentialNavigationState);
      sequentialNavigationState.goToNext();
      return;
    }
    if (!courseQuery.data) {
      return;
    }
    let nextPath = '';

    if (sequentialNavigationState.nextItem) {
      nextPath =
        `/courses/${courseQuery.data.slug?.current}/${sequentialNavigationState.nextItem.chapterSlug}` +
        (sequentialNavigationState.nextItem.contentSlug
          ? `/lessons/${sequentialNavigationState.nextItem.contentSlug}`
          : '');
    }

    mutate({
      userId: args.loaderData.currentSession._id,
      courseId: courseQuery.data._id,
      contentId:
        sequentialNavigationState.currentItem?.contentId?.toString() || '',
      nextPath,
    });
  };

  return (
    <div className="relative min-h-screen">
      <LearningLayout
        course={courseQuery.data}
        enrollment={enrollmentQuery.data}
      >
        <Outlet />

        <div className="flex items-center justify-between border-t pt-6 sm:pt-6">
          {sequentialNavigationState.canGoPrevious ? (
            <Button
              disabled={navigation.state !== 'idle'}
              onClick={handlePrevious}
              variant="outline"
            >
              <ArrowLeft />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {shouldShowComplete ? (
            <Button
              className={cn(!sequentialNavigationState.nextItem && 'hidden')}
              disabled={navigation.state !== 'idle' || isPending}
              onClick={handleNext}
            >
              Complete and Next <ArrowRight />
            </Button>
          ) : (
            <Button
              className={cn(!sequentialNavigationState.nextItem && 'hidden')}
              disabled={navigation.state !== 'idle'}
              onClick={handleNext}
            >
              Next <ArrowRight />
            </Button>
          )}
        </div>
      </LearningLayout>
    </div>
  );
}
