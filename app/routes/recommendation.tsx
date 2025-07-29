import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/3d-button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import { NavbarLogo } from '~/components/ui/resizable-navbar';
import { CourseCard } from '~/features/courses/components/course-card';
import { useRecommendation } from '~/features/recommendation/hooks/get-recommendation';
import { urlFor } from '~/lib/sanity-client';
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

  const { data, isLoading, isError, error } = useRecommendation(
    props.loaderData.session._id
  );

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 xl:px-0">
      <div className="w-full py-20">
        <div className="container mx-auto">
          <div className="flex flex-col">
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
                    <CourseCard
                      description={course.description as string}
                      difficulty={
                        course.difficulty as
                          | 'beginner'
                          | 'intermediate'
                          | 'advanced'
                      }
                      image={urlFor(course.thumbnail)?.url() as string}
                      slug={course.slug?.current as string}
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
        <Button variant={'secondary'}>
          Skip for now <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
