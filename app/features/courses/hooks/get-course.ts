import { queryOptions, useQuery } from '@tanstack/react-query';
import type { CourseContentsQueryResult } from 'sanity.types';
import { dataCourses } from '../data';

export const courseQueryOption = (
  slug: string,
  initialData?: CourseContentsQueryResult
) =>
  queryOptions({
    queryKey: ['course', slug],
    queryFn: () => dataCourses.withContents(slug),
    ...(initialData && { initialData }),
  });

export const useCourse = (slug: string) => useQuery(courseQueryOption(slug));
