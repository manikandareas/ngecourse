import { Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type {
  GetCourseContentsQueryResult,
  GetEnrollmentQueryResult,
} from 'sanity.types';
import { Button } from '~/components/ui/button';
import { CourseNavigation } from './course-navigation';

interface LearningLayoutProps {
  course: GetCourseContentsQueryResult;
  enrollment: GetEnrollmentQueryResult | null;
  children: ReactNode;
}

export function LearningLayout({
  course,
  enrollment,
  children,
}: LearningLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:block">
        <CourseNavigation course={course} enrollment={enrollment} />
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileNavOpen && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMobileNavOpen(false);
            }
          }}
          type="button"
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <CourseNavigation
          className="h-screen w-96 shadow-xl"
          course={course}
          enrollment={enrollment}
        />
        {/* Close button */}
        <Button
          className="absolute top-4 right-4 z-10 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setIsMobileNavOpen(false)}
          size="sm"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <Button
              className="h-9 w-9 p-0"
              onClick={() => setIsMobileNavOpen(true)}
              size="sm"
              variant="ghost"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
            <h1 className="truncate font-semibold text-lg">{course?.title}</h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        <div className="container mx-auto mb-28 max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
