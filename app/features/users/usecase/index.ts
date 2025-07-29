import type { UserJSON } from '@clerk/backend';
import { usecaseCourses } from '~/features/courses/usecase';
import {
  createUserError,
  createValidationError,
  ERROR_CODES,
  UsecaseError,
} from '~/features/shared/errors';
import {
  type SaveOnboardingInput,
  saveOnboardingSchema,
} from '~/features/shared/schemas';
import { dataUser } from '~/features/users/data';
import { generateCourseRecommendationPrompt } from '~/lib/utils';

const userCreated = async (user: UserJSON) => {
  return await dataUser.createOne({
    email: user.email_addresses[0].email_address as string,
    firstname: user.first_name || 'John',
    lastname: user.last_name || 'Doe',
    clerkId: user.id,
    username:
      user.username || user.email_addresses[0].email_address.split('@')[0],
    onboardingStatus: 'not_started',
  });
};

const saveOnboardingResults = async (
  userId: string,
  token: string,
  data: SaveOnboardingInput
) => {
  const validationResult = saveOnboardingSchema.safeParse(data);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  try {
    const result = await dataUser.updateOne(userId, {
      ...data,
      onboardingStatus: 'completed',
    });

    if (!result) {
      throw createUserError(
        'Failed to save onboarding results',
        'USER_ONBOARDING_FAILED'
      );
    }

    const prompt = generateCourseRecommendationPrompt({
      ...data,
      level: data.level ?? 'beginner',
    });

    await usecaseCourses.recommendCourses(prompt, token);

    return {
      success: true,
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

const getCurrentUser = async (clerkId: string) => {
  return await dataUser.findOneByClerkId(clerkId);
};

export const usecaseUser = {
  userCreated,
  getCurrentUser,
  saveOnboarding: saveOnboardingResults,
};
