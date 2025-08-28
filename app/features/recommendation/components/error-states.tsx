import { AlertCircle, ChevronRight, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/3d-button';
import { cn } from '~/lib/utils';

interface RecommendationErrorProps {
  type: 'failed' | 'timeout' | 'empty' | 'network';
  onRetry?: () => void;
  onSkip?: () => void;
  onBrowseCourses?: () => void;
  isRetrying?: boolean;
  className?: string;
}

const errorConfig = {
  failed: {
    icon: AlertCircle,
    title: 'Generation Failed',
    subtitle: 'We encountered an issue creating your recommendations',
    description:
      'Our AI had trouble analyzing your preferences. This might be temporary.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  timeout: {
    icon: Clock,
    title: 'Taking Longer Than Expected',
    subtitle: 'Your recommendations are still being crafted',
    description:
      'Our AI is working hard to find the perfect courses for you. You can wait a bit more or explore courses manually.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  empty: {
    icon: AlertCircle,
    title: 'No Matches Found',
    subtitle: "We couldn't find courses matching your specific criteria",
    description:
      "Don't worry! This just means we need to expand our search. Let's explore all available courses.",
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  network: {
    icon: RefreshCw,
    title: 'Connection Issue',
    subtitle: 'Unable to reach our recommendation service',
    description: 'Please check your internet connection and try again.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
};

export function RecommendationError({
  type,
  onRetry,
  onSkip,
  onBrowseCourses,
  isRetrying = false,
  className,
}: RecommendationErrorProps) {
  const config = errorConfig[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass-card text-center', className)}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="space-y-6">
        {/* Error Icon */}
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
          <IconComponent className={cn('size-8', config.color)} />
        </motion.div>

        {/* Error Content */}
        <div className="space-y-3">
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

          <motion.p
            animate={{ opacity: 1 }}
            className="mx-auto max-w-md text-sm text-text-muted leading-relaxed"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            {config.description}
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Retry button for failed/network errors */}
          {(type === 'failed' || type === 'network') && onRetry && (
            <Button
              className="w-full sm:w-auto"
              disabled={isRetrying}
              onClick={onRetry}
              size="lg"
              variant="default"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Try Again
                </>
              )}
            </Button>
          )}

          {/* Browse all courses button */}
          {onBrowseCourses && (
            <Button
              className="w-full sm:w-auto"
              onClick={onBrowseCourses}
              size="lg"
              variant={type === 'empty' ? 'default' : 'secondary'}
            >
              Browse All Courses
              <ChevronRight className="ml-2 size-4" />
            </Button>
          )}

          {/* Skip for timeout */}
          {type === 'timeout' && onSkip && (
            <Button
              className="w-full sm:w-auto"
              onClick={onSkip}
              size="lg"
              variant="secondary"
            >
              Continue to Dashboard
              <ChevronRight className="ml-2 size-4" />
            </Button>
          )}
        </motion.div>

        {/* Support Information */}
        <motion.div
          animate={{ opacity: 1 }}
          className="border-hairline border-t pt-4"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-text-muted text-xs">
            Still having issues?{' '}
            <a
              className="text-accent underline transition-colors hover:text-accent/80"
              href="mailto:support@ngecourse.com"
            >
              Contact Support
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface TimeoutProgressProps {
  timeoutIn: number; // seconds
  onTimeout: () => void;
  className?: string;
}

export function TimeoutProgress({
  timeoutIn,
  onTimeout,
  className,
}: TimeoutProgressProps) {
  const [remainingTime, setRemainingTime] = useState(timeoutIn);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeout]);

  const progress = ((timeoutIn - remainingTime) / timeoutIn) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2 text-center">
        <p className="text-sm text-text-muted">
          Auto-timeout in{' '}
          <span className="font-medium text-text-secondary">
            {remainingTime}s
          </span>
        </p>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
