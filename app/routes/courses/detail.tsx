import { useQueries } from '@tanstack/react-query';
import { dataCourses } from '~/data/courses';
import { dataEnrollment } from '~/data/enrollments';
import { CourseInfo } from '~/features/courses/detail/course-info';
import { HeroSection } from '~/features/courses/detail/hero-section';
import { PathSection } from '~/features/courses/detail/path-section';
import { extractYoutubeId } from '~/lib/utils';
import { getCurrentSession } from '~/root';
import { usecaseEnrollments } from '~/usecase/enrollments';
import type { Route } from './+types/detail';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `NgeCourse | ${data?.course?.title}` },
    {
      name: 'description',
      content: data?.course?.description || 'Course detail page of NgeCourse!',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);

  const courseWithContents = await dataCourses.withContents(args.params.slug);

  if (!courseWithContents) {
    throw new Response('Course Not Found', { status: 404 });
  }

  const enrollment = await dataEnrollment.oneByUserId(
    currentSession?._id || '',
    courseWithContents._id
  );

  return {
    course: courseWithContents,
    enrollment,
    currentSession,
  };
}

export async function action(args: Route.ActionArgs) {
  const currentSession = await getCurrentSession(args);

  if (!currentSession) {
    return new Response('Unauthorized', { status: 401 });
  }

  const response = await usecaseEnrollments.enroll(
    args.params.slug,
    currentSession._id
  );

  if (!response) {
    return false;
  }

  return true;
}

export default function CourseDetailPage(props: Route.ComponentProps) {
  const [courseQuery, enrollmentQuery] = useQueries({
    queries: [
      {
        queryKey: ['course', props.params.slug],
        queryFn: () => dataCourses.withContents(props.params.slug),
        initialData: props.loaderData.course,
      },
      {
        queryKey: ['enrollment', props.loaderData.enrollment?._id || ''],
        queryFn: () =>
          dataEnrollment.oneByUserId(
            props.loaderData.currentSession?._id || '',
            props.loaderData.course._id || ''
          ),
        initialData: props.loaderData.enrollment,
      },
    ],
  });

  if (courseQuery.isLoading || enrollmentQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!courseQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl px-6 py-20 xl:px-0">
      <HeroSection
        course={courseQuery.data}
        enrollment={enrollmentQuery.data}
        userId={props.loaderData.currentSession?._id}
      />

      {/* Main Content */}
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 py-8 md:flex-row">
        <PathSection
          course={courseQuery.data}
          enrollment={enrollmentQuery.data}
        />
        {/* Sidebar */}
        <aside className="w-full flex-shrink-0 md:w-80 lg:sticky lg:top-28 lg:h-screen lg:w-96">
          <div className="slide-in-from-right-4 animate-in space-y-6 duration-500">
            <div className="fade-in-50 animate-in delay-100 duration-700">
              {courseQuery.data.trailer && (
                <CourseInfo.Trailer
                  trailerUrl={courseQuery.data.trailer}
                  youtubeId={
                    extractYoutubeId(courseQuery.data.trailer) ?? 'Ke90Tje7VS0'
                  }
                />
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
