import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

export function CourseBadge(props: {
  difficulty: 'advanced' | 'beginner' | 'intermediate' | null;
}) {
  if (!props.difficulty) {
    return null;
  }
  return (
    <Badge
      className={cn('capitalize', {
        'bg-green-500 text-white': props.difficulty === 'beginner',
        'bg-yellow-500 text-white': props.difficulty === 'intermediate',
        'bg-red-500 text-white': props.difficulty === 'advanced',
      })}
    >
      {props.difficulty.toLowerCase()}
    </Badge>
  );
}
