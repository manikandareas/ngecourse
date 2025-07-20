import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import type { Chapter } from '~/data/courses';

interface ChapterItemProps {
  chapter: Chapter;
  isLast: boolean;
  chapterNumber: number;
}

// Helper functions to reduce complexity
function getChapterNodeStyles(
  isCompleted: boolean,
  isHovered: boolean
): string {
  if (isCompleted) {
    return 'border-green-500 bg-green-500';
  }
  if (isHovered) {
    return 'border-blue-500 bg-blue-500 scale-110';
  }
  return 'border-blue-400 bg-blue-400';
}

function getContentIconStyles(
  isItemCompleted: boolean,
  isLesson: boolean
): string {
  if (isItemCompleted) {
    return 'bg-green-100 text-green-600';
  }
  if (isLesson) {
    return 'bg-blue-100 text-blue-600';
  }
  return 'bg-purple-100 text-purple-600';
}

function getContentBadgeStyles(isLesson: boolean): string {
  if (isLesson) {
    return 'border-blue-200 text-blue-700';
  }
  return 'border-purple-200 text-purple-700';
}

export function ChapterItem({
  chapter,
  isLast,
  chapterNumber,
}: ChapterItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Mock completion status - replace with actual data
  const completedItems = 0; // Replace with actual completed count
  const totalItems = chapter.contents.length;
  const progressPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isCompleted = completedItems === totalItems && totalItems > 0;

  const nodeStyles = getChapterNodeStyles(isCompleted, isHovered);

  return (
    <div className="relative" id={isLast ? 'last-chapter' : ''}>
      {/* Chapter Node */}
      <div className="relative z-10 flex">
        <div className="mr-6 flex flex-col items-center">
          <button
            aria-label={`Chapter ${chapterNumber}: ${chapter.title}`}
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold text-white shadow-lg transition-all duration-300 ${nodeStyles}`}
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            type="button"
          >
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <span className="text-sm">{chapterNumber}</span>
            )}
          </button>
        </div>

        <div className="flex-1 pb-8">
          {/* Chapter Header */}
          <div
            className={`rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
              isExpanded ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={handleToggle}
              type="button"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-xs" variant="secondary">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </Badge>
                    {isCompleted && (
                      <Badge
                        className="bg-green-100 text-green-800"
                        variant="default"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>

                {chapter.description && (
                  <p className="mb-3 text-gray-600 text-sm">
                    {chapter.description}
                  </p>
                )}

                {totalItems > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>Progress</span>
                      <span>
                        {completedItems} of {totalItems} completed
                      </span>
                    </div>
                    <Progress className="h-1.5" value={progressPercentage} />
                  </div>
                )}
              </div>

              <div className="ml-4 flex items-center">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400 transition-transform" />
                )}
              </div>
            </button>
          </div>

          {/* Chapter Contents */}
          {isExpanded && (
            <div className="mt-4 space-y-2">
              {chapter.contents.map(({ item, collection }) => {
                const content = item as { title: string; id: string };
                const isLesson = collection === 'lms_lessons';
                const isItemCompleted = false; // Replace with actual completion status

                const iconStyles = getContentIconStyles(
                  isItemCompleted,
                  isLesson
                );
                const badgeStyles = getContentBadgeStyles(isLesson);

                return (
                  <div
                    className="group flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 transition-all duration-200 hover:border-gray-200 hover:shadow-sm"
                    key={content.id}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${iconStyles}`}
                      >
                        {isItemCompleted && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        {!isItemCompleted &&
                          (isLesson ? (
                            <BookOpen className="h-4 w-4" />
                          ) : (
                            <HelpCircle className="h-4 w-4" />
                          ))}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {content.title}
                          </span>
                          <Badge
                            className={`text-xs ${badgeStyles}`}
                            variant="outline"
                          >
                            {isLesson ? 'Lesson' : 'Quiz'}
                          </Badge>
                        </div>

                        <div className="mt-1 flex items-center space-x-4 text-gray-500 text-xs">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{isLesson ? '15 min' : '5 min'}</span>
                          </div>
                          {isItemCompleted && (
                            <span className="text-green-600">✓ Completed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      size="sm"
                      variant={isItemCompleted ? 'outline' : 'default'}
                    >
                      {isItemCompleted ? 'Review' : 'Start'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
