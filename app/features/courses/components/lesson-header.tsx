import { useQuery } from '@tanstack/react-query';
import { FolderTree, Maximize, MoreVertical, Sparkles } from 'lucide-react';
import { useNavigation } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '~/components/ui/3d-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Separator } from '~/components/ui/separator';
import { ThemeSwitcher } from '~/components/ui/theme-switcher';
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
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="mx-auto flex w-full items-center justify-between gap-2 sm:gap-4">
        {/* Left: Structure trigger */}
        <div className="flex w-1/2 items-center">
          <LessonFileTree course={course} enrollment={enrollment}>
            <Button
              aria-label="Open lesson structure"
              size="sm"
              type="button"
              variant={'solid'}
            >
              <FolderTree aria-hidden="true" size={16} />
              <span className="ml-2 hidden sm:inline">Outline</span>
            </Button>
          </LessonFileTree>
        </div>

        {/* Center: Title and meta */}
        <div className="flex w-1/2 items-center gap-2">
          <h1 className="truncate font-semibold text-base sm:text-lg">
            {title}
          </h1>
          <p className="mt-0.5 hidden truncate text-muted-foreground text-xs sm:block">
            {course?.title ? `Course: ${course.title}` : 'Lesson'}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex w-1/2 items-center justify-end gap-1.5 sm:gap-3">
          {isDesktop ? (
            /* Desktop: Individual Buttons */
            <>
              <Button
                onClick={onChatToggle}
                size="sm"
                type="button"
                variant={isChatOpen ? 'ai' : 'outline'}
              >
                <Sparkles aria-hidden="true" size={16} />
                <span className="ml-1">
                  {isChatOpen ? 'Close Chat' : 'Ask Genii'}
                </span>
              </Button>

              <ThemeSwitcher />

              <Button
                aria-label="Enter full screen"
                size="icon"
                type="button"
                variant="outline"
              >
                <Maximize aria-hidden="true" size={16} />
                <span className="sr-only">Enter full screen</span>
              </Button>
            </>
          ) : (
            /* Mobile: Dropdown Menu */
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  aria-label="Open menu"
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <MoreVertical aria-hidden="true" size={16} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-2">
                <div className="space-y-1">
                  <Button
                    className="w-full justify-start"
                    onClick={onChatToggle}
                    size="sm"
                    type="button"
                    variant={isChatOpen ? 'ai' : 'ghost'}
                  >
                    <Sparkles aria-hidden="true" size={16} />
                    <span className="ml-2">
                      {isChatOpen ? 'Close Chat' : 'Ask Genii'}
                    </span>
                  </Button>

                  <Separator className="my-1" />

                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-medium text-sm">Theme</span>
                    <ThemeSwitcher />
                  </div>

                  <Separator className="my-1" />

                  <Button
                    className="w-full justify-start"
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <Maximize aria-hidden="true" size={16} />
                    <span className="ml-2">Full Screen</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};
