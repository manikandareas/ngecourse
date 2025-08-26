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
      <div className="flex flex-col items-center gap-6">
        <Badge 
          className="bg-white/5 transition-colors"
          variant="secondary"
          style={{
            color: 'var(--text-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <Gamepad className="mr-1.5" /> Contents
        </Badge>
        <h2 className="max-w-lg text-center text-3xl md:text-4xl font-light tracking-tight leading-[1.1] xl:max-w-2xl" style={{color: 'var(--text-primary)'}}>
          What's in this course?
        </h2>
        <p className="max-w-2xl text-pretty text-center text-base/7 leading-relaxed" style={{color: 'var(--text-secondary)'}}>
          {course?.description}
        </p>
      </div>

      <div className="flex w-full flex-col-reverse items-start gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <h3 className="inline-flex items-center gap-2 text-lg font-medium" style={{color: 'var(--text-primary)'}}>
            <FolderTree size={18} />
            Course Structure
          </h3>
          <div className="bg-white/3 rounded-xl p-4 border" style={{borderColor: 'var(--border)'}}>
            <CourseFileTree
              className="h-fit border-none"
              course={course}
              enrollment={enrollment}
            />
          </div>
        </div>
        <div className="w-px mx-6 hidden lg:block" style={{backgroundColor: 'var(--border)'}}></div>
        <div className="flex-1">
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
      </div>
    </section>
  );
}

export default DetailContents;
