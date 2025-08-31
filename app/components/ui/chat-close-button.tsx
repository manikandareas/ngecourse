import { X } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

interface ChatCloseButtonProps {
  isOpen: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const ChatCloseButton = forwardRef<HTMLButtonElement, ChatCloseButtonProps>(
  ({ isOpen, onClick, disabled = false, className }, ref) => {
    // Only render when chat is open
    if (!isOpen) return null;

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        type="button"
        className={cn(
          // Positioning outside chat container
          'absolute left-[-48px] top-4 z-10',
          // Layout and sizing
          'flex h-10 w-10 items-center justify-center',
          // Background and borders
          'border border-hairline bg-background/95 backdrop-blur-sm',
          // Border radius
          'rounded-xl',
          // Hover effects
          'transition-all duration-200 ease-out',
          'hover:bg-background hover:border-strong hover:shadow-md hover:shadow-accent/10',
          // Focus styles
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // Active effects
          'active:scale-95',
          // Disabled styles
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Animation
          'animate-in slide-in-from-left-full duration-300 fill-mode-forwards',
          className
        )}
        aria-label="Close AI Chat"
      >
        <X 
          size={16} 
          className="text-text-secondary transition-colors duration-200 hover:text-text-primary" 
        />
      </button>
    );
  }
);

ChatCloseButton.displayName = 'ChatCloseButton';