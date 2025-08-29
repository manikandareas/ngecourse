// Achievement types aligned with Sanity schema
export interface Achievement {
  _id: string;
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'first_steps' | 'streak' | 'quiz' | 'course' | 'social';
  criteria: {
    type: 'lesson_count' | 'quiz_score' | 'course_completion' | 'streak_days' | 'custom';
    target?: number;
    threshold?: number;
  };
  points: number;
  isActive: boolean;
  course?: {
    _id: string;
    title: string;
    slug: string;
  } | null;
}

export interface UserAchievement {
  _id: string;
  earned: boolean;
  earnedAt?: string;
  progress: number;
  notified: boolean;
  achievement: Achievement;
}

// UI-compatible achievement type
export interface AchievementDisplay {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  target?: number;
  category: string;
  points: number;
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  shouldUnlock: boolean;
  metadata?: Record<string, any>;
}

export interface CourseCompletionData {
  userId: string;
  courseId: string;
  completedCourses: number;
  totalQuizScore?: number;
  courseDurationDays?: number;
}