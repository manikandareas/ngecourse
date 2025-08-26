import { useState } from 'react';
import { PageBackground } from '~/components/ui/page-background';
import { CourseListSection } from '~/features/courses/components/course-list-section';
import CourseLoading from '~/features/courses/components/course-loading';
import { RecommendationSection } from '~/features/courses/components/recommendation-section';
import { useCourses } from '~/features/courses/hooks/get-courses';
import { useRecommendation } from '~/features/recommendation/hooks/get-recommendation';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/courses';

export function meta() {
  return [
    { title: 'Courses | Genii' },
    { name: 'description', content: 'Courses page of Genii!' },
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
  const { data: courses, isPending, isError, error } = useCourses();
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
      <PageBackground>
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <div className="glass-card space-y-6 text-center">
            <div className="text-6xl">😬</div>
            <h2 className="font-light text-2xl text-text-primary tracking-tight md:text-3xl">
              Oops! Something went wrong
            </h2>
            <p className="max-w-md text-base/7 text-text-secondary">
              {error.message}
            </p>
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
              type="button"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageBackground>
    );
  }

  const handleClearSearch = () => setSearchQuery('');

  return (
    <PageBackground>
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="space-y-20">
          <RecommendationSection recommendation={recommendation} />
          <CourseListSection
            courses={courses}
            filteredCourses={filteredCourses}
            onClearSearch={handleClearSearch}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </PageBackground>
  );
}
