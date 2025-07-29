import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';

type EnrollCourse = {
  courseId: string;
  userId: string;
};

const enrollCourse = async (data: EnrollCourse) => {
  try {
    // Check for existing enrollment first to prevent race condition
    const existingEnrollment = await getEnrollmentByUserId(
      data.userId,
      data.courseId
    );
    if (existingEnrollment) {
      throw new Error('User already enrolled in this course');
    }

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
  } catch (error) {
    throw new Error(
      `Failed to enroll course: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getEnrollmentByUserId = async (userId: string, courseId: string) => {
  const enrollmentQuery = defineQuery(`
    *[_type == "enrollment" &&
      userEnrolled[0]._ref == $userId &&
      course[0]._ref == $courseId][0]{
      _id,
      _type,
      _rev,
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

  try {
    return await client.fetch(enrollmentQuery, { userId, courseId });
  } catch (error) {
    throw new Error(
      `Failed to fetch enrollment: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

type AddProgression = {
  enrollmentId: string;
  contentsCompleted: string[];
  dateCompleted?: string;
  percentComplete: number;
  _rev?: string;
};

const addProgression = async (data: AddProgression) => {
  const contentsCompletedRefs = data.contentsCompleted.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
  }));

  try {
    const patchBuilder = client.patch(data.enrollmentId);

    // Use optimistic locking if revision is provided
    if ('_rev' in data && data._rev) {
      patchBuilder.ifRevisionId(data._rev);
    }

    return await patchBuilder
      .set({
        contentsCompleted: contentsCompletedRefs,
        dateCompleted: data.dateCompleted,
        percentComplete: Number(data.percentComplete.toFixed(2)),
      })
      .commit();
  } catch (error) {
    throw new Error(
      `Failed to update progression: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const dataEnrollment = {
  enrollCourse,
  oneByUserId: getEnrollmentByUserId,
  addProgression,
};
