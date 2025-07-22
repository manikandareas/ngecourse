import { Clock, PlayCircle } from 'lucide-react';
import readingTimeFn from 'reading-time';
import { dataCourses } from '~/data/courses';
import { MarkdownRenderer } from '~/features/courses/detail/chapters/markdown-renderer';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/lesson-detail';

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);

  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const lesson = await dataCourses.getLessonBySlug(args.params.lessonSlug);

  if (!lesson) {
    throw new Response('Lesson Not Found', { status: 404 });
  }

  return {
    lesson,
  };
}

export default function LessonDetailPage(props: Route.ComponentProps) {
  const lessonData = props.loaderData.lesson;

  const readingTime = readingTimeFn(lessonData.content ?? '');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Lesson Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
          <PlayCircle className="h-4 w-4" />
          <span>Lesson</span>
          <span>•</span>
          <span className="truncate">{lessonData.title}</span>
        </div>

        <h1 className="font-bold text-2xl text-foreground leading-tight sm:text-3xl">
          {lessonData.title}
        </h1>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {readingTime.text}
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="border-t pt-4 sm:pt-6">
        <MarkdownRenderer content={lessonData.content ?? ''} />
      </div>
    </div>
  );
}
