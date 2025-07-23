import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { CourseWithContents } from '~/data/courses';
import type { LmsEnrollments } from '~/types/directus';
import { useContentProgression } from './use-content-progression';

interface SequentialNavigationItem {
  type: 'chapter' | 'lesson' | 'quiz';
  chapterId: string;
  chapterSlug: string;
  contentId?: number;
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
  course: CourseWithContents,
  enrollment: LmsEnrollments | null
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

    for (const chapter of course.chapters) {
      // Add chapter item
      items.push({
        type: 'chapter',
        chapterId: chapter.id,
        chapterSlug: chapter.slug,
        path: `/courses/${course.slug}/${chapter.slug}`,
        title: chapter.title,
        isCompleted: false, // Chapters don't have completion state
        isLocked: false, // Chapters are never locked
        isCurrent:
          params.chapterSlug === chapter.slug &&
          !params.lessonSlug &&
          !params.quizSlug,
      });

      // Add chapter contents (lessons and quizzes)
      for (const content of chapter.contents) {
        const contentId = content.id.toString();
        const isLesson = content.collection === 'lms_lessons';
        const contentPath = isLesson
          ? `/courses/${course.slug}/${chapter.slug}/lessons/${content.item.slug}`
          : `/courses/${course.slug}/${chapter.slug}/quizzes/${content.item.slug}`;

        items.push({
          type: isLesson ? 'lesson' : 'quiz',
          chapterId: chapter.id,
          chapterSlug: chapter.slug,
          contentId: content.id,
          contentSlug: content.item.slug,
          path: contentPath,
          title: content.item.title,
          isCompleted: isContentCompleted(contentId),
          isLocked: isContentLocked(contentId),
          isCurrent: isLesson
            ? params.lessonSlug === content.item.slug
            : params.quizSlug === content.item.slug,
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
