import { createItem, updateItem } from '@directus/sdk';
import type { AxiosResponse } from 'axios';
import { directusClient, directusClientAxios } from '~/lib/directus-client';
import type {
  LmsEnrollments,
  LmsEnrollmentsLmsChaptersContents,
} from '~/types/directus';

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

type UserEnrollment = LmsEnrollments & {
  contents_completed: LmsEnrollmentsLmsChaptersContents[];
};

const getEnrollmentByUserId = async (userId: string, courseId: string) => {
  return await directusClientAxios
    .get<AxiosResponse<UserEnrollment[]>>('/items/lms_enrollments', {
      params: {
        'filter[user_enrolled][_eq]': userId,
        'filter[course][_eq]': courseId,
        fields: ['*', 'contents_completed.*'],
      },
    })
    .then((res) =>
      res.data.data.length > 0 ? (res.data.data[0] as UserEnrollment) : null
    );
};

type AddProgression = {
  enrollmentId: number;
  contents_completed: number[];
  is_completed: boolean;
  date_completed?: string;
  percent_complete: number;
};

const addProgression = async (data: AddProgression) => {
  return await directusClient.request(
    updateItem('lms_enrollments', data.enrollmentId, {
      contents_completed: data.contents_completed,
      is_completed: data.is_completed,
      date_completed: data.date_completed,
      percent_complete: Number(data.percent_complete.toFixed(2)),
    })
  );
};

type AddCompletedContent = {
  enrollmentId: number;
  contentId: number;
};

const addCompletedContent = async (data: AddCompletedContent) => {
  return await directusClient.request(
    createItem('lms_enrollments_lms_chapters_contents', {
      lms_chapters_contents_id: data.contentId,
      lms_enrollments_id: data.enrollmentId,
    })
  );
};

export const dataEnrollment = {
  enrollCourse,
  oneByUserId: getEnrollmentByUserId,
  addProgression,
  addCompletedContent,
};
