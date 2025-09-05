import type { CourseContentsQueryResult } from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import { urlFor } from '~/lib/sanity-client';
import { COURSE_DETAIL_COPY } from '../constants/course-detail-copy';

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
            {COURSE_DETAIL_COPY.promo.title}
          </h2>
          <p
            className="text-center text-sm leading-relaxed md:text-left md:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            {COURSE_DETAIL_COPY.promo.subtitle}
          </p>
          <Button
            aria-label="Daftar kursus gratis sekarang"
            className=" w-full focus-visible:ring-2 md:w-fit"
            type="button"
            variant={'ai'}
          >
            {COURSE_DETAIL_COPY.promo.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default DetailPromo;
