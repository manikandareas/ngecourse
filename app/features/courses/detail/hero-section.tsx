import { ArrowRightIcon, Share2Icon } from 'lucide-react';
import type {
  Course,
  Enrollment,
  GetCourseContentsQueryResult,
  Topic,
} from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import { Badge } from '~/components/ui/badge';
import { urlFor } from '~/lib/sanity-client';
import { cn } from '~/lib/utils';
import EnrollDialog from './enroll-dialog';

type IHeroSection = {
  course: GetCourseContentsQueryResult;
  enrollment: Enrollment | null;
};

export function HeroSection(props: IHeroSection) {
  const thumbnailUrl = props.course?.thumbnail
    ? urlFor(props.course?.thumbnail)?.url()
    : '';
  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:gap-0">
        <div className="space-y-2">
          <CourseBadge difficulty={props.course?.difficulty || 'beginner'} />
          <h1 className="font-bold text-4xl">{props.course?.title}</h1>
          <p className="max-w-2xl text-pretty text-muted-foreground text-sm">
            {props.course?.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {props.course?.topics?.map((topic) => (
              <Badge
                className="capitalize"
                key={topic._id}
                variant={'secondary'}
              >
                {topic.title}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button size={'icon'} variant={'outline'}>
            <Share2Icon />
          </Button>
          {props.enrollment ? (
            <Button className="group">
              Continue Learning
              <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <EnrollDialog
              description={props.course?.description || 'Course Description'}
              difficulty={props.course?.difficulty || 'beginner'}
              duration={'10 hours'}
              id={props.course?._id || ''}
              image={thumbnailUrl || ''}
              lessonsCount={props.course?.chapters?.length || 15}
              slug={props.course?.slug?.current || ''}
              title={props.course?.title || 'Course Title'}
              topics={(props.course?.topics as Topic[]) || []}
            />
          )}
        </div>
      </div>
      <img
        alt={props.course?.title || 'Thumbnail'}
        className="mx-auto mb-8 h-[22rem] w-full rounded-md object-cover"
        src={thumbnailUrl}
      />
    </div>
  );
}

export function CourseBadge(props: {
  difficulty: 'advanced' | 'beginner' | 'intermediate' | null;
}) {
  if (!props.difficulty) {
    return null;
  }
  return (
    <Badge
      className={cn('capitalize', {
        'bg-green-500 text-white': props.difficulty === 'beginner',
        'bg-yellow-500 text-white': props.difficulty === 'intermediate',
        'bg-red-500 text-white': props.difficulty === 'advanced',
      })}
    >
      {props.difficulty.toLowerCase()}
    </Badge>
  );
}

export const toHeroSection = (
  course: Course,
  enrollment: Enrollment | null
) => {
  const imageUrl = course.thumbnail ? urlFor(course.thumbnail)?.url() : '';
  return {
    topics: course.topics,
    difficulty: course.difficulty || 'beginner',
    title: course.title || 'Course Title',
    description: course.description || 'Course Description',
    image: imageUrl,
    id: course._id,
    slug: course.slug?.current,
    enrollment,
  };
};
