import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  Folder,
  HelpCircle,
  Lock,
  PlayCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type {
  ChapterQueryResult,
  CourseContentsQueryResult,
  EnrollmentQueryResult,
  Lesson,
  Quiz,
} from 'sanity.types';
import { useContentProgression } from '~/features/courses/hooks/content-progression';
import { cn } from '~/lib/utils';

// Stateless chevron icon component to satisfy lint rule
function ChapterChevron({ open }: { open: boolean }) {
  return (
    <motion.span
      animate={{ rotate: open ? 90 : 0 }}
      className="flex"
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
    >
      <ChevronRight className="size-4 text-gray-500" />
    </motion.span>
  );
}

interface CourseFileTreeProps {
  course: CourseContentsQueryResult;
  enrollment: EnrollmentQueryResult | null;
  className?: string;
}

interface ChapterItemProps {
  chapter: ChapterQueryResult;
  course: CourseContentsQueryResult;
  isExpanded: boolean;
  onToggle: () => void;
  // Use a permissive type to match hook output without 'any'
  contentProgression: Array<{ id: string; state: string }>;
  isContentCompleted: (id: string) => boolean;
  isContentLocked: (id: string) => boolean;
  isContentCurrent: (id: string) => boolean;
}

interface ContentItemProps {
  content: Lesson | Quiz;
  chapter: ChapterQueryResult;
  course: CourseContentsQueryResult;
  isContentCompleted: (id: string) => boolean;
  isContentLocked: (id: string) => boolean;
  isContentCurrent: (id: string) => boolean;
}

function ContentItem({
  content,
  chapter,
  course,
  isContentCompleted,
  isContentLocked,
  isContentCurrent,
}: ContentItemProps) {
  const params = useParams();
  const contentId = content._id.toString();
  const isLesson = content._type === 'lesson';

  const isActive =
    params.chapterSlug === chapter?.slug?.current &&
    (params.lessonSlug === content.slug?.current ||
      params.quizSlug === content.slug?.current);

  const contentPath = isLesson
    ? `/courses/${course?.slug?.current}/${chapter?.slug?.current}/lessons/${content.slug?.current}`
    : `/courses/${course?.slug?.current}/${chapter?.slug?.current}/quizzes/${content.slug?.current}`;

  const iconClass = (colorWhenCurrent: string, colorDefault: string) =>
    cn('size-4', isContentCurrent(contentId) ? colorWhenCurrent : colorDefault);

  const renderStatusIcon = () => {
    if (isContentLocked(contentId)) {
      return <Lock className="size-4 text-gray-400" />;
    }
    if (isContentCompleted(contentId)) {
      return (
        <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
      );
    }
    if (isLesson) {
      return (
        <PlayCircle
          className={iconClass(
            'text-orange-600 dark:text-orange-400',
            'text-blue-600 dark:text-blue-400'
          )}
        />
      );
    }
    return (
      <HelpCircle
        className={iconClass(
          'text-orange-600 dark:text-orange-400',
          'text-purple-600 dark:text-purple-400'
        )}
      />
    );
  };

  const textClass = cn(
    'truncate text-sm',
    isContentLocked(contentId) && 'text-gray-400 dark:text-gray-500',
    !isContentLocked(contentId) &&
      isActive &&
      'font-medium text-blue-900 dark:text-blue-100',
    !(isContentLocked(contentId) || isActive) &&
      isContentCurrent(contentId) &&
      'font-medium text-orange-700 dark:text-orange-300',
    !(isContentLocked(contentId) || isActive || isContentCurrent(contentId)) &&
      'text-gray-900 dark:text-white'
  );

  if (isContentLocked(contentId)) {
    return (
      <li className="list-none">
        <button
          className="flex w-full items-center gap-2 rounded-md py-2 pl-6 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-0 dark:hover:bg-gray-800/50"
          type="button"
        >
          {renderStatusIcon()}
          <span className={textClass}>{content.title}</span>
        </button>
      </li>
    );
  }
  return (
    <li className="list-none">
      <Link
        className="flex min-h-9 items-center gap-2 rounded-md py-2 pl-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        to={contentPath}
      >
        {renderStatusIcon()}
        <span className={textClass}>{content.title}</span>
      </Link>
    </li>
  );
}

function ChapterItem({
  chapter,
  course,
  isExpanded,
  onToggle,
  contentProgression,
  isContentCompleted,
  isContentLocked,
  isContentCurrent,
}: ChapterItemProps) {
  // Calculate simple chapter completion state for the folder icon color
  const chapterContentIds =
    chapter?.contents?.map((c) => c._id.toString()) ?? [];
  const chapterProgression = contentProgression.filter((p) =>
    chapterContentIds.includes(p.id)
  );
  const completedItems = chapterProgression.filter(
    (p) => p.state === 'completed'
  ).length;
  const totalItems = chapter?.contents?.length ?? 0;
  const isChapterCompleted = totalItems > 0 && completedItems === totalItems;

  return (
    <li className="list-none">
      <div className="flex items-center gap-2 py-2">
        <button
          aria-label={isExpanded ? 'Collapse chapter' : 'Expand chapter'}
          className="-m-1 p-1"
          onClick={onToggle}
          type="button"
        >
          <ChapterChevron open={isExpanded} />
        </button>

        <Folder
          className={cn(
            'size-6',
            isChapterCompleted
              ? 'fill-green-500 text-green-500'
              : 'fill-sky-500 text-sky-500'
          )}
        />
        <span className="truncate text-gray-900 text-sm dark:text-white">
          {chapter?.title}
        </span>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            animate={{ height: 'auto' }}
            className="flex flex-col justify-end overflow-hidden pl-6"
            exit={{ height: 0 }}
            initial={{ height: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          >
            {chapter?.contents?.map((content) => (
              <ContentItem
                chapter={chapter as ChapterQueryResult}
                content={content as Lesson | Quiz}
                course={course}
                isContentCompleted={isContentCompleted}
                isContentCurrent={isContentCurrent}
                isContentLocked={isContentLocked}
                key={content._id}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export function CourseFileTree({
  course,
  enrollment,
  className,
}: CourseFileTreeProps) {
  const params = useParams();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  const {
    contentProgression: rawContentProgression,
    isContentCompleted: rawIsContentCompleted,
    isContentLocked: rawIsContentLocked,
    isContentCurrent: rawIsContentCurrent,
  } = useContentProgression(course, enrollment);

  // When there is no enrollment, lock all contents and hide progression
  const isEnrollmentMissing = !enrollment;

  const contentProgression = isEnrollmentMissing
    ? []
    : (rawContentProgression as Array<{ id: string; state: string }>);

  const isContentLocked = (id: string) =>
    isEnrollmentMissing ? true : rawIsContentLocked(id);

  const isContentCompleted = (id: string) =>
    isEnrollmentMissing ? false : rawIsContentCompleted(id);

  const isContentCurrent = (id: string) =>
    isEnrollmentMissing ? false : rawIsContentCurrent(id);

  // Auto-expand current chapter based on URL params
  useEffect(() => {
    const currentChapterSlug = params.chapterSlug;
    if (currentChapterSlug) {
      const currentChapter = course?.chapters?.find(
        (chapter) => chapter.slug?.current === currentChapterSlug
      );

      if (currentChapter) {
        setExpandedChapters((prev) => {
          const next = new Set(prev);
          next.add(currentChapter._id);
          return next;
        });
      }
    }
  }, [params.chapterSlug, course?.chapters]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        'sticky top-0 flex h-screen w-full flex-col bg-white dark:bg-gray-900',
        'border-gray-200 border-r dark:border-gray-700',
        'lg:w-80 xl:w-96',
        className
      )}
    >
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <nav>
          <ul className="space-y-1.5">
            {/* Top-level Course "folder" wrapping all chapters */}
            <li className="list-none">
              <div className="flex items-center gap-2 py-2">
                <ChapterChevron open />
                <Folder className="size-6 fill-sky-500 text-sky-500" />
                <span className="truncate text-gray-900 text-sm dark:text-white">
                  {course?.title}
                </span>
              </div>
              <ul className="pl-6">
                {course?.chapters?.map((chapter) => (
                  <ChapterItem
                    chapter={chapter as ChapterQueryResult}
                    contentProgression={
                      contentProgression as Array<{ id: string; state: string }>
                    }
                    course={course}
                    isContentCompleted={isContentCompleted}
                    isContentCurrent={isContentCurrent}
                    isContentLocked={isContentLocked}
                    isExpanded={expandedChapters.has(chapter._id)}
                    key={chapter._id}
                    onToggle={() => toggleChapter(chapter._id)}
                  />
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
