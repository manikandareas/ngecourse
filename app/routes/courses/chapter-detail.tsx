import { BookOpen, Clock } from 'lucide-react';
import { redirect } from 'react-router';
import { Badge } from '~/components/ui/badge';
import { getCurrentSession } from '~/root';
import { usecaseEnrollments } from '~/usecase/enrollments';
import type { Route } from './+types/chapter-detail';

export async function action(args: Route.ActionArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const formData = await args.request.formData();

  const courseId = formData.get('courseId') as string;
  const chapterId = formData.get('chapterId') as string;
  const contentId = formData.get('contentId') as string;
  const nextPath = formData.get('nextPath') as string;

  const response = await usecaseEnrollments.addProgression({
    userId: currentSession.id,
    courseId,
    chapterId,
    contentId: +contentId,
    nextPath,
  });

  if (!response?.isCompleted) {
    return redirect(response?.nextPath || '');
  }
}

export default function ChapterDetailPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Chapter Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
          <BookOpen className="h-4 w-4" />
          <span>Chapter</span>
        </div>

        <h1 className="font-bold text-2xl text-foreground leading-tight sm:text-3xl">
          Chapter Title
        </h1>

        <p className="text-base text-muted-foreground sm:text-lg">
          Chapter Description
        </p>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {/* {chapterData.duration} */} 10
            </span>
          </div>
          <Badge className="text-xs sm:text-sm" variant="secondary">
            {/* {chapterData.difficulty} */} Hard
          </Badge>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="border-t pt-4 sm:pt-6">
        {/* <MarkdownRenderer content={chapterData.content} /> */}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6 sm:pt-8">
        <div className="text-muted-foreground text-xs sm:text-sm">
          Continue with the lessons and quizzes in this chapter
        </div>
      </div>
    </div>
  );
}
