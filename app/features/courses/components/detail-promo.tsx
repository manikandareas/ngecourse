import type { CourseContentsQueryResult } from 'sanity.types';
import { Button } from '~/components/ui/3d-button';
import { urlFor } from '~/lib/sanity-client';

interface DetailPromoProps {
  course: CourseContentsQueryResult;
}

export function DetailPromo({ course }: DetailPromoProps) {
  const thumbnailUrl = course?.thumbnail ? urlFor(course.thumbnail)?.url() : '';

  return (
    <section className="relative mx-auto h-[22rem] w-full rounded-md">
      <img
        alt={course?.title || 'Thumbnail'}
        className="h-full w-full rounded-md object-cover"
        src={thumbnailUrl}
      />
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-white via-white/90 to-white md:to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center gap-2.5 p-4 md:items-start">
        <h2 className="max-w-sm text-center font-bold text-2xl text-primary md:text-left">
          Build your portfolio with this course
        </h2>
        <p className="max-w-sm text-center text-muted-foreground text-sm md:text-left">
          Build 16 web development projects for your portfolio, ready to apply for junior developer jobs.
        </p>
        <Button className="mt-4 w-fit">
          Enroll Now for{' '}
          <span className="font-semibold text-yellow-200">$Free</span>
        </Button>
      </div>
    </section>
  );
}

export default DetailPromo;
