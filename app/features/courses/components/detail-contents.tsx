import { FolderTree, Gamepad } from 'lucide-react';
import type { CourseContentsQueryResult, EnrollmentQueryResult } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { CourseFileTree } from './course-filee-tree';
import LearningOutcomes from './learning-outcomes';

interface DetailContentsProps {
  course: CourseContentsQueryResult;
  enrollment: EnrollmentQueryResult | null;
}

export function DetailContents({ course, enrollment }: DetailContentsProps) {
  return (
    <section className="flex flex-col items-center gap-12">
      <div className="flex flex-col items-center gap-4">
        <Badge variant="secondary">
          <Gamepad className="mr-1.5" /> Contents
        </Badge>
        <h2 className="max-w-lg text-center font-semibold text-3xl xl:max-w-2xl xl:text-4xl">
          What's in this course?
        </h2>
        <p className=" max-w-2xl text-pretty text-center text-base text-muted-foreground leading-relaxed">
          {course?.description}
        </p>
      </div>

      <div className="flex w-full flex-col-reverse items-start gap-6 lg:flex-row lg:divide-x">
        <div>
          <h3 className="inline-flex items-center gap-2 font-semibold text-lg lg:px-8">
            <FolderTree size={18} />
            Course Structure
          </h3>
          <CourseFileTree
            className="h-fit border-none"
            course={course}
            enrollment={enrollment}
          />
        </div>
        <LearningOutcomes
          className="h-full"
          items={[
            'Build 16 web development projects for your portfolio, ready to apply for junior developer jobs.',
            'After the course you will be able to build ANY website you want.',
            'Work as a freelance web developer.',
            'Master backend development with Node.',
            'Learn the latest technologies, including Javascript, React, Node and even Web3 development.',
            'Build fully-fledged websites and web apps for your startup or business.',
            'Master frontend development with React.',
            'Learn professional developer best practices.',
          ]}
          title="Yang akan Anda pelajari"
        />
      </div>
    </section>
  );
}

export default DetailContents;
