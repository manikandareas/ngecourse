import {
  CheckCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { LearningLayout } from '~/features/courses/detail/chapters/learning-layout';
import { cn } from '~/lib/utils';

// Mock data - same course structure
const mockCourse = {
  id: '1',
  title: 'UI/UX Design Fundamentals',
  slug: 'ui-ux-fundamentals',
  chapters: [
    {
      id: '1',
      title: 'Introduction to UI/UX',
      slug: 'introduction',
      contents: [
        {
          id: '1',
          title: 'What is UI/UX?',
          type: 'lesson' as const,
          slug: 'what-is-ui-ux',
        },
        {
          id: '2',
          title: 'Design Principles',
          type: 'lesson' as const,
          slug: 'design-principles',
        },
        {
          id: '3',
          title: 'Quiz: Basics',
          type: 'quiz' as const,
          slug: 'basics-quiz',
        },
      ],
    },
    {
      id: '2',
      title: 'Usability Principles',
      slug: 'usability-principles',
      contents: [
        {
          id: '4',
          title: 'Visibility of System Status',
          type: 'lesson' as const,
          slug: 'visibility-system-status',
        },
        {
          id: '5',
          title: 'User Control and Freedom',
          type: 'lesson' as const,
          slug: 'user-control-freedom',
        },
        {
          id: '6',
          title: 'Consistency and Standards',
          type: 'lesson' as const,
          slug: 'consistency-standards',
        },
        {
          id: '7',
          title: 'Quiz: Usability',
          type: 'quiz' as const,
          slug: 'usability-quiz',
        },
      ],
    },
    {
      id: '3',
      title: 'Design Process',
      slug: 'design-process',
      contents: [
        {
          id: '8',
          title: 'Research Phase',
          type: 'lesson' as const,
          slug: 'research-phase',
        },
        {
          id: '9',
          title: 'Wireframing',
          type: 'lesson' as const,
          slug: 'wireframing',
        },
        {
          id: '10',
          title: 'Prototyping',
          type: 'lesson' as const,
          slug: 'prototyping',
        },
        {
          id: '11',
          title: 'Final Quiz',
          type: 'quiz' as const,
          slug: 'final-quiz',
        },
      ],
    },
  ],
};

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  title: string;
  description: string;
  chapterTitle: string;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  questions: QuizQuestion[];
}

const mockQuizzes: Record<string, QuizData> = {
  'basics-quiz': {
    title: 'Quiz: UI/UX Basics',
    description: 'Test your understanding of fundamental UI/UX concepts.',
    chapterTitle: 'Introduction to UI/UX',
    timeLimit: 10,
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'What is the primary focus of UI design?',
        options: [
          'User research and testing',
          'Visual elements and interface layout',
          'Business strategy and goals',
          'Technical implementation',
        ],
        correctAnswer: 1,
        explanation:
          "UI design focuses on the visual elements of a product - colors, typography, buttons, icons, and layout. It's about how things look and the interface users interact with directly.",
      },
      {
        id: '2',
        question:
          'Which of the following is NOT a core principle of good design?',
        options: ['Hierarchy', 'Contrast', 'Complexity', 'Alignment'],
        correctAnswer: 2,
        explanation:
          'Complexity is not a core design principle. Good design typically emphasizes simplicity, clarity, and ease of use. The core principles include hierarchy, contrast, alignment, repetition, and proximity.',
      },
      {
        id: '3',
        question: 'What does UX design primarily focus on?',
        options: [
          'Color schemes and typography',
          'Overall user experience and interaction flow',
          'Code implementation',
          'Marketing and branding',
        ],
        correctAnswer: 1,
        explanation:
          'UX design focuses on the overall experience - how users interact with the product, how they feel, and whether they can accomplish their goals efficiently. It\'s about the "feel" of the product.',
      },
    ],
  },
  'usability-quiz': {
    title: 'Quiz: Usability Principles',
    description: "Test your knowledge of Nielsen's usability heuristics.",
    chapterTitle: 'Usability Principles',
    timeLimit: 15,
    passingScore: 80,
    questions: [
      {
        id: '1',
        question:
          "According to Nielsen's first usability heuristic, users should always be informed about:",
        options: [
          "The system's current status",
          "Other users' activities",
          "The company's business model",
          'Technical specifications',
        ],
        correctAnswer: 0,
        explanation:
          'The first heuristic is "Visibility of system status" - the system should always keep users informed about what is going on through appropriate feedback within reasonable time.',
      },
      {
        id: '2',
        question: 'When should you show a loading indicator?',
        options: [
          'Only for operations longer than 5 seconds',
          'After 1 second of waiting',
          'Never, it creates anxiety',
          'Only when the user asks for it',
        ],
        correctAnswer: 1,
        explanation:
          "Best practice is to show loading indicators after 1 second of waiting. This gives users feedback that the system is working and prevents them from thinking it's broken.",
      },
      {
        id: '3',
        question:
          'What is the main purpose of providing "emergency exits" in user interfaces?',
        options: [
          'To reduce server load',
          'To allow users to recover from mistakes',
          'To improve visual design',
          'To collect user feedback',
        ],
        correctAnswer: 1,
        explanation:
          'Emergency exits (like Undo/Redo, Cancel buttons) allow users to recover from mistakes. This supports the heuristic "User control and freedom" - users often choose system functions by mistake and need clearly marked exits.',
      },
    ],
  },
};

export default function QuizPage() {
  const params = useParams();
  const quizSlug = params.quizSlug || 'basics-quiz';
  const quizData = mockQuizzes[quizSlug] || mockQuizzes['basics-quiz'];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit * 60); // Convert to seconds

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    const correctAnswers = quizData.questions.filter(
      (question) => selectedAnswers[question.id] === question.correctAnswer
    ).length;
    return Math.round((correctAnswers / quizData.questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeRemaining(quizData.timeLimit * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= quizData.passingScore;

    return (
      <LearningLayout course={mockCourse}>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <HelpCircle className="h-4 w-4" />
              <span>Quiz Results</span>
              <span>•</span>
              <span>{quizData.chapterTitle}</span>
            </div>

            <h1 className="font-bold text-3xl text-foreground">
              {quizData.title}
            </h1>
          </div>

          <Card
            className={cn(
              'border-2',
              passed
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            )}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {passed ? (
                  <CheckCircle className="h-16 w-16 text-green-600" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-600" />
                )}
              </div>
              <CardTitle
                className={cn(
                  'text-2xl',
                  passed ? 'text-green-800' : 'text-red-800'
                )}
              >
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="space-y-2">
                <div className="font-bold text-4xl">{score}%</div>
                <div className="text-muted-foreground">
                  You scored{' '}
                  {selectedAnswers && Object.keys(selectedAnswers).length} out
                  of {quizData.questions.length} questions correctly
                </div>
                <div className="text-muted-foreground text-sm">
                  Passing score: {quizData.passingScore}%
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  className="flex items-center gap-2"
                  onClick={resetQuiz}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                </Button>
                {passed && (
                  <Button className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Continue Course
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            <h2 className="font-semibold text-xl">Review Your Answers</h2>
            {quizData.questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <Card
                  className={cn(
                    'border-l-4',
                    isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                  )}
                  key={question.id}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        {index + 1}. {question.question}
                      </CardTitle>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          className={cn(
                            'rounded p-2 text-sm',
                            optionIndex === question.correctAnswer &&
                              'bg-green-100 text-green-800',
                            optionIndex === userAnswer &&
                              optionIndex !== question.correctAnswer &&
                              'bg-red-100 text-red-800',
                            optionIndex !== question.correctAnswer &&
                              optionIndex !== userAnswer &&
                              'bg-muted/50'
                          )}
                          key={optionIndex.toString()}
                        >
                          {option}
                          {optionIndex === question.correctAnswer && ' ✓'}
                          {optionIndex === userAnswer &&
                            optionIndex !== question.correctAnswer &&
                            ' ✗'}
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-muted-foreground text-sm">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </LearningLayout>
    );
  }

  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <LearningLayout course={mockCourse}>
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <HelpCircle className="h-4 w-4" />
            <span>Quiz</span>
            <span>•</span>
            <span>{quizData.chapterTitle}</span>
          </div>

          <h1 className="font-bold text-3xl text-foreground">
            {quizData.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </Badge>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              Passing score: {quizData.passingScore}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              onValueChange={(value) =>
                handleAnswerSelect(currentQ.id, Number.parseInt(value))
              }
              value={selectedAnswers[currentQ.id]?.toString()}
            >
              {currentQ.options.map((option, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <RadioGroupItem
                    id={`option-${index}`}
                    value={index.toString()}
                  />
                  <Label
                    className="flex-1 cursor-pointer"
                    htmlFor={`option-${index}`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            disabled={currentQuestion === 0}
            onClick={handlePrevious}
            variant="outline"
          >
            Previous
          </Button>

          <div className="text-muted-foreground text-sm">
            {Object.keys(selectedAnswers).length} of {quizData.questions.length}{' '}
            answered
          </div>

          <Button
            disabled={selectedAnswers[currentQ.id] === undefined}
            onClick={handleNext}
          >
            {currentQuestion === quizData.questions.length - 1
              ? 'Finish Quiz'
              : 'Next'}
          </Button>
        </div>
      </div>
    </LearningLayout>
  );
}
