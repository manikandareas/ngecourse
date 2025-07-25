import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import type {
  GetCourseContentsQueryResult,
  GetEnrollmentQueryResult,
} from 'sanity.types';
import { useContentProgression } from './use-content-progression';

interface SequentialNavigationItem {
  type: 'chapter' | 'lesson' | 'quiz';
  chapterId: string;
  chapterSlug: string;
  contentId?: string;
  contentSlug?: string;
  path: string;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
}

interface UseSequentialNavigationReturn {
  currentItem: SequentialNavigationItem | null;
  previousItem: SequentialNavigationItem | null;
  nextItem: SequentialNavigationItem | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  isCurrentCompleted: boolean;
  isNextLocked: boolean;
}

export function useSequentialNavigation(
  course: GetCourseContentsQueryResult,
  enrollment: GetEnrollmentQueryResult | null
): UseSequentialNavigationReturn {
  const params = useParams();
  const navigate = useNavigate();
  const { isContentCompleted, isContentLocked } = useContentProgression(
    course,
    enrollment
  );

  // Create flat list of all navigation items in sequential order
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: false positive
  const navigationItems = useMemo((): SequentialNavigationItem[] => {
    const items: SequentialNavigationItem[] = [];

    for (const chapter of course?.chapters || []) {
      // Add chapter item
      items.push({
        type: 'chapter',
        chapterId: chapter._id,
        chapterSlug: chapter.slug?.current as string,
        path: `/courses/${course?.slug?.current}/${chapter.slug?.current}`,
        title: chapter?.title as string,
        isCompleted: false, // Chapters don't have completion state
        isLocked: false, // Chapters are never locked
        isCurrent:
          params.chapterSlug === chapter.slug?.current &&
          !params.lessonSlug &&
          !params.quizSlug,
      });

      // Add chapter contents (lessons and quizzes)
      for (const content of chapter.contents || []) {
        const contentId = content._id;
        const isLesson = content._type === 'lesson';
        const contentPath = isLesson
          ? `/courses/${course?.slug?.current}/${chapter.slug?.current}/lessons/${content.slug?.current}`
          : `/courses/${course?.slug?.current}/${chapter.slug?.current}/quizzes/${content.slug?.current}`;

        items.push({
          type: isLesson ? 'lesson' : 'quiz',
          chapterId: chapter._id,
          chapterSlug: chapter.slug?.current as string,
          contentId: content._id as string,
          contentSlug: content.slug?.current as string,
          path: contentPath,
          title: content.title as string,
          isCompleted: isContentCompleted(contentId),
          isLocked: isContentLocked(contentId),
          isCurrent: isLesson
            ? params.lessonSlug === content.slug?.current
            : params.quizSlug === content.slug?.current,
        });
      }
    }

    return items;
  }, [course, params, isContentCompleted, isContentLocked]);

  // Find current item index
  const currentIndex = navigationItems.findIndex((item) => item.isCurrent);
  const currentItem = currentIndex >= 0 ? navigationItems[currentIndex] : null;

  // Get previous and next items
  const previousItem =
    currentIndex > 0 ? navigationItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < navigationItems.length - 1
      ? navigationItems[currentIndex + 1]
      : null;

  // Navigation capabilities
  const canGoPrevious = previousItem !== null;
  const canGoNext = Boolean(nextItem && !nextItem.isLocked);
  const isCurrentCompleted = Boolean(currentItem?.isCompleted);
  const isNextLocked = Boolean(nextItem?.isLocked);

  // Navigation functions
  const goToPrevious = () => {
    if (previousItem) {
      navigate(previousItem.path);
    }
  };

  const goToNext = () => {
    if (nextItem && !nextItem.isLocked) {
      navigate(nextItem.path);
    }
  };

  return {
    currentItem,
    previousItem,
    nextItem,
    canGoNext,
    canGoPrevious,
    goToPrevious,
    goToNext,
    isCurrentCompleted,
    isNextLocked,
  };
}
