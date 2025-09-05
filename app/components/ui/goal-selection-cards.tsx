import { AnimatePresence, motion } from 'framer-motion';
import { Check, Code, Palette, Target, Zap } from 'lucide-react';
import { useState } from 'react';
import { ONBOARDING_COPY } from '~/features/shared/constants/onboarding-copy';
import { cn } from '~/lib/utils';

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  quote?: string; // Added for feedback quotes
}

interface GoalSelectionCardsProps {
  goals?: LearningGoal[];
  maxSelections?: number;
  className?: string;
  selectedValue?: string; // For form integration
  onValueChange?: (value: string) => void; // For form integration
}

const getIconForGoal = (id: string) => {
  switch (id) {
    case 'web-development':
      return <Code className="h-6 w-6" />;
    case 'ui-design':
      return <Palette className="h-6 w-6" />;
    case 'data-science':
      return <Target className="h-6 w-6" />;
    case 'mobile-development':
      return <Zap className="h-6 w-6" />;
    default:
      return <Code className="h-6 w-6" />;
  }
};

const defaultGoals: LearningGoal[] = ONBOARDING_COPY.learningGoals.map(goal => ({
  id: goal.id,
  title: goal.title,
  description: goal.description,
  icon: getIconForGoal(goal.id),
  category: goal.category,
  difficulty: goal.difficulty as 'beginner' | 'intermediate' | 'advanced',
  quote: goal.quote,
}));

const difficultyColors = {
  beginner:
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  intermediate:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
};

const difficultyLabels = {
  beginner: 'Pemula',
  intermediate: 'Menengah', 
  advanced: 'Mahir',
};

export function GoalSelectionCards({
  goals = defaultGoals,
  maxSelections = 1, // Changed default to 1 for the form
  className,
  selectedValue,
  onValueChange,
}: GoalSelectionCardsProps) {
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(
    new Set(selectedValue ? [selectedValue] : [])
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState<string | null>(null);

  const handleCardClick = (goal: LearningGoal) => {
    if (maxSelections === 1) {
      if (selectedGoals.has(goal.id)) return;

      setSelectedGoals(new Set([goal.id]));
      onValueChange?.(goal.id);
      setShowQuote(goal.quote || '');
      return;
    }

    if (selectedGoals.size < maxSelections) {
      setSelectedGoals(new Set([...selectedGoals, goal.id]));
      const newValue = [...selectedGoals, goal.id].join(',');
      onValueChange?.(newValue);
      setShowQuote(goal.quote || '');
      return;
    }
  };

  const isSelected = (goalId: string) => selectedGoals.has(goalId);
  const isMaxReached = selectedGoals.size >= maxSelections;

  return (
    <div className={cn('w-full', className)}>
      {/* Feedback quote tooltip */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-accent bg-accent/20 p-4 text-accent-foreground"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm italic">{showQuote}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {goals.map((goal, index) => {
          const selected = isSelected(goal.id);
          const hovered = hoveredCard === goal.id;

          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              key={goal.id}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
            >
              <motion.div
                className={cn(
                  'group relative cursor-pointer rounded-xl border-2 bg-white/5 p-4 transition-all duration-200 hover:shadow-lg',
                  selected
                    ? 'border-accent bg-accent/20 shadow-md'
                    : 'border-border hover:border-accent/50'
                )}
                onClick={() => handleCardClick(goal)}
                onMouseEnter={() => setHoveredCard(goal.id)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection indicator */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent"
                      exit={{ scale: 0, opacity: 0 }}
                      initial={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <Check className="h-4 w-4 text-accent-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content */}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                      selected
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-white/10 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent'
                    )}
                  >
                    {goal.icon}
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={cn(
                        'font-semibold text-base transition-colors',
                        selected ? 'text-accent' : 'text-foreground'
                      )}
                    >
                      {goal.title}
                    </h3>
                    <p className="line-clamp-2 text-muted-foreground text-xs">
                      {goal.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-medium text-xs',
                          difficultyColors[goal.difficulty]
                        )}
                      >
                        {difficultyLabels[goal.difficulty]}
                      </span>
                      <span className="font-medium text-muted-foreground text-xs">
                        {goal.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <AnimatePresence>
                  {hovered && !selected && (
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="pointer-events-none absolute inset-0 rounded-xl bg-accent/5"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
