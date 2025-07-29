import type {
  ChapterQueryResult,
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { useContentProgression } from '~/features/courses/hooks/content-progression';
import { cn } from '~/lib/utils';
import { ChapterItem } from './chapter-item';

export function DetailContentList({
  course,
  enrollment,
}: {
  course: CourseContentsQueryResult;
  enrollment: EnrollmentQueryResult | null;
}) {
  const { contentProgression, courseProgress } = useContentProgression(
    course,
    enrollment
  );
  const { completedCount, totalCount, progressPercentage } = courseProgress;

  return (
    <div className="space-y-6">
      {/* Course Progress Header */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-2xl text-gray-900">
                {course?.title}
              </h2>
              <p className="mt-1 text-gray-600">{course?.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                {course?.difficulty || 'Beginner'}
              </Badge>
              <Badge variant="outline">
                {course?.chapters?.length || 0} Chapters
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Course Progress</span>
              <span>
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <Progress className="h-2" value={progressPercentage} />
          </div>
        </div>
      </Card>

      {/* Learning Path */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-gray-900 text-xl">
            Learning Path
          </h3>
          <p className="text-gray-600 text-sm">
            Follow this structured path to master the course content
          </p>
        </div>

        <div className="relative">
          {/* Enhanced path line */}
          <div
            className={cn(
              'absolute top-0 bottom-0 left-[1.35rem] w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200'
            )}
          />

          <div className="space-y-4">
            {course?.chapters?.map((chapter, index) => (
              <ChapterItem
                chapter={chapter as ChapterQueryResult}
                chapterNumber={index + 1}
                contentProgression={contentProgression}
                isLast={
                  Array.isArray(course?.chapters)
                    ? index === course?.chapters.length - 1
                    : false
                }
                key={chapter._id}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
