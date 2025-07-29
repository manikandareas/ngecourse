import { queryOptions } from '@tanstack/react-query';
import { atomWithQuery } from 'jotai-tanstack-query';
import { dataCourses } from '../data';

export const coursesQueryOption = queryOptions({
  queryKey: ['courses'],
  queryFn: () => dataCourses.many(),
});

export const coursesAtom = atomWithQuery(() => coursesQueryOption);
