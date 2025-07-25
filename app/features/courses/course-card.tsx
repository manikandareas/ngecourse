import { Link } from 'react-router';
import type { GetCoursesQueryResult } from 'sanity.types';
import { urlFor } from '~/lib/sanity-client';

export const CourseCard = ({
  title,
  description,
  image,
  slug,
}: {
  title: string;
  description: string;
  image: string;
  slug: string;
}) => {
  return (
    <Link to={`/courses/${slug}`}>
      <div className="flex flex-col gap-2">
        <img
          alt={title}
          className="mb-2 aspect-video rounded-md object-cover"
          src={image}
        />
        <h3 className="text-xl tracking-tight">{title}</h3>
        <p className="line-clamp-2 text-pretty text-base text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const toCourseCard = (course: GetCoursesQueryResult[number]) => {
  const imageUrl = course.thumbnail ? urlFor(course.thumbnail)?.url() : '';
  return {
    title: course.title || 'Course Title',
    description: course.description || 'Course Description',
    image: imageUrl ?? '',
    slug: course.slug || 'course-slug',
  };
};
