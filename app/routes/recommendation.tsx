import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { CoursesQueryResult } from 'sanity.types';
import { toast } from 'sonner';
import { Button } from '~/components/ui/3d-button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import { NavbarLogo } from '~/components/ui/resizable-navbar';
import { CourseCard } from '~/features/courses/components/course-card';
import { enrollmentQueryOption } from '~/features/enrollments/hooks/get-enrollment';
import { usecaseEnrollments } from '~/features/enrollments/usecase';
import { RecommendationError } from '~/features/recommendation/components/error-states';
import { LoadingCourseCards } from '~/features/recommendation/components/loading-course-cards';
import {
  ProgressDots,
  RecommendationStatus,
} from '~/features/recommendation/components/recommendation-status';
import {
  CourseCardEntrance,
  SuccessCelebration,
  useConfettiCelebration,
} from '~/features/recommendation/components/success-celebration';
import { RECOMMENDATION_COPY } from '~/features/recommendation/constants/copy';
import { recommendationQuery } from '~/features/recommendation/data';
import { useLiveRecommendationData } from '~/features/recommendation/hooks/use-live-recommendation';
import type { RecommendationData } from '~/features/recommendation/types';
import { client } from '~/lib/sanity-client';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/recommendation';

export function meta() {
  return [
    { title: RECOMMENDATION_COPY.meta.title },
    { name: 'description', content: RECOMMENDATION_COPY.meta.description },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);

  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  if (!currentSession._id) {
    throw new Response('User ID is missing', { status: 400 });
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
    props.loaderData.session._id as string,
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
        enrollmentQueryOption(
          props.loaderData.session._id as string,
          variable.courseSlug
        )
      );
    },
    onError: (error) => {
      toast.error(
        `Enrollment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    },
    onSuccess: (res, variable) => {
      if (res.success) {
        document.getElementById('dialog-close')?.click();
        toast.success('Successfully enrolled in the course!');
        navigate(`/courses/${variable.courseSlug}`);
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
    <div className="relative flex min-h-screen items-center overflow-x-hidden">
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
                    {RECOMMENDATION_COPY.success.title}
                  </motion.h1>
                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-2xl text-base/7 text-text-secondary"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: confetti.isComplete ? 0.6 : 0.1 }}
                  >
                    {data.reason
                      ? data.reason
                      : RECOMMENDATION_COPY.success.fallbackDescription}
                  </motion.p>
                </div>

                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: confetti.isComplete ? 0.7 : 0.2 }}
                >
                  <Carousel className="w-full" setApi={setApi}>
                    <CarouselContent className="gap-4">
                      {data.courses.map((course, index: number) => (
                        <CarouselItem className="lg:basis-1/2" key={course._id}>
                          <CourseCardEntrance
                            delay={
                              confetti.isComplete
                                ? 0.8 + index * 0.1
                                : 0.3 + index * 0.1
                            }
                            isVisible={true}
                          >
                            <CourseCard
                              {...(course as CoursesQueryResult[number])}
                              isLoading={isPending}
                              onEnroll={() =>
                                handleEnroll(course.slug as string)
                              }
                              withEnrollButton
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
              {RECOMMENDATION_COPY.cta.skipButton} <ArrowRight />
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
  );
}
