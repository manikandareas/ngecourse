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


// Hooks
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

