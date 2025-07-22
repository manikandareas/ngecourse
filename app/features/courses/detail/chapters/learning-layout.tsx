import type { ReactNode } from 'react';
import type { CourseWithContents } from '~/data/courses';
import type { LmsEnrollments } from '~/types/directus';
import { CourseNavigation } from './course-navigation';

interface LearningLayoutProps {
  course: CourseWithContents;
  enrollment: LmsEnrollments | null;
  children: ReactNode;
}

export function LearningLayout({ course, enrollment, children }: LearningLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:block">
        <CourseNavigation course={course} enrollment={enrollment} />
      </div>

      {/* Mobile Navigation - Shown only on mobile */}
      <div className="lg:hidden">
        <CourseNavigation
          className="-translate-x-full fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out"
          course={course}
          enrollment={enrollment}
        />
      </div>

      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="container mx-auto mb-28 max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
