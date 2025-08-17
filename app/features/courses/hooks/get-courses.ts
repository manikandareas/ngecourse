import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataCourses } from '../data';

export const coursesQueryOption = queryOptions({
  queryKey: ['courses'],
  queryFn: () => dataCourses.many(),
});

export const useCourses = () => useQuery(coursesQueryOption);
