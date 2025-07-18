import {
    index,
    layout,
    route,
    type RouteConfig,
} from '@react-router/dev/routes';

export default [
    layout('routes/layout.tsx', [
        index('routes/home.tsx'),
        route('/courses', 'routes/courses/index.tsx'),
        route('/courses/:slug', 'routes/courses/detail.tsx'),
    ]),

    route('sign-in/*', 'routes/sign-in.tsx'),
    route('sign-up/*', 'routes/sign-up.tsx'),
] satisfies RouteConfig;
