import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  FolderTree,
  Maximize,
  Minimize,
  MoreVertical,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Separator } from '~/components/ui/separator';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { courseQueryOption } from '../hooks/get-course';
import { LessonFileTree } from './lesson-file-tree';

interface LessonHeaderProps {
  title: string;
  courseSlug: string;
  userId: string;
  onChatToggle?: () => void;
  isChatOpen?: boolean;
  onMaximizeToggle?: (isMaximized: boolean) => void;
  isMaximized?: boolean;
  showChatButton?: boolean;
}

export const LessonHeader = ({
  title,
  courseSlug,
  userId,
  onChatToggle,
  isChatOpen = false,
  onMaximizeToggle,
  isMaximized: externalIsMaximized,
  showChatButton = true,
}: LessonHeaderProps) => {
  const { data: course } = useQuery(courseQueryOption(courseSlug));
  const { data: enrollment } = useQuery(
    enrollmentQueryOption(userId, courseSlug)
  );
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [internalIsMaximized, setInternalIsMaximized] = useState(false);

  const isMaximized = externalIsMaximized ?? internalIsMaximized;
  const navigate = useNavigate();

  const enterFullscreen = async () => {
    try {
      const element = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch {
      // Silently fail if fullscreen is not supported or permission denied
    }
  };

  const exitFullscreen = async () => {
    try {
      const doc = document as Document & {
        webkitExitFullscreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
      };

      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch {
      // Silently fail if fullscreen is not supported
    }
  };

  const handleMaximizeToggle = async () => {
    const newMaximizedState = !isMaximized;

    if (newMaximizedState) {
      await enterFullscreen();
    } else {
      await exitFullscreen();
    }

    if (externalIsMaximized === undefined) {
      setInternalIsMaximized(newMaximizedState);
    }
    onMaximizeToggle?.(newMaximizedState);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element;
        msFullscreenElement?: Element;
      };

      const isCurrentlyFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement
      );

      if (externalIsMaximized === undefined) {
        setInternalIsMaximized(isCurrentlyFullscreen);
      }
      onMaximizeToggle?.(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'MSFullscreenChange',
        handleFullscreenChange
      );
    };
  }, [externalIsMaximized, onMaximizeToggle]);

  if (!(course && enrollment)) {
    return null;
  }
  return (
    <header className="tinted-blur sticky top-0 z-30 w-full border-hairline border-b px-4 py-3 sm:px-6">
      <div className="mx-auto flex w-full items-center justify-between gap-4">
        {/* Left: Structure trigger */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            aria-label="Go back to course"
            className="btn-ghost p-2.5"
            onClick={() => navigate(`/courses/${courseSlug}`)}
            title="Go back to course"
            type="button"
            variant={'outline'}
          >
            <ChevronLeft aria-hidden="true" size={16} />
            <span className="sr-only">Go back to course</span>
          </Button>
          <LessonFileTree course={course} enrollment={enrollment}>
            <Button
              aria-label="Open lesson structure"
              className=" focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              type="button"
              variant="outline"
            >
              <FolderTree aria-hidden="true" size={16} />
              <span className="ml-2 hidden sm:inline">Outline</span>
            </Button>
          </LessonFileTree>
        </div>

        {/* Center: Title and meta */}
        <div className="flex min-w-0 flex-1 flex-col items-center">
          <h1 className="truncate font-medium text-base text-text-primary leading-tight sm:text-lg">
            {title}
          </h1>
          <p className="mt-1 hidden truncate text-text-muted text-xs sm:block">
            {course?.title ? `Course: ${course.title}` : 'Lesson'}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          {isDesktop ? (
            /* Desktop: Only fullscreen button (chat handled by FAB) */
            <button
              aria-label={
                isMaximized ? 'Exit full screen' : 'Enter full screen'
              }
              className="btn-ghost p-2.5"
              onClick={() => {
                handleMaximizeToggle().catch(() => {
                  // Handle error silently
                });
              }}
              type="button"
            >
              {isMaximized ? (
                <Minimize aria-hidden="true" size={16} />
              ) : (
                <Maximize aria-hidden="true" size={16} />
              )}
              <span className="sr-only">
                {isMaximized ? 'Exit full screen' : 'Enter full screen'}
              </span>
            </button>
          ) : (
            /* Mobile: Dropdown Menu */
            <Popover>
              <PopoverTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="btn-ghost p-2.5"
                  type="button"
                >
                  <MoreVertical aria-hidden="true" size={16} />
                  <span className="sr-only">Open menu</span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="tinted-blur w-48 border border-strong p-3"
              >
                <div className="space-y-2">
                  {showChatButton && (
                    <>
                      <button
                        className={`w-full justify-start ${isChatOpen ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={onChatToggle}
                        type="button"
                      >
                        <Sparkles aria-hidden="true" size={16} />
                        <span className="ml-2">
                          {isChatOpen ? 'Close Chat' : 'Ask Genii'}
                        </span>
                      </button>

                      <Separator className="my-2 border-hairline" />
                    </>
                  )}

                  <button
                    className="btn-ghost w-full justify-start"
                    onClick={() => {
                      handleMaximizeToggle().catch(() => {
                        // Handle error silently
                      });
                    }}
                    type="button"
                  >
                    {isMaximized ? (
                      <Minimize aria-hidden="true" size={16} />
                    ) : (
                      <Maximize aria-hidden="true" size={16} />
                    )}
                    <span className="ml-2">
                      {isMaximized ? 'Exit Full Screen' : 'Full Screen'}
                    </span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};
