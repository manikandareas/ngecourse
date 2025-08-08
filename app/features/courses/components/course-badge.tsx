import { SignalHigh, SignalLow, SignalMedium } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

export function CourseBadge(props: {
  difficulty: 'advanced' | 'beginner' | 'intermediate' | null;
}) {
  if (!props.difficulty) {
    return null;
  }

  const sizeIcon = 14;

  const icon = {
    beginner: <SignalLow size={sizeIcon} />,
    intermediate: <SignalMedium size={sizeIcon} />,
    advanced: <SignalHigh size={sizeIcon} />,
  };
  return (
    <Badge
      className={cn('capitalize', {
        'bg-green-500 text-white': props.difficulty === 'beginner',
        'bg-yellow-500 text-white': props.difficulty === 'intermediate',
        'bg-red-500 text-white': props.difficulty === 'advanced',
      })}
    >
      {icon[props.difficulty]}
      {props.difficulty.toLowerCase()}
    </Badge>
  );
}
