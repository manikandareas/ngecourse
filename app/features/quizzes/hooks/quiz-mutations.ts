import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  FinalizeAttemptInput,
  StartQuizInput,
  SubmitAnswerInput,
} from '~/features/shared/schemas';
import { usecaseQuizzes } from '../usecase';

export const useStartQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: StartQuizInput) => usecaseQuizzes.startQuiz(params),
    onSuccess: (_, variables) => {
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

  return useMutation({
    mutationFn: (params: FinalizeAttemptInput) =>
      usecaseQuizzes.finalizeAttempt(params),
    onSuccess: (_, variables) => {
      // Invalidate both attempt and attempts list
      queryClient.invalidateQueries({
        queryKey: ['quiz-attempt', variables.attemptId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-quiz-attempts', variables.userId],
      });
    },
  });
};
