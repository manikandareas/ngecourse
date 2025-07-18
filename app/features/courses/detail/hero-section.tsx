import { ArrowRightIcon, Share2Icon } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { toFileUrl } from '~/data/utils';
import { cn } from '~/lib/utils';
import type { LmsCourses } from '~/types/directus';

interface IHeroSection {
  difficulty: string;
  title: string;
  description: string;
  image: string;
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
        </div>
        <div className="flex items-center gap-2.5">
          <Button size={'icon'} variant={'outline'}>
            <Share2Icon />
          </Button>
          <Button size={'lg'}>
            Start Learning Now <ArrowRightIcon />
          </Button>
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

function CourseBadge(props: { difficulty: string }) {
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

export const toHeroSection = (course: LmsCourses) => {
  const imageUrl = toFileUrl((course.thumbnail as string) || '');
  return {
    difficulty: course.difficulty || 'beginner',
    title: course.title || 'Course Title',
    description: course.description || 'Course Description',
    image: imageUrl,
  };
};
