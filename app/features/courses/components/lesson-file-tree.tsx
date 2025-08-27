import type React from 'react';
import type {
  CourseContentsQueryResult,
  EnrollmentQueryResult,
} from 'sanity.types';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { CourseFileTree } from './course-filee-tree';

interface LessonFileTreeProps {
  course: CourseContentsQueryResult;
  enrollment: EnrollmentQueryResult;
  children: React.ReactNode;
}

export const LessonFileTree: React.FC<LessonFileTreeProps> = (props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent
        className="glass-card h-screen w-full overflow-hidden md:w-[26rem]"
        side="left"
      >
        <ScrollArea>
          <SheetHeader>
            <SheetTitle className="max-w-[18rem] truncate text-wrap" style={{color: 'var(--text-primary)'}}>
              {props.course?.title}
            </SheetTitle>

            <SheetDescription className="sr-only">
              {props.course?.description}
            </SheetDescription>
          </SheetHeader>
          <CourseFileTree
            className="pb-20"
            course={props.course}
            enrollment={props.enrollment}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
