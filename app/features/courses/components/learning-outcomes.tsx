import { Check } from 'lucide-react';
import { cn } from '~/lib/utils';
import { COURSE_DETAIL_COPY } from '../constants/course-detail-copy';

export type LearningOutcomesProps = {
  className?: string;
  items?: string[];
};

const defaultItems: readonly string[] =
  COURSE_DETAIL_COPY.contents.outcomes.defaultItems;

export function LearningOutcomes({
  className,
  items = defaultItems,
}: LearningOutcomesProps) {
  return (
    <section className={cn('w-full', className)}>
      <ul className="grid gap-x-8 gap-y-3 px-4 py-5 md:grid-cols-2">
        {items.map((text) => (
          <li className="flex items-start gap-3 leading-relaxed" key={text}>
            <Check aria-hidden className="mt-1 size-4 text-primary" />
            <span className="text-sm">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LearningOutcomes;
