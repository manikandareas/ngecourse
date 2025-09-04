import {
  index,
  layout,
  type RouteConfig,
  route,
} from '@react-router/dev/routes';

export default [
  // Root routes
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('/courses', 'routes/courses/courses.tsx'),
    route('/courses/:slug', 'routes/courses/course.tsx'),
    route('/privacy', 'routes/privacy.tsx'),
    route('/terms', 'routes/terms.tsx'),
    route('/progress', 'routes/progress.tsx'),
  ]),

  route(
    '/courses/:slug/:chapterSlug/lessons/:lessonSlug',
    'routes/courses/lesson.tsx'
  ),
  route(
    '/courses/:slug/:chapterSlug/quizzes/:quizSlug',
    'routes/courses/quiz.tsx'
  ),
  route(
    '/courses/:courseSlug/:chapterSlug/quizzes/:quizSlug/a/:attemptId',
    'routes/courses/quiz-attempt.tsx'
  ),
  route(
    '/courses/:courseSlug/:chapterSlug/quizzes/:quizSlug/a/:attemptId/result',
    'routes/courses/quiz-result.tsx'
  ),

  //   Auth routes
  route('sign-in/*', 'routes/sign-in.tsx'),
  route('sign-up/*', 'routes/sign-up.tsx'),
  route('/onboarding', 'routes/onboarding.tsx'),
  route('/recommendation', 'routes/recommendation.tsx'),

  // System routes
  route('/health', 'routes/health.tsx'),
] satisfies RouteConfig;
