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

type AddProgressionParams = {
  chapterId: string;
  contentId: number;
  courseId: string;
  userId: string;
  nextPath?: string;
};

type ProgressionResult = {
  isCompleted: boolean;
  percentage: number;
  response: unknown;
  nextPath?: string;
};

class ProgressionError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ProgressionError';
    this.code = code;
  }
}

const addProgression = async (params: AddProgressionParams): Promise<ProgressionResult> => {
  const { userId, courseId, contentId, nextPath } = params;

  try {
    // Validate user enrollment
    const userEnrollment = await dataEnrollment.oneByUserId(userId, courseId);
    if (!userEnrollment) {
      throw new ProgressionError('User not enrolled in this course', 'NOT_ENROLLED');
    }

    // Extract completed content IDs for validation
    const existingCompletedContentIds = userEnrollment.contents_completed?.map(
      (content) => content.lms_chapters_contents_id as number
    ) ?? [];

    const existingCompletedIds = userEnrollment.contents_completed?.map(
      (content) => content.id
    ) ?? [];

    // Prevent duplicate completion
    if (existingCompletedContentIds.includes(contentId)) {
      throw new ProgressionError('Content already completed', 'ALREADY_COMPLETED');
    }

    // Add new completed content
    const newCompletedContent = await dataEnrollment.addCompletedContent({
      enrollmentId: userEnrollment.id,
      contentId,
    });

    if (!newCompletedContent) {
      throw new ProgressionError('Failed to record content completion', 'COMPLETION_FAILED');
    }

    // Calculate updated progress
    const updatedCompletedIds = [...existingCompletedIds, newCompletedContent.id];
    const totalContentCount = await dataCourses.countContents(courseId);
    
    if (totalContentCount === 0) {
      throw new ProgressionError('Course has no content to complete', 'INVALID_COURSE');
    }

    const completionPercentage = updatedCompletedIds.length / totalContentCount;
    const isCourseCompleted = completionPercentage >= 1;

    // Update enrollment progression
    const progressionResponse = await dataEnrollment.addProgression({
      enrollmentId: userEnrollment.id,
      contents_completed: updatedCompletedIds,
      is_completed: isCourseCompleted,
      percent_complete: completionPercentage,
      date_completed: isCourseCompleted ? new Date().toISOString() : undefined,
    });

    return {
      isCompleted: isCourseCompleted,
      percentage: completionPercentage,
      response: progressionResponse,
      nextPath,
    };
  } catch (error) {
    if (error instanceof ProgressionError) {
      console.error(`Progression Error [${error.code}]:`, error.message);
      throw error; // Re-throw custom errors for proper handling upstream
    }
    
    console.error('Unexpected error in addProgression:', error);
    throw new ProgressionError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
};

export const usecaseEnrollments = {
  enroll,
  addProgression,
};
