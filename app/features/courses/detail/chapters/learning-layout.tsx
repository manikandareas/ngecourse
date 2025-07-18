import type { ReactNode } from 'react';
import { CourseNavigation } from './course-navigation';

interface Course {
  id: string;
  title: string;
  slug: string;
  chapters: Array<{
    id: string;
    title: string;
    slug: string;
    contents: Array<{
      id: string;
      title: string;
      type: 'lesson' | 'quiz';
      slug: string;
      completed?: boolean;
    }>;
    completed?: boolean;
  }>;
}

interface LearningLayoutProps {
  course: Course;
  children: ReactNode;
}

export function LearningLayout({ course, children }: LearningLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:block">
        <CourseNavigation course={course} />
      </div>

      {/* Mobile Navigation - Shown only on mobile */}
      <div className="lg:hidden">
        <CourseNavigation
          className="-translate-x-full fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out"
          course={course}
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
