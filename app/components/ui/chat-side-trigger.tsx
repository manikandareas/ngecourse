import { forwardRef } from 'react';
import { LESSON_COPY } from '~/features/courses/constants/lesson-copy';
import { cn } from '~/lib/utils';

interface ChatSideTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  className?: string;
}

export const ChatSideTrigger = forwardRef<
  HTMLButtonElement,
  ChatSideTriggerProps
>(
  (
    {
      isOpen,
      onClick,
      text = LESSON_COPY.chat.sideTrigger.default,
      disabled = false,
      className,
    },
    ref
  ) => {
    // Don't render when chat is open
    if (isOpen) return null;

    return (
      <button
        aria-label={LESSON_COPY.accessibility.chatTrigger}
        className={cn(
          // Base positioning
          '-translate-y-1/2 fixed top-1/2 right-0 z-40',
          // Layout and sizing
          'flex items-center justify-center px-3 py-4',
          // Background and borders
          'border border-r-0 bg-primary backdrop-blur-sm',
          // Border radius (rounded on left side only)
          'rounded-l-xl',
          // Typography
          'font-medium text-primary-foreground text-sm',
          // Hover effects
          'transition-all duration-200 ease-out',
          'hover:cursor-pointer hover:bg-primary/90 hover:text-primary-foreground',
          'hover:shadow-accent/10 hover:shadow-md',
          // Focus styles
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // Active effects
          'active:scale-95',
          // Disabled styles
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background/95 disabled:hover:text-text-secondary',
          // Transform for slide-in animation
          'slide-in-from-right-full animate-in fill-mode-forwards duration-300',
          className
        )}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        type="button"
      >
        {/* Vertical text */}
        <span
          className="whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {text}
        </span>

        {/* Optional highlight indicator */}
        <div className="-translate-y-1/2 absolute top-1/2 left-0 h-8 w-1 rounded-r-full bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </button>
    );
  }
);

ChatSideTrigger.displayName = 'ChatSideTrigger';
