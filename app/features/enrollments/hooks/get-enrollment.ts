import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataEnrollment } from '../data';

export const enrollmentQueryOption = (userId: string, courseSlug: string) =>
  queryOptions({
    queryKey: ['enrollment', userId, courseSlug],
    queryFn: async () => await dataEnrollment.oneByUserId(userId, courseSlug),
  });

export const useEnrollment = (userId: string, courseSlug: string) =>
  useQuery(enrollmentQueryOption(userId, courseSlug));
