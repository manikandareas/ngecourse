import { dataCourses } from '~/features/courses/data';
import {
  createQuizError,
  createValidationError,
  ERROR_CODES,
  UsecaseError,
} from '~/features/shared/errors';
import {
  type StartQuizInput,
  startQuizSchema,
} from '~/features/shared/schemas';
import { dataQuizzes } from '../data';

export const startQuiz = async (params: StartQuizInput) => {
  // Validate input
  const validationResult = startQuizSchema.safeParse(params);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  const { userId, courseSlug, chapterSlug, quizSlug } = params;

  try {
    // Get quiz data
    const quiz = await dataQuizzes.getQuizBySlug(quizSlug);
    if (!quiz) {
      throw createQuizError('Quiz not found', 'QUIZ_NOT_FOUND');
    }

    // Get course and chapter for references
    const course = await dataCourses.one(courseSlug);
    const chapter = await dataCourses.getChapterBySlug(chapterSlug);

    if (!(course && chapter)) {
      throw createQuizError('Course or chapter not found', 'INVALID_CONTEXT');
    }

    // Check existing attempts
    const existingAttempts = await dataQuizzes.getUserQuizAttempts(
      userId,
      quiz._id
    );
    const inProgressAttempt = existingAttempts.find(
      (a) => a.status === 'in_progress'
    );

    if (inProgressAttempt) {
      // Continue existing attempt
      return {
        success: true,
        attemptId: inProgressAttempt._id,
        action: 'continue',
      };
    }

    // Check max attempts
    if (quiz.maxAttempt && existingAttempts.length >= quiz.maxAttempt) {
      throw createQuizError('Maximum attempts reached', 'MAX_ATTEMPTS_REACHED');
    }

    // Create new attempt
    const newAttempt = await dataQuizzes.createQuizAttempt({
      userId,
      quizId: quiz._id,
      courseId: course._id,
      chapterId: chapter._id,
      attemptNumber: existingAttempts.length + 1,
      totalQuestions: quiz.questions?.length || 0,
    });

    return {
      success: true,
      attemptId: newAttempt._id,
      action: 'start',
    };
  } catch (error) {
    if (error instanceof UsecaseError) {
      console.error(`${error.category} Error [${error.code}]:`, error.message);
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    console.error('Unexpected error in start quiz:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during quiz start',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};
