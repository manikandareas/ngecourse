import { ArrowLeft, ArrowRight, Maximize, Moon, Settings } from 'lucide-react';
import { Outlet } from 'react-router';
import { ExpandableTabs } from '~/components/ui/expandable-tabs';
import { dataCourses } from '~/data/courses';
import { dataEnrollment } from '~/data/enrollments';
import { LearningLayout } from '~/features/courses/detail/chapters/learning-layout';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/layout';

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);

  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const courseWithContents = await dataCourses.withContents(args.params.slug);

  if (!courseWithContents) {
    throw new Response('Course Not Found', { status: 404 });
  }
  const enrollment = await dataEnrollment.oneByUserId(
    currentSession?.id || '',
    courseWithContents.id
  );

  return {
    course: courseWithContents,
    enrollment,
  };
}

export default function CoursesLayout(args: Route.ComponentProps) {
  const tabs = [
    { title: 'Previous', icon: ArrowLeft },
    { type: 'separator' as const },
    { title: 'Maximize', icon: Maximize },
    { title: 'Appearance', icon: Settings },
    { title: 'Theme', icon: Moon },
    { type: 'separator' as const },
    { title: 'Complete', icon: ArrowRight },
  ];

  const { course, enrollment } = args.loaderData;

  return (
    <div className="relative min-h-screen">
      <LearningLayout course={course} enrollment={enrollment}>
        <Outlet />
      </LearningLayout>
      <div className="-translate-x-1/2 -translate-y-1/2 fixed right-1/2 bottom-4 left-1/2 z-50 flex w-max gap-4">
        <ExpandableTabs
          activeColor="text-primary"
          className="flex flex-row border-border"
          tabs={tabs}
        />
      </div>
    </div>
  );
}
