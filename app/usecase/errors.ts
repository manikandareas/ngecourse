/**
 * Custom error class for usecase layer operations
 * Provides structured error handling with error codes and categories
 */
export class UsecaseError extends Error {
  code: string;
  category: string;

  constructor(message: string, code: string, category = 'GENERAL') {
    super(message);
    this.name = 'UsecaseError';
    this.code = code;
    this.category = category;
  }
}

/**
 * Error codes for different usecase operations
 */
export const ERROR_CODES = {
  // Enrollment errors
  COURSE_NOT_FOUND: 'COURSE_NOT_FOUND',
  ALREADY_ENROLLED: 'ALREADY_ENROLLED',
  NOT_ENROLLED: 'NOT_ENROLLED',
  ENROLLMENT_FAILED: 'ENROLLMENT_FAILED',

  // Progression errors
  ALREADY_COMPLETED: 'ALREADY_COMPLETED',
  INVALID_COURSE: 'INVALID_COURSE',
  COMPLETION_FAILED: 'COMPLETION_FAILED',
  PROGRESSION_UPDATE_FAILED: 'PROGRESSION_UPDATE_FAILED',

  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_CREATION_FAILED: 'USER_CREATION_FAILED',
  INVALID_USER_DATA: 'INVALID_USER_DATA',
  USER_ONBOARDING_FAILED: 'USER_ONBOARDING_FAILED',

  // Course errors
  INVALID_COURSE_DATA: 'INVALID_COURSE_DATA',
  COURSE_ACCESS_DENIED: 'COURSE_ACCESS_DENIED',

  // Content errors
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  INVALID_CONTENT_TYPE: 'INVALID_CONTENT_TYPE',

  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

/**
 * Error categories for grouping related errors
 */
export const ERROR_CATEGORIES = {
  ENROLLMENT: 'ENROLLMENT',
  PROGRESSION: 'PROGRESSION',
  USER: 'USER',
  COURSE: 'COURSE',
  CONTENT: 'CONTENT',
  VALIDATION: 'VALIDATION',
  PERMISSION: 'PERMISSION',
  SYSTEM: 'SYSTEM',
} as const;

/**
 * Helper function to create enrollment-related errors
 */
export const createEnrollmentError = (
  message: string,
  code: keyof typeof ERROR_CODES
) => {
  return new UsecaseError(message, code, ERROR_CATEGORIES.ENROLLMENT);
};

/**
 * Helper function to create progression-related errors
 */
export const createProgressionError = (
  message: string,
  code: keyof typeof ERROR_CODES
) => {
  return new UsecaseError(message, code, ERROR_CATEGORIES.PROGRESSION);
};

/**
 * Helper function to create user-related errors
 */
export const createUserError = (
  message: string,
  code: keyof typeof ERROR_CODES
) => {
  return new UsecaseError(message, code, ERROR_CATEGORIES.USER);
};

/**
 * Helper function to create course-related errors
 */
export const createCourseError = (
  message: string,
  code: keyof typeof ERROR_CODES
) => {
  return new UsecaseError(message, code, ERROR_CATEGORIES.COURSE);
};

/**
 * Helper function to create content-related errors
 */
export const createContentError = (
  message: string,
  code: keyof typeof ERROR_CODES
) => {
  return new UsecaseError(message, code, ERROR_CATEGORIES.CONTENT);
};

/**
 * Helper function to create validation errors
 */
export const createValidationError = (
  message: string,
  code: keyof typeof ERROR_CODES = 'VALIDATION_ERROR'
) => {
  return new UsecaseError(message, code, ERROR_CATEGORIES.VALIDATION);
};

/**
 * Helper function to create system errors
 */
export const createSystemError = (
  message: string,
  code: keyof typeof ERROR_CODES = 'UNKNOWN_ERROR'
) => {
  return new UsecaseError(message, code, ERROR_CATEGORIES.SYSTEM);
};
