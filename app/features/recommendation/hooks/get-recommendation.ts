import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataRecommendation } from '../data';

export const recommendationQueryOption = (userId: string) =>
  queryOptions({
    queryKey: ['recommendation', userId],
    queryFn: () => dataRecommendation.forUser(userId),
  });

export const useRecommendation = (userId: string) =>
  useQuery(recommendationQueryOption(userId));
