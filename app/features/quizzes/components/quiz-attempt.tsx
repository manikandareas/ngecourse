import { ArrowLeft, CheckCircle, Flag, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { QuizAttempt } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { cn } from '~/lib/utils';
import { useFinalizeQuizMutation } from '../hooks/quiz-mutations';

interface QuizAttemptProps {
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

type QuestionState = 'upcoming' | 'active' | 'completed';

type ClientAnswer = {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
  showingFeedback: boolean;
};

export function QuizAttemptPage({ attempt, userId }: QuizAttemptProps) {
  const navigate = useNavigate();
  const finalizeQuizMutation = useFinalizeQuizMutation();

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [clientAnswers, setClientAnswers] = useState<ClientAnswer[]>([]);
  const [currentActiveQuestion, setCurrentActiveQuestion] = useState<number>(0);
  const [showingFeedback, setShowingFeedback] = useState<number | null>(null);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to the current active question after render
  useEffect(() => {
    const ref = questionRefs.current[currentActiveQuestion];
    if (!ref) return;

    // Account for sticky header height to avoid jump/blink
    const header = document.querySelector('.tinted-blur') as HTMLElement | null;
    const offset = (header?.offsetHeight ?? 0) + 12; // small breathing space

    requestAnimationFrame(() => {
      const rect = ref.getBoundingClientRect();
      const targetTop = rect.top + window.scrollY - offset;

      // Smooth scroll with offset
      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      const firstRadio = ref.querySelector(
        'input[type="radio"]:not(:disabled)'
      ) as HTMLInputElement | null;

      // Focus after a short delay; prevent additional scroll on focus
      if (firstRadio) {
        window.setTimeout(() => firstRadio.focus({ preventScroll: true }), 250);
      }
    });
  }, [currentActiveQuestion]);

  const quiz = attempt.quiz;
  const questions = quiz?.questions || [];
  const answeredQuestions = (attempt.answers ?? []) as NonNullable<QuizAttempt['answers']>;
  const totalQuestions = questions.length;

  // Initialize client state based on existing server answers
  useEffect(() => {
    if (answeredQuestions.length > 0) {
      const existingAnswers: ClientAnswer[] = [];
      const existingSelections: Record<number, number> = {};

      for (const answer of answeredQuestions) {
        const { questionIndex, selectedOptionIndex, isOutcome } = answer ?? {};
        if (
          typeof questionIndex !== 'number' ||
          typeof selectedOptionIndex !== 'number'
        ) {
          continue;
        }

        existingAnswers.push({
          questionIndex,
          selectedOptionIndex,
          isCorrect: isOutcome === 'correct',
          showingFeedback: false,
        });
        existingSelections[questionIndex] = selectedOptionIndex;
      }

      setClientAnswers(existingAnswers);
      setSelectedAnswers(existingSelections);
      setCurrentActiveQuestion(answeredQuestions.length);
    }
  }, [answeredQuestions.length, questions.length]);

  const getQuestionState = (questionIndex: number): QuestionState => {
    if (isQuestionAnswered(questionIndex)) return 'completed';
    if (questionIndex === currentActiveQuestion) return 'active';
    return 'upcoming';
  };

  const isQuestionAnswered = (questionIndex: number) => {
    return clientAnswers.some(
      (answer) => answer.questionIndex === questionIndex
    );
  };

  const isQuestionVisible = (questionIndex: number) => {
    return questionIndex <= currentActiveQuestion;
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleAnswerSubmit = (questionIndex: number) => {
    const selectedOption = selectedAnswers[questionIndex];
    if (selectedOption === undefined) return;

    const question = questions[questionIndex];
    const isCorrect = question.correctOptionIndex === selectedOption;

    // Create client-side answer
    const newAnswer: ClientAnswer = {
      questionIndex,
      selectedOptionIndex: selectedOption,
      isCorrect,
      showingFeedback: true,
    };

    // Add to client answers
    setClientAnswers((prev) => [...prev, newAnswer]);

    // Show feedback briefly, then advance smoothly
    setShowingFeedback(questionIndex);

    // Update the stored answer to not show feedback anymore (UI uses separate flag)
    setClientAnswers((prev) =>
      prev.map((answer) =>
        answer.questionIndex === questionIndex
          ? { ...answer, showingFeedback: false }
          : answer
      )
    );

    if (questionIndex < questions.length - 1) {
      // Small delay so users can perceive feedback before moving on
      window.setTimeout(() => {
        setCurrentActiveQuestion(questionIndex + 1);
        setShowingFeedback(null);
      }, 500);
    } else {
      // Last question answered; no auto-advance
      setShowingFeedback(null);
    }
  };

  const handleFinalizeQuiz = async () => {
    // First, submit all answers to server in bulk
    try {
      // Convert client answers to server format and submit them all
      const serverAnswers = clientAnswers.map((answer) => ({
        questionIndex: answer.questionIndex,
        selectedOptionIndex: answer.selectedOptionIndex,
        isOutcome: answer.isCorrect
          ? ('correct' as const)
          : ('incorrect' as const),
        timeTakenMs: Date.now() - new Date(attempt.startedAt || '').getTime(),
      }));

      // Update attempt with all answers at once
      const correctCount = clientAnswers.filter((a) => a.isCorrect).length;

      // Note: We need to call our data layer directly here or create a bulk submission endpoint
      // For now, we'll use the finalize mutation which should handle the bulk submission
      const result = await finalizeQuizMutation.mutateAsync({
        userId,
        attemptId: attempt._id,
        // Pass the client answers for bulk submission
        answers: serverAnswers,
        correctCount,
      });

      if (result.success) {
        navigate(
          `/courses/${attempt.course?.slug}/${attempt.chapter?.slug}/quizzes/${quiz?.slug}/a/${attempt._id}/result`
        );
      }
    } catch (error) {
      console.error('Failed to finalize quiz:', error);
    }
  };

  // Calculate progress based on client answers
  const progressPercentage = (clientAnswers.length / totalQuestions) * 100;

  if (!attempt || attempt.status !== 'in_progress') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-card max-w-md text-center">
          <h1 className="font-semibold text-2xl text-gray-100">
            Quiz Not Available
          </h1>
          <p className="mt-2 text-gray-400">
            This quiz attempt is not available or has been completed.
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
    <div aria-live="polite" className="min-h-screen">
      <div className="space-y-6">
        {/* Header with Progress */}
        <div className="tinted-blur sticky top-0 z-10 mx-auto w-full max-w-3xl border-hairline border-b px-4 py-4 shadow-soft sm:px-6">
          <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                className="btn-ghost gap-2 text-sm text-text-primary hover:text-text-primary"
                onClick={() =>
                  navigate(
                    `/courses/${attempt.course?.slug}/${attempt.chapter?.slug}/quizzes/${quiz?.slug}`
                  )
                }
                size="sm"
                variant="ghost"
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Back to Quiz</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <Badge
                className="border-hairline bg-white/5 text-text-secondary text-xs sm:text-sm"
                variant="outline"
              >
                {clientAnswers.length} / {totalQuestions}
              </Badge>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-text-secondary">
                  Quiz Progress
                </span>
                <span className="font-medium text-text-primary">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress
                className="h-2 overflow-hidden rounded-full border border-hairline bg-white/5"
                value={progressPercentage}
              />
            </div>
          </div>
        </div>

        {/* Questions Stack */}
        <div className="space-y-6 px-4 sm:space-y-8 sm:px-6">
          {questions.map((question, questionIndex) => {
            const questionState = getQuestionState(questionIndex);
            const isVisible = isQuestionVisible(questionIndex);
            const isAnswered = isQuestionAnswered(questionIndex);
            const selectedOption = selectedAnswers[questionIndex];
            const clientAnswer = clientAnswers.find(
              (a) => a.questionIndex === questionIndex
            );
            const isShowingFeedback = showingFeedback === questionIndex;

            if (!isVisible) return null;

            return (
              <div
                className={cn(
                  'glass-card mx-auto max-w-3xl p-4 transition-all duration-300 sm:p-6 md:p-8',
                  questionState === 'completed' &&
                    'border-green-500/20 opacity-75',
                  questionState === 'active' && 'border-blue-500/30',
                  questionState === 'upcoming' && 'opacity-50'
                )}
                key={question._key}
                ref={(el) => {
                  questionRefs.current[questionIndex] = el;
                }}
              >
                <div className="space-y-4 sm:space-y-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          className="shrink-0"
                          variant={
                            questionState === 'completed'
                              ? 'default'
                              : questionState === 'active'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          Question {questionIndex + 1}
                        </Badge>
                        {questionState === 'completed' && (
                          <CheckCircle className="size-5 text-green-500" />
                        )}
                      </div>
                      <h2 className="font-semibold text-gray-100 text-lg leading-relaxed sm:text-xl">
                        {question.question}
                      </h2>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 sm:space-y-3">
                    {question.options?.map((option, optionIndex) => {
                      const isSelected = selectedOption === optionIndex;
                      const isAnsweredOption =
                        clientAnswer?.selectedOptionIndex === optionIndex;
                      const isCorrectOption =
                        question.correctOptionIndex === optionIndex;
                      const canSelect =
                        questionState === 'active' && !isAnswered;

                      return (
                        <label
                          className={cn(
                            'flex min-h-[44px] items-start gap-3 rounded-lg border p-3 transition-all sm:min-h-[48px] sm:p-4',
                            canSelect
                              ? 'cursor-pointer hover:border-gray-600/50 hover:bg-gray-700/30'
                              : 'cursor-not-allowed',
                            isSelected &&
                              canSelect &&
                              'border-blue-500/50 bg-blue-500/10',
                            isAnswered &&
                              isAnsweredOption &&
                              (clientAnswer?.isCorrect
                                ? 'border-green-500/50 bg-green-500/10'
                                : 'border-red-500/50 bg-red-500/10'),
                            isAnswered &&
                              isCorrectOption &&
                              clientAnswer?.selectedOptionIndex !==
                                optionIndex &&
                              'border-green-500/30 bg-green-500/5',
                            questionState === 'completed'
                              ? 'border-gray-700/30 bg-gray-800/20'
                              : 'border-gray-700/50 bg-gray-800/30'
                          )}
                          key={optionIndex.toString()}
                        >
                          <input
                            checked={isSelected || isAnsweredOption}
                            className="mt-1 size-4 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                            disabled={!canSelect}
                            name={`question-${questionIndex}`}
                            onChange={() =>
                              canSelect &&
                              handleAnswerSelect(questionIndex, optionIndex)
                            }
                            type="radio"
                            value={optionIndex}
                          />
                          <span className="flex-1 text-gray-100 text-sm leading-relaxed sm:text-base">
                            {option}
                          </span>
                          {isAnswered && isAnsweredOption && (
                            <div className="shrink-0">
                              {clientAnswer?.isCorrect ? (
                                <CheckCircle className="size-5 text-green-500" />
                              ) : (
                                <XCircle className="size-5 text-red-500" />
                              )}
                            </div>
                          )}
                          {isAnswered &&
                            isCorrectOption &&
                            !isAnsweredOption && (
                              <div className="shrink-0">
                                <CheckCircle className="size-5 text-green-500 opacity-60" />
                              </div>
                            )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Submit Button for Active Question (labeled as Continue) */}
                  {questionState === 'active' &&
                    !isAnswered &&
                    !isShowingFeedback && (
                      <Button
                        className="min-h-[44px] w-full text-sm sm:min-h-[48px] sm:text-base"
                        disabled={selectedOption === undefined}
                        onClick={() => handleAnswerSubmit(questionIndex)}
                      >
                        Continue
                      </Button>
                    )}

                  {/* Final Submit Button on Last Question after answering */}
                  {questionIndex === questions.length - 1 && isAnswered && (
                    <Button
                      className="min-h-[44px] w-full text-sm sm:min-h-[48px] sm:text-base"
                      disabled={finalizeQuizMutation.isPending}
                      onClick={handleFinalizeQuiz}
                    >
                      {finalizeQuizMutation.isPending
                        ? 'Submitting...'
                        : 'Submit Quiz'}
                      <Flag className="size-4" />
                    </Button>
                  )}

                  {/* Feedback Display */}
                  {(isShowingFeedback ||
                    (isAnswered && question.explanation)) && (
                    <div
                      aria-live={isShowingFeedback ? 'assertive' : 'polite'}
                      className={cn(
                        'rounded-lg border p-4',
                        clientAnswer?.isCorrect
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-red-500/50 bg-red-500/10'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {clientAnswer?.isCorrect ? (
                          <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-500" />
                        ) : (
                          <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                        )}
                        <div className="space-y-2">
                          <p
                            className={cn(
                              'font-medium',
                              clientAnswer?.isCorrect
                                ? 'text-green-400'
                                : 'text-red-400'
                            )}
                          >
                            {clientAnswer?.isCorrect ? 'Correct!' : 'Incorrect'}
                          </p>
                          {question.explanation && (
                            <p className="text-gray-300 text-xs leading-relaxed sm:text-sm">
                              {question.explanation}
                            </p>
                          )}
                          {isShowingFeedback && (
                            <p className="text-gray-500 text-xs">
                              {questionIndex < questions.length - 1
                                ? 'Next question will appear shortly...'
                                : 'Preparing final submission...'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
