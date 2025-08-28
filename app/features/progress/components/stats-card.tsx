import type React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  color = 'text-accent',
}) => {
  return (
    <div className="tinted-blur-subtle relative flex flex-col rounded-2xl p-6 transition-all duration-200 hover:bg-white/8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-2xl">{icon}</div>
        <div className={`font-bold text-2xl ${color}`}>{value}</div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-sm text-text-primary tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-text-secondary text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
