import { readItems } from '@directus/sdk';
import type { AxiosResponse } from 'axios';
import { directusClient, directusClientAxios } from '~/lib/directus-client';
import type {
  LmsChapters,
  LmsChaptersContents,
  LmsCourses,
  LmsLessons,
  LmsQuizzes,
} from '~/types/directus';

const getCourses = async () => {
  return await directusClient.request(readItems('lms_courses', {}));
};

const getCourse = async (slug: string) => {
  return await directusClient
    .request(readItems('lms_courses', { filter: { slug: { _eq: slug } } }))
    .then((res) => (res.length > 0 ? res[0] : null));
};

export type CourseWithContents = LmsCourses & {
  chapters: Chapter[];
};

export type Chapter = LmsChapters & {
  contents: ChapterContent[];
};

export type ChapterContent = LmsChaptersContents & {
  item: LmsLessons | LmsQuizzes;
};

const getCourseContents = async (slug: string) => {
  return await directusClientAxios
    .get<AxiosResponse<CourseWithContents[]>>('/items/lms_courses', {
      params: {
        'filter[slug][_eq]': slug,
        fields: [
          '*',
          'chapters.*',
          'chapters.contents.*',
          'chapters.contents.item.*',
        ],
      },
    })
    .then((res) =>
      res.data.data.length > 0 ? (res.data.data[0] as CourseWithContents) : null
    );
};

export const dataCourses = {
  many: getCourses,
  one: getCourse,
  withContents: getCourseContents,
};
