import { queryOptions, useQuery } from '@tanstack/react-query';
import { client } from '~/lib/sanity-client';
import {
  getRecentlyCompletedContentQuery,
  getRecentQuizAttemptsQuery,
  getUserActivityStatsQuery,
  getUserEnrollmentsQuery,
  getUserProgressDataQuery,
} from '../data';

const fetchUserProgressData = async (clerkId: string) => {
  try {
    return await client.fetch(getUserProgressDataQuery, { clerkId });
  } catch (error) {
    throw new Error(
      `Failed to fetch user progress data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const fetchUserEnrollments = async (userId: string) => {
  try {
    return await client.fetch(getUserEnrollmentsQuery, { userId });
  } catch (error) {
    throw new Error(
      `Failed to fetch user enrollments: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const fetchRecentQuizAttempts = async (userId: string) => {
  try {
    return await client.fetch(getRecentQuizAttemptsQuery, { userId });
  } catch (error) {
    throw new Error(
      `Failed to fetch recent quiz attempts: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const fetchRecentlyCompletedContent = async (userId: string) => {
  try {
    return await client.fetch(getRecentlyCompletedContentQuery, { userId });
  } catch (error) {
    throw new Error(
      `Failed to fetch recently completed content: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const fetchUserActivityStats = async (userId: string) => {
  try {
    return await client.fetch(getUserActivityStatsQuery, { userId });
  } catch (error) {
    throw new Error(
      `Failed to fetch user activity stats: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Query options
export const userProgressDataQueryOption = (clerkId: string) =>
  queryOptions({
    queryKey: ['user-progress', clerkId],
    queryFn: () => fetchUserProgressData(clerkId),
    enabled: !!clerkId,
  });

export const userEnrollmentsQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['user-enrollments', userId],
    queryFn: () => fetchUserEnrollments(userId),
    enabled: !!userId,
  });

export const recentQuizAttemptsQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['recent-quiz-attempts', userId],
    queryFn: () => fetchRecentQuizAttempts(userId),
    enabled: !!userId,
  });

export const recentlyCompletedContentQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['recently-completed-content', userId],
    queryFn: () => fetchRecentlyCompletedContent(userId),
    enabled: !!userId,
  });

export const userActivityStatsQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['user-activity-stats', userId],
    queryFn: () => fetchUserActivityStats(userId),
    enabled: !!userId,
  });

// Combined data fetchers for optimization
const fetchUserProgressAndActivity = async (
  clerkId: string,
  userId: string
) => {
  try {
    const [userData, activityStats] = await Promise.all([
      client.fetch(getUserProgressDataQuery, { clerkId }),
      client.fetch(getUserActivityStatsQuery, { userId }),
    ]);
    return { userData, activityStats };
  } catch (error) {
    throw new Error(
      `Failed to fetch user progress and activity: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const fetchRecentActivities = async (userId: string) => {
  try {
    const [recentQuizAttempts, recentlyCompleted] = await Promise.all([
      client.fetch(getRecentQuizAttemptsQuery, { userId }),
      client.fetch(getRecentlyCompletedContentQuery, { userId }),
    ]);

    // Combine and sort activities by date for unified feed
    const allActivities = [
      ...(recentQuizAttempts || []).map((quiz) => ({ ...quiz, type: 'quiz' })),
      ...(recentlyCompleted || []).map((content: any) => ({
        ...content,
        type: 'content',
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt).getTime() -
          new Date(a.completedAt || a.createdAt).getTime()
      )
      .slice(0, 5); // Limit to 5 most recent activities

    return {
      recentQuizAttempts,
      recentlyCompleted,
      combinedActivities: allActivities,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch recent activities: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Optimized query options
export const userProgressAndActivityQueryOption = (
  clerkId: string,
  userId: string
) =>
  queryOptions({
    queryKey: ['user-progress-activity', clerkId, userId],
    queryFn: () => fetchUserProgressAndActivity(clerkId, userId),
    enabled: !!clerkId && !!userId,
  });

export const recentActivitiesQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['recent-activities', userId],
    queryFn: () => fetchRecentActivities(userId),
    enabled: !!userId,
  });

// Individual hooks (keeping for backward compatibility)
export const useUserProgressData = (clerkId: string) =>
  useQuery(userProgressDataQueryOption(clerkId));

export const useUserEnrollments = (userId: string) =>
  useQuery(userEnrollmentsQueryOption(userId));

export const useRecentQuizAttempts = (userId: string) =>
  useQuery(recentQuizAttemptsQueryOption(userId));

export const useRecentlyCompletedContent = (userId: string) =>
  useQuery(recentlyCompletedContentQueryOption(userId));

export const useUserActivityStats = (userId: string) =>
  useQuery(userActivityStatsQueryOption(userId));

// New consolidated hooks
export const useUserProgressAndActivity = (clerkId: string, userId: string) =>
  useQuery(userProgressAndActivityQueryOption(clerkId, userId));

export const useRecentActivities = (userId: string) =>
  useQuery(recentActivitiesQueryOption(userId));
