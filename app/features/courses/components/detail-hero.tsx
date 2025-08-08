import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { toast } from 'sonner';
import { Badge } from '~/components/ui/badge';
import { HeroVideoDialog } from '~/components/ui/hero-video-dialog';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import { urlFor } from '~/lib/sanity-client';
import { extractYoutubeId } from '~/lib/utils';
import { CourseBadge } from './course-badge';
import { DetailCTA } from './detail-cta';

type IDetailHero = {
  userId?: string;
  course: CourseContentsQueryResult;
  enrollment: EnrollmentQueryResult | null;
};

export function DetailHero(props: IDetailHero) {
  const queryClient = useQueryClient();
  const thumbnailUrl = props.course?.thumbnail
    ? urlFor(props.course?.thumbnail)?.url()
    : '';

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      courseSlug,
      userId,
    }: {
      courseSlug: string;
      userId: string;
    }) => usecaseEnrollments.enroll(courseSlug, userId),
    onSettled: () => {
      queryClient.invalidateQueries(
        enrollmentQueryOption(
          props.userId as string,
          props.course?.slug?.current as string
        )
      );
    },
    onError: (error) => {
      toast.error(
        `Enrollment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    },
    onSuccess: (data) => {
      if (data.success) {
        document.getElementById('dialog-close')?.click();
        toast.success('Successfully enrolled in the course!');
        return;
      }

      toast.error(`Enrollment failed: ${data.error?.message}`);
    },
  });

  const handleEnroll = () => {
    if (!(props.course?.slug?.current && props.userId)) {
      toast.error('Course slug or user ID is missing.', {
        description: 'You need to log in to enroll in a course.',
      });
      return;
    }
    mutate({
      courseSlug: props.course.slug.current,
      userId: props.userId,
    });
  };

  if (!props.course) {
    return null;
  }

  return (
    <section className="flex flex-col items-center justify-center gap-6">
      <CourseBadge difficulty={props.course.difficulty} />
      <h1 className="max-w-lg text-center font-semibold text-4xl xl:max-w-2xl xl:text-5xl">
        {props.course.title}
      </h1>
      <div className="mt-2 flex flex-wrap gap-2">
        {props.course.topics?.map((topic) => (
          <Badge className="capitalize" key={topic._id} variant={'secondary'}>
            {topic.title}
          </Badge>
        ))}
      </div>

      <p className=" max-w-2xl text-pretty text-center text-base text-muted-foreground leading-relaxed">
        {props.course.description}
      </p>
      <DetailCTA
        course={props.course}
        enrollment={props.enrollment}
        isPending={isPending}
        onEnroll={handleEnroll}
        thumbnailUrl={thumbnailUrl || ''}
      />
      <HeroVideoDialog
        className="mt-12 rounded-md"
        videoUrl={props.course.trailer as string}
        youtubeId={
          extractYoutubeId(props.course.trailer as string) ?? 'Ke90Tje7VS0'
        }
      />
    </section>
  );
}
