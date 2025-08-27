import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataQuizzes } from '../data';

export const quizQueryOption = (slug: string) =>
  queryOptions({
    queryKey: ['quiz', slug],
    queryFn: () => dataQuizzes.getQuizBySlug(slug),
  });

export const useQuiz = (slug: string) => useQuery(quizQueryOption(slug));