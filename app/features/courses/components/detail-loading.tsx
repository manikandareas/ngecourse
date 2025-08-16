import { Skeleton } from '~/components/ui/skeleton';

const chapterSkeletonKeys = ['ch1', 'ch2', 'ch3'] as const;
const itemSkeletonKeys = ['it1', 'it2', 'it3'] as const;

function DetailHeroSkeleton() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 text-center">
      {/* Difficulty badge */}
      <Skeleton className="h-7 w-20 rounded-full" />

      {/* Main title - single line, larger */}
      <Skeleton className="h-16 w-full max-w-4xl" />

      {/* Topic badges row */}
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* Description paragraph - 3 lines */}
      <div className="mt-4 flex flex-col items-center gap-3 px-4">
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-3/4 max-w-lg" />
      </div>

      {/* CTA button */}
      <Skeleton className="mt-6 h-12 w-52 rounded-lg" />

      {/* Video thumbnail with overlay elements */}
      <div className="relative mt-8 w-full max-w-4xl">
        <Skeleton className="aspect-video w-full rounded-xl" />
        {/* Play button overlay */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
        {/* Duration badge */}
        <div className="absolute right-4 bottom-4">
          <Skeleton className="h-6 w-16 rounded" />
        </div>
        {/* Views badge */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </section>
  );
}

function DetailContentsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {chapterSkeletonKeys.map((ch) => (
        <div className="rounded-lg border bg-white p-6 shadow-sm" key={ch}>
          {/* Chapter title */}
          <Skeleton className="h-6 w-48" />
          {/* Chapter items */}
          <div className="mt-6 space-y-4">
            {itemSkeletonKeys.map((it) => (
              <div className="flex items-center gap-4" key={`${ch}-${it}`}>
                <Skeleton className="h-5 w-5 flex-shrink-0 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
                <div className="ml-auto">
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailPromoSkeleton() {
  return (
    <div className="mx-auto max-w-4xl rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
      {/* Promo image/illustration */}
      <div className="mb-6 flex justify-center">
        <Skeleton className="h-32 w-48 rounded-lg" />
      </div>

      {/* Promo content */}
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-8 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="mx-auto h-4 w-3/4" />
          <Skeleton className="mx-auto h-4 w-1/2" />
        </div>
        <div className="pt-4">
          <Skeleton className="mx-auto h-12 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function DetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative mx-auto w-full max-w-7xl space-y-20 px-6 py-16 xl:px-8">
        <DetailHeroSkeleton />
        <DetailContentsSkeleton />
        <DetailPromoSkeleton />
      </div>
    </div>
  );
}

export default DetailLoading;
