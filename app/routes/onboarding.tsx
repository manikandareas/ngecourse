import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { type Control, useForm } from 'react-hook-form';
import { redirect, useNavigate } from 'react-router';
import { z } from 'zod';
import { Button } from '~/components/ui/3d-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { PageBackground } from '~/components/ui/page-background';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import type { SaveOnboardingInput } from '~/features/shared/schemas';
import { usecaseUser } from '~/features/users/usecase';
import { cn } from '~/lib/utils';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/onboarding';

export function meta() {
  return [
    { title: 'Genii | Onboarding' },
    { name: 'description', content: 'Welcome to Genii!' },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) {
    throw new Response('Unauthorized', { status: 401 });
  }

  if (currentSession.onboardingStatus === 'completed') {
    return redirect('/');
  }

  const token = await currentSession.getToken();

  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return { session: currentSession, token };
}

const formSchema = z.object({
  learningGoals: z
    .array(z.string())
    .min(1, 'Please select at least one learning goal.'),
  studyReason: z.string().min(1, 'Please select a reason for studying.'),
  studyPlan: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  {
    id: 1,
    name: 'What do you want to learn?',
    description:
      'This will help us tailor your learning experience. Be as specific or general as you like',
  },
  {
    id: 2,
    name: 'Why are you learning this?',
    description:
      "Understanding your 'why' help us personalize your journey and keep you motivated.",
  },
  {
    id: 3,
    name: 'What level are you at?',
    description: 'Help us understand your current knowledge level.',
  },
  {
    id: 4,
    name: 'How often do you plan to use Nalar?',
    description:
      'Undestanding your style help us make Nalar a better learning companion for you.',
  },
];

export default function LearningGoalsPage(props: Route.ComponentProps) {
  const navigate = useNavigate();
  const { mutate: saveOnboarding } = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: SaveOnboardingInput;
    }) => usecaseUser.saveOnboarding(userId, props.loaderData.token, data),
    onSuccess: (data) => {
      if (data.success) {
        navigate('/recommendation');
      }
    },
  });

  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learningGoals: [],
      studyReason: '',
      studyPlan: 'weekly',
      level: 'beginner',
    },
  });

  // Watch form values to ensure parent component re-renders on changes
  const watchedValues = form.watch();

  // Step validation functions
  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0:
        return ['learningGoals'];
      case 1:
        return ['studyReason'];
      case 2:
        return ['level'];
      case 3:
        return ['studyPlan'];
      default:
        return [];
    }
  };

  const isStepValid = (stepIndex: number): boolean => {
    const values = watchedValues as FormData;
    switch (stepIndex) {
      case 0:
        return (values.learningGoals?.length ?? 0) > 0;
      case 1:
        return (values.studyReason?.length ?? 0) > 0;
      case 2:
        return Boolean(values.level);
      case 3:
        return Boolean(values.studyPlan);
      default:
        return true;
    }
  };

  const isCurrentStepValid = isStepValid(currentStep);

  function onSubmit(values: FormData) {
    try {
      saveOnboarding({
        data: values,
        userId: props.loaderData.session._id,
      });
      // This is a background job, so we don't need to await it.
      // TODO: Get Recommendations Courses
    } catch (error) {
      console.error('Failed to save learning goals:', error);
    }
  }

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);

    if (isValid && isStepValid(currentStep)) {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }
  };

  const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <PageBackground variant="purple-cyan">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Step Progress Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center space-x-2">
              {steps.map((step, index) => {
                const stepComplete = index < currentStep;
                const stepCurrent = index === currentStep;
                const stepValid = isStepValid(index);

                return (
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full font-medium text-sm transition-all duration-300',
                      stepComplete
                        ? 'bg-green-500 text-white shadow-lg'
                        : stepCurrent
                          ? stepValid
                            ? 'bg-accent text-white shadow-lg'
                            : 'bg-accent/70 text-white shadow-lg'
                          : 'border border-hairline bg-white/5 text-text-muted'
                    )}
                    key={step.id}
                  >
                    {stepComplete ? '✓' : index + 1}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-text-muted">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Main Content Card */}
          <div className="glass-card space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="font-light text-3xl text-text-primary leading-[1.1] tracking-tight md:text-4xl">
                {steps[currentStep].name}
              </h1>
              <p className="mx-auto max-w-md text-base/7 text-text-secondary">
                {steps[currentStep].description}
              </p>
            </div>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentStep * 100}%)` }}
                  >
                    {/* Step 0 - Learning Goals */}
                    <div className="w-full flex-shrink-0">
                      <LearningGoals control={form.control} />
                    </div>

                    {/* Step 1 - Study Reason */}
                    <div className="w-full flex-shrink-0">
                      <StudyReason control={form.control} />
                    </div>

                    {/* Step 2 - Level */}
                    <div className="w-full flex-shrink-0">
                      <Level control={form.control} />
                    </div>

                    {/* Step 3 - Study Plan */}
                    <div className="w-full flex-shrink-0">
                      <StudyPlan control={form.control} />
                    </div>
                  </div>
                </div>

                {/* Validation Error Message */}
                {!isCurrentStepValid && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                    <p className="field-error text-sm">
                      {currentStep === 0 &&
                        'Please select at least one learning goal to continue.'}
                      {currentStep === 1 &&
                        'Please select your motivation to continue.'}
                      {currentStep === 2 &&
                        'Please select your current level to continue.'}
                      {currentStep === 3 &&
                        'Please select your usage style to continue.'}
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  {currentStep > 0 ? (
                    <Button
                      onClick={prevStep}
                      size="lg"
                      type="button"
                      variant={'secondary'}
                    >
                      Back
                    </Button>
                  ) : (
                    <span />
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button
                      disabled={!isCurrentStepValid}
                      onClick={nextStep}
                      size="lg"
                      type="button"
                    >
                      Next
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button
                      disabled={form.formState.isSubmitting}
                      size="lg"
                      type="submit"
                    >
                      {form.formState.isSubmitting
                        ? 'Saving...'
                        : 'Finish Setup'}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}

function LearningGoals({ control }: { control: Control<FormData> }) {
  const learningGoalOptions = [
    'Web Development',
    'Mobile App Development',
    'Data Science & Analytics',
    'Artificial Intelligence',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps & Automation',
    'UI/UX Design',
    'Blockchain & Cryptocurrency',
    'Internet of Things (IoT)',
  ];

  return (
    <FormField
      control={control}
      name="learningGoals"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="field-label font-medium text-base">
            Learning Goals
          </FormLabel>
          <FormControl className="w-full">
            <div className="w-full space-y-6">
              <Input
                className="glass-input"
                placeholder="e.g., Web Development, Machine Learning"
                readOnly
                value={field.value.join(', ')}
              />
              <div>
                <p className="field-help mb-3">Popular choices:</p>
                <ToggleGroup
                  className="grid w-full grid-cols-1 gap-3 md:grid-cols-2"
                  onValueChange={field.onChange}
                  type="multiple"
                  value={field.value}
                >
                  {learningGoalOptions.map((option) => (
                    <ToggleGroupItem
                      className="justify-start rounded-xl border border-hairline bg-white/5 px-4 py-3 text-left font-medium text-text-primary transition-all duration-200 hover:border-strong hover:bg-white/10 data-[state=on]:border-accent data-[state=on]:bg-accent/20 data-[state=on]:text-accent"
                      key={option}
                      value={option}
                    >
                      {option}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </FormControl>
          <FormMessage className="field-error" />
        </FormItem>
      )}
    />
  );
}

function StudyReason({ control }: { control: Control<FormData> }) {
  const motivationOptions = [
    { value: 'career-switch', label: 'Career Switch to Tech' },
    { value: 'skill-upgrade', label: 'Upgrade Current Tech Skills' },
    { value: 'certification', label: 'Professional Certification' },
    { value: 'freelancing', label: 'Freelancing & Side Projects' },
    { value: 'entrepreneurship', label: 'Tech Entrepreneurship' },
    { value: 'personal-projects', label: 'Building Personal Projects' },
  ];
  return (
    <FormField
      control={control}
      name="studyReason"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="field-label font-medium text-base">
            Select your motivation
          </FormLabel>
          <FormControl className="w-full">
            <ToggleGroup
              className="grid w-full grid-cols-1 gap-3"
              onValueChange={field.onChange}
              type="single"
              value={field.value}
            >
              {motivationOptions.map((option) => (
                <ToggleGroupItem
                  className="justify-start rounded-xl border border-hairline bg-white/5 px-4 py-3 text-left font-medium text-text-primary transition-all duration-200 hover:border-strong hover:bg-white/10 data-[state=on]:border-accent data-[state=on]:bg-accent/20 data-[state=on]:text-accent"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage className="field-error" />
        </FormItem>
      )}
    />
  );
}

function StudyPlan({ control }: { control: Control<FormData> }) {
  const studyPlanOptions = [
    {
      value: 'intensive',
      label: 'Intensive Learning',
      description: 'Dedicated full-time learning schedule',
    },
    {
      value: 'structured',
      label: 'Structured Learning',
      description: 'Regular weekly sessions with clear goals',
    },
    {
      value: 'project-based',
      label: 'Project-Based Learning',
      description: 'Learning through hands-on projects and building',
    },
    {
      value: 'flexible',
      label: 'Flexible Learning',
      description: 'Learning as my schedule allows with varied topics',
    },
  ];
  return (
    <FormField
      control={control}
      name="studyPlan"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="field-label font-medium text-base">
            Choose your usage style
          </FormLabel>
          <FormControl className="w-full">
            <ToggleGroup
              className="grid w-full grid-cols-1 gap-3"
              onValueChange={field.onChange}
              type="single"
              value={field.value}
            >
              {studyPlanOptions.map((option) => (
                <ToggleGroupItem
                  className="flex h-auto flex-col items-start justify-start rounded-xl border border-hairline bg-white/5 p-4 text-left transition-all duration-200 hover:border-strong hover:bg-white/10 data-[state=on]:border-accent data-[state=on]:bg-accent/20"
                  key={option.value}
                  value={option.value}
                >
                  <span
                    className={cn(
                      'mb-1 font-semibold text-base transition-colors',
                      field.value === option.value
                        ? 'text-accent'
                        : 'text-text-primary'
                    )}
                  >
                    {option.label}
                  </span>
                  <p
                    className={cn(
                      'text-sm leading-relaxed transition-colors',
                      field.value === option.value
                        ? 'text-accent/80'
                        : 'text-text-muted'
                    )}
                  >
                    {option.description}
                  </p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage className="field-error" />
        </FormItem>
      )}
    />
  );
}

function Level({ control }: { control: Control<FormData> }) {
  const levelOptions = [
    {
      value: 'beginner',
      label: 'I completly new to it',
      description:
        'Starting from scratch with little to no prior knowledge (pre-high school level)',
    },
    {
      value: 'intermediate',
      label: 'I have some basic understanding',
      description:
        'Familiar with fundamentals but need to build deeper knowledge (high school level)',
    },
    {
      value: 'advanced',
      label: 'I have a some experience/knowledge',
      description:
        'Looking to expand on existing skills and fill knowledge gaps (graduate/professional level)',
    },
  ];
  return (
    <FormField
      control={control}
      name="level"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="field-label font-medium text-base">
            Select your current level
          </FormLabel>
          <FormControl className="w-full">
            <ToggleGroup
              className="grid w-full grid-cols-1 gap-3"
              onValueChange={field.onChange}
              type="single"
              value={field.value}
            >
              {levelOptions.map((option) => (
                <ToggleGroupItem
                  className="flex h-auto flex-col items-start justify-start rounded-xl border border-hairline bg-white/5 p-4 text-left transition-all duration-200 hover:border-strong hover:bg-white/10 data-[state=on]:border-accent data-[state=on]:bg-accent/20"
                  key={option.value}
                  value={option.value}
                >
                  <span
                    className={cn(
                      'mb-1 font-semibold text-base transition-colors',
                      field.value === option.value
                        ? 'text-accent'
                        : 'text-text-primary'
                    )}
                  >
                    {option.label}
                  </span>
                  <p
                    className={cn(
                      'text-wrap text-sm leading-relaxed transition-colors',
                      field.value === option.value
                        ? 'text-accent/80'
                        : 'text-text-muted'
                    )}
                  >
                    {option.description}
                  </p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage className="field-error" />
        </FormItem>
      )}
    />
  );
}
