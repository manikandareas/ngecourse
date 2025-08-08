import { Check, Goal } from 'lucide-react';
import { cn } from '~/lib/utils';

export type LearningOutcomesProps = {
  className?: string;
  title?: string;
  items?: string[];
};

const defaultItems: string[] = [
  'Build real web development projects for your portfolio.',
  'Learn modern technologies: JavaScript, React, Node.',
  'Create production-ready websites and web apps.',
  'Master frontend development best practices.',
  'Understand backend fundamentals with Node.',
  'Gain confidence to apply for junior developer roles.',
  'Work as a freelance web developer.',
  'Learn professional developer workflows.',
];

export function LearningOutcomes({
  className,
  title = 'You will learn',
  items = defaultItems,
}: LearningOutcomesProps) {
  return (
    <section className={cn('w-full', className)}>
      <h3 className="flex items-center gap-2 font-semibold text-lg">
        <Goal size={18} />
        {title}
      </h3>
      <ul className="grid gap-x-8 gap-y-2 px-6 py-5 md:grid-cols-2">
        {items.map((text) => (
          <li className="flex items-start gap-3 leading-relaxed" key={text}>
            <Check aria-hidden className="mt-1 size-4 text-primary" />
            <span className="text-muted-foreground text-sm">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LearningOutcomes;
