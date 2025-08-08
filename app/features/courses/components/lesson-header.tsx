import { useQuery } from '@tanstack/react-query';
import { FolderTree, Maximize, Sparkles } from 'lucide-react';
import { Button } from '~/components/ui/3d-button';
import { ThemeSwitcher } from '~/components/ui/theme-switcher';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { courseQueryOption } from '../hooks/get-course';
import { LessonFileTree } from './lesson-file-tree';

interface LessonHeaderProps {
  title: string;
  courseSlug: string;
  userId: string;
}

export const LessonHeader = ({
  title,
  courseSlug,
  userId,
}: LessonHeaderProps) => {
  const { data: course } = useQuery(courseQueryOption(courseSlug));

  const { data: enrollment } = useQuery(
    enrollmentQueryOption(userId, courseSlug)
  );

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
          <ThemeSwitcher />

          {/* Mobile: icon-only Ask Genii */}
          <div className="sm:hidden">
            <Button
              aria-label="Ask Genii about this lesson"
              size="icon"
              type="button"
              variant={'outline'}
            >
              <Sparkles aria-hidden="true" size={16} />
              <span className="sr-only">Ask Genii</span>
            </Button>
          </div>

          {/* Desktop: text Ask Genii */}
          <div className="hidden sm:block">
            <Button size="sm" type="button" variant={'ai'}>
              <Sparkles aria-hidden="true" size={16} />
              <span className="ml-1">Ask Genii</span>
            </Button>
          </div>

          <Button
            aria-label="Enter full screen"
            size="icon"
            type="button"
            variant={'outline'}
          >
            <Maximize aria-hidden="true" size={16} />
            <span className="sr-only">Enter full screen</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
