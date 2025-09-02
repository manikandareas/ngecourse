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
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-accent/5">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-3 text-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <div className={`font-bold text-2xl transition-all duration-300 group-hover:scale-110 ${color}`}>
            {value}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-text-primary tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-text-secondary/80 text-xs leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-accent/20 via-purple-500/20 to-accent/20 opacity-0 transition-opacity duration-300 group-hover:opacity-20" 
           style={{
             background: 'linear-gradient(90deg, transparent, rgba(var(--accent), 0.1), transparent)',
             mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             maskComposite: 'subtract'
           }} />
    </div>
  );
};
