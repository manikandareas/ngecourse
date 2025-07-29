import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataEnrollment } from '../data';

export const enrollmentQueryOption = (userId: string, courseId: string) =>
  queryOptions({
    queryKey: ['enrollment', userId, courseId],
    queryFn: () => dataEnrollment.oneByUserId(userId, courseId),
  });

export const useEnrollment = (userId: string, courseId: string) =>
  useQuery(enrollmentQueryOption(userId, courseId));
