import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { BlockContent } from 'sanity.types';
import { PortableTextRenderer } from '~/components/ui/portable-text-renderer';
import { Separator } from '~/components/ui/separator';
import { SectionAskProvider } from '~/features/ai-ask/context/ask-context';
import { LessonHeader } from '~/features/courses/components/lesson-header';
import { LessonNavigation } from '~/features/courses/components/lesson-navigation';
import { SectionAwareAsk } from '~/features/courses/components/section-aware-ask';
import { LESSON_COPY } from '~/features/courses/constants/lesson-copy';
import { dataCourses } from '~/features/courses/data';
import { dataEnrollment } from '~/features/enrollments/data';
import { useEventTracking } from '~/hooks/use-event-tracking';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/lesson';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.lesson.title} ${LESSON_COPY.meta.titleSuffix}` },
    {
      name: 'description',
      content: data?.lesson.content || LESSON_COPY.meta.fallbackDescription,
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) throw new Response('Unauthorized', { status: 401 });

  const lesson = await dataCourses.getLessonBySlug(args.params.lessonSlug);
  if (!lesson) {
    throw new Response('Lesson not found', { status: 404 });
  }

  const enrollment = await dataEnrollment.oneByUserId(
    currentSession._id || '',
    args.params.slug
  );
  if (!enrollment) throw new Response('User not enrolled', { status: 403 });

  return { lesson, enrollment, currentSession };
}

export default function LessonDetailPage(props: Route.ComponentProps) {
  const { startSession, endSession, startActivity } = useEventTracking();

  const {
    data: lesson,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['lesson', props.loaderData.lesson.slug],
    queryFn: () => dataCourses.getLessonBySlug(props.params.lessonSlug),
    initialData: props.loaderData.lesson,
  });

  // Session and activity tracking
  useEffect(() => {
    let sessionStarted = false;

    const initializeTracking = async () => {
      // Start session for the course
      const courseId = props.loaderData.enrollment.course?._id; // Using lesson ID as course context
      if (courseId) {
        await startSession(courseId);
        sessionStarted = true;

        // Start activity timing for this specific lesson
        startActivity();
      }
    };

    initializeTracking();

    // Cleanup on unmount or route change
    return () => {
      if (sessionStarted) {
        endSession('navigation');
      }
    };
  }, [
    props.loaderData.enrollment.course?._id,
    startSession,
    endSession,
    startActivity,
  ]);

  // Handle page visibility changes to pause/resume tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, could pause tracking if needed
      } else {
        // Page is visible again, resume tracking
        startActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startActivity]);

  const commonProps = {
    courseSlug: props.params.slug,
    userId: props.loaderData.currentSession._id || '',
  };

  const lessonContent = (
    <div className="space-y-8 py-12">
      <PortableTextRenderer
        lessonId={lesson?._id}
        value={(lesson?.content as BlockContent) || []}
      />
      <Separator className="my-8 border-hairline" />
      <LessonNavigation {...commonProps} />
    </div>
  );

  if (!lesson || isPending) {
    return <div>{LESSON_COPY.states.loading}</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-2 font-semibold text-lg text-text-primary">
          {LESSON_COPY.states.error.title}
        </h2>
        <p className="mb-4 text-text-secondary">
          {LESSON_COPY.states.error.message}
        </p>
        <button onClick={() => window.location.reload()} type="button">
          {LESSON_COPY.states.error.retry}
        </button>
      </div>
    );
  }

  return (
    <SectionAskProvider>
      <div className="relative w-full">
        <SectionAwareAsk lessonId={lesson._id} />

        <LessonHeader {...commonProps} title={lesson.title || 'Lesson Title'} />

        <main className="mx-auto max-w-4xl px-4 sm:px-6">
          <article className="glass-card">{lessonContent}</article>
        </main>
      </div>
    </SectionAskProvider>
  );
}
