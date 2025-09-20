import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, FolderTree, Maximize, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '~/components/ui/button';
import { LESSON_COPY } from '~/features/courses/constants/lesson-copy';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { courseQueryOption } from '../hooks/get-course';
import { LessonFileTree } from './lesson-file-tree';

interface LessonHeaderProps {
  title: string;
  courseSlug: string;
  userId: string;
  onMaximizeToggle?: (isMaximized: boolean) => void;
  isMaximized?: boolean;
}

export const LessonHeader = ({
  title,
  courseSlug,
  userId,
  onMaximizeToggle,
  isMaximized: externalIsMaximized,
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
    <header className="sticky top-0 z-30 w-full border-hairline border-b px-3 py-2 backdrop-blur-md sm:px-6 sm:py-3">
      <div className="mx-auto flex w-full items-center justify-between gap-4">
        {/* Left: Structure trigger */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            aria-label={LESSON_COPY.accessibility.backButton}
            className="btn-ghost p-2.5"
            onClick={() => navigate(`/courses/${courseSlug}`)}
            title={LESSON_COPY.header.backToCourse.title}
            type="button"
            variant={'outline'}
          >
            <ChevronLeft aria-hidden="true" size={16} />
            <span className="sr-only">
              {LESSON_COPY.header.backToCourse.label}
            </span>
          </Button>
          <LessonFileTree course={course} enrollment={enrollment}>
            <Button
              aria-label={LESSON_COPY.accessibility.outlineButton}
              className=" focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              type="button"
              variant="outline"
            >
              <FolderTree aria-hidden="true" size={16} />
              <span className="ml-2 hidden sm:inline">
                {LESSON_COPY.header.outline.label}
              </span>
            </Button>
          </LessonFileTree>
        </div>

        {/* Center: Title and meta */}
        <div className="flex min-w-0 flex-1 flex-col items-center">
          <h1
            className="max-w-[14rem] truncate font-medium text-base text-text-primary leading-tight sm:text-lg md:max-w-full"
            title={title}
          >
            {title}
          </h1>
          <p className="mt-1 hidden truncate text-text-muted text-xs sm:block">
            {course?.title
              ? `${LESSON_COPY.progress.courseInfo.replace('{{courseTitle}}', course.title)}`
              : LESSON_COPY.progress.current}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <button
            aria-label={
              isMaximized
                ? LESSON_COPY.header.fullscreen.exit
                : LESSON_COPY.header.fullscreen.enter
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
              {isMaximized
                ? LESSON_COPY.header.fullscreen.exitTitle
                : LESSON_COPY.header.fullscreen.enterTitle}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
