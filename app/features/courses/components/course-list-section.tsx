import { BookOpen, SearchIcon } from 'lucide-react';
import type { CoursesQueryResult } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
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
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <Badge className="bg-background" variant="outline">
            <BookOpen className="mr-1 h-3 w-3" />
            All Courses
          </Badge>
          <div>
            <h2 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
              {searchQuery
                ? `Search Results (${filteredCourses.length})`
                : 'Explore All Courses'}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {searchQuery
                ? `Found ${filteredCourses.length} courses matching "${searchQuery}"`
                : 'Discover our complete collection of expert-led courses'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="hidden items-center gap-8 lg:flex">
            <div className="text-center">
              <div className="font-bold text-2xl text-foreground">
                {courses?.length || 0}
              </div>
              <div className="text-muted-foreground text-sm">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-foreground">12k+</div>
              <div className="text-muted-foreground text-sm">Students</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-foreground">4.8</div>
              <div className="text-muted-foreground text-sm">Avg Rating</div>
            </div>
          </div>
          <div className="relative w-auto">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 z-10 size-5" />
            <Input
              className="h-12 border-border/50 bg-background/80 pl-10 text-base backdrop-blur-sm focus:border-primary/50"
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      )}

      {searchQuery && filteredCourses.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 font-semibold text-foreground text-xl">
            No courses found
          </h3>
          <p className="mb-6 text-muted-foreground">
            Try adjusting your search terms or browse all courses
          </p>
          <Button onClick={onClearSearch} variant="outline">
            Clear Search
          </Button>
        </div>
      )}

      {!searchQuery && filteredCourses.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">📚</div>
          <h3 className="mb-2 font-semibold text-foreground text-xl">
            No courses available
          </h3>
          <p className="text-muted-foreground">
            Check back soon for new courses!
          </p>
        </div>
      )}
    </section>
  );
}
