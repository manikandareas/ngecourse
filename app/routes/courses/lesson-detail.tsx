import { useQuery } from '@tanstack/react-query';
import { Clock, PlayCircle } from 'lucide-react';
import { MarkdownRenderer } from '~/components/ui/markdown-renderer';
import { dataCourses } from '~/features/courses/data';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/lesson-detail';

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

  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const lesson = await dataCourses.getLessonBySlug(args.params.lessonSlug);
  if (!lesson) {
    throw new Response('Lesson not found', { status: 404 });
  }

  return { lesson };
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
    <div className="space-y-4 sm:space-y-6">
      {/* Lesson Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
          <PlayCircle className="h-4 w-4" />
          <span>Lesson</span>
          <span>•</span>
          <span className="truncate">{lesson?.title}</span>
        </div>

        <h1 className="font-bold text-2xl text-foreground leading-tight sm:text-3xl">
          {lesson?.title}
        </h1>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {/* {readingTime(lesson?.content ?? '').text} */}
              10 Min
            </span>
          </div>
        </div>
      </div>
      {/* Lesson Content */}
      <div className="border-t pt-4 sm:pt-6">
        <MarkdownRenderer content={lesson?.content ?? ''} />
      </div>
    </div>
  );
}
