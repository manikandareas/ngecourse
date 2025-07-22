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

type AddProgression = {
  chapterId: string;
  contentId: number;
  courseId: string;
  userId: string;
};

const addProgression = async (data: AddProgression) => {
  try {
    const enrollment = await dataEnrollment.oneByUserId(
      data.userId,
      data.courseId
    );
    if (!enrollment) {
      throw new Error('User not enrolled in this course');
    }

    const completedContentsId = enrollment.contents_completed?.map(
      (content) => content.id
    );

    if (completedContentsId?.includes(data.contentId)) {
      throw new Error('Content already completed');
    }

    // Check and calculate percentage
    const contentsCount = await dataCourses.countContents(data.courseId);

    const percentage = (completedContentsId?.length || 0) / contentsCount;
    const isCompleted = percentage === 1;

    const response = await dataEnrollment.addProgression({
      chapterId: data.chapterId,
      contents_completed: [...completedContentsId, data.contentId],
      is_completed: isCompleted,
      percent_complete: percentage,
      date_completed: isCompleted ? new Date().toISOString() : undefined,
    });
    return {
      isCompleted,
      percentage,
      response,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const usecaseEnrollments = {
  enroll,
  addProgression,
};
