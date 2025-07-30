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
import { Progress } from '~/components/ui/progress';
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

  const nextStep = () =>
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl space-y-8 rounded-xl bg-card p-10 text-card-foreground">
        <div className="space-y-4">
          <h1 className="font-semibold text-3xl tracking-tight">
            {steps[currentStep].name}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 0 && <LearningGoals control={form.control} />}
            {currentStep === 1 && <StudyReason control={form.control} />}
            {currentStep === 2 && <Level control={form.control} />}
            {currentStep === 3 && <StudyPlan control={form.control} />}

            <div className="flex justify-between pt-4">
              {currentStep > 0 ? (
                <Button
                  onClick={prevStep}
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  Back
                </Button>
              ) : (
                <span />
              )}
              {currentStep < steps.length - 1 && (
                <Button onClick={nextStep} size="lg" type="button">
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  disabled={form.formState.isSubmitting}
                  size="lg"
                  type="submit"
                >
                  {form.formState.isSubmitting ? 'Saving...' : 'Finish Setup'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <div className="absolute right-0 bottom-0 left-0 p-4">
        <Progress
          className="h-2 w-full rounded-full"
          value={(currentStep + 1) * 25}
        />
      </div>
    </div>
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
        <FormItem className="space-y-4">
          <FormLabel className="font-medium text-lg">Learning Goals</FormLabel>
          <FormControl className="w-full">
            <div className="w-full space-y-4">
              <Input
                className="mb-2"
                placeholder="e.g., Web Development, Machine Learning"
                readOnly
                value={field.value.join(', ')}
              />
              <p className="text-muted-foreground text-sm">Popular choices</p>
              <ToggleGroup
                className="grid w-full grid-cols-1 gap-3 md:grid-cols-2"
                defaultValue={field.value}
                onValueChange={field.onChange}
                type="multiple"
                variant={'outline'}
              >
                {learningGoalOptions.map((option) => (
                  <ToggleGroupItem
                    className="justify-start px-4 py-3 text-left font-medium hover:text-primary-foreground"
                    key={option}
                    value={option}
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </FormControl>
          <FormMessage />
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
        <FormItem className="space-y-4">
          <FormLabel className="font-medium text-lg">
            Select your motivation
          </FormLabel>
          <FormControl className="w-full">
            <ToggleGroup
              className="grid w-full grid-cols-1 gap-3"
              defaultValue={field.value}
              onValueChange={field.onChange}
              type="single"
            >
              {motivationOptions.map((option) => (
                <ToggleGroupItem
                  className="justify-start px-4 py-3 text-left font-medium hover:text-primary-foreground"
                  key={option.value}
                  value={option.value}
                  variant={'outline'}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
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
        <FormItem className="space-y-4">
          <FormLabel className="font-medium text-lg">
            Choose your usage style
          </FormLabel>
          <FormControl className="w-full">
            <ToggleGroup
              className="grid w-full grid-cols-1 gap-3 "
              defaultValue={field.value}
              onValueChange={field.onChange}
              type="single"
            >
              {studyPlanOptions.map((option) => (
                <ToggleGroupItem
                  className="flex h-auto flex-col items-start justify-start p-4 text-left hover:text-primary-foreground"
                  key={option.value}
                  value={option.value}
                  variant={'outline'}
                >
                  <span className="mb-1 font-semibold text-base hover:text-primary-foreground">
                    {option.label}
                  </span>
                  <p
                    className={cn(
                      'text-muted-foreground text-sm leading-relaxed hover:text-primary-foreground',
                      field.value === option.value && 'text-primary-foreground'
                    )}
                  >
                    {option.description}
                  </p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
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
        <FormItem className="space-y-4">
          <FormLabel className="font-medium text-lg">
            Select your current level
          </FormLabel>
          <FormControl className="w-full">
            <ToggleGroup
              className="grid w-full grid-cols-1 gap-3"
              defaultValue={field.value}
              onValueChange={field.onChange}
              type="single"
            >
              {levelOptions.map((option) => (
                <ToggleGroupItem
                  className="flex h-auto flex-col items-start justify-start p-4 text-left"
                  key={option.value}
                  value={option.value}
                  variant={'outline'}
                >
                  <span className="mb-1 font-semibold text-base hover:text-primary-foreground">
                    {option.label}
                  </span>
                  <p
                    className={cn(
                      'text-wrap text-muted-foreground text-sm leading-relaxed hover:text-primary-foreground',
                      field.value === option.value && 'text-primary-foreground'
                    )}
                  >
                    {option.description}
                  </p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
