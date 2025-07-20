import {
  ArrowRightIcon,
  Award,
  BookOpen,
  Clock,
  InfinityIcon,
} from 'lucide-react';
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
import type { LmsTopics } from '~/types/directus';
import { CourseBadge } from './hero-section';

interface IEnrollDialogProps {
  id: string;
  title: string;
  description: string;
  image: string;
  topics: LmsTopics[];
  difficulty: string;
  duration?: string;
  lessonsCount?: number;
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
}: IEnrollDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group" size="lg">
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
              <CourseBadge difficulty={difficulty} />
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
          <Button
            className="w-full bg-primary transition-colors hover:bg-primary/90"
            size="lg"
          >
            Enroll Now - Free
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollDialog;
