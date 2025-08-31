import type { CourseContentsQueryResult } from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import { urlFor } from '~/lib/sanity-client';

interface DetailPromoProps {
  course: CourseContentsQueryResult;
}

export function DetailPromo({ course }: DetailPromoProps) {
  const thumbnailUrl = course?.thumbnail ? urlFor(course.thumbnail)?.url() : '';

  return (
    <section
      className="relative mx-auto h-[24rem] w-full overflow-hidden rounded-xl border"
      style={{ borderColor: 'var(--border)' }}
    >
      <img
        alt={course?.title || 'Thumbnail'}
        className="h-full w-full object-cover"
        src={thumbnailUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 md:items-start md:justify-center">
        <div className="glass-card max-w-md space-y-4">
          <h2
            className="text-center font-light text-2xl leading-tight tracking-tight md:text-left md:text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Build your portfolio with this course
          </h2>
          <p
            className="text-center text-sm leading-relaxed md:text-left md:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Build 16 web development projects for your portfolio, ready to apply
            for junior developer jobs.
          </p>
          <Button
            aria-label="Enroll in this course for free"
            className=" w-full focus-visible:ring-2 md:w-fit"
            type="button"
            variant={'ai'}
          >
            Enroll Now for{' '}
            <span className="font-semibold text-amber-200">Free</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default DetailPromo;
