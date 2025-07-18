import { readItems } from '@directus/sdk';
import { directusClient } from '~/lib/directus-client';

const getCourses = async () => {
  return await directusClient.request(readItems('lms_courses', {}));
};

const getCourse = async (slug: string) => {
  return await directusClient
    .request(readItems('lms_courses', { filter: { slug: { _eq: slug } } }))
    .then((res) => (res.length > 0 ? res[0] : null));
};

export const dataCourses = {
  many: getCourses,
  one: getCourse,
};
