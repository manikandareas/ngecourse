import { Rocket, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

export function CourseBadge(props: {
  difficulty: 'advanced' | 'beginner' | 'intermediate' | null;
}) {
  if (!props.difficulty) {
    return null;
  }

  const difficultyConfig = {
    beginner: {
      icon: <Zap className="h-3 w-3" />,
      label: 'Beginner',
      className:
        'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    },
    intermediate: {
      icon: <TrendingUp className="h-3 w-3" />,
      label: 'Intermediate',
      className:
        'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    },
    advanced: {
      icon: <Rocket className="h-3 w-3" />,
      label: 'Advanced',
      className:
        'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    },
  };

  const config = difficultyConfig[props.difficulty];

  return (
    <Badge
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 font-medium text-xs shadow-sm backdrop-blur-sm',
        config.className
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
