import { CheckCircle, Trophy } from 'lucide-react';
import type React from 'react';

interface CompletionBadgeProps {
  isCompleted: boolean;
  completionDate?: string;
  variant?: 'default' | 'small' | 'large';
  showIcon?: boolean;
  className?: string;
}

export const CompletionBadge: React.FC<CompletionBadgeProps> = ({
  isCompleted,
  completionDate,
  variant = 'default',
  showIcon = true,
  className = '',
}) => {
  if (!isCompleted) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-2.5 py-1.5 text-xs',
    large: 'px-3 py-2 text-sm',
  };

  const iconSizes = {
    small: 'h-3 w-3',
    default: 'h-3 w-3',
    large: 'h-4 w-4',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/20 font-medium text-green-400 backdrop-blur-sm ${sizeClasses[variant]} ${className}`}
    >
      {showIcon && <CheckCircle className={iconSizes[variant]} />}
      <span>Completed</span>
      {completionDate && (
        <span className="text-green-300/80">{formatDate(completionDate)}</span>
      )}
    </div>
  );
};

interface AchievementBadgeProps {
  achievementCount: number;
  variant?: 'default' | 'small' | 'large';
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievementCount,
  variant = 'default',
  className = '',
}) => {
  if (achievementCount === 0) return null;

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-2.5 py-1.5 text-xs',
    large: 'px-3 py-2 text-sm',
  };

  const iconSizes = {
    small: 'h-3 w-3',
    default: 'h-3 w-3',
    large: 'h-4 w-4',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/20 font-medium text-yellow-400 backdrop-blur-sm ${sizeClasses[variant]} ${className}`}
    >
      <Trophy className={iconSizes[variant]} />
      <span>
        {achievementCount} Achievement{achievementCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};
