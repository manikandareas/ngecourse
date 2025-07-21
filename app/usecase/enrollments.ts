import { dataCourses } from '~/data/courses';
import { dataEnrollment } from '~/data/enrollments';

const enroll = async (courseSlug: string, userId: string) => {
  try {
    const course = await dataCourses.one(courseSlug);
    if (!course) {
      throw new Error('Course not found');
    }
    const enrollment = await dataEnrollment.oneByUserId(userId, course.id);
    if (enrollment) {
      throw new Error('User already enrolled in this course');
    }
    const response = await dataEnrollment.enrollCourse({
      courseId: course.id,
      userId,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const usecaseEnrollments = {
  enroll,
};
