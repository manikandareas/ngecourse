import {
  createQuizError,
  createValidationError,
  ERROR_CODES,
  UsecaseError,
} from '~/features/shared/errors';
import {
  type FinalizeAttemptInput,
  finalizeAttemptSchema,
} from '~/features/shared/schemas';
import { dataQuizzes } from '../data';

export const finalizeAttempt = async (params: FinalizeAttemptInput) => {
  const validationResult = finalizeAttemptSchema.safeParse(params);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  const { userId, attemptId, answers, correctCount } = params;

  try {
    const attempt = await dataQuizzes.getQuizAttempt(attemptId, userId);
    if (!attempt) {
      throw createQuizError('Quiz attempt not found', 'ATTEMPT_NOT_FOUND');
    }

    if (attempt.status !== 'in_progress') {
      throw createQuizError('Attempt already finalized', 'ALREADY_FINALIZED');
    }

    // Handle bulk submission of answers if provided
    let finalAnswers = attempt.answers || [];
    let finalCorrectCount = attempt.correctCount || 0;

    if (answers && answers.length > 0) {
      // Convert answers to the format expected by Sanity
      const bulkAnswers = answers.map((answer) => ({
        _key: `answer-${answer.questionIndex}`,
        _type: 'answer' as const,
        questionIndex: answer.questionIndex,
        selectedOptionIndex: answer.selectedOptionIndex,
        isOutcome: answer.isOutcome,
        timeTakenMs: answer.timeTakenMs,
      }));

      finalAnswers = [...finalAnswers, ...bulkAnswers];
      finalCorrectCount =
        correctCount !== undefined ? correctCount : finalCorrectCount;
    }

    // Calculate final scores
    const totalQuestions = attempt.quiz?.questions?.length || 0;
    const percentage =
      totalQuestions > 0
        ? Math.round((finalCorrectCount / totalQuestions) * 100)
        : 0;
    const score = finalCorrectCount;

    const submittedAt = new Date().toISOString();
    const durationMs =
      new Date(submittedAt).getTime() -
      new Date(attempt.startedAt || '').getTime();

    // Update attempt as completed with bulk answers
    await dataQuizzes.updateQuizAttempt(attemptId, {
      answers: finalAnswers,
      correctCount: finalCorrectCount,
      status: 'submitted',
      submittedAt,
      durationMs,
      score,
      percentage,
      _rev: attempt._rev,
    });

    return {
      success: true,
      finalScore: {
        correctCount: finalCorrectCount,
        totalQuestions,
        percentage,
        score,
      },
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

    console.error('Unexpected error in finalize attempt:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during attempt finalization',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};
