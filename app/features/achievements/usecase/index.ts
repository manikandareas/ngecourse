import type {
  Achievement,
  AchievementProgress,
  CourseCompletionData,
} from '../types';

// Achievement criteria evaluation functions
export const evaluateAchievementProgress = (
  achievement: Achievement,
  progressData: any
): AchievementProgress => {
  const { criteria } = achievement;
  let currentProgress = 0;
  let shouldUnlock = false;

  switch (criteria.type) {
    case 'course_completion':
      // Check if this is a course-specific achievement
      if (achievement.course) {
        // Course-specific achievement: check if this specific course is completed
        const isSpecificCourseCompleted =
          progressData.completedCoursesList?.some(
            (completedCourse: any) =>
              completedCourse.course._id === achievement.course?._id
          );
        currentProgress = isSpecificCourseCompleted ? 1 : 0;
        shouldUnlock = isSpecificCourseCompleted;
      } else {
        // General milestone achievement: use total completed courses count
        currentProgress = progressData.completedCourses || 0;
        shouldUnlock = currentProgress >= (criteria.target || 1);
      }
      break;

    case 'lesson_count':
      // Sum up completed content from all enrollments
      currentProgress =
        progressData.enrollments?.reduce(
          (total: number, enrollment: any) =>
            total + (enrollment.completedContent || 0),
          0
        ) || 0;
      shouldUnlock = currentProgress >= (criteria.target || 1);
      break;

    case 'quiz_score': {
      // Count quizzes with score >= threshold
      const threshold = criteria.threshold || 90;
      currentProgress =
        progressData.quizAttempts?.filter(
          (attempt: any) => attempt.percentage >= threshold
        ).length || 0;
      shouldUnlock = currentProgress >= (criteria.target || 5);
      break;
    }

    case 'streak_days':
      currentProgress = progressData.user?.studyStreak || 0;
      shouldUnlock = currentProgress >= (criteria.target || 7);
      break;

    default:
      // Custom achievements would be handled here
      break;
  }

  return {
    achievementId: achievement._id,
    currentProgress,
    shouldUnlock,
    metadata: {
      criteria: criteria.type,
      target: criteria.target,
      threshold: criteria.threshold,
    },
  };
};

// Check all achievements for a user and return those that should be unlocked
export const checkAchievementsForUser = (
  achievements: Achievement[],
  progressData: any,
  existingUserAchievements: any[] = []
): AchievementProgress[] => {
  const results: AchievementProgress[] = [];

  for (const achievement of achievements) {
    // Skip if already earned
    const existingAchievement = existingUserAchievements.find(
      (ua) => ua.achievement._id === achievement._id
    );

    if (existingAchievement?.earned) {
      continue;
    }

    const progress = evaluateAchievementProgress(achievement, progressData);
    results.push(progress);
  }

  return results.filter((p) => p.shouldUnlock || p.currentProgress > 0);
};

// Specifically check for course completion achievement
export const checkCourseCompletionAchievement = async (
  data: CourseCompletionData,
  achievements: Achievement[],
  progressData?: any
): Promise<AchievementProgress[]> => {
  // Find course completion achievements
  const courseAchievements = achievements.filter(
    (a) => a.category === 'course' && a.criteria.type === 'course_completion'
  );

  const results: AchievementProgress[] = [];

  for (const achievement of courseAchievements) {
    let progress: AchievementProgress;

    if (achievement.course) {
      // Course-specific achievement: check if the specific course matches the completed one
      const isTargetCourse = achievement.course._id === data.courseId;
      progress = {
        achievementId: achievement._id,
        currentProgress: isTargetCourse ? 1 : 0,
        shouldUnlock: isTargetCourse,
        metadata: {
          criteria: 'course_completion',
          courseSpecific: true,
          targetCourseId: achievement.course._id,
          completedCourseId: data.courseId,
        },
      };
    } else {
      // General milestone achievement: use the standard evaluation with progress data
      progress = evaluateAchievementProgress(
        achievement,
        progressData || {
          completedCourses: data.completedCourses,
        }
      );
    }

    if (progress.shouldUnlock || progress.currentProgress > 0) {
      results.push(progress);
    }
  }

  return results;
};

// Calculate XP points for achievements
export const calculateXPFromAchievements = (
  achievements: Achievement[]
): number => {
  return achievements.reduce(
    (total, achievement) => total + achievement.points,
    0
  );
};

// Get achievements by category
export const getAchievementsByCategory = (
  achievements: Achievement[]
): Record<string, Achievement[]> => {
  return achievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );
};

// Format achievement notification message
export const formatAchievementNotification = (
  achievement: Achievement
): {
  title: string;
  message: string;
  icon: string;
} => {
  return {
    title: '🎉 Achievement Unlocked!',
    message: `You earned "${achievement.title}" - ${achievement.description}`,
    icon: achievement.icon,
  };
};
