import { HeroSection } from '~/features/courses/detail/hero-section';

export default function CourseDetailPage() {
    return (
        <div className='mx-auto w-full max-w-6xl px-6 py-20 xl:px-0'>
            <HeroSection {...dummyCourse} />
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
