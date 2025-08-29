import {
  getAvailableAchievementsQuery,
  getUserProgressForAchievementsQuery,
} from '~/features/achievements/data';
import type {
  Achievement,
  UserAchievement,
} from '~/features/achievements/types';
import { checkCourseCompletionAchievement } from '~/features/achievements/usecase';
import { client } from '~/lib/sanity-client';

/**
 * Award course completion achievements when a user completes a course
 */
export const awardCourseCompletionAchievements = async (
  userId: string,
  courseId: string
) => {
  try {
    // Get all available achievements and user's current progress
    const [achievements, progressData] = await Promise.all([
      client.fetch(getAvailableAchievementsQuery),
      client.fetch(getUserProgressForAchievementsQuery, { userId }),
    ]);

    // Calculate how many courses the user has completed (including this one)
    const completedCourses = progressData.completedCourses || 0;

    // Check which course completion achievements should be unlocked
    const achievementProgress = await checkCourseCompletionAchievement(
      {
        userId,
        courseId,
        completedCourses,
      },
      achievements as Achievement[],
      progressData // Pass the full progress data for proper evaluation
    );

    // Award achievements that should be unlocked
    const newlyEarnedAchievements: UserAchievement[] = [];

    for (const progress of achievementProgress) {
      if (progress.shouldUnlock) {
        try {
          // Check if user already has this achievement
          const existingRecord = await client.fetch(
            `*[_type == "userAchievement" && user._ref == $userId && achievement._ref == $achievementId][0]`,
            { userId, achievementId: progress.achievementId }
          );

          if (existingRecord) {
            // Update existing record if not already earned
            if (!existingRecord.earned) {
              const updated = await client
                .patch(existingRecord._id)
                .set({
                  earned: true,
                  progress: progress.currentProgress,
                  earnedAt: new Date().toISOString(),
                  notified: false,
                })
                .commit();

              newlyEarnedAchievements.push(updated as any);
            }
          } else {
            // Create new achievement record
            const created = await client.create({
              _type: 'userAchievement',
              user: { _type: 'reference', _ref: userId },
              achievement: { _type: 'reference', _ref: progress.achievementId },
              earned: true,
              progress: progress.currentProgress,
              earnedAt: new Date().toISOString(),
              notified: false,
            });

            newlyEarnedAchievements.push(created as any);
          }
        } catch (error) {
          console.error(
            `Failed to award achievement ${progress.achievementId}:`,
            error
          );
          // Continue with other achievements even if one fails
        }
      }
    }

    return newlyEarnedAchievements;
  } catch (error) {
    console.error('Failed to award course completion achievements:', error);
    throw error;
  }
};
