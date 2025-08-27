import { cn } from '~/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md',
        'bg-white/8 backdrop-blur-sm',
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
