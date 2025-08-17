import { Sparkles } from 'lucide-react';
import type {
  CoursesQueryResult,
  RecommendationQueryResult,
} from 'sanity.types';
import { Badge } from '~/components/ui/badge';
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
        <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
          <Sparkles className="mr-1 h-3 w-3" />
          Curated For You
        </Badge>
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
