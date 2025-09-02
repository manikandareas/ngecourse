import { useMemo } from 'react';
import { Calendar } from '~/components/ui/calendar';
import { cn } from '~/lib/utils';

interface StreakCalendarProps {
  streakStartDate?: number | null;
  studyStreak?: number | null;
  className?: string;
}

export function StreakCalendar({
  streakStartDate,
  studyStreak = 0,
  className,
}: StreakCalendarProps) {
  const { activityDays, currentStreakDays, currentMonth } = useMemo(() => {
    const today = new Date();
    const streakCount = studyStreak || 0;
    const startingDate = streakStartDate ? new Date(streakStartDate) : null;
    
    const activityDates: Date[] = [];
    const currentStreakDates: Date[] = [];
    
    if (startingDate && streakCount > 0) {
      // Generate activity days based on streak
      for (let i = 0; i < streakCount; i++) {
        const streakDay = new Date(startingDate);
        streakDay.setDate(startingDate.getDate() + i);
        
        activityDates.push(streakDay);
        currentStreakDates.push(streakDay);
      }
    }
    
    // Display the current month to show recent activity
    const month = today;
    
    return { activityDays: activityDates, currentStreakDays: currentStreakDates, currentMonth: month };
  }, [streakStartDate, studyStreak]);

  const modifiersClassNames = {
    hasActivity: 'border-success bg-success',
    currentStreak: 'border-accent bg-accent',
    today: 'ring-1 ring-accent ring-offset-1 ring-offset-background',
  };

  const modifiers = {
    hasActivity: activityDays,
    currentStreak: currentStreakDays,
    today: new Date(),
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-text-primary">
          Study Streak: {studyStreak || 0} days 🔥
        </h3>
        <span className="text-text-secondary text-xs">
          Current month
        </span>
      </div>
      
      <div className="space-y-1">
        <Calendar
          className="rounded-md"
          classNames={{
            root: 'w-full',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'w-8 rounded-md font-normal text-[0.8rem] text-text-secondary',
            row: 'mt-2 flex w-full',
            cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
            day: cn(
              'inline-flex h-6 w-6 items-center justify-center rounded-sm border border-hairline bg-white/5 text-xs transition-colors hover:bg-white/10'
            ),
            day_selected: 'bg-primary text-primary-foreground',
            day_today: 'ring-1 ring-accent ring-offset-1 ring-offset-background',
            day_outside: 'opacity-50 text-text-secondary',
            day_disabled: 'opacity-50 text-text-secondary',
            day_hidden: 'invisible',
          }}
          defaultMonth={currentMonth}
          mode="single"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          onDayClick={(_day) => {
            // Add click handler for day details if needed
            // Could show streak details for the day
          }}
          showOutsideDays={false}
        />
      </div>

      {/* Streak stats */}
      <div className="flex items-center justify-between text-text-secondary text-xs">
        <span>
          {streakStartDate && studyStreak && studyStreak > 0
            ? `Started ${new Date(streakStartDate).toLocaleDateString()}`
            : 'No streak yet'}
        </span>
        <span>
          🔥 = Current streak
        </span>
      </div>
    </div>
  );
}