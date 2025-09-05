import { QuizPage } from '~/features/quizzes/components/quiz-page';
import { QUIZ_COPY } from '~/features/quizzes/constants/copy';
import { dataQuizzes } from '~/features/quizzes/data';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/quiz';

export function meta({ data }: Route.MetaArgs) {
  const quizTitle = data?.quiz?.title || 'Quiz';
  return [
    { title: QUIZ_COPY.meta.title(quizTitle) },
    {
      name: 'description',
      content: data?.quiz?.description || QUIZ_COPY.meta.description(quizTitle),
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const { slug: courseSlug, chapterSlug, quizSlug } = args.params;
  if (!courseSlug) {
    throw new Response('Course slug is required', { status: 400 });
  }
  if (!chapterSlug) {
    throw new Response('Chapter slug is required', { status: 400 });
  }
  if (!quizSlug) {
    throw new Response('Quiz slug is required', { status: 400 });
  }

  // Get quiz and user attempts
  const quiz = await dataQuizzes.getQuizBySlug(quizSlug);
  const attempts = quiz
    ? await dataQuizzes.getUserQuizAttempts(currentSession._id, quiz._id)
    : [];

  return {
    quiz,
    attempts,
    courseSlug,
    chapterSlug,
    quizSlug,
    userId: currentSession._id,
  };
}

export default function QuizRoute(props: Route.ComponentProps) {
  const data = props.loaderData;

  return <QuizPage {...data} />;
}
