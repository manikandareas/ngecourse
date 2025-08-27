import { Skeleton } from '~/components/ui/skeleton';
import { PageBackground } from '~/components/ui/page-background';

const chapterSkeletonKeys = ['ch1', 'ch2', 'ch3'] as const;
const itemSkeletonKeys = ['it1', 'it2', 'it3'] as const;

function DetailHeroSkeleton() {
  return (
    <section className="flex flex-col items-center justify-center gap-8">
      {/* Difficulty badge */}
      <Skeleton className="h-7 w-20 rounded-full" />

      {/* Main title - matching actual h1 structure */}
      <Skeleton className="h-16 w-full max-w-lg xl:max-w-2xl" />

      {/* Topic badges row */}
      <div className="flex flex-wrap justify-center gap-3">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      {/* Description paragraph - matching actual structure */}
      <div className="flex flex-col items-center gap-3 max-w-2xl">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* CTA button */}
      <Skeleton className="h-12 w-52 rounded-full" />

      {/* Video thumbnail - matching HeroVideoDialog structure */}
      <div className="relative mt-8 w-full max-w-4xl">
        <Skeleton className="aspect-video w-full rounded-xl border border-hairline" />
        {/* Play button overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function DetailContentsSkeleton() {
  return (
    <section className="flex flex-col items-center gap-12">
      {/* Header section */}
      <div className="flex flex-col items-center gap-6">
        {/* Contents badge */}
        <Skeleton className="h-8 w-24 rounded-full" />
        {/* Section title */}
        <Skeleton className="h-12 w-full max-w-lg xl:max-w-2xl" />
        {/* Description */}
        <div className="flex flex-col items-center gap-3 max-w-2xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      {/* Content structure - two columns */}
      <div className="flex w-full flex-col-reverse items-start gap-8 lg:flex-row">
        {/* Course structure side */}
        <div className="flex-1 space-y-6">
          {/* Course Structure title */}
          <Skeleton className="h-6 w-40" />
          {/* Course file tree container */}
          <div className="glass-card">
            <div className="space-y-4">
              {chapterSkeletonKeys.map((ch) => (
                <div key={ch}>
                  {/* Chapter title */}
                  <Skeleton className="h-5 w-48 mb-3" />
                  {/* Chapter items */}
                  <div className="ml-4 space-y-2">
                    {itemSkeletonKeys.map((it) => (
                      <div className="flex items-center gap-3" key={`${ch}-${it}`}>
                        <Skeleton className="h-4 w-4 flex-shrink-0 rounded" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-10 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-px mx-6 hidden lg:block bg-white/8 h-96"></div>
        
        {/* Learning outcomes side */}
        <div className="flex-1 space-y-6">
          {/* Learning outcomes title */}
          <Skeleton className="h-6 w-48" />
          {/* Learning outcomes list */}
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="flex items-start gap-3" key={index}>
                <Skeleton className="h-4 w-4 flex-shrink-0 rounded mt-0.5" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailPromoSkeleton() {
  return (
    <section className="relative mx-auto h-96 w-full rounded-xl overflow-hidden border border-hairline">
      {/* Background image skeleton */}
      <Skeleton className="h-full w-full" />
      
      {/* Overlay gradient simulation */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 md:items-start md:justify-center">
        <div className="glass-card max-w-md space-y-4">
          {/* Title skeleton */}
          <Skeleton className="h-8 w-full max-w-xs" />
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-12 w-full md:w-40 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function DetailLoading() {
  return (
    <PageBackground>
      <div className="glass-card relative mx-auto w-full max-w-6xl space-y-24 px-6 py-16 xl:px-0">
        <DetailHeroSkeleton />
        <DetailContentsSkeleton />
        <DetailPromoSkeleton />
      </div>
    </PageBackground>
  );
}

export default DetailLoading;
