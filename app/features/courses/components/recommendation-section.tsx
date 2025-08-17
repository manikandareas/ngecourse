import { ArrowRightIcon } from 'lucide-react';
import type {
  CoursesQueryResult,
  RecommendationQueryResult,
} from 'sanity.types';
import { AnimatedShinyText } from '~/components/ui/animated-shiny-text';
import { CourseCard } from './course-card';

interface RecommendationSectionProps {
  recommendation: RecommendationQueryResult | undefined;
}

export function RecommendationSection({
  recommendation,
}: RecommendationSectionProps) {
  if (!recommendation) {
    return null;
  }

  return (
    <section className="space-y-12">
      <div className="space-y-4 text-center">
        <div className="group mx-auto w-fit rounded-full border border-yellow-500 text-base text-yellow-500 transition-all ease-in hover:cursor-pointer hover:bg-yellow-500/10 dark:border-white/5 ">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 text-yellow-500 transition ease-out hover:text-yellow-500/90 hover:duration-300 hover:dark:text-yellow-500">
            <span>✨ Curated For You</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
        <h2 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
          Personalized Learning Path
        </h2>
        <p className="mx-auto max-w-4xl text-lg text-muted-foreground">
          {recommendation?.reason}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {recommendation?.courses?.map((course) => (
          <CourseCard
            key={course._id}
            {...(course as CoursesQueryResult[number])}
          />
        ))}
      </div>
    </section>
  );
}
