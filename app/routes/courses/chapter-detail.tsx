import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, PlayCircle } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { dataCourses } from '~/data/courses';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/chapter-detail';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `NgeCourse | ${data?.chapter.title}` },
    {
      name: 'description',
      content: data?.chapter.description || 'Chapter detail page of NgeCourse!',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const chapter = await dataCourses.getChapterBySlug(args.params.chapterSlug);
  if (!chapter) {
    throw new Response('Chapter not found', { status: 404 });
  }

  return { chapter };
}

export default function ChapterDetailPage(props: Route.ComponentProps) {
  const {
    data: chapterData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['chapter', props.loaderData.chapter.slug],
    queryFn: () => dataCourses.getChapterBySlug(props.params.chapterSlug),
    initialData: props.loaderData.chapter,
  });

  if (!chapterData || isPending) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading chapter...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-center text-destructive">
          <div className="font-medium">Could not load chapter 😬</div>
          <div className="mt-1 text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  const lessonCount =
    chapterData.contents?.filter((content) => content._type === 'lesson')
      .length || 0;

  const quizCount =
    chapterData.contents?.filter((content) => content._type === 'quiz')
      .length || 0;

  // Group contents by type
  const lessons =
    chapterData.contents?.filter((content) => content._type === 'lesson') || [];
  const quizzes =
    chapterData.contents?.filter((content) => content._type === 'quiz') || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Chapter Header */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <BookOpen className="h-4 w-4" />
          <span>Chapter</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-bold text-2xl text-foreground leading-tight sm:text-3xl">
            {chapterData.title}
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg">
            {chapterData.description ||
              'No description provided for this chapter.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {lessonCount} Lessons
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {quizCount} Quizzes
            </span>
          </div>
        </div>
      </div>

      {/* Chapter Contents */}
      <div className="space-y-8">
        {/* Lessons Section */}
        {lessons.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-semibold text-foreground text-xl">Lessons</h2>
            <div className="grid gap-3">
              {lessons.map((lesson, index) => (
                <div
                  className="flex items-center justify-between rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:text-accent-foreground"
                  key={lesson._id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        Lesson {index + 1}
                      </p>
                    </div>
                  </div>
                  <Badge className="text-xs" variant="secondary">
                    Lesson
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-semibold text-foreground text-xl">Quizzes</h2>
            <div className="grid gap-3">
              {quizzes.map((quiz, index) => (
                <div
                  className="flex items-center justify-between rounded-lg border bg-card p-4 transition-all hover:bg-accent hover:text-accent-foreground"
                  key={quiz._id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <PlayCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{quiz.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        Quiz {index + 1}
                      </p>
                    </div>
                  </div>
                  <Badge className="text-xs" variant="secondary">
                    Quiz
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {lessons.length === 0 && quizzes.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium text-lg">No content available</h3>
            <p className="mt-2 text-muted-foreground">
              This chapter doesn't have any lessons or quizzes yet.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6 sm:pt-8">
        <div className="text-muted-foreground text-sm">
          Continue with the lessons and quizzes in this chapter
        </div>
      </div>
    </div>
  );
}
