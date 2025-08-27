import { ArrowRight, Clock, Play, RotateCcw, Target } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { Quiz } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { PageBackground } from '~/components/ui/page-background';
import { LessonHeader } from '~/features/courses/components/lesson-header';
import { useStartQuizMutation } from '../hooks/quiz-mutations';

interface QuizPageProps {
  quiz: Quiz | null;
  attempts: Array<{
    _id: string;
    attemptNumber?: number;
    status?: string;
    percentage?: number;
    correctCount?: number;
    totalQuestions?: number;
    _createdAt: string;
    submittedAt?: string;
  }>;
  courseSlug: string;
  chapterSlug: string;
  quizSlug: string;
  userId: string;
}

export function QuizPage({
  quiz,
  attempts,
  courseSlug,
  chapterSlug,
  quizSlug,
  userId,
}: QuizPageProps) {
  const navigate = useNavigate();
  const startQuizMutation = useStartQuizMutation();

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card max-w-md text-center">
          <h1 className="font-semibold text-2xl text-gray-100">
            Quiz Not Found
          </h1>
          <p className="mt-2 text-gray-400">
            The requested quiz could not be found.
          </p>
        </div>
      </div>
    );
  }

  const inProgressAttempt = attempts.find((a) => a.status === 'in_progress');
  const completedAttempts = attempts.filter(
    (a) => a.status === 'submitted' || a.status === 'graded'
  );
  const hasReachedMaxAttempts =
    quiz.maxAttempt && attempts.length >= quiz.maxAttempt;
  const canTakeQuiz = !hasReachedMaxAttempts;

  const getButtonConfig = () => {
    if (inProgressAttempt) {
      return {
        text: 'Continue Quiz',
        icon: ArrowRight,
        variant: 'default' as const,
        onClick: () =>
          navigate(
            `/courses/${courseSlug}/${chapterSlug}/quizzes/${quizSlug}/a/${inProgressAttempt._id}`
          ),
      };
    }

    if (canTakeQuiz) {
      return {
        text: completedAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz',
        icon: completedAttempts.length > 0 ? RotateCcw : Play,
        variant: 'default' as const,
        onClick: handleStartQuiz,
      };
    }

    return null;
  };

  const handleStartQuiz = async () => {
    const result = await startQuizMutation.mutateAsync({
      userId,
      courseSlug,
      chapterSlug,
      quizSlug,
    });

    if (result.success) {
      navigate(
        `/courses/${courseSlug}/${chapterSlug}/quizzes/${quizSlug}/a/${result.attemptId}`
      );
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <PageBackground variant="sapphire-magenta">
      <div className="relative w-full space-y-6">
        <LessonHeader
          courseSlug={courseSlug}
          showChatButton={false}
          title={quiz.title || 'Quiz'}
          userId={userId}
        />

        <main className="mx-auto max-w-4xl px-4 pt-16 sm:px-6">
          <div className="space-y-8">
            {/* Quiz Header */}
            <div className="glass-card">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <h1 className="font-medium text-3xl text-gray-100">
                      {quiz.title}
                    </h1>
                    {quiz.description && (
                      <p className="text-gray-400 text-lg">
                        {quiz.description}
                      </p>
                    )}
                  </div>
                  <Badge className="shrink-0" variant="secondary">
                    Quiz
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="size-4" />
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                  {quiz.maxAttempt && (
                    <div className="flex items-center gap-2">
                      <RotateCcw className="size-4" />
                      <span>Max {quiz.maxAttempt} Attempts</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>
                      ~{Math.ceil((quiz.questions?.length || 0) * 1.5)} min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {buttonConfig && (
              <div className="glass-card text-center">
                <Button
                  className="w-full max-w-xs"
                  disabled={startQuizMutation.isPending}
                  onClick={buttonConfig.onClick}
                  size="lg"
                  variant={buttonConfig.variant}
                >
                  <buttonConfig.icon className="size-4" />
                  {startQuizMutation.isPending
                    ? 'Starting...'
                    : buttonConfig.text}
                </Button>

                {hasReachedMaxAttempts && (
                  <p className="mt-2 text-orange-400 text-sm">
                    You have reached the maximum number of attempts for this
                    quiz.
                  </p>
                )}
              </div>
            )}

            {/* Attempt History */}
            {attempts.length > 0 && (
              <div className="glass-card">
                <h2 className="mb-4 font-semibold text-gray-100 text-xl">
                  Attempt History
                </h2>
                <div className="space-y-3">
                  {attempts.map((attempt) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-gray-700/50 bg-gray-800/30 p-4"
                      key={attempt._id}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50">
                          <span className="font-medium text-sm">
                            #{attempt.attemptNumber}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className="text-xs"
                              variant={
                                attempt.status === 'in_progress'
                                  ? 'default'
                                  : attempt.status === 'submitted'
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {attempt.status === 'in_progress'
                                ? 'In Progress'
                                : 'Completed'}
                            </Badge>
                            {attempt.percentage !== undefined && (
                              <span className="text-gray-400 text-sm">
                                {attempt.correctCount}/{attempt.totalQuestions}{' '}
                                correct ({attempt.percentage}%)
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs">
                            {attempt.status === 'in_progress'
                              ? `Started ${new Date(attempt._createdAt).toLocaleDateString()}`
                              : `Completed ${attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : 'Unknown'}`}
                          </p>
                        </div>
                      </div>

                      {attempt.status !== 'in_progress' && (
                        <Button
                          onClick={() =>
                            navigate(
                              `/courses/${courseSlug}/${chapterSlug}/quizzes/${quizSlug}/a/${attempt._id}/result`
                            )
                          }
                          size="sm"
                          variant="ghost"
                        >
                          View Results
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageBackground>
  );
}
