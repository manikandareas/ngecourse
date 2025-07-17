import { CourseInfo } from '~/features/courses/detail/course-info';
import { HeroSection } from '~/features/courses/detail/hero-section';
import { PathSection } from '~/features/courses/detail/path-section';

export default function CourseDetailPage() {
    return (
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 xl:px-0">
            <HeroSection {...dummyCourse} />

            {/* Main Content */}
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8 md:flex-row">
                <PathSection />
                {/* Sidebar */}
                <aside className="w-full flex-shrink-0 md:w-80 lg:w-96">
                    <div className="slide-in-from-right-4 animate-in space-y-6 duration-500">
                        <div className="fade-in-50 animate-in delay-100 duration-700">
                            <CourseInfo.Trailer
                                trailerUrl="https://www.youtube.com/embed/fP4h-_UpYRc?si=qmPnaTzH4iaagiYr"
                                youtubeId="fP4h-_UpYRc"
                            />
                        </div>
                        <div className="fade-in-50 animate-in delay-300 duration-700">
                            <CourseInfo.HelpCard />
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

const dummyCourse = {
    _id: '1',
    _creationTime: Date.now(),
    title: 'Introduction to TypeScript',
    description:
        'Learn the basics of TypeScript and how to use it in modern web development.',
    image: 'https://codedex.io/images/python/python-animated.gif',
    trailerUrl: 'https://www.youtube.com/watch?v=BCg4U1FzODs',
    tags: ['typescript', 'javascript', 'web'],
    slug: 'introduction-to-typescript',
    isPublished: true,
    embedding: [],
    difficulty: 'beginner',
};
