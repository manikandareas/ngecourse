import { BookOpen, SearchIcon } from 'lucide-react';
import type { CoursesQueryResult } from 'sanity.types';
import { COURSES_COPY } from '../constants/copy';
import { CourseCard } from './course-card';

interface CourseListSectionProps {
  filteredCourses: CoursesQueryResult;
  searchQuery: string;
  onClearSearch: () => void;
  onSearchChange: (query: string) => void;
}

export function CourseListSection({
  filteredCourses,
  searchQuery,
  onClearSearch,
  onSearchChange,
}: CourseListSectionProps) {
  return (
    <section>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/5 px-3 py-1.5">
            <BookOpen className="h-3 w-3 text-green-500" />
            <span className="field-label">{COURSES_COPY.courseList.badge}</span>
          </div>
          <div className="mb-6">
            <h2 className="font-light text-3xl text-text-primary tracking-tight sm:text-4xl">
              {searchQuery
                ? COURSES_COPY.courseList.titles.search(filteredCourses.length)
                : COURSES_COPY.courseList.titles.default}
            </h2>
            <p className="mt-2 max-w-4xl text-base/7 text-text-secondary">
              {searchQuery
                ? COURSES_COPY.courseList.descriptions.search(
                    filteredCourses.length,
                    searchQuery
                  )
                : COURSES_COPY.courseList.descriptions.default}
            </p>
          </div>
          <div className="relative max-w-md">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 z-10 size-5 text-text-muted" />
            <input
              className="glass-input h-12 pl-10 text-base"
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={COURSES_COPY.courseList.searchPlaceholder}
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
            {COURSES_COPY.emptyStates.noSearchResults.title}
          </h3>
          <p className="mb-6 text-text-secondary">
            {COURSES_COPY.emptyStates.noSearchResults.description}
          </p>
          <button className="btn-ghost" onClick={onClearSearch} type="button">
            {COURSES_COPY.emptyStates.noSearchResults.clearButton}
          </button>
        </div>
      )}

      {!searchQuery && filteredCourses.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
            📚
          </div>
          <h3 className="mb-3 font-light text-text-primary text-xl tracking-tight">
            {COURSES_COPY.emptyStates.noCourses.title}
          </h3>
          <p className="text-text-secondary">
            {COURSES_COPY.emptyStates.noCourses.description}
          </p>
        </div>
      )}
    </section>
  );
}
