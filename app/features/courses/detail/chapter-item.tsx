import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { GetChapterBySlugQueryResult, Lesson, Quiz } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import type { ContentWithProgression } from '~/utils/content-progression';
import { ContentItem } from './content-item';

interface ChapterItemProps {
  chapter: GetChapterBySlugQueryResult;
  isLast: boolean;
  chapterNumber: number;
  contentProgression: ContentWithProgression[];
}

/**
 * Get chapter node styling based on completion and hover state
 */
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

export function ChapterItem({
  chapter,
  isLast,
  chapterNumber,
  contentProgression,
}: ChapterItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate chapter progress
  const chapterContentIds = chapter?.contents?.map((content) =>
    content._id.toString()
  );
  const chapterProgression = contentProgression.filter((item) =>
    chapterContentIds?.includes(item.id)
  );

  const completedItems = chapterProgression.filter(
    (item) => item.state === 'completed'
  ).length;
  const totalItems = chapter?.contents?.length ?? 0;
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
            aria-label={`Chapter ${chapterNumber}: ${chapter?.title}`}
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
                    {chapter?.title}
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

                {chapter?.description && (
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
              {chapter?.contents?.map((content) => {
                const contentState = contentProgression.find(
                  (item) => item.id === content._id.toString()
                );

                return (
                  <ContentItem
                    chapterSlug={chapter.slug?.current as string}
                    content={content as Lesson | Quiz}
                    contentState={contentState}
                    key={content._id}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
