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
import { PageBackground } from '~/components/ui/page-background';
import { NavbarLogo } from '~/components/ui/resizable-navbar';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import { RecommendationError } from '~/features/recommendation/components/error-states';
import { LoadingCourseCards } from '~/features/recommendation/components/loading-course-cards';
import { RecommendationCard } from '~/features/recommendation/components/recommendation-card';
import {
  ProgressDots,
  RecommendationStatus,
} from '~/features/recommendation/components/recommendation-status';
import {
  CourseCardEntrance,
  SuccessCelebration,
  useConfettiCelebration,
} from '~/features/recommendation/components/success-celebration';
import { recommendationQuery } from '~/features/recommendation/data';
import { useLiveRecommendationData } from '~/features/recommendation/hooks/use-live-recommendation';
import type { RecommendationData } from '~/features/recommendation/types';
import { client, urlFor } from '~/lib/sanity-client';
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

  // Load initial recommendation data for SSR hydration using direct Sanity client
  // This ensures consistency with our live client implementation
  const initialData = await client.fetch<RecommendationData>(
    recommendationQuery,
    { userId: currentSession._id }
  );

  return {
    session: currentSession,
    initial: initialData, // Pass the direct data from Sanity client
  };
}

export default function RecommendationPage(props: Route.ComponentProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [timeoutCount, setTimeoutCount] = useState(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confetti = useConfettiCelebration();

  // Use the new live recommendation hook with initial data for proper SSR hydration
  // This replaces @sanity/react-loader with our custom Live Content API implementation
  // providing real-time updates in both development and production
  const {
    data,
    status,
    message,
    error: recommendationError,
  } = useLiveRecommendationData(
    props.loaderData.session._id,
    props.loaderData.initial
  );

  const handleSkip = () => {
    navigate('/');
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  const handleRetry = () => {
    // In a real implementation, you might want to trigger a new recommendation request
    // For now, we'll just reset the error state and let polling continue
    setTimeoutCount(0);
    // Trigger a manual refetch could be added here if needed
  };

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

  // Trigger confetti when recommendations complete successfully
  useEffect(() => {
    if (status === 'completed' && data?.courses && data.courses.length > 0) {
      confetti.trigger();
    }
  }, [status, data?.courses, confetti]);

  // Auto-carousel for completed recommendations
  useEffect(() => {
    if (!api || status !== 'completed') return;

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);
  }, [api, current, status]);

  // Handle timeout after extended processing
  useEffect(() => {
    if (status === 'processing') {
      const timeout = setTimeout(() => {
        setTimeoutCount((prev) => prev + 1);
      }, 30_000); // 30 seconds

      return () => clearTimeout(timeout);
    }
  }, [status]);

  return (
    <PageBackground className="overflow-x-hidden" variant="purple-cyan">
      <div className="relative flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-8 xl:px-0">
          <div className="container mx-auto space-y-8">
            {/* Loading States */}
            {(status === 'pending' || status === 'processing') && (
              <div className="space-y-8">
                <RecommendationStatus message={message} status={status} />

                <ProgressDots className="flex justify-center" status={status} />

                {/* Show timeout warning after extended processing */}
                {status === 'processing' && timeoutCount > 0 && (
                  <RecommendationError
                    onBrowseCourses={handleBrowseCourses}
                    onSkip={handleSkip}
                    type="timeout"
                  />
                )}

                {/* Loading skeleton */}
                <LoadingCourseCards count={2} />
              </div>
            )}

            {/* Error States */}
            {status === 'failed' && (
              <RecommendationError
                onBrowseCourses={handleBrowseCourses}
                onRetry={handleRetry}
                type={recommendationError ? 'network' : 'failed'}
              />
            )}

            {/* Empty Results */}
            {status === 'completed' &&
              (!data?.courses || data.courses.length === 0) && (
                <RecommendationError
                  onBrowseCourses={handleBrowseCourses}
                  type="empty"
                />
              )}

            {/* Success State with Recommendations */}
            {status === 'completed' &&
              data?.courses &&
              data.courses.length > 0 && (
                <>
                  <div className="space-y-4 text-center">
                    <motion.h1
                      animate={{ opacity: 1, y: 0 }}
                      className="font-light text-3xl text-text-primary leading-[1.1] tracking-tight md:text-5xl"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ delay: confetti.isComplete ? 0.5 : 0 }}
                    >
                      Your Learning Journey Awaits!
                    </motion.h1>
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      className="mx-auto max-w-2xl text-base/7 text-text-secondary"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ delay: confetti.isComplete ? 0.6 : 0.1 }}
                    >
                      {data.reason
                        ? data.reason
                        : "We've curated these courses specifically for your learning goals and experience level."}
                    </motion.p>
                  </div>

                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: confetti.isComplete ? 0.7 : 0.2 }}
                  >
                    <Carousel className="w-full" setApi={setApi}>
                      <CarouselContent>
                        {data.courses.map((course, index: number) => (
                          <CarouselItem
                            className="lg:basis-1/2"
                            key={course._id}
                          >
                            <CourseCardEntrance
                              delay={
                                confetti.isComplete
                                  ? 0.8 + index * 0.1
                                  : 0.3 + index * 0.1
                              }
                              isVisible={true}
                            >
                              <RecommendationCard
                                description={course.description as string}
                                difficulty={
                                  course.difficulty === 'beginner' ||
                                  course.difficulty === 'intermediate' ||
                                  course.difficulty === 'advanced'
                                    ? course.difficulty
                                    : 'beginner' // Fallback for invalid/null values
                                }
                                duration="TBD" // TODO: Add duration to course data
                                image={
                                  urlFor(
                                    course.thumbnail ?? ''
                                  )?.url() as string
                                }
                                isLoading={isPending}
                                lessonsCount={0} // TODO: Add lessons count to course data
                                onEnroll={() =>
                                  handleEnroll(course.slug as string)
                                }
                                slug={course.slug as string}
                                title={course.title as string}
                                topics={course.topics ?? []}
                              />
                            </CourseCardEntrance>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </motion.div>
                </>
              )}

            {/* Bottom Navigation */}
            <motion.div
              animate={{ opacity: 1 }}
              className="flex items-center justify-between pt-8"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              <NavbarLogo />
              <Button onClick={handleSkip} type="button" variant="secondary">
                Skip for now <ArrowRight />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Success Celebration */}
        <SuccessCelebration
          onComplete={confetti.handleComplete}
          trigger={confetti.shouldCelebrate}
        />
      </div>
    </PageBackground>
  );
}
