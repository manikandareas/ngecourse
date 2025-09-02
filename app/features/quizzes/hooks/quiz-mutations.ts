import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  FinalizeAttemptInput,
  StartQuizInput,
  SubmitAnswerInput,
} from '~/features/shared/schemas';
import { useEventTracking } from '~/hooks/use-event-tracking';
import { usecaseQuizzes } from '../usecase';

export const useStartQuizMutation = () => {
  const queryClient = useQueryClient();
  const { startActivity } = useEventTracking();

  return useMutation({
    mutationFn: (params: StartQuizInput) => usecaseQuizzes.startQuiz(params),
    onSuccess: (_, variables) => {
      // Start timing the quiz activity
      startActivity();

      // Invalidate attempts list
      queryClient.invalidateQueries({
        queryKey: ['user-quiz-attempts', variables.userId],
      });
    },
  });
};

export const useSubmitAnswerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SubmitAnswerInput) =>
      usecaseQuizzes.submitAnswer(params),
    onSuccess: (_, variables) => {
      // Update attempt cache with new answer
      queryClient.invalidateQueries({
        queryKey: ['quiz-attempt', variables.attemptId, variables.userId],
      });
    },
  });
};

export const useFinalizeQuizMutation = () => {
  const queryClient = useQueryClient();
  const { completeQuiz } = useEventTracking();

  return useMutation({
    mutationFn: (params: FinalizeAttemptInput) =>
      usecaseQuizzes.finalizeAttempt(params),
    onSuccess: async (result, variables) => {
      // Track quiz completion analytics
      if (result.success && result.quizData) {
        await completeQuiz(
          result.quizData.quizId,
          result.quizData.score || 0,
          result.quizData.totalQuestions || 1,
          result.quizData.courseId,
          {
            percentage: result.quizData.percentage,
            attemptNumber: result.quizData.attemptNumber,
            courseCompleted: result.courseCompleted,
            durationMs: result.quizData.durationMs,
          }
        );
      }

      // Invalidate both attempt and attempts list
      queryClient.invalidateQueries({
        queryKey: ['quiz-attempt', variables.attemptId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-quiz-attempts', variables.userId],
      });

      // If course was completed, invalidate enrollment and achievement queries
      if (
        result.success &&
        (result.courseCompleted ||
          (result.newlyEarnedAchievements?.length ?? 0) > 0)
      ) {
        queryClient.invalidateQueries({
          queryKey: ['user-enrollments', variables.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-achievements', variables.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-progress-achievements', variables.userId],
        });
      }
    },
  });
};
