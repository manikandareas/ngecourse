import { Clock, PlayCircle } from 'lucide-react';
import React from 'react';
import { Await } from 'react-router';
import { dataCourses } from '~/data/courses';
import { MarkdownRenderer } from '~/features/courses/detail/chapters/markdown-renderer';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/lesson-detail';

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return dataCourses.getLessonBySlug(args.params.lessonSlug);
}

export default function LessonDetailPage(props: Route.ComponentProps) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Await resolve={props.loaderData}>
        {(lesson) => (
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
        )}
      </Await>
    </React.Suspense>
  );
}
