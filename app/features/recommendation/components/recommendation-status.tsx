import { AlertCircle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { RECOMMENDATION_COPY } from '~/features/recommendation/constants/copy';
import { cn } from '~/lib/utils';

type RecommendationStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface RecommendationStatusProps {
  status: RecommendationStatus;
  message: string;
  className?: string;
}

const statusConfig = {
  pending: {
    icon: Loader2,
    color: 'text-text-secondary',
    bgColor: 'bg-white/5',
    borderColor: 'border-hairline',
    title: RECOMMENDATION_COPY.loading.pending.title,
    subtitle: RECOMMENDATION_COPY.loading.pending.subtitle,
  },
  processing: {
    icon: Sparkles,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    title: RECOMMENDATION_COPY.loading.processing.title,
    subtitle: RECOMMENDATION_COPY.loading.processing.subtitle,
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    title: RECOMMENDATION_COPY.status.completed.title,
    subtitle: RECOMMENDATION_COPY.status.completed.subtitle,
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    title: RECOMMENDATION_COPY.status.failed.title,
    subtitle: RECOMMENDATION_COPY.status.failed.subtitle,
  },
};

export function RecommendationStatus({
  status,
  message,
  className,
}: RecommendationStatusProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;
  const isAnimating = status === 'pending' || status === 'processing';

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass-card text-center', className)}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="space-y-6">
        {/* Status Icon */}
        <motion.div
          animate={{ scale: 1 }}
          className={cn(
            'mx-auto flex size-16 items-center justify-center rounded-2xl border',
            config.bgColor,
            config.borderColor,
            'shadow-soft'
          )}
          initial={{ scale: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <IconComponent
            className={cn(
              'size-8',
              config.color,
              isAnimating && 'animate-spin'
            )}
          />
        </motion.div>

        {/* Title and Subtitle */}
        <div className="space-y-2">
          <motion.h2
            animate={{ opacity: 1 }}
            className="font-light text-2xl text-text-primary tracking-tight md:text-3xl"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
          >
            {config.title}
          </motion.h2>

          <motion.p
            animate={{ opacity: 1 }}
            className="text-base text-text-secondary"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            {config.subtitle}
          </motion.p>
        </div>

        {/* Dynamic Message */}
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[2rem] items-center justify-center"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 10 }}
            key={message}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-text-muted">{message}</p>
          </motion.div>
        </AnimatePresence>

        {/* Live Updates Indicator - Always show for real-time status */}
        {(status === 'pending' || status === 'processing') && (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-text-muted text-xs"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="size-2 animate-pulse rounded-full bg-accent" />
            <span>{RECOMMENDATION_COPY.loading.pending.liveIndicator}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface ProgressDotsProps {
  status: RecommendationStatus;
  className?: string;
}

export function ProgressDots({ status, className }: ProgressDotsProps) {
  const steps = ['pending', 'processing', 'completed'] as const;
  const currentStepIndex = steps.indexOf(
    status as 'pending' | 'processing' | 'completed'
  );

  if (status === 'failed') return null;

  return (
    <div
      className={cn('flex items-center justify-center space-x-3', className)}
    >
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <motion.div
            animate={{ scale: 1 }}
            className={cn(
              'size-2.5 rounded-full transition-colors duration-300',
              isActive ? 'bg-accent' : 'bg-white/20',
              isCurrent && status !== 'completed' && 'animate-pulse'
            )}
            initial={{ scale: 0 }}
            key={step}
            transition={{ delay: index * 0.1 }}
          />
        );
      })}
    </div>
  );
}
