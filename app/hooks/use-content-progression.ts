import { useMemo } from 'react';
import type {
  GetCourseContentsQueryResult,
  GetEnrollmentQueryResult,
} from 'sanity.types';
import {
  type ContentWithProgression,
  calculateCourseProgress,
  getContentProgression,
} from '~/utils/content-progression';

interface UseContentProgressionReturn {
  contentProgression: ContentWithProgression[];
  courseProgress: {
    completedCount: number;
    totalCount: number;
    progressPercentage: number;
  };
  getContentState: (contentId: string) => ContentWithProgression | undefined;
  isContentCompleted: (contentId: string) => boolean;
  isContentLocked: (contentId: string) => boolean;
  isContentCurrent: (contentId: string) => boolean;
}

/**
 * Custom hook for managing content progression state
 * Provides computed values and helper functions for content progression
 */
export function useContentProgression(
  course: GetCourseContentsQueryResult,
  enrollment: GetEnrollmentQueryResult | null
): UseContentProgressionReturn {
  const contentProgression = useMemo(
    () => getContentProgression(course, enrollment),
    [course, enrollment]
  );

  const courseProgress = useMemo(
    () => calculateCourseProgress(contentProgression),
    [contentProgression]
  );

  const getContentState = useMemo(
    () => (contentId: string) =>
      contentProgression.find((item) => item.id === contentId),
    [contentProgression]
  );

  const isContentCompleted = useMemo(
    () => (contentId: string) =>
      getContentState(contentId)?.state === 'completed',
    [getContentState]
  );

  const isContentLocked = useMemo(
    () => (contentId: string) => getContentState(contentId)?.state === 'locked',
    [getContentState]
  );

  const isContentCurrent = useMemo(
    () => (contentId: string) =>
      getContentState(contentId)?.isCurrentContent === true,
    [getContentState]
  );

  return {
    contentProgression,
    courseProgress,
    getContentState,
    isContentCompleted,
    isContentLocked,
    isContentCurrent,
  };
}
