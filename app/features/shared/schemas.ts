import { z } from 'zod';

/**
 * Validation schema for enrollment operations
 */
export const enrollmentSchema = z.object({
  courseSlug: z.string().min(1, 'Course slug is required'),
  userId: z.string().min(1, 'User ID is required'),
});

/**
 * Validation schema for progression operations
 */
export const progressionSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  nextPath: z.string().optional(),
  courseSlug: z.string().min(1, 'Course slug is required'),
});

/**
 * Validation schema for user creation
 */
export const createUserSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username too long'),
  firstname: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long'),
  lastname: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long'),
  email: z.string().email('Invalid email format'),
  clerkId: z.string().min(1, 'Clerk ID is required'),
  onboardingStatus: z.enum(['not_started', 'completed']).optional(),
});

/**
 * Validation schema for enrollment creation in data layer
 */
export const enrollCourseDataSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

/**
 * Validation schema for progression update in data layer
 */
export const addProgressionDataSchema = z.object({
  enrollmentId: z.string().min(1, 'Enrollment ID is required'),
  contentsCompleted: z.array(z.string().min(1)),
  dateCompleted: z.string().optional(),
  percentComplete: z.number().min(0).max(100),
});

/**
 * Validation schema for save onborading state in data layer
 */
export const saveOnboardingSchema = z.object({
  learningGoals: z
    .array(z.string())
    .min(1, 'At least one focus area is required'),
  goal: z
    .string()
    .min(1, 'Personal learning goal is required')
    .max(120, 'Goal must be 120 characters or less'),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  languagePreference: z.enum(['id', 'en', 'mix']),
  explanationStyle: z.string().min(1, 'Please select an explanation style'),
});

/**
 * Validation schema for starting a quiz
 */
export const startQuizSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseSlug: z.string().min(1, 'Course slug is required'),
  chapterSlug: z.string().min(1, 'Chapter slug is required'),
  quizSlug: z.string().min(1, 'Quiz slug is required'),
});

/**
 * Validation schema for submitting a quiz answer
 */
export const submitAnswerSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  attemptId: z.string().min(1, 'Attempt ID is required'),
  questionIndex: z.number().min(0, 'Question index must be non-negative'),
  selectedOptionIndex: z
    .number()
    .min(0, 'Selected option index must be non-negative'),
});

/**
 * Validation schema for finalizing a quiz attempt
 */
export const finalizeAttemptSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  attemptId: z.string().min(1, 'Attempt ID is required'),
  answers: z
    .array(
      z.object({
        questionIndex: z.number().min(0),
        selectedOptionIndex: z.number().min(0),
        isOutcome: z.enum(['correct', 'incorrect']),
        timeTakenMs: z.number().min(0),
      })
    )
    .optional(),
  correctCount: z.number().min(0).optional(),
});

// Export types for use in other files
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type ProgressionInput = z.infer<typeof progressionSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type EnrollCourseDataInput = z.infer<typeof enrollCourseDataSchema>;
export type AddProgressionDataInput = z.infer<typeof addProgressionDataSchema>;
export type SaveOnboardingInput = z.infer<typeof saveOnboardingSchema>;
export type StartQuizInput = z.infer<typeof startQuizSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type FinalizeAttemptInput = z.infer<typeof finalizeAttemptSchema>;
