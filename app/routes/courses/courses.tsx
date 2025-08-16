import { useAtom } from 'jotai';
import { Badge } from '~/components/ui/badge';
import {
  CourseCard,
  toCourseCard,
} from '~/features/courses/components/course-card';
import CourseLoading from '~/features/courses/components/course-loading';
import {
  coursesAtom,
  coursesQueryOption,
} from '~/features/courses/hooks/get-courses';
import { makeQueryClient } from '~/lib/react-query';

export function meta() {
  return [
    { title: 'Courses | Genii' },
    { name: 'description', content: 'Courses page of Genii!' },
  ];
}

export async function clientLoader() {
  const queryClient = makeQueryClient();
  return (
    queryClient.getQueryData(coursesQueryOption.queryKey) ??
    (await queryClient.fetchQuery(coursesQueryOption))
  );
}

export default function CoursesPage() {
  const [{ data: courses, isPending, isError, error }] = useAtom(coursesAtom);

  if (isPending) {
    return <CourseLoading />;
  }

  if (isError) {
    return <div>Could not load courses 😬: {error.message}</div>;
  }

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
          {courses.map((course) => (
            <CourseCard key={course._id} {...toCourseCard(course)} />
          ))}
        </div>
      </div>
    </div>
  );
}
