import { BarChart3, BookOpen, Calendar, Clock, Target, TrendingUp, Zap } from 'lucide-react';
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
  const currentStreak = user?.studyStreak || 0;
  
  const insights = useMemo(() => {
    const totalStudyMinutes = analytics?.totalStudyTimeMinutes || 0;
    const averageSessionTime = analytics?.averageSessionTime || 0;
    const currentLevel = analytics?.currentLevel || 1;
    const totalXP = analytics?.totalXP || 0;
    const totalEnrollments = activityStats?.totalEnrollments || 0;
    const completedCourses = activityStats?.completedCourses || 0;
    const averageQuizScore = activityStats?.averageQuizScore || 0;
    
    // Calculate XP needed for next level (example formula)
    const xpForNextLevel = currentLevel * 100;
    const xpProgress = totalXP % xpForNextLevel;
    const xpProgressPercent = Math.floor((xpProgress / xpForNextLevel) * 100);

    // Calculate completion rate
    const completionRate = totalEnrollments > 0 
      ? Math.floor((completedCourses / totalEnrollments) * 100) 
      : 0;

    // Determine study consistency level
    const studyConsistency = currentStreak > 7 ? 'excellent' 
      : currentStreak > 3 ? 'good' 
      : currentStreak > 0 ? 'fair' 
      : 'needs improvement';

    // Determine performance level
    const performanceLevel = averageQuizScore >= 90 ? 'excellent'
      : averageQuizScore >= 80 ? 'good'
      : averageQuizScore >= 70 ? 'fair'
      : 'needs improvement';

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
        totalEnrollments,
        completedCourses,
        averageQuizScore,
        contentCompleted: activityStats?.totalContentCompleted || 0,
        completionRate,
      },
      performance: {
        consistency: studyConsistency,
        level: performanceLevel,
        streak: currentStreak,
      },
    };
  }, [analytics, activityStats, currentStreak]);

  const getInsightColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-info';
      case 'fair': return 'text-warning';
      default: return 'text-error';
    }
  };

  const getInsightBgColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-success/20';
      case 'good': return 'bg-info/20';
      case 'fair': return 'bg-warning/20';
      default: return 'bg-error/20';
    }
  };

  const analyticsCards = [
    {
      icon: Clock,
      title: 'Study Time',
      value: `${insights.studyTime.total}h`,
      subtitle: `${insights.studyTime.average}min avg session`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      icon: Target,
      title: 'Consistency',
      value: insights.performance.consistency.charAt(0).toUpperCase() + insights.performance.consistency.slice(1),
      subtitle: `${insights.performance.streak} day streak`,
      color: getInsightColor(insights.performance.consistency),
      bgColor: getInsightBgColor(insights.performance.consistency),
    },
    {
      icon: BookOpen,
      title: 'Completion Rate',
      value: `${insights.activity.completionRate}%`,
      subtitle: `${insights.activity.completedCourses}/${insights.activity.totalEnrollments} courses`,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: BarChart3,
      title: 'Quiz Performance',
      value: `${Math.floor(insights.activity.averageQuizScore)}%`,
      subtitle: insights.performance.level.charAt(0).toUpperCase() + insights.performance.level.slice(1),
      color: getInsightColor(insights.performance.level),
      bgColor: getInsightBgColor(insights.performance.level),
    },
  ];

  // Smart recommendations based on performance
  const recommendations = useMemo(() => {
    const recs = [];

    // Study consistency recommendations
    if (currentStreak === 0) {
      recs.push({
        icon: Calendar,
        title: 'Start Your Learning Journey',
        description: 'Complete a lesson today to begin building your study habit.',
        color: 'text-accent',
        bgColor: 'bg-accent/20',
      });
    } else if (currentStreak < 7) {
      recs.push({
        icon: Target,
        title: 'Build Consistency',
        description: `${7 - currentStreak} more days to reach a week streak!`,
        color: 'text-info',
        bgColor: 'bg-info/20',
      });
    }

    // Session time recommendations
    if (insights.studyTime.average < 20) {
      recs.push({
        icon: Clock,
        title: 'Extend Study Sessions',
        description: 'Try studying for 30-45 minutes for better retention.',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
      });
    }

    // Performance recommendations
    if (insights.activity.averageQuizScore < 80) {
      recs.push({
        icon: Zap,
        title: 'Review Before Quizzes',
        description: 'Spend extra time reviewing lesson content before taking quizzes.',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/20',
      });
    }

    // If no specific recommendations, add a general one
    if (recs.length === 0) {
      recs.push({
        icon: Target,
        title: 'Keep Up the Great Work!',
        description: 'You\'re doing excellent. Consider taking on more challenging courses.',
        color: 'text-success',
        bgColor: 'bg-success/20',
      });
    }

    return recs.slice(0, 2); // Limit to 2 recommendations to avoid clutter
  }, [currentStreak, insights]);

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

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-text-primary">
            Personalized Recommendations
          </h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={cn('rounded-lg border border-hairline p-4', rec.bgColor)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('rounded-full p-1', rec.bgColor)}>
                    <rec.icon className={cn('h-4 w-4', rec.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn('font-medium text-sm mb-1', rec.color)}>
                      {rec.title}
                    </div>
                    <p className="text-text-secondary text-xs">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills insights - Only show if available */}
      {analytics?.strongestSkills && analytics.strongestSkills.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-text-primary">
            Strong Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {analytics.strongestSkills.slice(0, 3).map((skill) => (
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
    </div>
  );
}