import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Code,
  Palette,
  Target,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { type Control, useForm } from 'react-hook-form';
import { redirect, useNavigate } from 'react-router';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { FocusSelectionCards } from '~/components/ui/focus-selection-cards';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { GoalSelectionCards } from '~/components/ui/goal-selection-cards';
import { LanguageStyleCards } from '~/components/ui/language-style-cards';
import { LevelSelectionCards } from '~/components/ui/level-selection-cards';
import { ONBOARDING_COPY } from '~/features/shared/constants/onboarding-copy';
import type { SaveOnboardingInput } from '~/features/shared/schemas';
import { usecaseUser } from '~/features/users/usecase';
import { cn } from '~/lib/utils';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/onboarding';

export function meta() {
  return [
    { title: ONBOARDING_COPY.meta.title },
    { name: 'description', content: ONBOARDING_COPY.meta.description },
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
    .min(1, ONBOARDING_COPY.validation.focusRequired), // as focus
  goal: z
    .string()
    .min(1, ONBOARDING_COPY.validation.goalRequired)
    .max(120, ONBOARDING_COPY.validation.goalTooLong),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  languagePreference: z.enum(['id', 'en', 'mix'], {
    error: ONBOARDING_COPY.validation.languageRequired,
  }),
  explanationStyle: z.string().min(1, ONBOARDING_COPY.validation.styleRequired),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  {
    id: 1,
    name: ONBOARDING_COPY.steps.focus.name,
    description: ONBOARDING_COPY.steps.focus.description,
  },
  {
    id: 2,
    name: ONBOARDING_COPY.steps.goal.name,
    description: ONBOARDING_COPY.steps.goal.description,
  },
  {
    id: 3,
    name: ONBOARDING_COPY.steps.level.name,
    description: ONBOARDING_COPY.steps.level.description,
  },
  {
    id: 4,
    name: ONBOARDING_COPY.steps.preferences.name,
    description: ONBOARDING_COPY.steps.preferences.description,
  },
];

export default function LearningGoalsPage(props: Route.ComponentProps) {
  const navigate = useNavigate();
  const { mutate: saveOnboarding, isPending } = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: SaveOnboardingInput;
    }) => usecaseUser.saveOnboarding(userId, props.loaderData.token, data),
    onSuccess: (data) => {
      if (data.success) {
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            startVelocity: 30,
            scalar: 0.9,
            origin: { y: 0.7 },
          });
        } catch {
          // no-op if confetti fails
        }
        // brief delay so users can see the celebration
        setTimeout(() => {
          navigate('/recommendation');
        }, 250);
      }
    },
  });

  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learningGoals: [],
      goal: '',
      level: 'beginner',
      languagePreference: 'id',
      explanationStyle: 'simple',
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
        return ['goal'];
      case 2:
        return ['level'];
      case 3:
        return ['languagePreference', 'explanationStyle'];
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
        return (values.goal?.length ?? 0) > 0 && values.goal.length <= 120;
      case 2:
        return Boolean(values.level);
      case 3:
        return (
          Boolean(values.languagePreference) && Boolean(values.explanationStyle)
        );
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

  const nextStep = () => {
    const fields = getFieldsForStep(currentStep);
    form.trigger(fields).then((isValid) => {
      if (isValid && isStepValid(currentStep)) {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }
    });
  };

  const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <div className=" w-full max-w-2xl">
        {/* Step Progress Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            {steps.map((step, index) => {
              const stepComplete = index < currentStep;
              const stepCurrent = index === currentStep;
              const stepValid = isStepValid(index);

              return (
                <button
                  aria-label={`Go to step ${index + 1}: ${step.name}`}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full font-medium text-sm transition-all duration-300',
                    stepComplete
                      ? 'bg-green-500 text-white'
                      : stepCurrent
                        ? stepValid
                          ? 'bg-accent text-white'
                          : 'bg-accent/70 text-white'
                        : 'border border-hairline bg-white/5 text-text-muted'
                  )}
                  key={step.id}
                  onClick={() => {
                    if (index <= currentStep) setCurrentStep(index);
                  }}
                  type="button"
                >
                  {stepComplete ? '✓' : index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <div className=" space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="font-light text-3xl text-text-primary leading-[1.1] tracking-tight md:text-4xl">
              {steps[currentStep].name}
            </h1>
            <p className="mx-auto max-w-md text-base/7 text-text-secondary">
              {steps[currentStep].description}
            </p>
          </div>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="relative">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    initial={{ opacity: 0, x: 32 }}
                    key={currentStep}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {currentStep === 0 && <Focus control={form.control} />}
                    {currentStep === 1 && <Goal control={form.control} />}
                    {currentStep === 2 && <Level control={form.control} />}
                    {currentStep === 3 && (
                      <LanguageAndStyle control={form.control} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between pt-6">
                {currentStep > 0 ? (
                  <Button
                    disabled={isPending}
                    onClick={prevStep}
                    size="lg"
                    type="button"
                    variant={'secondary'}
                  >
                    <ChevronLeft aria-hidden="true" className="mr-2 size-4" />
                    {ONBOARDING_COPY.actions.back}
                  </Button>
                ) : (
                  <span />
                )}
                {currentStep < steps.length - 1 && (
                  <Button
                    disabled={!isCurrentStepValid || isPending}
                    onClick={nextStep}
                    size="lg"
                    type="button"
                  >
                    {ONBOARDING_COPY.actions.next}
                    <ChevronRight aria-hidden="true" className="ml-2 size-4" />
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    aria-label="Finish onboarding setup"
                    disabled={isPending}
                    size="lg"
                    type="submit"
                  >
                    {isPending ? (
                      ONBOARDING_COPY.actions.saving
                    ) : (
                      <>
                        {ONBOARDING_COPY.actions.finishSetup}
                        <Check aria-hidden="true" className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Focus({ control }: { control: Control<FormData> }) {
  return (
    <FormField
      control={control}
      name="learningGoals"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="field-label font-medium text-base">
            {ONBOARDING_COPY.labels.focusAreas}
          </FormLabel>
          <FormControl className="w-full">
            <FocusSelectionCards
              onValueChange={field.onChange}
              selectedValues={field.value}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function Goal({ control }: { control: Control<FormData> }) {
  // Learning goals from copy constants
  const learningGoals = ONBOARDING_COPY.learningGoals.map((goal) => ({
    ...goal,
    icon:
      goal.id === 'web-development' ? (
        <Code className="h-5 w-5" />
      ) : goal.id === 'ui-design' ? (
        <Palette className="h-5 w-5" />
      ) : goal.id === 'data-science' ? (
        <Target className="h-5 w-5" />
      ) : goal.id === 'mobile-development' ? (
        <Zap className="h-5 w-5" />
      ) : (
        <Code className="h-5 w-5" />
      ),
  }));

  return (
    <FormField
      control={control}
      name="goal"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="field-label font-medium text-base">
            {ONBOARDING_COPY.labels.learningGoal}
          </FormLabel>
          <FormControl className="w-full">
            <div className="space-y-4">
              {/* Interactive Goal Selection Cards */}
              <GoalSelectionCards
                goals={learningGoals}
                maxSelections={1}
                onValueChange={field.onChange}
                selectedValue={field.value}
              />
            </div>
          </FormControl>
          <FormMessage className="field-error" />
        </FormItem>
      )}
    />
  );
}

function LanguageAndStyle({ control }: { control: Control<FormData> }) {
  return (
    <FormField
      control={control}
      name="languagePreference"
      render={({ field: languageField }) => (
        <FormItem className="space-y-6">
          <FormControl className="w-full">
            <FormField
              control={control}
              name="explanationStyle"
              render={({ field: styleField }) => (
                <LanguageStyleCards
                  onLanguageChange={languageField.onChange}
                  onStyleChange={styleField.onChange}
                  selectedLanguage={languageField.value}
                  selectedStyle={styleField.value}
                />
              )}
            />
          </FormControl>
          <FormMessage className="field-error" />
        </FormItem>
      )}
    />
  );
}

function Level({ control }: { control: Control<FormData> }) {
  return (
    <FormField
      control={control}
      name="level"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="field-label font-medium text-base">
            {ONBOARDING_COPY.labels.currentLevel}
          </FormLabel>
          <FormControl className="w-full">
            <LevelSelectionCards
              onValueChange={field.onChange}
              selectedValue={field.value}
            />
          </FormControl>
          <FormMessage className="field-error" />
        </FormItem>
      )}
    />
  );
}
