import { Award, BookOpen, Clock, InfinityIcon, Loader2 } from 'lucide-react';
import type { Topic } from 'sanity.types';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';
import { COURSE_DETAIL_COPY } from '../constants/course-detail-copy';
import { CourseBadge } from './course-badge';

interface IDetailEnrollDialogProps {
  id: string;
  title: string;
  description: string;
  image: string;
  topics: Topic[];
  difficulty: 'advanced' | 'beginner' | 'intermediate' | null;
  duration?: string;
  lessonsCount?: number;
  slug?: string;
  onEnroll: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

interface CourseFeatureProps {
  icon: React.ElementType;
  text: string;
}

const CourseFeature = ({ icon: Icon, text }: CourseFeatureProps) => (
  <div className="flex items-center gap-2 text-muted-foreground text-sm">
    <Icon className="size-4" />
    <span>{text}</span>
  </div>
);

const DetailEnrollDialog = ({
  title,
  description,
  image,
  difficulty,
  topics,
  duration = '10 hours',
  lessonsCount = 15,
  onEnroll,
  isLoading = false,
  children,
}: IDetailEnrollDialogProps) => {
  return (
    <Dialog>
      <DialogClose className="sr-only" id="dialog-close" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[42rem]">
        <DialogHeader className="space-y-4">
          <div className="space-y-2">
            <DialogTitle className="font-bold text-2xl tracking-tight">
              {COURSE_DETAIL_COPY.enrollDialog.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <CourseBadge difficulty={difficulty || 'beginner'} />
              <span className="text-muted-foreground text-sm">
                {difficulty} Level
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {COURSE_DETAIL_COPY.enrollDialog.subtitle}
            </p>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img alt={title} className="size-full object-cover" src={image} />
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <CourseFeature icon={Clock} text={COURSE_DETAIL_COPY.enrollDialog.features.duration(duration)} />
            <CourseFeature icon={BookOpen} text={COURSE_DETAIL_COPY.enrollDialog.features.lessons(lessonsCount)} />
            <CourseFeature
              icon={Award}
              text={topics.length > 0 ? topics.map((topic) => topic.title).join(', ') : COURSE_DETAIL_COPY.enrollDialog.features.topics}
            />
            <CourseFeature icon={InfinityIcon} text={COURSE_DETAIL_COPY.enrollDialog.features.access} />
          </div>

          <Separator className="my-2" />

          <div className="space-y-2">
            <h4 className="font-medium">{COURSE_DETAIL_COPY.enrollDialog.aboutTitle}</h4>
            <DialogDescription className="text-foreground/80">
              {COURSE_DETAIL_COPY.enrollDialog.aboutDescription}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="border-t px-6 py-4">
          <Button
            className="w-full bg-primary transition-colors hover:bg-primary/90"
            disabled={isLoading}
            onClick={onEnroll}
            size="lg"
            type="button"
          >
            {isLoading ? (
              <>
                {COURSE_DETAIL_COPY.enrollDialog.ctaProcessing} <Loader2 className="animate-spin" />
              </>
            ) : (
              COURSE_DETAIL_COPY.enrollDialog.ctaPrimary
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailEnrollDialog;
