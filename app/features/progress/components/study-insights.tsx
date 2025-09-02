import { Calendar, Clock, Target, Zap } from 'lucide-react';
import { useMemo } from 'react';
import type { User } from 'sanity.types';
import { cn } from '~/lib/utils';

interface StudyInsightsProps {
  user: User | null;
  activityStats: any;
  className?: string;
}

export function StudyInsights({ user, activityStats, className }: StudyInsightsProps) {
  const analytics = user?.analytics;
  const currentStreak = user?.studyStreak || 0;
  
  const insights = useMemo(() => {
    const totalStudyMinutes = analytics?.totalStudyTimeMinutes || 0;
    const averageSessionTime = analytics?.averageSessionTime || 0;
    const totalEnrollments = activityStats?.totalEnrollments || 0;
    const completedCourses = activityStats?.completedCourses || 0;
    const averageQuizScore = activityStats?.averageQuizScore || 0;

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
      studyHabits: {
        consistency: studyConsistency,
        averageSession: averageSessionTime,
        totalTime: totalStudyMinutes,
        streak: currentStreak,
      },
      performance: {
        level: performanceLevel,
        quizScore: averageQuizScore,
        completionRate,
        coursesCompleted: completedCourses,
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
    if (insights.studyHabits.averageSession < 20) {
      recs.push({
        icon: Clock,
        title: 'Extend Study Sessions',
        description: 'Try studying for 30-45 minutes for better retention.',
        color: 'text-warning',
        bgColor: 'bg-warning/20',
      });
    }

    // Performance recommendations
    if (insights.performance.quizScore < 80) {
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

    return recs;
  }, [currentStreak, insights]);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-text-primary">
          Study Insights
        </h3>
        <span className="text-text-secondary text-xs">
          Personalized for you
        </span>
      </div>

      {/* Performance overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="text-center">
            <div className={cn('font-bold text-2xl', getInsightColor(insights.studyHabits.consistency))}>
              {insights.studyHabits.consistency.charAt(0).toUpperCase() + insights.studyHabits.consistency.slice(1)}
            </div>
            <p className="text-text-secondary text-xs">Study Consistency</p>
          </div>
          <div className={cn('rounded-lg px-3 py-2 text-center', getInsightBgColor(insights.studyHabits.consistency))}>
            <div className={cn('font-semibold text-sm', getInsightColor(insights.studyHabits.consistency))}>
              {currentStreak} day streak
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <div className={cn('font-bold text-2xl', getInsightColor(insights.performance.level))}>
              {insights.performance.level.charAt(0).toUpperCase() + insights.performance.level.slice(1)}
            </div>
            <p className="text-text-secondary text-xs">Quiz Performance</p>
          </div>
          <div className={cn('rounded-lg px-3 py-2 text-center', getInsightBgColor(insights.performance.level))}>
            <div className={cn('font-semibold text-sm', getInsightColor(insights.performance.level))}>
              {Math.floor(insights.performance.quizScore)}% average
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="font-bold text-lg text-text-primary">
            {Math.floor(insights.studyHabits.totalTime / 60)}h
          </div>
          <p className="text-text-secondary text-xs">Total Study Time</p>
        </div>
        <div>
          <div className="font-bold text-lg text-text-primary">
            {insights.performance.completionRate}%
          </div>
          <p className="text-text-secondary text-xs">Completion Rate</p>
        </div>
        <div>
          <div className="font-bold text-lg text-text-primary">
            {insights.studyHabits.averageSession}m
          </div>
          <p className="text-text-secondary text-xs">Avg Session</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-text-primary">
          Recommendations
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
    </div>
  );
}