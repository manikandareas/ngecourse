import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '~/components/ui/3d-button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import { NavbarLogo } from '~/components/ui/resizable-navbar';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import { RecommendationCard } from '~/features/recommendation/components/recommendation-card';
import { useRecommendation } from '~/features/recommendation/hooks/get-recommendation';
import { urlFor } from '~/lib/sanity-client';
import { cn } from '~/lib/utils';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/recommendation';

export function meta() {
  return [
    { title: 'Genii | Recommendation' },
    { name: 'description', content: 'Recommendation course for you' },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);

  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return { session: currentSession };
}

export default function RecommendationPage(props: Route.ComponentProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/');
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      courseSlug,
      userId,
    }: {
      courseSlug: string;
      userId: string;
    }) => usecaseEnrollments.enroll(courseSlug, userId),
    onSettled: (_, __, variable) => {
      queryClient.invalidateQueries(
        enrollmentQueryOption(props.loaderData.session._id, variable.courseSlug)
      );
    },
    onError: (error) => {
      toast.error(
        `Enrollment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    },
    onSuccess: (res) => {
      if (res.success) {
        document.getElementById('dialog-close')?.click();
        toast.success('Successfully enrolled in the course!');
        navigate('/');
        return;
      }

      toast.error(`Enrollment failed: ${res.error?.message}`);
    },
  });

  const handleEnroll = (courseSlug: string) => {
    if (!props.loaderData.session._id) {
      toast.error('Course slug or user ID is missing.', {
        description: 'You need to log in to enroll in a course.',
      });
      return;
    }
    mutate({
      courseSlug,
      userId: props.loaderData.session._id,
    });
  };

  const {
    data,
    isLoading,
    isError,
    error: recommendationError,
  } = useRecommendation(props.loaderData.session._id);

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);
  }, [api, current]);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {recommendationError.message}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 xl:px-0">
      <div className="w-full py-10">
        <div className="container mx-auto">
          <div className="flex flex-col">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mb-2 flex w-fit items-center space-x-2 rounded-full',
                'bg-primary/20 ring-1 ring-accent',
                'whitespace-pre px-2 py-1'
              )}
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div
                className={cn(
                  'w-fit rounded-full bg-secondary px-2 py-0.5',
                  'font-medium text-primary text-xs sm:text-sm',
                  'text-center'
                )}
              >
                📣 Recommendation
              </div>
              <p className="font-medium text-primary text-xs sm:text-sm">
                Courses
              </p>
              <ArrowRight className="ml-1 text-primary" size={12} />
            </motion.div>
            <h2 className="mb-4 text-left font-regular text-3xl tracking-tighter md:text-5xl lg:max-w-xl">
              Belajar jadi makin seru karena kami ngerti kamu.
            </h2>
            <p className="mb-10 max-w-lg text-left text-base text-muted-foreground">
              Kami menawarkan berbagai kursus yang dirancang khusus untuk
              memenuhi kebutuhan belajarmu.
            </p>
            <Carousel className="w-full" setApi={setApi}>
              <CarouselContent>
                {data.courses?.map((course, index) => (
                  <CarouselItem
                    className=" lg:basis-1/2"
                    key={index.toString()}
                  >
                    <RecommendationCard
                      description={course.description as string}
                      difficulty={
                        course.difficulty as
                          | 'beginner'
                          | 'intermediate'
                          | 'advanced'
                      }
                      image={urlFor(course.thumbnail ?? '')?.url() as string}
                      isLoading={isPending}
                      onEnroll={() => handleEnroll(course.slug as string)}
                      slug={course.slug as string}
                      title={course.title as string}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <NavbarLogo />
        <Button onClick={handleSkip} type="button" variant={'secondary'}>
          Skip for now <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
