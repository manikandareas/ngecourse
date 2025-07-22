import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Lock,
  PlayCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import type { CourseWithContents } from '~/data/courses';
import { useContentProgression } from '~/hooks/use-content-progression';
import { cn } from '~/lib/utils';
import type {
  LmsChapters,
  LmsChaptersContents,
  LmsEnrollments,
} from '~/types/directus';

interface CourseNavigationProps {
  course: CourseWithContents;
  enrollment: LmsEnrollments | null;
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

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const isChapterActive = (chapter: LmsChapters) => {
    return params.chapterSlug === chapter.slug;
  };

  const isContentActive = (
    chapter: LmsChapters,
    content: LmsChaptersContents
  ) => {
    return (
      params.chapterSlug === chapter.slug &&
      (params.lessonSlug === content.item.slug ||
        params.quizSlug === content.item.slug)
    );
  };

  // Calculate chapter progress
  const getChapterProgress = (chapter: LmsChapters) => {
    const chapterContentIds = chapter.contents.map((content) =>
      content.id.toString()
    );
    const chapterProgression = contentProgression.filter((item) =>
      chapterContentIds.includes(item.id)
    );

    const completedItems = chapterProgression.filter(
      (item) => item.state === 'completed'
    ).length;
    const totalItems = chapter.contents.length;
    const isChapterCompleted = completedItems === totalItems && totalItems > 0;

    return { completedItems, totalItems, isChapterCompleted };
  };

  // Generate content navigation path
  const getContentPath = (
    chapter: LmsChapters,
    content: LmsChaptersContents
  ) => {
    const isLesson = content.collection === 'lms_lessons';
    return isLesson
      ? `/courses/${course.slug}/chapters/${chapter.slug}/lessons/${content.item.slug}`
      : `/courses/${course.slug}/chapters/${chapter.slug}/quizzes/${content.item.slug}`;
  };

  return (
    <div
      className={cn(
        'w-80 border-r bg-muted/30 p-3 sm:w-72 sm:p-4 lg:w-80',
        className
      )}
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="font-semibold text-base text-foreground sm:text-lg">
          {course.title}
        </h2>
        <div className="mt-2 space-y-1">
          <p className="text-muted-foreground text-xs sm:text-sm">
            {course.chapters.length} chapters
          </p>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>
              {courseProgress.completedCount} of {courseProgress.totalCount}{' '}
              completed
            </span>
            <div className="h-1 w-16 rounded-full bg-muted">
              <div
                className="h-1 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${courseProgress.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {course.chapters.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const isActive = isChapterActive(chapter);
          const { completedItems, totalItems, isChapterCompleted } =
            getChapterProgress(chapter);

          return (
            <div className="space-y-1" key={chapter.id}>
              <div className="flex items-center gap-2">
                <button
                  className="flex min-h-[44px] items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted/50 sm:min-h-[auto]"
                  onClick={() => toggleChapter(chapter.id)}
                  type="button"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <Link
                  className={cn(
                    'inline-flex min-h-[44px] flex-1 items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted/50 sm:min-h-[auto]',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                  to={`/courses/${course.slug}/chapters/${chapter.slug}`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    {isChapterCompleted && (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-left font-medium text-sm sm:text-sm">
                        {chapter.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {completedItems}/{totalItems}
                      </span>
                    </div>
                    {completedItems > 0 && (
                      <div className="mt-1 h-1 w-full rounded-full bg-muted">
                        <div
                          className="h-1 rounded-full bg-primary transition-all duration-300"
                          style={{
                            width: `${(completedItems / totalItems) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {isExpanded && (
                <div className="ml-10 space-y-1">
                  {/** biome-ignore lint/complexity/noExcessiveCognitiveComplexity: false positive */}
                  {chapter.contents.map((content) => {
                    const isContentItemActive = isContentActive(
                      chapter,
                      content
                    );
                    const contentPath = getContentPath(chapter, content);
                    const contentId = content.id.toString();

                    const isCompleted = isContentCompleted(contentId);
                    const isLocked = isContentLocked(contentId);
                    const isCurrent = isContentCurrent(contentId);
                    const isLesson = content.collection === 'lms_lessons';

                    return (
                      <Link
                        className={cn(
                          'flex min-h-[44px] items-center gap-2 rounded-md p-2 transition-colors sm:min-h-[auto]',
                          isContentItemActive && 'bg-primary/10 text-primary',
                          isLocked && 'cursor-not-allowed opacity-60',
                          isCurrent && 'border border-blue-200 bg-blue-50',
                          isCompleted && 'bg-green-50',
                          !(isLocked || isContentItemActive) &&
                            'hover:bg-muted/50'
                        )}
                        key={content.id}
                        onClick={(e) => {
                          if (isLocked) {
                            e.preventDefault();
                          }
                        }}
                        to={isLocked ? '#' : contentPath}
                      >
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {isLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {!(isCompleted || isLocked) &&
                            (isLesson ? (
                              <PlayCircle className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            ))}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                'text-xs sm:text-sm',
                                isLocked && 'text-muted-foreground',
                                isCurrent && 'font-medium'
                              )}
                            >
                              {content.item.title}
                            </span>
                            {isCurrent && (
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 text-xs">
                                Current
                              </span>
                            )}
                          </div>
                          {isLocked && (
                            <p className="mt-1 text-muted-foreground text-xs">
                              Complete previous content to unlock
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
