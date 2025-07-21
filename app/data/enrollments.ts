import { createItem, readItems } from '@directus/sdk';
import { directusClient } from '~/lib/directus-client';

type EnrollCourse = {
  courseId: string;
  userId: string;
};

const enrollCourse = async (data: EnrollCourse) => {
  return await directusClient.request(
    createItem('lms_enrollments', {
      course: data.courseId,
      user_enrolled: data.userId,
    })
  );
};

const getEnrollmentByUserId = async (userId: string, courseId: string) => {
  return await directusClient
    .request(
      readItems('lms_enrollments', {
        filter: { user_enrolled: { _eq: userId }, course: { _eq: courseId } },
        fields: ['*'],
      })
    )
    .then((res) => (res.length > 0 ? res[0] : null));
};

export const dataEnrollment = {
  enrollCourse,
  oneByUserId: getEnrollmentByUserId,
};
