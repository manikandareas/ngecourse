import { useQuery } from '@tanstack/react-query';
import { MarkdownRenderer } from '~/components/ui/markdown-renderer';
import { LessonHeader } from '~/features/courses/components/lesson-header';
import { LessonNavigation } from '~/features/courses/components/lesson-navigation';
import { dataCourses } from '~/features/courses/data';
import { dataEnrollment } from '~/features/enrollments/data';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/lesson';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `Genii | ${data?.lesson.title}` },
    {
      name: 'description',
      content: data?.lesson.content || 'Lesson detail page of Genii!',
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
  const {
    data: lesson,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['lesson', props.loaderData.lesson.slug],
    queryFn: () => dataCourses.getLessonBySlug(props.params.lessonSlug),
    initialData: props.loaderData.lesson,
  });

  if (!lesson || isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Could not load courses 😬: {error.message}</div>;
  }

  return (
    <div className="relative w-full space-y-4 sm:space-y-6">
      <LessonHeader
        courseSlug={props.params.slug}
        title={lesson.title || 'Lesson Title'}
        userId={props.loaderData.currentSession._id}
      />
      <main className="mx-auto max-w-5xl px-6 py-6">
        <MarkdownRenderer content={lesson?.content ?? ''} />

        <LessonNavigation
          courseSlug={props.params.slug}
          userId={props.loaderData.currentSession._id}
        />
      </main>
    </div>
  );
}
