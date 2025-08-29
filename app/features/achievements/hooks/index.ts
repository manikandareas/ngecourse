import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { client } from '~/lib/sanity-client';
import {
  getAvailableAchievementsQuery,
  getUserAchievementsQuery,
  getUserProgressForAchievementsQuery,
} from '../data';
import type { AchievementDisplay, UserAchievement } from '../types';

// Fetch functions
const fetchUserAchievements = async (
  userId: string
): Promise<UserAchievement[]> => {
  try {
    return await client.fetch(getUserAchievementsQuery, { userId });
  } catch (error) {
    throw new Error(
      `Failed to fetch user achievements: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const fetchAvailableAchievements = async () => {
  try {
    return await client.fetch(getAvailableAchievementsQuery);
  } catch (error) {
    throw new Error(
      `Failed to fetch available achievements: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const fetchUserProgressForAchievements = async (userId: string) => {
  try {
    return await client.fetch(getUserProgressForAchievementsQuery, { userId });
  } catch (error) {
    throw new Error(
      `Failed to fetch user progress for achievements: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Create or update user achievement
const createOrUpdateUserAchievement = async (data: {
  userId: string;
  achievementId: string;
  earned: boolean;
  progress: number;
  earnedAt?: string;
}) => {
  try {
    // Check if record exists
    const existingRecord = await client.fetch(
      `*[_type == "userAchievement" && user._ref == $userId && achievement._ref == $achievementId][0]`,
      { userId: data.userId, achievementId: data.achievementId }
    );

    if (existingRecord) {
      // Update existing record
      return await client
        .patch(existingRecord._id)
        .set({
          earned: data.earned,
          progress: data.progress,
          earnedAt: data.earnedAt,
          notified: false, // Reset notification flag
        })
        .commit();
    }
    // Create new record
    return await client.create({
      _type: 'userAchievement',
      user: { _type: 'reference', _ref: data.userId },
      achievement: { _type: 'reference', _ref: data.achievementId },
      earned: data.earned,
      progress: data.progress,
      earnedAt: data.earnedAt,
      notified: false,
    });
  } catch (error) {
    throw new Error(
      `Failed to create/update user achievement: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Mark achievement as notified
const markAchievementNotified = async (userAchievementId: string) => {
  try {
    return await client
      .patch(userAchievementId)
      .set({ notified: true })
      .commit();
  } catch (error) {
    throw new Error(
      `Failed to mark achievement as notified: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Query options
export const userAchievementsQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['user-achievements', userId],
    queryFn: () => fetchUserAchievements(userId),
    enabled: !!userId,
  });

export const availableAchievementsQueryOption = () =>
  queryOptions({
    queryKey: ['available-achievements'],
    queryFn: () => fetchAvailableAchievements(),
    staleTime: 1000 * 60 * 10, // 10 minutes - achievements don't change often
  });

export const userProgressForAchievementsQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['user-progress-achievements', userId],
    queryFn: () => fetchUserProgressForAchievements(userId),
    enabled: !!userId,
  });

// Hooks
export const useUserAchievements = (userId: string) =>
  useQuery(userAchievementsQueryOption(userId));

export const useAvailableAchievements = () =>
  useQuery(availableAchievementsQueryOption());

export const useUserProgressForAchievements = (userId: string) =>
  useQuery(userProgressForAchievementsQueryOption(userId));

// Achievement mutations
export const useAwardAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdateUserAchievement,
    onSuccess: (_, variables) => {
      // Invalidate and refetch achievement queries
      queryClient.invalidateQueries({
        queryKey: ['user-achievements', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-progress-achievements', variables.userId],
      });
    },
  });
};

export const useMarkAchievementNotified = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAchievementNotified,
    onSuccess: () => {
      // Invalidate achievement queries to update notification status
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
  });
};

// Transform user achievements to display format
export const transformUserAchievementsToDisplay = (
  userAchievements: UserAchievement[]
): AchievementDisplay[] => {
  return userAchievements.map((ua) => ({
    id: ua.achievement.id,
    title: ua.achievement.title,
    description: ua.achievement.description,
    icon: ua.achievement.icon,
    earned: ua.earned,
    earnedAt: ua.earnedAt ? new Date(ua.earnedAt) : undefined,
    progress: ua.progress,
    target: ua.achievement.criteria.target,
    category: ua.achievement.category,
    points: ua.achievement.points,
  }));
};
