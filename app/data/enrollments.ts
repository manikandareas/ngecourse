import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';

type EnrollCourse = {
  courseId: string;
  userId: string;
};

const enrollCourse = async (data: EnrollCourse) => {
  return await client.create({
    _type: 'enrollment',
    userEnrolled: [
      {
        _type: 'reference',
        _ref: data.userId,
      },
    ],
    course: [
      {
        _type: 'reference',
        _ref: data.courseId,
      },
    ],
    contentsCompleted: [],
    percentComplete: 0,
  });
};

const getEnrollmentByUserId = async (userId: string, courseId: string) => {
  const getEnrollmentQuery = defineQuery(`
    *[_type == "enrollment" && 
      userEnrolled[0]._ref == $userId && 
      course[0]._ref == $courseId][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      "userEnrolled": userEnrolled[0]->,
      "course": course[0]->,
      "contentsCompleted": contentsCompleted[]->{
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        slug,
      },
      dateCompleted,
      percentComplete
    }
  `);

  return await client.fetch(getEnrollmentQuery, { userId, courseId });
};

type AddProgression = {
  enrollmentId: string;
  contentsCompleted: string[];
  dateCompleted?: string;
  percentComplete: number;
};

const addProgression = async (data: AddProgression) => {
  const contentsCompletedRefs = data.contentsCompleted.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
  }));

  return await client
    .patch(data.enrollmentId)
    .set({
      contentsCompleted: contentsCompletedRefs,
      dateCompleted: data.dateCompleted,
      percentComplete: Number(data.percentComplete.toFixed(2)),
    })
    .commit();
};

export const dataEnrollment = {
  enrollCourse,
  oneByUserId: getEnrollmentByUserId,
  addProgression,
};
