import {
  ArrowLeft,
  CheckCircle,
  Clock,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { QuizAttempt } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import {
  CourseCompletionModal,
  useAchievementNotifications,
} from '~/features/achievements';
import { useUserEnrollments } from '~/features/progress/hooks/useProgressData';
import { QUIZ_RESULT_COPY } from '~/features/quizzes/constants/quiz-result-copy';
import { cn } from '~/lib/utils';

interface QuizResultProps {
  attempt: QuizAttempt & {
    quiz: {
      _id: string;
      title?: string;
      slug: string;
      description?: string;
      questions?: Array<{
        _key: string;
        question?: string;
        options?: string[];
        correctOptionIndex?: number;
        explanation?: string;
      }>;
    };
    course: {
      _id: string;
      title?: string;
      slug: string;
    };
    chapter: {
      _id: string;
      title?: string;
      slug: string;
    };
  };
  userId: string;
}

export function QuizResultPage({ attempt, userId }: QuizResultProps) {
  const navigate = useNavigate();
  const { showNotification, NotificationContainer } =
    useAchievementNotifications();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  // Fetch user enrollments to check completion status
  const { data: enrollments } = useUserEnrollments(userId);

  const quiz = attempt.quiz;
  const questions = quiz?.questions || [];
  const answers = attempt.answers || [];
  const totalQuestions = attempt.totalQuestions || questions.length;
  const correctCount = attempt.correctCount || 0;
  const percentage = attempt.percentage || 0;
  const duration = attempt.durationMs
    ? Math.round(attempt.durationMs / 1000 / 60)
    : 0;

  const getScoreData = (p: number) => {
    if (p >= 90) return QUIZ_RESULT_COPY.performance.outstanding;
    if (p >= 70) return QUIZ_RESULT_COPY.performance.excellent;
    if (p >= 50) return QUIZ_RESULT_COPY.performance.good;
    return QUIZ_RESULT_COPY.performance.needsWork;
  };

  // Check for course completion when enrollments data is available
  useEffect(() => {
    if (enrollments && attempt.course?._id) {
      const currentEnrollment = enrollments.find(
        (enrollment) => enrollment.course?._id === attempt.course?._id
      );

      if (
        currentEnrollment &&
        currentEnrollment.percentComplete === 100 &&
        currentEnrollment.dateCompleted
      ) {
        const completedDate = new Date(currentEnrollment.dateCompleted);
        const quizSubmittedDate = new Date(attempt.submittedAt || '');

        // Check if course was completed recently (within 5 minutes of quiz submission)
        const timeDiff = Math.abs(
          completedDate.getTime() - quizSubmittedDate.getTime()
        );
        const fiveMinutes = 5 * 60 * 1000;

        if (timeDiff < fiveMinutes) {
          setCourseCompleted(true);
          setShowCompletionModal(true);
        }
      }
    }
  }, [enrollments, attempt.course?._id, attempt.submittedAt]);

  if (!attempt || attempt.status === 'in_progress') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card max-w-md text-center">
          <h1 className="font-semibold text-2xl text-gray-100">
            {QUIZ_RESULT_COPY.states.inProgress.title}
          </h1>
          <p className="mt-2 text-gray-400">
            {QUIZ_RESULT_COPY.states.inProgress.description}
          </p>
          <Button
            className="mt-4"
            onClick={() =>
              navigate(
                `/courses/${attempt.course?.slug}/${attempt.chapter?.slug}/quizzes/${quiz?.slug}`
              )
            }
            variant="outline"
          >
            {QUIZ_RESULT_COPY.states.inProgress.cta}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NotificationContainer />
      <CourseCompletionModal
        completionStats={{
          totalTime: `${duration} minutes`,
          averageQuizScore: percentage,
        }}
        courseTitle={attempt.course?.title || 'Course'}
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />

      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="glass-card">
            <div className="flex items-center justify-between">
              <Button
                onClick={() =>
                  navigate(
                    `/courses/${attempt.course?.slug}/${attempt.chapter?.slug}/quizzes/${quiz?.slug}`
                  )
                }
                size="sm"
                variant="ghost"
              >
                <ArrowLeft className="size-4" />
                {QUIZ_RESULT_COPY.sections.header.backButton}
              </Button>
              <Badge variant="outline">{QUIZ_RESULT_COPY.sections.header.badge}</Badge>
            </div>
          </div>

          {/* Score Summary */}
          <div className="glass-card">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <Trophy
                  className={cn('mx-auto size-16', getScoreData(percentage).color)}
                />
                <h1 className="font-bold text-3xl text-gray-100">
                  {QUIZ_RESULT_COPY.sections.scoreDisplay.title(quiz?.title || 'Quiz')}
                </h1>
                <p
                  className={cn(
                    'font-bold text-5xl',
                    getScoreData(percentage).color
                  )}
                >
                  {percentage}{QUIZ_RESULT_COPY.sections.scoreDisplay.scoreSuffix}
                </p>
                <p className="text-gray-300 text-xl">
                  {getScoreData(percentage).message}
                </p>
                <p className="mt-2 text-gray-400 text-sm">
                  {getScoreData(percentage).description}
                </p>
              </div>

              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Target className="size-4" />
                    <span>{QUIZ_RESULT_COPY.sections.stats.expertise.label}</span>
                  </div>
                  <p className="font-semibold text-gray-100 text-lg">
                    {QUIZ_RESULT_COPY.sections.stats.expertise.format(correctCount, totalQuestions)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Clock className="size-4" />
                    <span>{QUIZ_RESULT_COPY.sections.stats.duration.label}</span>
                  </div>
                  <p className="font-semibold text-gray-100 text-lg">
                    {QUIZ_RESULT_COPY.sections.stats.duration.format(duration)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <RotateCcw className="size-4" />
                    <span>{QUIZ_RESULT_COPY.sections.stats.attempt.label}</span>
                  </div>
                  <p className="font-semibold text-gray-100 text-lg">
                    {QUIZ_RESULT_COPY.sections.stats.attempt.format(attempt.attemptNumber)}
                  </p>
                </div>
              </div>

              <Progress className="mx-auto h-3 max-w-md" value={percentage} />
            </div>
          </div>

          {/* Detailed Results */}
          <div className="glass-card">
            <h2 className="mb-6 font-semibold text-2xl text-gray-100">
              {QUIZ_RESULT_COPY.sections.breakdown.title}
            </h2>
            <p className="mb-6 text-gray-400 text-sm">
              {QUIZ_RESULT_COPY.sections.breakdown.subtitle}
            </p>
            <div className="space-y-6">
              {questions.map((question, questionIndex) => {
                const answer = answers.find(
                  (a) => a.questionIndex === questionIndex
                );
                const isCorrect = answer?.isOutcome === 'correct';
                const userAnswer = answer?.selectedOptionIndex;
                const correctAnswer = question.correctOptionIndex;

                return (
                  <div
                    className="space-y-4 rounded-lg border border-gray-700/50 bg-gray-800/30 p-6"
                    key={question._key}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="flex-1 font-medium text-gray-100 text-lg">
                        {questionIndex + 1}. {question.question}
                      </h3>
                      <div className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle className="size-6 text-green-500" />
                        ) : (
                          <XCircle className="size-6 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => {
                        const isUserChoice = userAnswer === optionIndex;
                        const isCorrectChoice = correctAnswer === optionIndex;

                        return (
                          <div
                            className={cn(
                              'flex items-center gap-3 rounded-lg border p-3',
                              isCorrectChoice
                                ? 'border-green-500/50 bg-green-500/10'
                                : isUserChoice && !isCorrect
                                  ? 'border-red-500/50 bg-red-500/10'
                                  : 'border-gray-700/30 bg-gray-800/20'
                            )}
                            key={optionIndex.toString()}
                          >
                            <div className="flex items-center gap-2">
                              {isUserChoice && (
                                <Badge
                                  className={cn(
                                    'text-xs',
                                    isCorrect
                                      ? 'border-green-500/50 text-green-400'
                                      : 'border-red-500/50 text-red-400'
                                  )}
                                  variant="outline"
                                >
                                  {QUIZ_RESULT_COPY.questionReview.badges.userChoice}
                                </Badge>
                              )}
                              {isCorrectChoice && (
                                <Badge
                                  className="border-green-500/50 text-green-400 text-xs"
                                  variant="outline"
                                >
                                  {QUIZ_RESULT_COPY.questionReview.badges.expertAnswer}
                                </Badge>
                              )}
                            </div>
                            <span className="flex-1 text-gray-100">
                              {option}
                            </span>
                            {isCorrectChoice && (
                              <CheckCircle className="size-4 text-green-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                        <h4 className="mb-2 font-medium text-blue-400">
                          {QUIZ_RESULT_COPY.questionReview.insight.title}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="glass-card">
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() =>
                  navigate(
                    `/courses/${attempt.course?.slug}/${attempt.chapter?.slug}/quizzes/${quiz?.slug}`
                  )
                }
                variant="outline"
              >
                <ArrowLeft className="size-4" />
                {QUIZ_RESULT_COPY.actions.secondary.backToOverview}
              </Button>
              <Button
                onClick={() =>
                  navigate(
                    `/courses/${attempt.course?.slug}/${attempt.chapter?.slug}/quizzes/${quiz?.slug}`
                  )
                }
              >
                <RotateCcw className="size-4" />
                {QUIZ_RESULT_COPY.actions.primary.retake}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
