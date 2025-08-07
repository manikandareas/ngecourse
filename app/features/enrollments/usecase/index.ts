import { dataCourses } from '~/features/courses/data';
import { dataEnrollment } from '~/features/enrollments/data';
import {
  createEnrollmentError,
  createProgressionError,
  createValidationError,
  ERROR_CODES,
  UsecaseError,
} from '~/features/shared/errors';
import {
  enrollmentSchema,
  type ProgressionInput,
  progressionSchema,
} from '~/features/shared/schemas';

const enroll = async (courseSlug: string, userId: string) => {
  // Validate input
  const validationResult = enrollmentSchema.safeParse({ courseSlug, userId });
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  try {
    // Get course by slug
    const course = await dataCourses.one(courseSlug);
    if (!course) {
      throw createEnrollmentError('Course not found', 'COURSE_NOT_FOUND');
    }

    // Check if user is already enrolled
    const existingEnrollment = await dataEnrollment.oneByUserId(
      userId,
      course.slug as string
    );
    if (existingEnrollment) {
      throw createEnrollmentError(
        'User already enrolled in this course',
        'ALREADY_ENROLLED'
      );
    }

    // Create new enrollment
    const enrollment = await dataEnrollment.enrollCourse({
      courseId: course._id,
      userId,
    });

    return {
      success: true,
      enrollment,
    };
  } catch (error) {
    if (error instanceof UsecaseError) {
      console.error(`${error.category} Error [${error.code}]:`, error.message);
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    console.error('Unexpected error in enroll:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during enrollment',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};

const addProgression = async (params: ProgressionInput) => {
  // Validate input
  const validationResult = progressionSchema.safeParse(params);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  const { userId, contentId, nextPath, courseSlug, courseId } = params;

  try {
    // Validate user enrollment
    const userEnrollment = await dataEnrollment.oneByUserId(userId, courseSlug);
    if (!userEnrollment) {
      throw createProgressionError(
        'User not enrolled in this course',
        'NOT_ENROLLED'
      );
    }

    // Extract completed content IDs (now strings for Sanity)
    const existingCompletedContentIds =
      userEnrollment.contentsCompleted?.map((content) => content._id) ?? [];

    // Prevent duplicate completion
    if (existingCompletedContentIds.includes(contentId)) {
      throw createProgressionError(
        'Content already completed',
        'ALREADY_COMPLETED'
      );
    }

    // Calculate updated progress
    const updatedCompletedIds = [...existingCompletedContentIds, contentId];
    const totalContentCount = await dataCourses.countContents(courseId);

    if (totalContentCount === 0) {
      throw createProgressionError(
        'Course has no content to complete',
        'INVALID_COURSE'
      );
    }

    const completionPercentage = Math.round(
      (updatedCompletedIds.length / totalContentCount) * 100
    );
    const isCourseCompleted = completionPercentage >= 100;

    // Update enrollment progression with Sanity data structure
    const progressionResponse = await dataEnrollment.addProgression({
      enrollmentId: userEnrollment._id,
      contentsCompleted: updatedCompletedIds,
      dateCompleted: isCourseCompleted ? new Date().toISOString() : undefined,
      percentComplete: completionPercentage,
    });

    return {
      success: true,
      isCompleted: isCourseCompleted,
      percentage: completionPercentage,
      response: progressionResponse,
      nextPath,
    };
  } catch (error) {
    if (error instanceof UsecaseError) {
      console.error(`${error.category} Error [${error.code}]:`, error.message);
      return {
        success: false,
        isCompleted: false,
        percentage: 0,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    console.error('Unexpected error in addProgression:', error);
    return {
      success: false,
      isCompleted: false,
      percentage: 0,
      error: {
        message: 'An unexpected error occurred during progression update',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};

export const usecaseEnrollments = {
  enroll,
  addProgression,
};
