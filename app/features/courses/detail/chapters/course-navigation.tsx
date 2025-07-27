/** biome-ignore-all lint/style/noNestedTernary: false positive*/
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Lock,
  PlayCircle,
  Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type {
  GetChapterBySlugQueryResult,
  GetCourseContentsQueryResult,
  GetEnrollmentQueryResult,
  Lesson,
  Quiz,
} from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { useContentProgression } from '~/hooks/use-content-progression';
import { cn } from '~/lib/utils';

interface CourseNavigationProps {
  course: GetCourseContentsQueryResult;
  enrollment: GetEnrollmentQueryResult | null;
  className?: string;
}

export function CourseNavigation({
  course,
  enrollment,
  className,
}: CourseNavigationProps) {
  const params = useParams();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  // Use our content progression hook
  const {
    contentProgression,
    courseProgress,
    isContentCompleted,
    isContentLocked,
    isContentCurrent,
  } = useContentProgression(course, enrollment);

  // Auto-expand current chapter based on URL params
  useEffect(() => {
    const currentChapterSlug = params.chapterSlug;
    if (currentChapterSlug) {
      // Find the chapter that matches the current URL
      const currentChapter = course?.chapters?.find(
        (chapter) => chapter.slug?.current === currentChapterSlug
      );

      if (currentChapter) {
        setExpandedChapters((prev) => {
          const newExpanded = new Set(prev);
          newExpanded.add(currentChapter._id);
          return newExpanded;
        });
      }
    }
  }, [params.chapterSlug, course?.chapters]);

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // Check if content is currently active
  const isContentActive = (
    chapter: GetChapterBySlugQueryResult,
    content: Lesson | Quiz
  ) => {
    return (
      params.chapterSlug === chapter?.slug?.current &&
      (params.lessonSlug === content.slug?.current ||
        params.quizSlug === content.slug?.current)
    );
  };

  // Calculate chapter progress
  const getChapterProgress = (chapter: GetChapterBySlugQueryResult) => {
    const chapterContentIds = chapter?.contents?.map((content) =>
      content._id.toString()
    );
    const chapterProgression = contentProgression.filter((item) =>
      chapterContentIds?.includes(item.id)
    );

    const completedItems = chapterProgression?.filter(
      (item) => item.state === 'completed'
    ).length;
    const totalItems = chapter?.contents?.length || 0;
    const progressPercentage =
      totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return { completedItems, totalItems, progressPercentage };
  };

  // Generate content navigation path
  const getContentPath = (
    chapter: GetChapterBySlugQueryResult,
    content: Lesson | Quiz
  ) => {
    const isLesson = content._type === 'lesson';
    return isLesson
      ? `/courses/${course?.slug?.current}/${chapter?.slug?.current}/lessons/${content.slug?.current}`
      : `/courses/${course?.slug?.current}/${chapter?.slug?.current}/quizzes/${content.slug?.current}`;
  };

  return (
    <div
      className={cn(
        'sticky top-0 flex h-screen w-full flex-col overflow-clip bg-white dark:bg-gray-900',
        'border-gray-200 border-r dark:border-gray-700',
        'lg:w-80 xl:w-96',
        className
      )}
    >
      {/* Course Header */}
      <div className="border-border border-b bg-blue-500 p-4 sm:p-6 dark:bg-primary ">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-lg text-primary-foreground leading-tight sm:text-xl ">
              {course?.title}
            </h1>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-primary-foreground text-sm">
                <Trophy className="h-4 w-4" />
                <span>
                  {courseProgress.completedCount} of {courseProgress.totalCount}{' '}
                  completed
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary-foreground">Progress</span>
                  <span className="font-medium text-primary-foreground">
                    {Math.round(courseProgress.progressPercentage)}%
                  </span>
                </div>
                <Progress
                  className="h-2 bg-primary-foreground"
                  value={courseProgress.progressPercentage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <nav className="space-y-1">
          {course?.chapters?.map((chapter, chapterIndex) => {
            const isExpanded = expandedChapters.has(chapter._id);
            const { completedItems, totalItems, progressPercentage } =
              getChapterProgress(chapter as GetChapterBySlugQueryResult);
            const isChapterCompleted =
              completedItems === totalItems && totalItems > 0;

            return (
              <div className="group" key={chapter._id}>
                {/* Chapter Header */}
                <div className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Button
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => toggleChapter(chapter._id)}
                    size="sm"
                    variant="ghost"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>

                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full font-medium text-xs',
                          isChapterCompleted
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        )}
                      >
                        {isChapterCompleted ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          chapterIndex + 1
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight dark:text-white">
                          {chapter.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-gray-500 text-xs dark:text-gray-400">
                            {completedItems}/{totalItems} completed
                          </span>
                          {progressPercentage > 0 && (
                            <div className="h-1 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-1 rounded-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter Content */}
                {isExpanded && (
                  <div className="mt-2 ml-10 space-y-1">
                    {chapter?.contents?.map((content) => {
                      const isContentItemActive = isContentActive(
                        chapter as GetChapterBySlugQueryResult,
                        content as Lesson | Quiz
                      );
                      const contentPath = getContentPath(
                        chapter as GetChapterBySlugQueryResult,
                        content as Lesson | Quiz
                      );
                      const contentId = content._id.toString();

                      const isCompleted = isContentCompleted(contentId);
                      const isLocked = isContentLocked(contentId);
                      const isCurrent = isContentCurrent(contentId);
                      const isLesson = content._type === 'lesson';

                      return (
                        <div className="group/content" key={content._id}>
                          {isLocked ? (
                            <div
                              className={cn(
                                'flex items-center gap-3 rounded-lg p-3 transition-colors',
                                'border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50',
                                'opacity-60'
                              )}
                            >
                              <div className="flex-shrink-0">
                                <Lock className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-500 text-sm dark:text-gray-400">
                                  {content.title}
                                </p>
                                <p className="text-gray-400 text-xs dark:text-gray-500">
                                  Complete previous content to unlock
                                </p>
                              </div>
                            </div>
                          ) : (
                            <Link
                              className={cn(
                                'flex items-center gap-3 rounded-lg p-3 transition-all duration-200',
                                'border border-transparent hover:border-gray-200 hover:bg-gray-50',
                                'dark:hover:border-gray-700 dark:hover:bg-gray-800/50',
                                isContentItemActive && [
                                  'border-blue-200 bg-blue-50 shadow-sm',
                                  'dark:border-blue-800 dark:bg-blue-900/20',
                                ],
                                isCurrent &&
                                  !isContentItemActive && [
                                    'border-orange-200 bg-orange-50',
                                    'dark:border-orange-800 dark:bg-orange-900/20',
                                  ],
                                isCompleted &&
                                  !isContentItemActive &&
                                  !isCurrent && [
                                    'border-green-200 bg-green-50',
                                    'dark:border-green-800 dark:bg-green-900/20',
                                  ]
                              )}
                              to={contentPath}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                  </div>
                                ) : isLesson ? (
                                  <div
                                    className={cn(
                                      'rounded-full p-1',
                                      isCurrent
                                        ? 'bg-orange-100 dark:bg-orange-900'
                                        : 'bg-blue-100 dark:bg-blue-900'
                                    )}
                                  >
                                    <PlayCircle
                                      className={cn(
                                        'h-3 w-3',
                                        isCurrent
                                          ? 'text-orange-600 dark:text-orange-400'
                                          : 'text-blue-600 dark:text-blue-400'
                                      )}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className={cn(
                                      'rounded-full p-1',
                                      isCurrent
                                        ? 'bg-orange-100 dark:bg-orange-900'
                                        : 'bg-purple-100 dark:bg-purple-900'
                                    )}
                                  >
                                    <HelpCircle
                                      className={cn(
                                        'h-3 w-3',
                                        isCurrent
                                          ? 'text-orange-600 dark:text-orange-400'
                                          : 'text-purple-600 dark:text-purple-400'
                                      )}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p
                                    className={cn(
                                      'font-medium text-sm leading-tight',
                                      isContentItemActive
                                        ? 'text-blue-900 dark:text-blue-100'
                                        : 'text-gray-900 dark:text-white'
                                    )}
                                  >
                                    {content.title}
                                  </p>
                                  {isCurrent && (
                                    <Badge
                                      className="ml-2 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                      variant="secondary"
                                    >
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <Badge className="text-xs" variant="outline">
                                    {isLesson ? 'Lesson' : 'Quiz'}
                                  </Badge>
                                  {isCompleted && (
                                    <Badge
                                      className="bg-green-100 text-green-700 text-xs dark:bg-green-900 dark:text-green-300"
                                      variant="secondary"
                                    >
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
