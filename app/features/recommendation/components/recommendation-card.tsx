import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/3d-button';
import { CourseBadge } from '~/features/courses/components/course-badge';
import DetailEnrollDialog from '~/features/courses/components/detail-enroll-dialog';

export const RecommendationCard = ({
  title,
  description,
  image,
  difficulty,
  slug,
  onEnroll,
  isLoading,
}: {
  title: string;
  description: string;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  slug: string;
  onEnroll: () => void;
  isLoading: boolean;
}) => {
  return (
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
      <div className="flex items-center justify-between">
        <CourseBadge difficulty={difficulty} />
        <DetailEnrollDialog
          description={description}
          difficulty={difficulty}
          duration={'10 hours'}
          id={slug}
          image={image}
          isLoading={isLoading}
          lessonsCount={15}
          onEnroll={onEnroll}
          slug={slug}
          title={title}
          topics={[]}
        >
          <Button className="" type="button">
            Enroll <ArrowRight />
          </Button>
        </DetailEnrollDialog>
      </div>
    </div>
  );
};
