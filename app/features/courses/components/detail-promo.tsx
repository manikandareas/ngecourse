import type { CourseContentsQueryResult } from 'sanity.types';
import { urlFor } from '~/lib/sanity-client';

interface DetailPromoProps {
  course: CourseContentsQueryResult;
}

export function DetailPromo({ course }: DetailPromoProps) {
  const thumbnailUrl = course?.thumbnail ? urlFor(course.thumbnail)?.url() : '';

  return (
    <section className="relative mx-auto h-[24rem] w-full rounded-xl overflow-hidden border" style={{borderColor: 'var(--border)'}}>
      <img
        alt={course?.title || 'Thumbnail'}
        className="h-full w-full object-cover"
        src={thumbnailUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 md:items-start md:justify-center">
        <div className="glass-card max-w-md space-y-4">
          <h2 className="text-center font-light text-2xl md:text-3xl tracking-tight leading-tight md:text-left" style={{color: 'var(--text-primary)'}}>
            Build your portfolio with this course
          </h2>
          <p className="text-center text-sm md:text-base leading-relaxed md:text-left" style={{color: 'var(--text-secondary)'}}>
            Build 16 web development projects for your portfolio, ready to apply for junior developer jobs.
          </p>
          <button 
            className="btn-primary w-full md:w-fit focus-visible:ring-2"
            aria-label="Enroll in this course for free"
            style={{
              '--tw-ring-color': 'rgb(62 91 255 / 0.6)'
            } as React.CSSProperties}
          >
            Enroll Now for{' '}
            <span className="font-semibold text-amber-200">Free</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default DetailPromo;
