import { ArrowRightIcon } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
  Topic,
} from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import { useContentProgression } from '~/features/courses/hooks/content-progression';
import DetailEnrollDialog from './detail-enroll-dialog';

type DetailCTAProps = {
  enrollment: EnrollmentQueryResult | null;
  course: NonNullable<CourseContentsQueryResult>;
  onEnroll: () => void;
  isPending: boolean;
  thumbnailUrl: string;
};

export const DetailCTA: React.FC<DetailCTAProps> = (props) => {
  const navigate = useNavigate();

  const { contentProgression } = useContentProgression(
    props.course,
    props.enrollment
  );

  const contentIndex = useMemo(() => {
    const courseSlug = props.course.slug?.current;
    if (!courseSlug) return null;

    const entries: [string, string][] = (props.course.chapters ?? []).flatMap(
      (chapter) => {
        const chapterSlug = chapter?.slug?.current;
        if (!chapterSlug) return [];
        const base = `/courses/${courseSlug}/${chapterSlug}`;
        return (chapter?.contents ?? [])
          .map((cnt) => {
            if (!cnt?._id) return null;
            const cid = cnt._id;
            const cslug = cnt?.slug?.current;
            if (!cslug) return null;
            const path =
              cnt._type === 'lesson'
                ? `${base}/lessons/${cslug}`
                : `${base}/quizzes/${cslug}`;
            return [cid, path] as [string, string];
          })
          .filter((v): v is [string, string] => v !== null);
      }
    );

    return new Map(entries);
  }, [props.course]);

  const currentPath = useMemo(() => {
    if (!contentIndex) return null;
    const current = contentProgression.find((c) => c.isCurrentContent);
    if (!current) return null;
    return contentIndex.get(current.id) ?? null;
  }, [contentIndex, contentProgression]);

  return (
    <div className="">
      {props.enrollment ? (
        <Button
          className="group"
          onClick={() => {
            if (currentPath) {
              navigate(currentPath);
            }
          }}
          type="button"
        >
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
