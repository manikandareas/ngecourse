import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataQuizzes } from '../data';

export const quizAttemptQueryOption = (attemptId: string, userId: string) =>
  queryOptions({
    queryKey: ['quiz-attempt', attemptId, userId],
    queryFn: () => dataQuizzes.getQuizAttempt(attemptId, userId),
  });

export const useQuizAttempt = (attemptId: string, userId: string) => 
  useQuery(quizAttemptQueryOption(attemptId, userId));

export const userQuizAttemptsQueryOption = (userId: string, quizId: string) =>
  queryOptions({
    queryKey: ['user-quiz-attempts', userId, quizId],
    queryFn: () => dataQuizzes.getUserQuizAttempts(userId, quizId),
  });

export const useUserQuizAttempts = (userId: string, quizId: string) =>
  useQuery(userQuizAttemptsQueryOption(userId, quizId));