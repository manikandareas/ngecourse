import { PROGRESS_COPY } from '../constants/copy';

export const calculateStudyStreak = (
  streakStartDate?: number,
  currentDate: Date = new Date()
): number => {
  if (!streakStartDate) return 0;

  const startDate = new Date(streakStartDate);
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getStreakStatus = (
  streak: number
): {
  status: 'none' | 'building' | 'strong' | 'champion';
  message: string;
  emoji: string;
} => {
  if (streak === 0)
    return {
      status: 'none',
      message: PROGRESS_COPY.streakStatus.none.message,
      emoji: PROGRESS_COPY.streakStatus.none.emoji,
    };
  if (streak < 7)
    return {
      status: 'building',
      message: PROGRESS_COPY.streakStatus.building.message,
      emoji: PROGRESS_COPY.streakStatus.building.emoji,
    };
  if (streak < 30)
    return {
      status: 'strong',
      message: PROGRESS_COPY.streakStatus.strong.message,
      emoji: PROGRESS_COPY.streakStatus.strong.emoji,
    };
  return {
    status: 'champion',
    message: PROGRESS_COPY.streakStatus.champion.message,
    emoji: PROGRESS_COPY.streakStatus.champion.emoji,
  };
};

export const formatProgressPercentage = (percentage: number): string => {
  return `${Math.round(percentage)}%`;
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return 'text-green-400';
  if (percentage >= 75) return 'text-blue-400';
  if (percentage >= 50) return 'text-yellow-400';
  if (percentage >= 25) return 'text-orange-400';
  return 'text-gray-400';
};

export const getProgressBarColor = (percentage: number): string => {
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-gray-500';
};

export const formatQuizScore = (correct: number, total: number): string => {
  return `${correct}/${total}`;
};

export const getQuizGrade = (
  percentage: number
): {
  grade: string;
  color: string;
  description: string;
} => {
  if (percentage >= 90)
    return {
      grade: 'A',
      color: 'text-green-400',
      description: 'Excellent!',
    };
  if (percentage >= 80)
    return {
      grade: 'B',
      color: 'text-blue-400',
      description: 'Good job!',
    };
  if (percentage >= 70)
    return {
      grade: 'C',
      color: 'text-yellow-400',
      description: 'Keep improving!',
    };
  if (percentage >= 60)
    return {
      grade: 'D',
      color: 'text-orange-400',
      description: 'Needs work',
    };
  return {
    grade: 'F',
    color: 'text-red-400',
    description: 'Try again',
  };
};

export const formatTimeAgo = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

export const getLevelProgress = (
  level: string
): {
  current: number;
  next: string;
  progress: number;
} => {
  const levels = {
    beginner: { current: 1, next: 'Intermediate', progress: 33 },
    intermediate: { current: 2, next: 'Advanced', progress: 66 },
    advanced: { current: 3, next: 'Expert', progress: 100 },
  };

  return levels[level as keyof typeof levels] || levels.beginner;
};

export const getCourseStatusInfo = (
  percentComplete: number,
  dateCompleted?: string
): {
  status: 'not-started' | 'in-progress' | 'completed';
  statusText: string;
  statusColor: string;
} => {
  if (percentComplete === 0) {
    return {
      status: 'not-started',
      statusText: PROGRESS_COPY.status.notStarted,
      statusColor: 'text-gray-400',
    };
  }

  if (percentComplete === 100 && dateCompleted) {
    return {
      status: 'completed',
      statusText: PROGRESS_COPY.status.completed,
      statusColor: 'text-green-400',
    };
  }

  return {
    status: 'in-progress',
    statusText: PROGRESS_COPY.status.inProgress,
    statusColor: 'text-blue-400',
  };
};

// Dummy data generators for features not yet in Sanity
export const generateDummyAchievements = () => [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Completed your first lesson',
    icon: '🎯',
    earned: true,
    earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Scored 90% or higher on 5 quizzes',
    icon: '🏆',
    earned: true,
    earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'streak-week',
    title: 'Weekly Warrior',
    description: 'Maintained a 7-day learning streak',
    icon: '🔥',
    earned: false,
    progress: 5,
    target: 7,
  },
  {
    id: 'course-complete',
    title: 'Course Champion',
    description: 'Completed your first course',
    icon: '🎓',
    earned: false,
    progress: 0,
    target: 1,
  },
];


export const generateDummyAnalytics = () => ({
  weeklyProgress: [
    { week: 'Week 1', lessons: 3, quizzes: 2, avgScore: 75 },
    { week: 'Week 2', lessons: 5, quizzes: 3, avgScore: 82 },
    { week: 'Week 3', lessons: 4, quizzes: 4, avgScore: 78 },
    { week: 'Week 4', lessons: 7, quizzes: 3, avgScore: 85 },
  ],
  skillProgress: [
    { skill: 'JavaScript', progress: 85, level: 'Advanced' },
    { skill: 'React', progress: 70, level: 'Intermediate' },
    { skill: 'TypeScript', progress: 60, level: 'Intermediate' },
    { skill: 'Node.js', progress: 45, level: 'Beginner' },
  ],
});
