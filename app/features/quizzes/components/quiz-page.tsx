import { ArrowRight, Clock, Play, RotateCcw, Target } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Quiz } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { LessonHeader } from '~/features/courses/components/lesson-header';
import { LessonNavigation } from '~/features/courses/components/lesson-navigation';
import { useEventTracking } from '~/hooks/use-event-tracking';
import { QUIZ_COPY } from '../constants/copy';
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
  const { startSession, endSession } = useEventTracking();

  // Session tracking for quiz page
  useEffect(() => {
    let sessionStarted = false;

    const initializeTracking = async () => {
      if (quiz?._id) {
        await startSession(quiz._id);
        sessionStarted = true;
      }
    };

    initializeTracking();

    // Cleanup on unmount
    return () => {
      if (sessionStarted) {
        endSession('navigation');
      }
    };
  }, [quiz?._id, startSession, endSession]);

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card max-w-md text-center">
          <h1 className="font-semibold text-2xl text-gray-100">
            {QUIZ_COPY.errors.quizNotFound.title}
          </h1>
          <p className="mt-2 text-gray-400">
            {QUIZ_COPY.errors.quizNotFound.description}
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate(`/courses/${courseSlug}`)}
            variant="outline"
          >
            {QUIZ_COPY.errors.quizNotFound.backButton}
          </Button>
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
        text: `${QUIZ_COPY.states.inProgress.nextButton} Quiz`,
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
        text:
          completedAttempts.length > 0
            ? QUIZ_COPY.results.actions.retake
            : QUIZ_COPY.states.notStarted.startButton,
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
                    <p className="text-gray-400 text-lg">{quiz.description}</p>
                  )}
                </div>
                <Badge className="shrink-0" variant="secondary">
                  {QUIZ_COPY.states.notStarted.badge}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="size-4" />
                  <span>{quiz.questions?.length || 0} Skill Challenges</span>
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
                    ~{Math.ceil((quiz.questions?.length || 0) * 1.5)} min untuk
                    validate expertise
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
                  ? QUIZ_COPY.states.loading.title
                  : buttonConfig.text}
              </Button>

              {hasReachedMaxAttempts && (
                <p className="mt-2 text-orange-400 text-sm">
                  Maximum attempts reached. Your expertise journey continues
                  dengan quiz lainnya!
                </p>
              )}
            </div>
          )}

          {/* Attempt History */}
          {attempts.length > 0 && (
            <div className="glass-card">
              <h2 className="mb-4 font-semibold text-gray-100 text-xl">
                Journey Validasi Skillmu
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
                              ? 'Sedang Validate'
                              : 'Skill Validated'}
                          </Badge>
                          {attempt.percentage !== undefined && (
                            <span className="text-gray-400 text-sm">
                              {attempt.correctCount}/{attempt.totalQuestions}{' '}
                              expertise confirmed ({attempt.percentage}%)
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">
                          {attempt.status === 'in_progress'
                            ? `Started validation ${new Date(attempt._createdAt).toLocaleDateString('id-ID')}`
                            : `Expertise validated ${attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString('id-ID') : 'recently'}`}
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
                        {QUIZ_COPY.results.actions.reviewAnswers}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Controls */}
      <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6">
        <LessonNavigation courseSlug={courseSlug} userId={userId} />
      </div>
    </div>
  );
}
