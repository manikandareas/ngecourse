import { useState } from 'react';
import { CourseListSection } from '~/features/courses/components/course-list-section';
import CourseLoading from '~/features/courses/components/course-loading';
import { RecommendationSection } from '~/features/courses/components/recommendation-section';
import { COURSES_COPY } from '~/features/courses/constants/copy';
import { useCourses } from '~/features/courses/hooks/get-courses';
import { useRecommendation } from '~/features/recommendation/hooks/get-recommendation';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/courses';

export function meta() {
  return [
    { title: COURSES_COPY.meta.title },
    { name: 'description', content: COURSES_COPY.meta.description },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);

  if (!currentSession) {
    return { userId: '' };
  }

  return {
    userId: currentSession._id,
  };
}

export default function CoursesPage(props: Route.ComponentProps) {
  const { data: courses, isPending, isError } = useCourses();
  const { data: recommendation } = useRecommendation(props.loaderData.userId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses =
    courses?.filter(
      (course) =>
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (isPending) {
    return <CourseLoading />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="glass-card space-y-6 text-center">
          <div className="text-6xl">😬</div>
          <h2 className="font-light text-2xl text-text-primary tracking-tight md:text-3xl">
            {COURSES_COPY.error.title}
          </h2>
          <p className="max-w-md text-base/7 text-text-secondary">
            {COURSES_COPY.error.description}
          </p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
            type="button"
          >
            {COURSES_COPY.error.retryButton}
          </button>
        </div>
      </div>
    );
  }

  const handleClearSearch = () => setSearchQuery('');

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="space-y-20">
        <RecommendationSection recommendation={recommendation} />
        <CourseListSection
          filteredCourses={filteredCourses}
          onClearSearch={handleClearSearch}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
