import { createItem, readItems } from '@directus/sdk';
import { directusClient } from '~/lib/directus-client';
import type { LmsEnrollments } from '~/types/directus';

const enrollCourse = async (data: LmsEnrollments) => {
  return await directusClient.request(createItem('lms_enrollments', data));
};

const getEnrollmentByUserId = async (userId: string) => {
  return await directusClient
    .request(
      readItems('lms_enrollments', {
        filter: { user_enrolled: { _eq: userId } },
      })
    )
    .then((res) => (res.length > 0 ? res[0] : null));
};

export const dataEnrollment = {
  enrollCourse,
  onByUserId: getEnrollmentByUserId,
};
