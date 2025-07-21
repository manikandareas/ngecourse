import React from 'react';
import { Await } from 'react-router';
import { Badge } from '~/components/ui/badge';
import { dataCourses } from '~/data/courses';
import { CourseCard, toCourseCard } from '~/features/courses/course-card';
import type { Route } from './+types';

export function meta() {
  return [
    { title: 'NgeCourse | Courses' },
    { name: 'description', content: 'Courses page of NgeCourse!' },
  ];
}

export function loader() {
  return dataCourses.many();
}

export default function CoursesPage(props: Route.ComponentProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-20 xl:px-0">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div>
            <Badge>Courses</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-left font-semibold text-3xl tracking-tighter md:text-5xl">
              Explore All Courses!
            </h2>
            <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
              Discover courses and start learning something new today.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Await
              errorElement={<div>Could not load courses 😬</div>}
              resolve={props.loaderData}
            >
              {(resolvedCourses) =>
                resolvedCourses.map((course) => (
                  <CourseCard key={course.id} {...toCourseCard(course)} />
                ))
              }
            </Await>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
