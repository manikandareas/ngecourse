import { Link } from 'react-router';
import { Badge } from '~/components/ui/badge';

export function meta() {
    return [
        { title: 'NgeCourse | Courses' },
        { name: 'description', content: 'Courses page of NgeCourse!' },
    ];
}

export default function CoursesPage() {
    return (
        <div className='mx-auto w-full max-w-6xl px-6 py-20 sm:px-0'>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col items-start gap-4">
                    <div>
                        <Badge>Courses</Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                            Something new!
                        </h2>
                        <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
                            Managing a small business today is already tough.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {dummyCourses.map((course) => (
                        <CourseCard
                            description={course.description}
                            image={course.image}
                            key={course._id}
                            slug={course.slug}
                            title={course.title}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const CourseCard = ({
    title,
    description,
    image,
    slug,
}: {
    title: string;
    description: string;
    image: string;
    slug: string;
}) => {
    return (
        <Link to={`/courses/${slug}`}>
            <div className="flex flex-col gap-2">
                <img
                    alt={title}
                    className="mb-2 aspect-video rounded-md object-cover"
                    src={image}
                />
                <h3 className="text-xl tracking-tight">{title}</h3>
                <p className="text-base text-muted-foreground">{description}</p>
            </div>
        </Link>
    );
};

export const dummyCourses = [
    {
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
    },
    {
        _id: '2',
        _creationTime: Date.now(),
        title: 'React for Beginners',
        description:
            'Start building interactive UIs with React and understand its fundamentals.',
        image: 'https://codedex.io/images/html/html-parralax-combined.gif',
        trailerUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
        tags: ['react', 'frontend', 'javascript'],
        slug: 'react-for-beginners',
        isPublished: true,
        embedding: [],
        difficulty: 'beginner',
    },
    {
        _id: '3',
        _creationTime: Date.now(),
        title: 'Advanced CSS Techniques',
        description: 'Master layouts, animations, and responsive design with CSS.',
        image: 'https://codedex.io/images/css/css-course-banner.gif',
        trailerUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
        tags: ['css', 'design', 'frontend'],
        slug: 'advanced-css-techniques',
        isPublished: true,
        embedding: [],
        difficulty: 'intermediate',
    },
    {
        _id: '4',
        _creationTime: Date.now(),
        title: 'Node.js Essentials',
        description:
            'Understand backend development using Node.js and build scalable APIs.',
        image: 'https://codedex.io/images/javascript/javascript-course-banner.gif',
        trailerUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
        tags: ['nodejs', 'backend', 'javascript'],
        slug: 'nodejs-essentials',
        isPublished: true,
        embedding: [],
        difficulty: 'advanced',
    },
];
