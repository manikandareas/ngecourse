import { useQueries } from '@tanstack/react-query';
import type { EnrollmentQueryResult } from 'sanity.types';
import { DetailContentList } from '~/features/courses/components/detail-content-list/index';
import { DetailHero } from '~/features/courses/components/detail-hero';
import { DetailInformation } from '~/features/courses/components/detail-information';
import { dataCourses } from '~/features/courses/data';
import { courseQueryOption } from '~/features/courses/hooks/get-course';
import { dataEnrollment } from '~/features/enrollments/data';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { extractYoutubeId } from '~/lib/utils';
import { getCurrentSession } from '~/root';
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

export default function CourseDetailPage(props: Route.ComponentProps) {
  const [courseQuery, enrollmentQuery] = useQueries({
    queries: [
      courseQueryOption(props.params.slug),
      enrollmentQueryOption(
        props.loaderData.currentSession?._id || '',
        props.loaderData.course._id
      ),
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
      <DetailHero
        course={courseQuery.data}
        enrollment={enrollmentQuery.data as EnrollmentQueryResult}
        userId={props.loaderData.currentSession?._id}
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 py-8 md:flex-row">
        <DetailContentList
          course={courseQuery.data}
          enrollment={enrollmentQuery.data as EnrollmentQueryResult}
        />

        <aside className="w-full flex-shrink-0 md:w-80 lg:sticky lg:top-28 lg:h-screen lg:w-96">
          <div className="slide-in-from-right-4 animate-in space-y-6 duration-500">
            <div className="fade-in-50 animate-in delay-100 duration-700">
              {courseQuery.data.trailer && (
                <DetailInformation.Trailer
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
