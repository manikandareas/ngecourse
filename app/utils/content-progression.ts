import type {
  GetCourseContentsQueryResult,
  GetEnrollmentQueryResult,
} from 'sanity.types';

export type ContentProgressionState = 'completed' | 'unlocked' | 'locked';

export interface ContentWithProgression {
  id: string;
  state: ContentProgressionState;
  isCurrentContent: boolean;
}

/**
 * Extract all content IDs from course chapters in sequential order
 */
function extractContentIds(course: GetCourseContentsQueryResult): string[] {
  if (!Array.isArray(course?.chapters)) {
    return [];
  }

  return course.chapters.flatMap(
    (chapter) =>
      chapter.contents?.map((content) => content._id.toString()) || []
  );
}

/**
 * Extract completed content IDs from enrollment data
 */
function extractCompletedContentIds(
  enrollment: GetEnrollmentQueryResult | null
): Set<string> {
  if (!enrollment?.contentsCompleted?.length) {
    return new Set();
  }

  const completedIds = enrollment.contentsCompleted
    .map((item) => {
      if (typeof item === 'object' && item._id) {
        return item._id.toString();
      }
      return null;
    })
    .filter((id): id is string => Boolean(id));

  return new Set(completedIds);
}

/**
 * Find the index of the first uncompleted content
 */
function findCurrentProgressionIndex(
  contentIds: string[],
  completedIds: Set<string>
): number {
  const firstIncompleteIndex = contentIds.findIndex(
    (id) => !completedIds.has(id)
  );
  return firstIncompleteIndex === -1
    ? contentIds.length - 1
    : firstIncompleteIndex;
}

/**
 * Determine the state and current status for a content item
 */
function determineContentState(
  index: number,
  currentIndex: number,
  contentId: string,
  completedIds: Set<string>
): { state: ContentProgressionState; isCurrentContent: boolean } {
  const isCompleted = completedIds.has(contentId);

  if (index < currentIndex || isCompleted) {
    return { state: 'completed', isCurrentContent: false };
  }

  if (index === currentIndex) {
    return { state: 'unlocked', isCurrentContent: true };
  }

  return { state: 'locked', isCurrentContent: false };
}

/**
 * Determines the progression state for all contents in a course based on enrollment data
 * Rules:
 * - Contents must be completed in order
 * - Completed contents (n-1 and below) are marked as 'completed'
 * - The next content to complete (nth) is marked as 'unlocked' and is the current content
 * - Future contents (n+1 and above) are marked as 'locked'
 */
export function getContentProgression(
  course: GetCourseContentsQueryResult,
  enrollment: GetEnrollmentQueryResult | null
): ContentWithProgression[] {
  const allContentIds = extractContentIds(course);
  const completedContentIds = extractCompletedContentIds(enrollment);
  const currentIndex = findCurrentProgressionIndex(
    allContentIds,
    completedContentIds
  );

  return allContentIds.map((contentId, index) => {
    const { state, isCurrentContent } = determineContentState(
      index,
      currentIndex,
      contentId,
      completedContentIds
    );

    return {
      id: contentId,
      state,
      isCurrentContent,
    };
  });
}

/**
 * Get progression state for a specific content
 */
export function getContentState(
  contentId: string,
  contentProgression: ContentWithProgression[]
): ContentWithProgression | undefined {
  return contentProgression.find((item) => item.id === contentId);
}

/**
 * Calculate overall course progress
 */
export function calculateCourseProgress(
  contentProgression: ContentWithProgression[]
): {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
} {
  const completedCount = contentProgression.filter(
    (item) => item.state === 'completed'
  ).length;
  const totalCount = contentProgression.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return {
    completedCount,
    totalCount,
    progressPercentage,
  };
}
