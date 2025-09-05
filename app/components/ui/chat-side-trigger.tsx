import { forwardRef } from 'react';
import { cn } from '~/lib/utils';
import { LESSON_COPY } from '~/features/courses/constants/lesson-copy';

interface ChatSideTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  className?: string;
}

export const ChatSideTrigger = forwardRef<HTMLButtonElement, ChatSideTriggerProps>(
  ({ isOpen, onClick, text = LESSON_COPY.chat.sideTrigger.default, disabled = false, className }, ref) => {
    // Don't render when chat is open
    if (isOpen) return null;

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        type="button"
        className={cn(
          // Base positioning
          'fixed right-0 top-1/2 z-40 -translate-y-1/2',
          // Layout and sizing
          'flex items-center justify-center px-3 py-4',
          // Background and borders
          'border border-r-0 border-hairline bg-background/95 backdrop-blur-sm',
          // Border radius (rounded on left side only)
          'rounded-l-xl',
          // Typography
          'text-sm font-medium text-text-secondary',
          // Hover effects
          'transition-all duration-200 ease-out',
          'hover:bg-background hover:text-text-primary hover:border-strong',
          'hover:shadow-md hover:shadow-accent/10',
          // Focus styles
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // Active effects
          'active:scale-95',
          // Disabled styles
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background/95 disabled:hover:text-text-secondary',
          // Transform for slide-in animation
          'animate-in slide-in-from-right-full duration-300 fill-mode-forwards',
          className
        )}
        aria-label={LESSON_COPY.accessibility.chatTrigger}
      >
        {/* Vertical text */}
        <span 
          className="whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {text}
        </span>
        
        {/* Optional highlight indicator */}
        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </button>
    );
  }
);

ChatSideTrigger.displayName = 'ChatSideTrigger';