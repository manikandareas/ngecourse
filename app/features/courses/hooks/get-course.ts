import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataCourses } from '../data';

export const courseQueryOption = (slug: string) =>
  queryOptions({
    queryKey: ['course', slug],
    queryFn: () => dataCourses.withContents(slug),
  });

export const useCourse = (slug: string) => useQuery(courseQueryOption(slug));
