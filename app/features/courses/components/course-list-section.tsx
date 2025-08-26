import { BookOpen, SearchIcon } from 'lucide-react';
import type { CoursesQueryResult } from 'sanity.types';
import { CourseCard } from './course-card';

interface CourseListSectionProps {
  courses: CoursesQueryResult;
  filteredCourses: CoursesQueryResult;
  searchQuery: string;
  onClearSearch: () => void;
  onSearchChange: (query: string) => void;
}

export function CourseListSection({
  courses,
  filteredCourses,
  searchQuery,
  onClearSearch,
  onSearchChange,
}: CourseListSectionProps) {
  return (
    <section className="glass-card">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/5 px-3 py-1.5">
            <BookOpen className="h-3 w-3 text-accent" />
            <span className="field-label">All Courses</span>
          </div>
          <div>
            <h2 className="font-light text-3xl text-text-primary tracking-tight sm:text-4xl">
              {searchQuery
                ? `Search Results (${filteredCourses.length})`
                : 'Explore All Courses'}
            </h2>
            <p className="mt-2 text-base/7 text-text-secondary">
              {searchQuery
                ? `Found ${filteredCourses.length} courses matching "${searchQuery}"`
                : 'Discover our complete collection of expert-led courses'}
            </p>
          </div>
        </div>

        {/* Stats and Search */}
        <div className="space-y-4">
          <div className="hidden items-center gap-8 lg:flex">
            <div className="text-center">
              <div className="font-medium text-2xl text-text-primary">
                {courses?.length || 0}
              </div>
              <div className="field-help">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-2xl text-text-primary">12k+</div>
              <div className="field-help">Students</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-2xl text-text-primary">4.8</div>
              <div className="field-help">Avg Rating</div>
            </div>
          </div>
          <div className="relative">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 z-10 size-5 text-text-muted" />
            <input
              className="glass-input h-12 pl-10 text-base"
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search courses..."
              type="text"
              value={searchQuery}
            />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      )}

      {searchQuery && filteredCourses.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
            🔍
          </div>
          <h3 className="mb-3 font-light text-text-primary text-xl tracking-tight">
            No courses found
          </h3>
          <p className="mb-6 text-text-secondary">
            Try adjusting your search terms or browse all courses
          </p>
          <button className="btn-ghost" onClick={onClearSearch} type="button">
            Clear Search
          </button>
        </div>
      )}

      {!searchQuery && filteredCourses.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
            📚
          </div>
          <h3 className="mb-3 font-light text-text-primary text-xl tracking-tight">
            No courses available
          </h3>
          <p className="text-text-secondary">
            Check back soon for new courses!
          </p>
        </div>
      )}
    </section>
  );
}
