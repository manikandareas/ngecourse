import { ArrowRightIcon, Share2Icon } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { toFileUrl } from '~/data/utils';
import { cn } from '~/lib/utils';
import type {
  LmsCourses,
  LmsCoursesLmsTopics,
  LmsEnrollments,
  LmsTopics,
} from '~/types/directus';
import EnrollDialog from './enroll-dialog';

interface IHeroSection {
  difficulty: string;
  title: string;
  description: string;
  topics: LmsTopics[];
  image: string;
  id: string;
  slug: string;

  enrollment: LmsEnrollments | null;
}

export function HeroSection(props: IHeroSection) {
  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:gap-0">
        <div className="space-y-2">
          <CourseBadge difficulty={props.difficulty} />
          <h1 className="font-bold text-4xl">{props.title}</h1>
          <p className="max-w-2xl text-pretty text-muted-foreground text-sm">
            {props.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {props.topics.map((topic) => (
              <Badge
                className="capitalize"
                key={topic.id}
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
            <Button className="group" size="lg">
              Continue Learning
              <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <EnrollDialog {...props} />
          )}
        </div>
      </div>
      <img
        alt={props.title}
        className="mx-auto mb-8 h-[22rem] w-full rounded-md object-cover"
        src={props.image}
      />
    </div>
  );
}

export function CourseBadge(props: { difficulty: string }) {
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
  course: LmsCourses,
  enrollment: LmsEnrollments | null
) => {
  const imageUrl = toFileUrl((course.thumbnail as string) || '');
  return {
    topics: course.topics.map(
      (topic: LmsCoursesLmsTopics) => topic.lms_topics_id as LmsTopics
    ),
    difficulty: course.difficulty || 'beginner',
    title: course.title || 'Course Title',
    description: course.description || 'Course Description',
    image: imageUrl,
    id: course.id,
    slug: course.slug as string,
    enrollment,
  };
};
