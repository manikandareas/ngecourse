import { defineQuery } from 'groq';

// Get user achievements with detailed achievement info
export const getUserAchievementsQuery = defineQuery(`
  *[_type == "userAchievement" && user._ref == $userId]{
    _id,
    earned,
    earnedAt,
    progress,
    notified,
    achievement->{
      _id,
      id,
      title,
      description,
      icon,
      category,
      criteria,
      points,
      isActive,
      course->
    }
  } | order(achievement->category, earned desc, achievement->points desc)
`);

// Get all available achievements
export const getAvailableAchievementsQuery = defineQuery(`
  *[_type == "achievement" && isActive == true] | order(category, points asc){
    _id,
    id,
    title,
    description,
    icon,
    category,
    criteria,
    points,
    isActive,
    course->
  }
`);

// Get specific achievement by ID
export const getAchievementByIdQuery = defineQuery(`
  *[_type == "achievement" && id == $achievementId][0]{
    _id,
    id,
    title,
    description,
    icon,
    category,
    criteria,
    points,
    isActive,
    course->
  }
`);

// Get or create user achievement record
export const getUserAchievementRecordQuery = defineQuery(`
  *[_type == "userAchievement" && user._ref == $userId && achievement._ref == $achievementId][0]
`);

// Check user's progress data for achievement calculations
export const getUserProgressForAchievementsQuery = defineQuery(`
  {
    "user": *[_type == "user" && _id == $userId][0]{
      _id,
      studyStreak,
      streakStartDate
    },
    "enrollments": *[_type == "enrollment" && userEnrolled[0]._ref == $userId]{
      _id,
      percentComplete,
      dateCompleted,
      "totalContent": count(course[0]->chapters[]->contents[]),
      "completedContent": count(contentsCompleted),
      "course": course[0]->{
        _id,
        title,
        "slug": slug.current
      }
    },
    "completedCourses": count(*[_type == "enrollment" && userEnrolled[0]._ref == $userId && percentComplete == 100 && defined(dateCompleted)]),
    "completedCoursesList": *[_type == "enrollment" && userEnrolled[0]._ref == $userId && percentComplete == 100 && defined(dateCompleted)]{
      _id,
      dateCompleted,
      "course": course[0]->{
        _id,
        title,
        "slug": slug.current
      }
    },
    "quizAttempts": *[_type == "quizAttempt" && user[0]._ref == $userId && status == "graded"]{
      percentage,
      submittedAt
    },
    "highScoringQuizzes": count(*[_type == "quizAttempt" && user[0]._ref == $userId && status == "graded" && percentage >= 90])
  }
`);