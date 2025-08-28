import { defineQuery } from 'groq';

export const getUserProgressDataQuery = defineQuery(`
  *[_type == "user" && clerkId == $clerkId][0]{
    _id,
    username,
    firstname,
    lastname,
    studyStreak,
    streakStartDate,
    learningGoals,
    studyPlan,
    level,
    onboardingStatus
  }
`);

export const getUserEnrollmentsQuery = defineQuery(`
  *[_type == "enrollment" && userEnrolled[0]._ref == $userId]{
    _id,
    percentComplete,
    dateCompleted,
    contentsCompleted,
    course[0]->{
      _id,
      title,
      "slug": slug.current,
      description,
      difficulty,
      thumbnail,
      topics[]->{
        _id,
        title,
        "slug": slug.current
      }
    }
  }
`);

export const getRecentQuizAttemptsQuery = defineQuery(`
  *[_type == "quizAttempt" && user[0]._ref == $userId] | order(submittedAt desc)[0...5]{
    _id,
    score,
    percentage,
    totalQuestions,
    correctCount,
    submittedAt,
    status,
    quiz[0]->{
      _id,
      title,
      "slug": slug.current
    },
    course[0]->{
      _id,
      title,
      "slug": slug.current
    },
    chapter[0]->{
      _id,
      title
    }
  }
`);

export const getRecentlyCompletedContentQuery = defineQuery(`
  *[_type == "enrollment" && userEnrolled[0]._ref == $userId && count(contentsCompleted) > 0]{
    _id,
    "recentCompletions": contentsCompleted[-5..-1][]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      "parentChapter": *[_type == "chapter" && references(^._id)][0]{
        _id,
        title,
        "slug": slug.current
      },
      "parentCourse": *[_type == "chapter" && references(^._id)][0].course[0]->{
        _id,
        title,
        "slug": slug.current
      }
    },
    course[0]->{
      _id,
      title,
      "slug": slug.current
    },
    percentComplete,
    dateCompleted
  }
`);

export const getCourseProgressQuery = defineQuery(`
  *[_type == "enrollment" && userEnrolled[0]._ref == $userId && course[0]._ref == $courseId][0]{
    _id,
    percentComplete,
    contentsCompleted,
    dateCompleted,
    course[0]->{
      _id,
      title,
      "slug": slug.current,
      chapters[]->{
        _id,
        title,
        "slug": slug.current,
        contents[]->{
          _id,
          _type,
          title,
          "slug": slug.current
        }
      }
    }
  }
`);

export const getUserActivityStatsQuery = defineQuery(`
  {
    "totalEnrollments": count(*[_type == "enrollment" && userEnrolled[0]._ref == $userId]),
    "completedCourses": count(*[_type == "enrollment" && userEnrolled[0]._ref == $userId && percentComplete == 100]),
    "totalQuizAttempts": count(*[_type == "quizAttempt" && user[0]._ref == $userId]),
    "averageQuizScore": math::avg(*[_type == "quizAttempt" && user[0]._ref == $userId && status == "graded"].percentage),
    "totalContentCompleted": math::sum(*[_type == "enrollment" && userEnrolled[0]._ref == $userId]{ "c": count(contentsCompleted) }.c)
  }
`);
