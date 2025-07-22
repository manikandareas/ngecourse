import { BookOpen, CheckCircle2, Clock, HelpCircle, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import type { LmsChaptersContents } from '~/types/directus';
import type { ContentWithProgression } from '~/utils/content-progression';

interface ContentItemProps {
  content: LmsChaptersContents;
  contentState: ContentWithProgression | undefined;
  chapterSlug: string;
}

/**
 * Individual content item component with progression state styling
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: the logic is necessary
export function ContentItem({
  content,
  contentState,
  chapterSlug,
}: ContentItemProps) {
  const isLesson = content.collection === 'lms_lessons';
  const isCompleted = contentState?.state === 'completed';
  const isLocked = contentState?.state === 'locked';
  const isCurrent = contentState?.isCurrentContent;

  const navigate = useNavigate();

  const { slug } = useParams();

  // Container styles based on state
  const containerClass = [
    'group flex items-center justify-between rounded-lg border p-3 transition-all duration-200',
    isLocked && 'border-gray-200 bg-gray-50 opacity-60',
    isCurrent && 'border-blue-200 bg-blue-50 shadow-sm',
    isCompleted && 'border-green-200 bg-green-50',
    !(isLocked || isCurrent || isCompleted) &&
      'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm',
  ]
    .filter(Boolean)
    .join(' ');

  // Icon container styles
  const iconContainerClass = [
    'flex h-8 w-8 items-center justify-center rounded-full',
    isLocked && 'bg-gray-200 text-gray-400',
    !isLocked && isCompleted && 'bg-green-100 text-green-600',
    !(isLocked || isCompleted) && isLesson && 'bg-blue-100 text-blue-600',
    !(isLocked || isCompleted || isLesson) && 'bg-purple-100 text-purple-600',
  ]
    .filter(Boolean)
    .join(' ');

  // Title styles
  const titleClass = [
    'font-medium text-sm',
    isLocked ? 'text-gray-500' : 'text-gray-900',
  ]
    .filter(Boolean)
    .join(' ');

  // Badge styles helper function
  const getBadgeStyles = () => {
    if (isLocked) {
      return 'border-gray-300 text-gray-500';
    }
    if (isLesson) {
      return 'border-blue-200 text-blue-700';
    }
    return 'border-purple-200 text-purple-700';
  };

  const badgeClass = ['text-xs', getBadgeStyles()].filter(Boolean).join(' ');

  // Button styles
  const buttonClass = [
    'transition-opacity',
    isLocked
      ? 'cursor-not-allowed opacity-50'
      : 'opacity-0 group-hover:opacity-100',
  ]
    .filter(Boolean)
    .join(' ');

  const getButtonText = () => {
    if (isLocked) {
      return 'Locked';
    }
    if (isCompleted) {
      return 'Review';
    }
    return 'Start';
  };

  const buttonText = getButtonText();

  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-3">
        <div className={iconContainerClass}>
          {isCompleted && <CheckCircle2 className="h-4 w-4" />}
          {isLocked && <Lock className="h-4 w-4" />}
          {!(isCompleted || isLocked) && isLesson && (
            <BookOpen className="h-4 w-4" />
          )}
          {!(isCompleted || isLocked || isLesson) && (
            <HelpCircle className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={titleClass}>{content.item.title}</span>
            <Badge className={badgeClass} variant="outline">
              {isLesson ? 'Lesson' : 'Quiz'}
            </Badge>
            {isCurrent && (
              <Badge
                className="bg-blue-100 text-blue-700 text-xs"
                variant="secondary"
              >
                Current
              </Badge>
            )}
          </div>

          <div className="mt-1 flex items-center space-x-4 text-gray-500 text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{isLesson ? '15 min' : '5 min'}</span>
            </div>
            {isCompleted && <span className="text-green-600">✓ Completed</span>}
            {isLocked && <span className="text-gray-400">🔒 Locked</span>}
          </div>
        </div>
      </div>

      <Button
        className={buttonClass}
        disabled={isLocked}
        onClick={() => {
          if (isLocked) {
            return;
          }
          if (isCompleted) {
            return;
          }
          if (isLesson) {
            navigate(
              `/courses/${slug}/${chapterSlug}/lessons/${content.item.slug}`
            );
            return;
          }

          if (!isLesson) {
            navigate(
              `/courses/${slug}/${chapterSlug}/quizzes/${content.item.slug}`
            );
          }
        }}
        size="sm"
        type="button"
        variant={isCompleted ? 'outline' : 'default'}
      >
        {buttonText}
      </Button>
    </div>
  );
}
