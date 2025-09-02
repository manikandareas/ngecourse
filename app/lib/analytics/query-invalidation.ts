import type { QueryClient } from '@tanstack/react-query';

/**
 * Centralized query invalidation utility for analytics events
 * This ensures consistent cache invalidation across all analytics tracking
 */
export class AnalyticsQueryInvalidator {
  constructor(private queryClient: QueryClient) {}

  /**
   * Invalidate all user-related queries after analytics events
   */
  async invalidateUserData(userId: string, clerkId?: string) {
    const invalidationPromises = [];

    // User progress and analytics data
    if (clerkId) {
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: ['user-progress', clerkId],
        })
      );
    }

    // User enrollments and activity stats
    invalidationPromises.push(
      this.queryClient.invalidateQueries({
        queryKey: ['user-enrollments', userId],
      }),
      this.queryClient.invalidateQueries({
        queryKey: ['user-activity-stats', userId],
      }),
      this.queryClient.invalidateQueries({
        queryKey: ['recently-completed-content', userId],
      })
    );

    await Promise.all(invalidationPromises);
  }

  /**
   * Invalidate course-specific queries after course-related events
   */
  async invalidateCourseData(userId: string, courseSlug?: string) {
    const invalidationPromises = [];

    if (courseSlug) {
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: ['enrollment', userId, courseSlug],
        })
      );
    }

    await Promise.all(invalidationPromises);
  }

  /**
   * Invalidate achievement queries after potential achievement unlocks
   */
  async invalidateAchievements(userId: string) {
    const invalidationPromises = [
      this.queryClient.invalidateQueries({
        queryKey: ['user-achievements', userId],
      }),
      this.queryClient.invalidateQueries({
        queryKey: ['user-progress-achievements', userId],
      }),
    ];

    await Promise.all(invalidationPromises);
  }

  /**
   * Invalidate quiz-related queries after quiz completion
   */
  async invalidateQuizData(userId: string, attemptId?: string) {
    const invalidationPromises = [
      this.queryClient.invalidateQueries({
        queryKey: ['user-quiz-attempts', userId],
      }),
      this.queryClient.invalidateQueries({
        queryKey: ['recent-quiz-attempts', userId],
      }),
    ];

    if (attemptId) {
      invalidationPromises.push(
        this.queryClient.invalidateQueries({
          queryKey: ['quiz-attempt', attemptId, userId],
        })
      );
    }

    await Promise.all(invalidationPromises);
  }

  /**
   * Comprehensive invalidation after any learning activity
   * This is called after lesson/quiz completion events
   */
  async invalidateAfterLearningActivity(params: {
    userId: string;
    clerkId?: string;
    courseSlug?: string;
    attemptId?: string;
    achievementsUpdated?: boolean;
  }) {
    const { userId, clerkId, courseSlug, attemptId, achievementsUpdated } =
      params;

    const invalidationPromises = [
      // Always invalidate user data
      this.invalidateUserData(userId, clerkId),
    ];

    // Course-specific invalidation
    if (courseSlug) {
      invalidationPromises.push(this.invalidateCourseData(userId, courseSlug));
    }

    // Quiz-specific invalidation
    if (attemptId) {
      invalidationPromises.push(this.invalidateQuizData(userId, attemptId));
    }

    // Achievement invalidation
    if (achievementsUpdated) {
      invalidationPromises.push(this.invalidateAchievements(userId));
    }

    await Promise.all(invalidationPromises);
  }

  /**
   * Optimistically update user progress data
   * This provides immediate UI feedback before server response
   */
  optimisticallyUpdateStreak(clerkId: string, newStreak: number) {
    this.queryClient.setQueryData(
      ['user-progress', clerkId],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          studyStreak: newStreak,
          streakStartDate:
            newStreak === 1 ? Date.now() : oldData.streakStartDate,
        };
      }
    );
  }

  /**
   * Optimistically update XP and level
   */
  optimisticallyUpdateXP(clerkId: string, xpGained: number) {
    this.queryClient.setQueryData(
      ['user-progress', clerkId],
      (oldData: any) => {
        if (!oldData) return oldData;

        const newTotalXP = (oldData.analytics?.totalXP || 0) + xpGained;
        const newLevel = Math.floor(newTotalXP / 100) + 1; // Simple level calculation

        return {
          ...oldData,
          analytics: {
            ...oldData.analytics,
            totalXP: newTotalXP,
            currentLevel: newLevel,
          },
        };
      }
    );
  }

  /**
   * Reset all user-related cache
   * Useful for debugging or after major data changes
   */
  async resetUserCache(userId: string, clerkId?: string) {
    const resetPromises = [
      this.queryClient.resetQueries({
        queryKey: ['user-enrollments', userId],
      }),
      this.queryClient.resetQueries({
        queryKey: ['user-activity-stats', userId],
      }),
      this.queryClient.resetQueries({
        queryKey: ['user-achievements', userId],
      }),
    ];

    if (clerkId) {
      resetPromises.push(
        this.queryClient.resetQueries({
          queryKey: ['user-progress', clerkId],
        })
      );
    }

    await Promise.all(resetPromises);
  }
}

/**
 * Hook to create and use the query invalidator
 */
export function useAnalyticsInvalidator(queryClient: QueryClient) {
  return new AnalyticsQueryInvalidator(queryClient);
}
