import {
  ArrowLeft,
  CheckCircle,
  Clock,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import type { QuizAttempt } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
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

export function QuizResultPage({ attempt }: QuizResultProps) {
  const navigate = useNavigate();

  const quiz = attempt.quiz;
  const questions = quiz?.questions || [];
  const answers = attempt.answers || [];
  const totalQuestions = attempt.totalQuestions || questions.length;
  const correctCount = attempt.correctCount || 0;
  const percentage = attempt.percentage || 0;
  const duration = attempt.durationMs
    ? Math.round(attempt.durationMs / 1000 / 60)
    : 0;

  const getScoreColor = (p: number) => {
    if (p >= 90) return 'text-green-400';
    if (p >= 70) return 'text-blue-400';
    if (p >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (p: number) => {
    if (p >= 90) return 'Excellent work!';
    if (p >= 70) return 'Great job!';
    if (p >= 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  if (!attempt || attempt.status === 'in_progress') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card max-w-md text-center">
          <h1 className="font-semibold text-2xl text-gray-100">
            Results Not Available
          </h1>
          <p className="mt-2 text-gray-400">
            This quiz has not been completed yet.
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
            Back to Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
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
              Back to Quiz
            </Button>
            <Badge variant="outline">Quiz Results</Badge>
          </div>
        </div>

        {/* Score Summary */}
        <div className="glass-card">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <Trophy
                className={cn('mx-auto size-16', getScoreColor(percentage))}
              />
              <h1 className="font-bold text-3xl text-gray-100">
                {quiz?.title}
              </h1>
              <p
                className={cn('font-bold text-5xl', getScoreColor(percentage))}
              >
                {percentage}%
              </p>
              <p className="text-gray-300 text-xl">
                {getScoreMessage(percentage)}
              </p>
            </div>

            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Target className="size-4" />
                  <span>Score</span>
                </div>
                <p className="font-semibold text-gray-100 text-lg">
                  {correctCount} / {totalQuestions}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Clock className="size-4" />
                  <span>Time</span>
                </div>
                <p className="font-semibold text-gray-100 text-lg">
                  {duration} min
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <RotateCcw className="size-4" />
                  <span>Attempt</span>
                </div>
                <p className="font-semibold text-gray-100 text-lg">
                  #{attempt.attemptNumber}
                </p>
              </div>
            </div>

            <Progress className="mx-auto h-3 max-w-md" value={percentage} />
          </div>
        </div>

        {/* Detailed Results */}
        <div className="glass-card">
          <h2 className="mb-6 font-semibold text-2xl text-gray-100">
            Question Review
          </h2>
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
                                Your Answer
                              </Badge>
                            )}
                            {isCorrectChoice && (
                              <Badge
                                className="border-green-500/50 text-green-400 text-xs"
                                variant="outline"
                              >
                                Correct
                              </Badge>
                            )}
                          </div>
                          <span className="flex-1 text-gray-100">{option}</span>
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
                        Explanation
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
              Back to Quiz
            </Button>
            <Button
              onClick={() =>
                navigate(
                  `/courses/${attempt.course?.slug}/${attempt.chapter?.slug}/quizzes/${quiz?.slug}`
                )
              }
            >
              <RotateCcw className="size-4" />
              Take Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
