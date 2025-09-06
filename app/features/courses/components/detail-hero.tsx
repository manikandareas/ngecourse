import { SignInButton } from '@clerk/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { toast } from 'sonner';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { HeroVideoDialog } from '~/components/ui/hero-video-dialog';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import { urlFor } from '~/lib/sanity-client';
import { extractYoutubeId } from '~/lib/utils';
import { COURSE_DETAIL_COPY } from '../constants/course-detail-copy';
import { CourseBadge } from './course-badge';
import { DetailCTA } from './detail-cta';

type IDetailHero = {
  userId?: string;
  course: CourseContentsQueryResult;
  enrollment: EnrollmentQueryResult | null;
};

export function DetailHero(props: IDetailHero) {
  const location = useLocation();
  console.log(location);
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
    onError: () => {
      toast.error(COURSE_DETAIL_COPY.error.enrollmentFailed, {
        description: COURSE_DETAIL_COPY.error.enrollmentFailedDesc,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        document.getElementById('dialog-close')?.click();
        toast.success(COURSE_DETAIL_COPY.success.enrolled, {
          description: COURSE_DETAIL_COPY.success.enrolledDesc,
        });
        return;
      }

      toast.error(
        `${COURSE_DETAIL_COPY.error.enrollmentFailed}: ${data.error?.message}`
      );
    },
  });

  const handleEnroll = () => {
    if (!(props.course?.slug?.current && props.userId)) {
      toast.error(COURSE_DETAIL_COPY.error.missingData, {
        description: COURSE_DETAIL_COPY.error.missingDataDesc,
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
    <section className="flex flex-col items-center justify-center gap-8">
      <CourseBadge difficulty={props.course.difficulty} />
      <h1
        className="max-w-lg text-center font-light text-5xl leading-[1.1] tracking-tight md:text-6xl xl:max-w-2xl"
        style={{ color: 'var(--text-primary)' }}
      >
        {props.course.title}
      </h1>
      <div className="flex flex-wrap justify-center gap-3">
        {props.course.topics?.map((topic) => (
          <Badge
            className="bg-white/5 capitalize transition-colors"
            key={topic._id}
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border)',
            }}
            variant={'secondary'}
          >
            {topic.title}
          </Badge>
        ))}
      </div>

      <p
        className="max-w-2xl text-pretty text-center text-base/7 leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {props.course.description}
      </p>
      {props.userId ? (
        <DetailCTA
          course={props.course}
          enrollment={props.enrollment}
          isPending={isPending}
          onEnroll={handleEnroll}
          thumbnailUrl={thumbnailUrl || ''}
        />
      ) : (
        <SignInButton fallbackRedirectUrl={location.pathname} mode="modal">
          <Button>Sign In Untuk Belajar</Button>
        </SignInButton>
      )}
      <HeroVideoDialog
        className="mt-8 overflow-hidden rounded-xl border border-hairline"
        videoUrl={props.course.trailer as string}
        youtubeId={
          extractYoutubeId(props.course.trailer as string) ?? 'Ke90Tje7VS0'
        }
      />
    </section>
  );
}
