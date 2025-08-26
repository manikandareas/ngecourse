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
    <section className="glass-card">
      <div className="space-y-6 text-center">
        <div className="group mx-auto w-fit rounded-full border border-accent/30 bg-accent/5 px-4 py-2 backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/10">
          <AnimatedShinyText className="inline-flex items-center justify-center text-accent transition ease-out hover:text-accent/90">
            <span>✨ Curated For You</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
        <h2 className="font-light text-3xl text-text-primary leading-[1.1] tracking-tight sm:text-4xl">
          Personalized Learning Path
        </h2>
        <p className="mx-auto max-w-4xl text-base/7 text-text-secondary">
          {recommendation?.reason}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
