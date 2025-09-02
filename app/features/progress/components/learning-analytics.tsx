import { BarChart3, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import type { User } from 'sanity.types';
import { cn } from '~/lib/utils';

interface LearningAnalyticsProps {
  user: User | null;
  activityStats: any; // This would be properly typed based on your activity stats query
  className?: string;
}

export function LearningAnalytics({ user, activityStats, className }: LearningAnalyticsProps) {
  const analytics = user?.analytics;
  
  const insights = useMemo(() => {
    const totalStudyMinutes = analytics?.totalStudyTimeMinutes || 0;
    const averageSessionTime = analytics?.averageSessionTime || 0;
    const currentLevel = analytics?.currentLevel || 1;
    const totalXP = analytics?.totalXP || 0;
    
    // Calculate XP needed for next level (example formula)
    const xpForNextLevel = currentLevel * 100;
    const xpProgress = totalXP % xpForNextLevel;
    const xpProgressPercent = Math.floor((xpProgress / xpForNextLevel) * 100);

    return {
      studyTime: {
        total: Math.floor(totalStudyMinutes / 60), // hours
        average: averageSessionTime,
        dailyAverage: totalStudyMinutes > 0 ? Math.floor(totalStudyMinutes / 7) : 0, // rough weekly average
      },
      level: {
        current: currentLevel,
        xpProgress,
        xpNeeded: xpForNextLevel - xpProgress,
        progressPercent: xpProgressPercent,
      },
      activity: {
        totalEnrollments: activityStats?.totalEnrollments || 0,
        completedCourses: activityStats?.completedCourses || 0,
        averageQuizScore: activityStats?.averageQuizScore || 0,
        contentCompleted: activityStats?.totalContentCompleted || 0,
      },
    };
  }, [analytics, activityStats]);

  const analyticsCards = [
    {
      icon: Clock,
      title: 'Study Time',
      value: `${insights.studyTime.total}h`,
      subtitle: `Avg: ${insights.studyTime.average}min/session`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      icon: TrendingUp,
      title: 'Level Progress',
      value: `Level ${insights.level.current}`,
      subtitle: `${insights.level.progressPercent}% to next level`,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: BookOpen,
      title: 'Content Completed',
      value: insights.activity.contentCompleted,
      subtitle: `Across ${insights.activity.totalEnrollments} courses`,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: BarChart3,
      title: 'Quiz Performance',
      value: `${Math.floor(insights.activity.averageQuizScore)}%`,
      subtitle: 'Average quiz score',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-text-primary">
          Learning Analytics
        </h3>
        <span className="text-text-secondary text-xs">
          Your progress insights
        </span>
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {analyticsCards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-hairline bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <div className={cn('rounded-full p-2', card.bgColor)}>
                <card.icon className={cn('h-4 w-4', card.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn('font-bold text-lg', card.color)}>
                    {card.value}
                  </span>
                  <span className="font-medium text-sm text-text-primary">
                    {card.title}
                  </span>
                </div>
                <p className="text-text-secondary text-xs truncate">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Level progress bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-text-primary">
            Level {insights.level.current} Progress
          </span>
          <span className="text-text-secondary text-xs">
            {insights.level.xpNeeded} XP to next level
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${insights.level.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Study recommendations */}
      {insights.studyTime.total < 5 && (
        <div className="rounded-lg border border-info/20 bg-info/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-info" />
            <span className="font-medium text-sm text-text-primary">
              Study Recommendation
            </span>
          </div>
          <p className="text-text-secondary text-xs">
            Try to study for at least 30 minutes daily to maintain consistent progress and build a strong learning habit.
          </p>
        </div>
      )}

      {/* Skills insights */}
      {analytics?.strongestSkills && analytics.strongestSkills.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-text-primary">
            Your Strongest Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {analytics.strongestSkills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-success/20 px-3 py-1 text-success text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement areas */}
      {analytics?.improvementAreas && analytics.improvementAreas.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-text-primary">
            Areas for Improvement
          </h4>
          <div className="flex flex-wrap gap-2">
            {analytics.improvementAreas.slice(0, 3).map((area) => (
              <span
                key={area}
                className="rounded-full bg-warning/20 px-3 py-1 text-warning text-xs"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}