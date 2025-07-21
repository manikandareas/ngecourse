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
    route('/courses', 'routes/courses/index.tsx'),
    route('/courses/:slug', 'routes/courses/detail.tsx'),
  ]),

  // Courses routes
  layout('routes/courses/layout.tsx', [
    route(
      '/courses/:slug/chapters/:chapterSlug',
      'routes/courses/chapter-detail.tsx'
    ),
    route(
      '/courses/:slug/chapters/:chapterSlug/lessons/:lessonSlug',
      'routes/courses/lesson-detail.tsx'
    ),
  ]),

  // Courses quiz routes
  route(
    '/courses/:slug/chapters/:chapterSlug/quizzes/:quizSlug',
    'routes/courses/quiz.tsx'
  ),

  //   Auth routes
  route('sign-in/*', 'routes/sign-in.tsx'),
  route('sign-up/*', 'routes/sign-up.tsx'),

  // Webhooks routes
  route('api/webhooks', 'routes/api/webhooks.ts'),
] satisfies RouteConfig;
