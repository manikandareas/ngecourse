import { ArrowRightIcon } from 'lucide-react';
import type React from 'react';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
  Topic,
} from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import DetailEnrollDialog from './detail-enroll-dialog';

type DetailCTAProps = {
  enrollment: EnrollmentQueryResult | null;
  course: NonNullable<CourseContentsQueryResult>;
  onEnroll: () => void;
  isPending: boolean;
  thumbnailUrl: string;
};
export const DetailCTA: React.FC<DetailCTAProps> = (props) => {
  return (
    <div className="">
      {props.enrollment ? (
        <Button className="group">
          Continue Learning
          <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      ) : (
        <DetailEnrollDialog
          description={props.course.description || 'Course Description'}
          difficulty={props.course.difficulty || 'beginner'}
          duration={'10 hours'}
          id={props.course._id || ''}
          image={props.thumbnailUrl || ''}
          isLoading={props.isPending}
          lessonsCount={props.course.chapters?.length || 15}
          onEnroll={props.onEnroll}
          slug={props.course.slug?.current || ''}
          title={props.course.title || 'Course Title'}
          topics={(props.course.topics as Topic[]) || []}
        >
          <Button className="group" size="lg" type="button">
            Start Learning Now
            <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </DetailEnrollDialog>
      )}
    </div>
  );
};
