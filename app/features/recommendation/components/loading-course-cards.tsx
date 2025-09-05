import { motion } from 'motion/react';
import { RECOMMENDATION_COPY } from '~/features/recommendation/constants/copy';
import { cn } from '~/lib/utils';

interface LoadingCourseCardsProps {
  count?: number;
  className?: string;
}

export function LoadingCourseCards({
  count = 2,
  className,
}: LoadingCourseCardsProps) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCourseCard delay={index * 0.1} key={index.toString()} />
      ))}
    </div>
  );
}

interface LoadingCourseCardProps {
  delay?: number;
}

function LoadingCourseCard({ delay = 0 }: LoadingCourseCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="max-h-[20rem] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Thumbnail Skeleton */}
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-white/5">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            className="h-full w-full bg-gradient-to-r from-white/5 via-white/10 to-white/5"
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        </div>

        {/* Content Skeletons */}
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded-md bg-white/5" />
            <div className="h-6 w-1/2 rounded-md bg-white/5" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-white/5" />
            <div className="h-4 w-5/6 rounded-md bg-white/5" />
            <div className="h-4 w-2/3 rounded-md bg-white/5" />
          </div>

          {/* Difficulty Badge */}
          <div className="flex items-center space-x-3">
            <div className="h-6 w-20 rounded-full bg-white/5" />
            <div className="h-4 w-16 rounded-md bg-white/5" />
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                className="h-6 rounded-md bg-white/5"
                key={i.toString()}
                style={{ width: `${Math.random() * 40 + 60}px` }}
              />
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <div className="h-10 w-full rounded-full bg-white/5" />
          </div>
        </div>
      </div>

      {/* Shimmer Overlay */}
      <motion.div
        animate={{ x: '100%' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: '-100%' }}
        style={{ pointerEvents: 'none' }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
          delay,
        }}
      />
    </motion.div>
  );
}

export function LoadingProgressIndicator() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="mx-auto flex items-center justify-center space-x-2"
      initial={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            className="size-2 rounded-full bg-accent"
            key={i.toString()}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <span className="field-help ml-3">{RECOMMENDATION_COPY.loading.pending.message}</span>
    </motion.div>
  );
}
