import axios from 'axios';
import z from 'zod';
import { getPublicEnv } from '~/env.public';

import {
  createCourseError,
  createValidationError,
  ERROR_CODES,
  UsecaseError,
} from '~/features/shared/errors';

const EXTERNAL_SERVICE_URL = getPublicEnv(import.meta.env).EXTERNAL_SERVICE_URL;

const recommendCourses = async (query: string, token: string) => {
  const querySchema = z.string().min(1, 'Query must not be empty');
  const validationResult = querySchema.safeParse(query);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  try {
    const res = await axios.post(
      `${EXTERNAL_SERVICE_URL}/api/recommendations`,
      {
        query,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data);

    if (res.status !== 200) {
      throw createCourseError(
        'Failed to search courses',
        'COURSE_SEARCH_FAILED'
      );
    }

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

    console.error('Unexpected error in recommend courses:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during recommend courses',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};

export const usecaseCourses = {
  recommendCourses,
};
