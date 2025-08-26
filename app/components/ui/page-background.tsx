import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';

interface PageBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function PageBackground({ children, className }: PageBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen text-text-primary', className)}>
      {/* Fixed Cosmic Dark Abstract Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="h-full w-full"
          style={{
            background: `
              radial-gradient(
                circle at 20% 80%,
                oklch(0.15 0.12 220) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 80% 20%,
                oklch(0.12 0.1 180) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 40% 40%,
                oklch(0.1 0.08 140) 0%,
                transparent 50%
              ), 
              oklch(0.08 0.02 240)
            `,
          }}
        />
      </div>
      {children}
    </div>
  );
}