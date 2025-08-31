import { Sparkles } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

interface ChatToggleFABProps {
  isOpen: boolean;
  onClick: () => void;
  messageCount?: number;
  disabled?: boolean;
  className?: string;
}

export const ChatToggleFAB = forwardRef<HTMLButtonElement, ChatToggleFABProps>(
  ({ isOpen, onClick, messageCount = 0, disabled = false, className }, ref) => {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        {/* Notification Badge */}
        {messageCount > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 z-10 animate-in fade-in-0 zoom-in-75 duration-200">
            <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-alt px-1.5 text-xs font-semibold text-white shadow-lg">
              {messageCount > 99 ? '99+' : messageCount}
            </div>
          </div>
        )}

        <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className={cn(
            // Base styles
            'group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ease-out',
            // Background gradient
            'bg-gradient-to-br from-accent via-accent to-accent-alt',
            // Hover effects
            'hover:scale-105 hover:shadow-xl hover:shadow-accent/25',
            // Active effects  
            'active:scale-95',
            // Focus styles
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            // Disabled styles
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            // Glow effect
            'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-accent before:to-accent-alt before:blur-md before:opacity-0 before:transition-opacity before:duration-200',
            'hover:before:opacity-30',
            // Open state
            isOpen && 'bg-gradient-to-br from-accent-alt via-accent to-accent scale-105 shadow-xl shadow-accent/25',
            className
          )}
          aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
        >
          {/* Icon with rotation animation */}
          <Sparkles
            size={20}
            className={cn(
              'text-white transition-transform duration-200 ease-out',
              'group-hover:scale-110',
              isOpen && 'rotate-12 scale-110'
            )}
          />

          {/* Pulse animation for new messages */}
          {messageCount > 0 && !isOpen && (
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
          )}
        </button>

        {/* Ripple effect on click */}
        <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-white/20 scale-0 opacity-0 group-active:scale-150 group-active:opacity-100 transition-all duration-150 ease-out" />
        </div>
      </div>
    );
  }
);

ChatToggleFAB.displayName = 'ChatToggleFAB';