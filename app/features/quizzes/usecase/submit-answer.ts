import {
  createQuizError,
  createValidationError,
  ERROR_CODES,
  UsecaseError,
} from '~/features/shared/errors';
import {
  type SubmitAnswerInput,
  submitAnswerSchema,
} from '~/features/shared/schemas';
import { dataQuizzes } from '../data';

export const submitAnswer = async (params: SubmitAnswerInput) => {
  const validationResult = submitAnswerSchema.safeParse(params);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  const { userId, attemptId, questionIndex, selectedOptionIndex } = params;

  try {
    // Get current attempt
    const attempt = await dataQuizzes.getQuizAttempt(attemptId, userId);
    if (!attempt) {
      throw createQuizError('Quiz attempt not found', 'ATTEMPT_NOT_FOUND');
    }

    if (attempt.status !== 'in_progress') {
      throw createQuizError(
        'Cannot modify completed attempt',
        'ATTEMPT_FINALIZED'
      );
    }

    // Check if question already answered (immutability)
    const existingAnswer = attempt.answers?.find(
      (a) => a.questionIndex === questionIndex
    );
    if (existingAnswer) {
      throw createQuizError('Question already answered', 'QUESTION_LOCKED');
    }

    // Get quiz data for grading (only for this question)
    const quiz = attempt.quiz;
    if (!quiz?.questions?.[questionIndex]) {
      throw createQuizError('Invalid question index', 'INVALID_QUESTION');
    }

    const question = quiz.questions[questionIndex];
    const isCorrect = question.correctOptionIndex === selectedOptionIndex;

    // Create new answer
    const newAnswer = {
      _key: `answer-${questionIndex}`,
      _type: 'answer' as const,
      questionIndex,
      selectedOptionIndex,
      isOutcome: isCorrect ? ('correct' as const) : ('incorrect' as const),
      timeTakenMs: Date.now() - new Date(attempt.startedAt || '').getTime(),
    };

    // Update attempt with new answer
    const updatedAnswers = [...(attempt.answers || []), newAnswer];
    const correctCount = updatedAnswers.filter(
      (a) => a.isOutcome === 'correct'
    ).length;

    await dataQuizzes.updateQuizAttempt(attemptId, {
      answers: updatedAnswers,
      correctCount,
      _rev: attempt._rev, // Optimistic locking
    });

    return {
      success: true,
      correctness: isCorrect ? ('correct' as const) : ('incorrect' as const),
      explanation: question.explanation,
      nextQuestionIndex:
        questionIndex + 1 < quiz.questions.length ? questionIndex + 1 : null,
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

    console.error('Unexpected error in submit answer:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during answer submission',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};
