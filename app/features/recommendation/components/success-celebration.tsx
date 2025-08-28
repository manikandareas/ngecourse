import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '~/lib/utils';

interface SuccessCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
  className?: string;
}

export function SuccessCelebration({
  trigger,
  onComplete,
  className,
}: SuccessCelebrationProps) {
  const hasTriggeredRef = useRef(false);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (trigger && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;

      // Check for reduced motion preference
      if (prefersReducedMotion.current) {
        // For users with reduced motion preference, just call onComplete
        onComplete?.();
        return;
      }

      // Subtle side cannons confetti effect (your design)
      const end = Date.now() + 3 * 1000; // 3 seconds
      const colors = ['#a786ff', '#fd8bfc', '#eca184', '#f8deb1'];

      const frame = () => {
        if (Date.now() > end) {
          onComplete?.();
          return;
        }

        // Left side cannon
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors,
        });

        // Right side cannon
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors,
        });

        requestAnimationFrame(frame);
      };

      // Start the side cannons animation
      frame();
    }
  }, [trigger, onComplete]);

  // Reset the trigger when it becomes false
  useEffect(() => {
    if (!trigger) {
      hasTriggeredRef.current = false;
    }
  }, [trigger]);

  if (!trigger) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn(
        'pointer-events-none fixed inset-0 z-50 flex items-center justify-center',
        className
      )}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Success message overlay for reduced motion users */}
      {prefersReducedMotion.current && (
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              <svg
                className="size-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Success</title>
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-text-primary">
                Success!
              </h3>
              <p className="text-sm text-text-secondary">
                Your learning journey awaits!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface CourseCardEntranceProps {
  children: React.ReactNode;
  delay?: number;
  isVisible: boolean;
  className?: string;
}

export function CourseCardEntrance({
  children,
  delay = 0,
  isVisible,
  className,
}: CourseCardEntranceProps) {
  return (
    <motion.div
      animate={
        isVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.95 }
      }
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.25, 0, 1], // Custom bezier curve for smooth entrance
        scale: {
          type: 'spring',
          stiffness: 200,
          damping: 20,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredEntranceProps {
  children: React.ReactNode[];
  isVisible: boolean;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredEntrance({
  children,
  isVisible,
  staggerDelay = 0.1,
  className,
}: StaggeredEntranceProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <CourseCardEntrance
          delay={index * staggerDelay}
          isVisible={isVisible}
          key={index.toString()}
        >
          {child}
        </CourseCardEntrance>
      ))}
    </div>
  );
}

// Hook for managing confetti celebration
export function useConfettiCelebration() {
  const [shouldCelebrate, setShouldCelebrate] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const trigger = () => {
    setShouldCelebrate(true);
    setIsComplete(false);
  };

  const handleComplete = () => {
    setIsComplete(true);
    // Keep shouldCelebrate true until manually reset
  };

  const reset = () => {
    setShouldCelebrate(false);
    setIsComplete(false);
  };

  return {
    shouldCelebrate,
    isComplete,
    trigger,
    reset,
    handleComplete,
  };
}
