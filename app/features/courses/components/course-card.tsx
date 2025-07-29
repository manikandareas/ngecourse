import { Link } from 'react-router';
import type { CoursesQueryResult } from 'sanity.types';
import { urlFor } from '~/lib/sanity-client';
import { CourseBadge } from './course-badge';

export const CourseCard = ({
  title,
  description,
  image,
  difficulty,
  slug,
}: {
  title: string;
  description: string;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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
        <CourseBadge difficulty={difficulty} />
      </div>
    </Link>
  );
};

export const toCourseCard = (course: CoursesQueryResult[number]) => {
  const imageUrl = course.thumbnail ? urlFor(course.thumbnail)?.url() : '';
  return {
    title: course.title || 'Course Title',
    description: course.description || 'Course Description',
    image: imageUrl ?? '',
    slug: course.slug || 'course-slug',
    difficulty: course.difficulty || 'beginner',
  };
};
