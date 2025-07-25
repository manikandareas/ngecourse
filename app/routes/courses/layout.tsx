import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Outlet, useFetcher, useNavigation } from 'react-router';
import { Button } from '~/components/ui/3d-button';
import { dataCourses } from '~/data/courses';
import { dataEnrollment } from '~/data/enrollments';
import { LearningLayout } from '~/features/courses/detail/chapters/learning-layout';
import { useSequentialNavigation } from '~/hooks/use-sequential-navigation';
import { cn } from '~/lib/utils';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/layout';
import type { action } from './chapter-detail';

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

  return {
    course: courseWithContents,
    enrollment,
  };
}

export default function CoursesLayout(args: Route.ComponentProps) {
  const { course, enrollment } = args.loaderData;
  const navigation = useNavigation();

  const fethcher = useFetcher<typeof action>();

  const {
    currentItem,
    nextItem,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
    isCurrentCompleted,
    isNextLocked,
  } = useSequentialNavigation(course, enrollment);

  // Check if current content is a lesson/quiz (not chapter) and not completed
  const isCurrentContent =
    currentItem && currentItem.type !== 'chapter' && !isCurrentCompleted;

  const shouldShowComplete = isCurrentContent && currentItem.contentId;

  const handlePrevious = () => {
    if (canGoPrevious && navigation.state === 'idle') {
      goToPrevious();
    }
  };

  const handleNext = async () => {
    if (!nextItem || navigation.state !== 'idle') {
      return;
    }

    if (canGoNext || !isNextLocked) {
      goToNext();
      return;
    }

    const formData = new FormData();

    formData.append('courseId', course._id);
    formData.append('chapterId', currentItem?.chapterId as string);
    formData.append('contentId', currentItem?.contentId?.toString() as string);

    console.log('before  submit', currentItem?.contentId);

    if (nextItem) {
      const nextPath =
        `/courses/${course.slug?.current}/${nextItem.chapterSlug}` +
        (nextItem.contentSlug ? `/lessons/${nextItem.contentSlug}` : '');

      formData.append('nextPath', nextPath);
    }

    await fethcher.submit(formData, {
      method: 'POST',
      action: `/courses/${course.slug?.current}/${currentItem?.chapterSlug}`,
    });
  };

  return (
    <div className="relative min-h-screen">
      <LearningLayout course={course} enrollment={enrollment}>
        <Outlet />

        <div className="flex items-center justify-between border-t pt-6 sm:pt-6">
          {canGoPrevious ? (
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
              className={cn(!nextItem && 'hidden')}
              disabled={
                navigation.state !== 'idle' || fethcher.state !== 'idle'
              }
              onClick={handleNext}
            >
              Complete and Next <ArrowRight />
            </Button>
          ) : (
            <Button
              className={cn(!nextItem && 'hidden')}
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
