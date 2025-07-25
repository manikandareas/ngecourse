import {
  ArrowRightIcon,
  Award,
  BookOpen,
  Clock,
  InfinityIcon,
  Loader2,
} from 'lucide-react';
import { useFetcher } from 'react-router';
import type { Topic } from 'sanity.types';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';
import type { action } from '~/routes/courses/detail';
import { CourseBadge } from './hero-section';

interface IEnrollDialogProps {
  id: string;
  title: string;
  description: string;
  image: string;
  topics: Topic[];
  difficulty: 'advanced' | 'beginner' | 'intermediate' | null;
  duration?: string;
  lessonsCount?: number;
  slug?: string;
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

const EnrollDialog = ({
  title,
  description,
  image,
  difficulty,
  topics,
  duration = '10 hours',
  lessonsCount = 15,
  slug,
}: IEnrollDialogProps) => {
  const fetcher = useFetcher<typeof action>();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group" size="lg" type="button">
          Start Learning Now
          <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[42rem]">
        <DialogHeader className="space-y-4">
          <div className="space-y-2">
            <DialogTitle className="font-bold text-2xl tracking-tight">
              Enroll in {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <CourseBadge difficulty={difficulty || 'beginner'} />
              <span className="text-muted-foreground text-sm">
                {difficulty} Level
              </span>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img alt={title} className="size-full object-cover" src={image} />
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <CourseFeature icon={Clock} text={duration} />
            <CourseFeature icon={BookOpen} text={`${lessonsCount} lessons`} />
            <CourseFeature
              icon={Award}
              text={topics.map((topic) => topic.title).join(', ')}
            />
            <CourseFeature icon={InfinityIcon} text="Lifetime Access" />
          </div>

          <Separator className="my-2" />

          <div className="space-y-2">
            <h4 className="font-medium">About This Course</h4>
            <DialogDescription className="text-foreground/80">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="border-t px-6 py-4">
          <fetcher.Form action={`/courses/${slug}`} method="POST">
            <Button
              className="w-full bg-primary transition-colors hover:bg-primary/90"
              disabled={fetcher.state !== 'idle'}
              size="lg"
              type="submit"
            >
              {fetcher.state === 'idle' ? (
                'Enroll Now - Free'
              ) : (
                <>
                  Processing enrollment <Loader2 className="animate-spin" />
                </>
              )}
            </Button>
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollDialog;
