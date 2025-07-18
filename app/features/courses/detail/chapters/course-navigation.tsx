import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  PlayCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { cn } from '~/lib/utils';

interface Content {
  id: string;
  title: string;
  type: 'lesson' | 'quiz';
  slug: string;
  completed?: boolean;
}

interface Chapter {
  id: string;
  title: string;
  slug: string;
  contents: Content[];
  completed?: boolean;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  chapters: Chapter[];
}

interface CourseNavigationProps {
  course: Course;
  className?: string;
}

export function CourseNavigation({ course, className }: CourseNavigationProps) {
  const params = useParams();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const isChapterActive = (chapter: Chapter) => {
    return params.chapterSlug === chapter.slug;
  };

  const isContentActive = (chapter: Chapter, content: Content) => {
    return (
      params.chapterSlug === chapter.slug &&
      (params.lessonSlug === content.slug || params.quizSlug === content.slug)
    );
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
        <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
          {course.chapters.length} chapters
        </p>
      </div>

      <nav className="space-y-2">
        {course.chapters.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const isActive = isChapterActive(chapter);

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
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-left font-medium text-sm sm:text-sm">
                    {chapter.title}
                  </span>
                  {chapter.completed && (
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                </Link>
              </div>

              {isExpanded && (
                <div className="ml-10 space-y-1">
                  {chapter.contents.map((content) => {
                    const isContentItemActive = isContentActive(
                      chapter,
                      content
                    );
                    const contentPath =
                      content.type === 'lesson'
                        ? `/courses/${course.slug}/chapters/${chapter.slug}/lessons/${content.slug}`
                        : `/courses/${course.slug}/chapters/${chapter.slug}/quizzes/${content.slug}`;

                    return (
                      <Link
                        className={cn(
                          'flex min-h-[44px] items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted/50 sm:min-h-[auto]',
                          isContentItemActive && 'bg-primary/10 text-primary'
                        )}
                        key={content.id}
                        to={contentPath}
                      >
                        {content.type === 'lesson' ? (
                          <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="flex-1 text-xs sm:text-sm">
                          {content.title}
                        </span>
                        {content.completed && (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
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
