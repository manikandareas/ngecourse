import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { useContentProgression } from './content-progression';

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
  course: CourseContentsQueryResult,
  enrollment: EnrollmentQueryResult | null
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
      const chapterSlug = chapter.slug?.current;
      const courseSlug = course?.slug?.current;
      const chapterTitle = chapter?.title;

      if (!(chapterSlug && courseSlug && chapterTitle)) {
        continue; // Skip invalid chapters
      }

      items.push({
        type: 'chapter',
        chapterId: chapter._id,
        chapterSlug,
        path: `/courses/${courseSlug}/${chapterSlug}`,
        title: chapterTitle,
        isCompleted: false, // Chapters don't have completion state
        isLocked: false, // Chapters are never locked
        isCurrent:
          params.chapterSlug === chapterSlug &&
          !params.lessonSlug &&
          !params.quizSlug,
      });

      // Add chapter contents (lessons and quizzes)
      for (const content of chapter.contents || []) {
        const contentId = content._id;
        const contentSlug = content.slug?.current;
        const contentTitle = content.title;
        const isLesson = content._type === 'lesson';

        if (
          !(
            contentId &&
            contentSlug &&
            contentTitle &&
            chapterSlug &&
            courseSlug
          )
        ) {
          continue; // Skip invalid content
        }

        const contentPath = isLesson
          ? `/courses/${courseSlug}/${chapterSlug}/lessons/${contentSlug}`
          : `/courses/${courseSlug}/${chapterSlug}/quizzes/${contentSlug}`;

        items.push({
          type: isLesson ? 'lesson' : 'quiz',
          chapterId: chapter._id,
          chapterSlug,
          contentId,
          contentSlug,
          path: contentPath,
          title: contentTitle,
          isCompleted: isContentCompleted(contentId),
          isLocked: isContentLocked(contentId),
          isCurrent: isLesson
            ? params.lessonSlug === contentSlug
            : params.quizSlug === contentSlug,
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
