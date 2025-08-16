import { useQueries } from '@tanstack/react-query';
import type { EnrollmentQueryResult } from 'sanity.types';
import DetailContents from '~/features/courses/components/detail-contents';
import { DetailHero } from '~/features/courses/components/detail-hero';
import DetailLoading from '~/features/courses/components/detail-loading';
import DetailPromo from '~/features/courses/components/detail-promo';
import { dataCourses } from '~/features/courses/data';
import { courseQueryOption } from '~/features/courses/hooks/get-course';
import { dataEnrollment } from '~/features/enrollments/data';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/course';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.course?.title} | Genii` },
    {
      name: 'description',
      content: data?.course?.description || 'Course detail page of Genii!',
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
    courseWithContents.slug?.current || ''
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
        props.params.slug
      ),
    ],
  });

  const isLoading =
    courseQuery.isLoading || enrollmentQuery.isLoading || !courseQuery.data;

  if (isLoading) {
    return <DetailLoading />;
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-28 px-6 py-20 xl:px-0">
      <DetailHero
        course={courseQuery.data}
        enrollment={enrollmentQuery.data as EnrollmentQueryResult}
      />

      <DetailContents
        course={courseQuery.data}
        enrollment={enrollmentQuery.data ?? null}
      />

      <DetailPromo course={courseQuery.data} />
    </div>
  );
}
