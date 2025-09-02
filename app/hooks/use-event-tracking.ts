import { useAuth } from '@clerk/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { eventTracker } from '~/lib/analytics/event-tracker';
import { useAnalyticsInvalidator } from '~/lib/analytics/query-invalidation';
import type {
  EventPayload,
  LessonCompletedPayload,
  QuizCompletedPayload,
  SessionEndedPayload,
  SessionStartedPayload,
} from '~/lib/analytics/types';

export function useEventTracking() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const invalidator = useAnalyticsInvalidator(queryClient);
  const sessionStartTimeRef = useRef<Date | null>(null);
  const activityStartTimeRef = useRef<Date | null>(null);

  // Process queue when component mounts and auth is available
  useEffect(() => {
    const processQueueWithAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          await eventTracker.processQueue(token);
        }
      } catch (error) {
        console.error('Failed to process analytics queue:', error);
        // Failed to process analytics queue
      }
    };

    processQueueWithAuth();
  }, [getToken]);

  const trackEventWithAuth = useCallback(
    async (payload: EventPayload): Promise<boolean> => {
      try {
        const token = await getToken();
        if (!token) {
          // No auth token available for analytics tracking
          return false;
        }
        return await eventTracker.trackEvent(payload, token);
      } catch (error) {
        // Failed to track analytics event
        console.error('Failed to track analytics event:', error);
        return false;
      }
    },
    [getToken]
  );

  const startSession = useCallback(
    async (courseId?: string): Promise<boolean> => {
      sessionStartTimeRef.current = new Date();

      const payload: SessionStartedPayload = {
        eventType: 'session_started',
        courseId,
        metadata: {
          platform: 'web',
          device: 'desktop',
          timestamp: sessionStartTimeRef.current.toISOString(),
        },
      };

      return await trackEventWithAuth(payload);
    },
    [trackEventWithAuth]
  );

  const completeLesson = useCallback(
    async (
      lessonId: string,
      courseId?: string,
      additionalMetadata?: Record<string, unknown>
    ): Promise<boolean> => {
      const timeSpent = activityStartTimeRef.current
        ? Math.floor(
            (Date.now() - activityStartTimeRef.current.getTime()) / (1000 * 60)
          )
        : 0;

      // Optimistic updates for immediate UI feedback
      const user = queryClient.getQueryData(['user-progress']) as any;
      if (user?.clerkId) {
        // Optimistically update XP (lessons give 50 XP)
        invalidator.optimisticallyUpdateXP(user.clerkId, 50);

        // Optimistically update streak if this is a new day
        const lastActivity = localStorage.getItem('lastActivityDate');
        const today = new Date().toDateString();
        if (lastActivity !== today) {
          invalidator.optimisticallyUpdateStreak(
            user.clerkId,
            (user.studyStreak || 0) + 1
          );
          localStorage.setItem('lastActivityDate', today);
        }
      }

      const payload: LessonCompletedPayload = {
        eventType: 'lesson_completed',
        contentId: lessonId,
        courseId,
        timeSpent: Math.max(timeSpent, 1), // Minimum 1 minute
        metadata: {
          completedAt: new Date().toISOString(),
          ...additionalMetadata,
        },
      };

      const success = await trackEventWithAuth(payload);

      // Invalidate relevant queries after successful tracking
      if (success && user) {
        await invalidator.invalidateAfterLearningActivity({
          userId: user._id,
          clerkId: user.clerkId,
          courseSlug: additionalMetadata?.courseSlug as string,
          achievementsUpdated: true, // Lessons can unlock achievements
        });
      }

      return success;
    },
    [trackEventWithAuth, queryClient, invalidator]
  );

  const completeQuiz = useCallback(
    async (
      quizId: string,
      score: number,
      totalQuestions: number,
      courseId?: string,
      additionalMetadata?: Record<string, unknown>
    ): Promise<boolean> => {
      const timeSpent = activityStartTimeRef.current
        ? Math.floor(
            (Date.now() - activityStartTimeRef.current.getTime()) / (1000 * 60)
          )
        : 0;

      const percentage = Math.floor((score / totalQuestions) * 100);

      // Optimistic updates for immediate UI feedback
      const user = queryClient.getQueryData(['user-progress']) as any;
      if (user?.clerkId) {
        // Quiz XP based on performance (0-100 XP)
        const xpGained = Math.floor(percentage);
        invalidator.optimisticallyUpdateXP(user.clerkId, xpGained);

        // Update streak if this is a new day
        const lastActivity = localStorage.getItem('lastActivityDate');
        const today = new Date().toDateString();
        if (lastActivity !== today) {
          invalidator.optimisticallyUpdateStreak(
            user.clerkId,
            (user.studyStreak || 0) + 1
          );
          localStorage.setItem('lastActivityDate', today);
        }
      }

      const payload: QuizCompletedPayload = {
        eventType: 'quiz_completed',
        contentId: quizId,
        courseId,
        timeSpent: Math.max(timeSpent, 1), // Minimum 1 minute
        metadata: {
          score,
          percentage,
          totalQuestions,
          correctAnswers: score,
          completedAt: new Date().toISOString(),
          ...additionalMetadata,
        },
      };

      const success = await trackEventWithAuth(payload);

      // Invalidate relevant queries after successful tracking
      if (success && user) {
        await invalidator.invalidateAfterLearningActivity({
          userId: user._id,
          clerkId: user.clerkId,
          courseSlug: additionalMetadata?.courseSlug as string,
          attemptId: additionalMetadata?.attemptId as string,
          achievementsUpdated: percentage >= 80, // High scores can unlock achievements
        });
      }

      return success;
    },
    [trackEventWithAuth, queryClient, invalidator]
  );

  const endSession = useCallback(
    async (
      reason: 'manual' | 'timeout' | 'navigation' = 'manual'
    ): Promise<boolean> => {
      sessionStartTimeRef.current = null;

      const payload: SessionEndedPayload = {
        eventType: 'session_ended',
        metadata: {
          reason,
          endedAt: new Date().toISOString(),
        },
      };

      return await trackEventWithAuth(payload);
    },
    [trackEventWithAuth]
  );

  const startActivity = useCallback(() => {
    activityStartTimeRef.current = new Date();
  }, []);

  const resetActivity = useCallback(() => {
    activityStartTimeRef.current = null;
  }, []);

  // Get current session and activity state
  const getSessionState = useCallback(() => {
    return {
      hasActiveSession: sessionStartTimeRef.current !== null,
      hasActiveActivity: activityStartTimeRef.current !== null,
      sessionDuration: sessionStartTimeRef.current
        ? Date.now() - sessionStartTimeRef.current.getTime()
        : 0,
      activityDuration: activityStartTimeRef.current
        ? Date.now() - activityStartTimeRef.current.getTime()
        : 0,
    };
  }, []);

  // Get analytics queue status for debugging
  const getQueueStatus = useCallback(() => {
    return eventTracker.getQueueStatus();
  }, []);

  return {
    // Core event tracking functions
    startSession,
    completeLesson,
    completeQuiz,
    endSession,

    // Activity timing helpers
    startActivity,
    resetActivity,

    // State getters
    getSessionState,
    getQueueStatus,

    // Low-level tracking function
    trackEvent: trackEventWithAuth,
  };
}
