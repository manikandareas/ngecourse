# Quiz Feature Implementation Plan - Architecture Aligned

## 0) Context & Guardrails

* **Stack**: React + React Router v7 (SSR) and **Sanity** CMS following the project's established architecture patterns
* **Auth**: Clerk integration with user validation in loaders
* **Architecture**: Feature-based architecture with data layer, usecase layer, TanStack Query hooks, and UI components
* **Data Flow**: Following project patterns - no direct Sanity calls in components, use data layer + usecase + TanStack Query

## 1) Deliverables (Definition of Done)

### 1.1 Feature Module Structure
Create `features/quizzes/` following the established pattern:
```
features/quizzes/
├── data/index.ts          # GROQ queries and Sanity data access
├── hooks/                 # TanStack Query hooks
│   ├── get-quiz.ts        # useQuiz hook
│   ├── get-quiz-attempt.ts # useQuizAttempt hook  
│   └── quiz-mutations.ts   # useMutation hooks
├── usecase/
│   ├── index.ts           # Main usecase exports
│   ├── start-quiz.ts      # Start/continue quiz logic
│   ├── submit-answer.ts   # Answer submission logic
│   ├── grade-question.ts  # Question grading logic
│   └── finalize-attempt.ts # Complete quiz logic
├── components/
│   ├── quiz-page.tsx      # Quiz overview page
│   ├── quiz-attempt.tsx   # Quiz taking interface
│   └── quiz-result.tsx    # Results display
└── utils/                 # Feature utilities
```

### 1.2 Quiz Page
Route: `/courses/:courseSlug/:chapterSlug/quizzes/:quizSlug`

* Show quiz metadata (title, description, total questions)
* Display user status and attempt history
* CTA states: **Start**, **Continue**, or **Retake**
* Uses `useQuiz` hook and quiz usecase functions

### 1.3 Attempt Page  
Route: `/courses/:courseSlug/:chapterSlug/quizzes/:quizSlug/a/:quizAttemptId`

* Renders questions one by one with immediate grading
* **On "Next"**: Submit answer via mutation, get correctness + explanation, show next question
* Auto-scroll and focus management for new questions
* **Submit** on last question → confirmation → finalize

### 1.4 Result Page
Route: `/courses/:courseSlug/:chapterSlug/quizzes/:quizSlug/a/:quizAttemptId/result`

* Show attempt summary and all answers with explanations
* **Back** button with proper cache invalidation

## 2) Architecture Implementation

### 2.1 Data Layer (`data/index.ts`)

Following the pattern from `features/courses/data/index.ts`:

```typescript
import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';

const getQuizBySlug = async (slug: string) => {
  const quizQuery = defineQuery(`
    *[_type == "quiz" && slug.current == $slug][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      maxAttempt,
      questions[]{
        _key,
        question,
        options,
        correctOptionIndex,
        explanation
      }
    }
  `);
  
  try {
    return await client.fetch(quizQuery, { slug });
  } catch (error) {
    throw new Error(`Failed to fetch quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const getQuizAttempt = async (attemptId: string, userId: string) => {
  const attemptQuery = defineQuery(`
    *[_type == "quizAttempt" && _id == $attemptId && user[0]._ref == $userId][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      attemptNumber,
      status,
      answers[]{
        _key,
        questionIndex,
        selectedOptionIndex,
        isOutcome,
        timeTakenMs
      },
      correctCount,
      totalQuestions,
      score,
      percentage,
      startedAt,
      submittedAt,
      durationMs,
      feedback,
      "quiz": quiz[0]->,
      "course": course[0]->,
      "chapter": chapter[0]->
    }
  `);
  
  try {
    return await client.fetch(attemptQuery, { attemptId, userId });
  } catch (error) {
    throw new Error(`Failed to fetch quiz attempt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const getUserQuizAttempts = async (userId: string, quizId: string) => {
  const attemptsQuery = defineQuery(`
    *[_type == "quizAttempt" && 
      user[0]._ref == $userId && 
      quiz[0]._ref == $quizId] | order(_createdAt desc){
      _id,
      attemptNumber,
      status,
      percentage,
      correctCount,
      totalQuestions,
      _createdAt,
      submittedAt
    }
  `);
  
  try {
    return await client.fetch(attemptsQuery, { userId, quizId });
  } catch (error) {
    throw new Error(`Failed to fetch user quiz attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const createQuizAttempt = async (data: CreateQuizAttemptData) => {
  try {
    return await client.create({
      _type: 'quizAttempt',
      user: [{ _type: 'reference', _ref: data.userId }],
      quiz: [{ _type: 'reference', _ref: data.quizId }],
      course: [{ _type: 'reference', _ref: data.courseId }],
      chapter: [{ _type: 'reference', _ref: data.chapterId }],
      attemptNumber: data.attemptNumber,
      status: 'in_progress',
      answers: [],
      startedAt: new Date().toISOString(),
      totalQuestions: data.totalQuestions
    });
  } catch (error) {
    throw new Error(`Failed to create quiz attempt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const updateQuizAttempt = async (attemptId: string, updates: Partial<QuizAttempt>) => {
  try {
    return await client.patch(attemptId).set(updates).commit();
  } catch (error) {
    throw new Error(`Failed to update quiz attempt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const dataQuizzes = {
  getQuizBySlug,
  getQuizAttempt,  
  getUserQuizAttempts,
  createQuizAttempt,
  updateQuizAttempt
};
```

### 2.2 TanStack Query Hooks (`hooks/`)

Following the pattern from `features/courses/hooks/get-course.ts`:

**`hooks/get-quiz.ts`**:
```typescript
import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataQuizzes } from '../data';

export const quizQueryOption = (slug: string) =>
  queryOptions({
    queryKey: ['quiz', slug],
    queryFn: () => dataQuizzes.getQuizBySlug(slug),
  });

export const useQuiz = (slug: string) => useQuery(quizQueryOption(slug));
```

**`hooks/get-quiz-attempt.ts`**:
```typescript
import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataQuizzes } from '../data';

export const quizAttemptQueryOption = (attemptId: string, userId: string) =>
  queryOptions({
    queryKey: ['quiz-attempt', attemptId, userId],
    queryFn: () => dataQuizzes.getQuizAttempt(attemptId, userId),
  });

export const useQuizAttempt = (attemptId: string, userId: string) => 
  useQuery(quizAttemptQueryOption(attemptId, userId));

export const userQuizAttemptsQueryOption = (userId: string, quizId: string) =>
  queryOptions({
    queryKey: ['user-quiz-attempts', userId, quizId],
    queryFn: () => dataQuizzes.getUserQuizAttempts(userId, quizId),
  });

export const useUserQuizAttempts = (userId: string, quizId: string) =>
  useQuery(userQuizAttemptsQueryOption(userId, quizId));
```

**`hooks/quiz-mutations.ts`**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usecaseQuizzes } from '../usecase';

export const useStartQuizMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usecaseQuizzes.startQuiz,
    onSuccess: (data, variables) => {
      // Invalidate attempts list
      queryClient.invalidateQueries({ 
        queryKey: ['user-quiz-attempts', variables.userId, variables.quizId] 
      });
    },
  });
};

export const useSubmitAnswerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usecaseQuizzes.submitAnswer,
    onSuccess: (data, variables) => {
      // Update attempt cache with new answer
      queryClient.invalidateQueries({ 
        queryKey: ['quiz-attempt', variables.attemptId, variables.userId] 
      });
    },
  });
};

export const useFinalizeQuizMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usecaseQuizzes.finalizeAttempt,
    onSuccess: (data, variables) => {
      // Invalidate both attempt and attempts list
      queryClient.invalidateQueries({ 
        queryKey: ['quiz-attempt', variables.attemptId, variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['user-quiz-attempts', variables.userId] 
      });
    },
  });
};
```

### 2.3 Usecase Layer (`usecase/`)

Following the pattern from `features/enrollments/usecase/index.ts`:

**`usecase/start-quiz.ts`**:
```typescript
import { dataQuizzes } from '../data';
import { dataCourses } from '~/features/courses/data';
import { 
  createQuizError, 
  createValidationError, 
  ERROR_CODES, 
  UsecaseError 
} from '~/features/shared/errors';
import { startQuizSchema, type StartQuizInput } from '~/features/shared/schemas';

export const startQuiz = async (params: StartQuizInput) => {
  // Validate input
  const validationResult = startQuizSchema.safeParse(params);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  const { userId, courseSlug, chapterSlug, quizSlug } = params;

  try {
    // Get quiz data
    const quiz = await dataQuizzes.getQuizBySlug(quizSlug);
    if (!quiz) {
      throw createQuizError('Quiz not found', 'QUIZ_NOT_FOUND');
    }

    // Get course and chapter for references  
    const course = await dataCourses.one(courseSlug);
    const chapter = await dataCourses.getChapterBySlug(chapterSlug);
    
    if (!course || !chapter) {
      throw createQuizError('Course or chapter not found', 'INVALID_CONTEXT');
    }

    // Check existing attempts
    const existingAttempts = await dataQuizzes.getUserQuizAttempts(userId, quiz._id);
    const inProgressAttempt = existingAttempts.find(a => a.status === 'in_progress');
    
    if (inProgressAttempt) {
      // Continue existing attempt
      return {
        success: true,
        attemptId: inProgressAttempt._id,
        action: 'continue'
      };
    }

    // Check max attempts
    if (quiz.maxAttempt && existingAttempts.length >= quiz.maxAttempt) {
      throw createQuizError('Maximum attempts reached', 'MAX_ATTEMPTS_REACHED');
    }

    // Create new attempt
    const newAttempt = await dataQuizzes.createQuizAttempt({
      userId,
      quizId: quiz._id,
      courseId: course._id,
      chapterId: chapter._id,
      attemptNumber: existingAttempts.length + 1,
      totalQuestions: quiz.questions?.length || 0
    });

    return {
      success: true,
      attemptId: newAttempt._id,
      action: 'start'
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

    console.error('Unexpected error in start quiz:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during quiz start',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};
```

**`usecase/submit-answer.ts`**:
```typescript
import { dataQuizzes } from '../data';
import { 
  createQuizError, 
  createValidationError, 
  ERROR_CODES, 
  UsecaseError 
} from '~/features/shared/errors';
import { submitAnswerSchema, type SubmitAnswerInput } from '~/features/shared/schemas';

export const submitAnswer = async (params: SubmitAnswerInput) => {
  const validationResult = submitAnswerSchema.safeParse(params);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  const { userId, attemptId, questionIndex, selectedOptionIndex } = params;

  try {
    // Get current attempt
    const attempt = await dataQuizzes.getQuizAttempt(attemptId, userId);
    if (!attempt) {
      throw createQuizError('Quiz attempt not found', 'ATTEMPT_NOT_FOUND');
    }

    if (attempt.status !== 'in_progress') {
      throw createQuizError('Cannot modify completed attempt', 'ATTEMPT_FINALIZED');
    }

    // Check if question already answered (immutability)
    const existingAnswer = attempt.answers?.find(a => a.questionIndex === questionIndex);
    if (existingAnswer) {
      throw createQuizError('Question already answered', 'QUESTION_LOCKED');
    }

    // Get quiz data for grading (only for this question)
    const quiz = await dataQuizzes.getQuizBySlug(attempt.quiz.slug.current);
    if (!quiz?.questions?.[questionIndex]) {
      throw createQuizError('Invalid question index', 'INVALID_QUESTION');
    }

    const question = quiz.questions[questionIndex];
    const isCorrect = question.correctOptionIndex === selectedOptionIndex;
    
    // Create new answer
    const newAnswer = {
      _key: `answer-${questionIndex}`,
      _type: 'answer' as const,
      questionIndex,
      selectedOptionIndex,
      isOutcome: isCorrect ? 'correct' as const : 'incorrect' as const,
      timeTakenMs: Date.now() - new Date(attempt.startedAt).getTime()
    };

    // Update attempt with new answer
    const updatedAnswers = [...(attempt.answers || []), newAnswer];
    const correctCount = updatedAnswers.filter(a => a.isOutcome === 'correct').length;
    
    await dataQuizzes.updateQuizAttempt(attemptId, {
      answers: updatedAnswers,
      correctCount,
      _rev: attempt._rev // Optimistic locking
    });

    return {
      success: true,
      correctness: isCorrect ? 'correct' as const : 'incorrect' as const,
      explanation: question.explanation,
      nextQuestionIndex: questionIndex + 1 < quiz.questions.length ? questionIndex + 1 : null
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

    console.error('Unexpected error in submit answer:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during answer submission',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};
```

**`usecase/finalize-attempt.ts`**:
```typescript
import { dataQuizzes } from '../data';
import { 
  createQuizError, 
  createValidationError, 
  ERROR_CODES, 
  UsecaseError 
} from '~/features/shared/errors';
import { finalizeAttemptSchema, type FinalizeAttemptInput } from '~/features/shared/schemas';

export const finalizeAttempt = async (params: FinalizeAttemptInput) => {
  const validationResult = finalizeAttemptSchema.safeParse(params);
  if (!validationResult.success) {
    throw createValidationError(
      `Invalid input: ${validationResult.error.issues.map((issue) => issue.message).join(', ')}`,
      'VALIDATION_ERROR'
    );
  }

  const { userId, attemptId } = params;

  try {
    const attempt = await dataQuizzes.getQuizAttempt(attemptId, userId);
    if (!attempt) {
      throw createQuizError('Quiz attempt not found', 'ATTEMPT_NOT_FOUND');
    }

    if (attempt.status !== 'in_progress') {
      throw createQuizError('Attempt already finalized', 'ALREADY_FINALIZED');
    }

    // Calculate final scores
    const totalQuestions = attempt.totalQuestions || 0;
    const correctCount = attempt.correctCount || 0;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = correctCount;
    
    const submittedAt = new Date().toISOString();
    const durationMs = new Date(submittedAt).getTime() - new Date(attempt.startedAt).getTime();

    // Update attempt as completed
    await dataQuizzes.updateQuizAttempt(attemptId, {
      status: 'submitted',
      submittedAt,
      durationMs,
      score,
      percentage,
      _rev: attempt._rev
    });

    return {
      success: true,
      finalScore: {
        correctCount,
        totalQuestions,
        percentage,
        score
      }
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

    console.error('Unexpected error in finalize attempt:', error);
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred during attempt finalization',
        code: ERROR_CODES.UNKNOWN_ERROR,
      },
    };
  }
};
```

**`usecase/index.ts`**:
```typescript
export { startQuiz } from './start-quiz';
export { submitAnswer } from './submit-answer';
export { finalizeAttempt } from './finalize-attempt';

export const usecaseQuizzes = {
  startQuiz,
  submitAnswer,
  finalizeAttempt,
};
```

## 3) Routes & Data Flow

### 3.1 Quiz Page Route
**`routes/courses.$courseSlug.$chapterSlug.quizzes.$quizSlug.tsx`**:

```typescript
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getAuth } from '@clerk/remix/ssr.server';
import { QuizPage } from '~/features/quizzes/components/quiz-page';
import { dataQuizzes } from '~/features/quizzes/data';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { userId } = await getAuth(request);
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const { courseSlug, chapterSlug, quizSlug } = params;
  if (!courseSlug || !chapterSlug || !quizSlug) {
    throw new Response('Invalid parameters', { status: 400 });
  }

  // Get quiz and user attempts
  const quiz = await dataQuizzes.getQuizBySlug(quizSlug);
  const attempts = quiz ? await dataQuizzes.getUserQuizAttempts(userId, quiz._id) : [];

  return {
    quiz,
    attempts,
    courseSlug,
    chapterSlug,
    quizSlug,
    userId
  };
};

export default function QuizRoute() {
  const data = useLoaderData<typeof loader>();
  return <QuizPage {...data} />;
}
```

### 3.2 Attempt Page Route
**`routes/courses.$courseSlug.$chapterSlug.quizzes.$quizSlug.a.$attemptId.tsx`**:

```typescript
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getAuth } from '@clerk/remix/ssr.server';
import { QuizAttemptPage } from '~/features/quizzes/components/quiz-attempt';
import { dataQuizzes } from '~/features/quizzes/data';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { userId } = await getAuth(request);
  if (!userId) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const { attemptId } = params;
  if (!attemptId) {
    throw new Response('Invalid attempt ID', { status: 400 });
  }

  // Get attempt with ownership check
  const attempt = await dataQuizzes.getQuizAttempt(attemptId, userId);
  if (!attempt) {
    throw new Response('Quiz attempt not found', { status: 404 });
  }

  return { attempt, userId };
};

export default function QuizAttemptRoute() {
  const data = useLoaderData<typeof loader>();
  return <QuizAttemptPage {...data} />;
}
```

## 4) Immediate Grading & State Management

* **Client-Side State**: TanStack Query manages quiz attempt state with proper invalidation
* **Mutations**: Submit answer via `useSubmitAnswerMutation` → get correctness + explanation → update UI
* **Immutability**: Enforced in usecase layer by checking existing answers
* **Progressive Enhancement**: Questions render locked state based on attempt.answers data

## 5) A11y & UX Implementation

* **Focus Management**: Auto-scroll and focus new questions with `scrollIntoView` + `focus()`
* **ARIA**: Quiz container with `aria-live="polite"` for dynamic updates
* **Loading States**: TanStack Query provides `isLoading`, `isPending` states
* **Error Handling**: Toast notifications for network failures with retry options

## 6) Security & Data Integrity

* **Authentication**: Clerk user validation in all loaders
* **Ownership**: Quiz attempts filtered by userId in GROQ queries
* **Immutability**: Usecase layer prevents locked question modification
* **Optimistic Locking**: Using Sanity `_rev` field for concurrent updates

## 7) Integration Points

* **Navigation**: Uses existing sequential navigation hooks from courses feature
* **Enrollment**: Integrates with enrollment progression tracking
* **Course Layout**: Uses same layout as lesson pages (`@app/routes/courses/lesson.tsx`)
* **Error System**: Uses shared error types and handling from `features/shared/errors`

## 8) Test Scenarios

* **Happy Path**: Start → Answer questions with immediate feedback → Submit → View results
* **Continue Session**: Reload mid-quiz shows locked answered questions + current question
* **Validation**: Attempt modification rejected for locked questions
* **Auth**: Unauthorized access blocked, attempts filtered by user
* **A11y**: Focus management and screen reader announcements work correctly

## Implementation Notes

1. **Follow Existing Patterns**: Use exact same structure as courses/enrollments features
2. **Schema Compliance**: Use existing Quiz/QuizAttempt types from sanity.types.ts
3. **No Schema Changes**: Work with existing document structure and field names
4. **TanStack Query**: Replace React Router actions with mutation hooks + usecase functions
5. **Error Handling**: Use shared error system and proper validation schemas
6. **Cache Management**: Proper query invalidation on mutations for consistent state

This implementation plan aligns with the project's established architecture while maintaining the immediate grading functionality through client-side mutations and proper state management.