import { useQuery } from '@tanstack/react-query';
import { FolderTree, Maximize, MoreVertical, Sparkles } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
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
}

export const LessonHeader = ({
  title,
  courseSlug,
  userId,
  onChatToggle,
  isChatOpen = false,
}: LessonHeaderProps) => {
  const { data: course } = useQuery(courseQueryOption(courseSlug));
  const { data: enrollment } = useQuery(
    enrollmentQueryOption(userId, courseSlug)
  );
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!(course && enrollment)) {
    return null;
  }
  return (
    <header className="tinted-blur sticky top-0 z-30 w-full border-hairline border-b px-4 py-3 sm:px-6">
      <div className="mx-auto flex w-full items-center justify-between gap-4">
        {/* Left: Structure trigger */}
        <div className="flex min-w-0 flex-1 items-center">
          <LessonFileTree course={course} enrollment={enrollment}>
            <button
              aria-label="Open lesson structure"
              className="btn-ghost focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              type="button"
            >
              <FolderTree aria-hidden="true" size={16} />
              <span className="ml-2 hidden sm:inline">Outline</span>
            </button>
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
            /* Desktop: Individual Buttons */
            <>
              <button
                className={isChatOpen ? 'btn-primary' : 'btn-ghost'}
                onClick={onChatToggle}
                type="button"
              >
                <Sparkles aria-hidden="true" size={16} />
                <span className="ml-2">
                  {isChatOpen ? 'Close Chat' : 'Ask Genii'}
                </span>
              </button>

              <button
                aria-label="Enter full screen"
                className="btn-ghost p-2.5"
                type="button"
              >
                <Maximize aria-hidden="true" size={16} />
                <span className="sr-only">Enter full screen</span>
              </button>
            </>
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

                  <button
                    className="btn-ghost w-full justify-start"
                    type="button"
                  >
                    <Maximize aria-hidden="true" size={16} />
                    <span className="ml-2">Full Screen</span>
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
