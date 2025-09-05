import { Calendar, Star, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import type { User } from 'sanity.types';
import { cn } from '~/lib/utils';
import { PROGRESS_COPY } from '../constants/copy';
import { AchievementsBadges } from './achievements-badges';
import { ActivityFeed } from './activity-feed';
import { StreakOverview } from './streak-overview';

interface ActivityTabsProps {
  user: User | null;
  recentlyCompleted: any[];
  recentQuizAttempts: any[];
  achievements: any[];
  isLoading?: boolean;
}

type TabId = 'streak' | 'activity' | 'achievements';

const tabs: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}> = [
  {
    id: 'streak',
    label: PROGRESS_COPY.tabs.streak,
    icon: TrendingUp,
    color: 'text-orange-400'
  },
  {
    id: 'activity',
    label: PROGRESS_COPY.tabs.activity,
    icon: Calendar,
    color: 'text-blue-400'
  },
  {
    id: 'achievements',
    label: PROGRESS_COPY.tabs.achievements,
    icon: Star,
    color: 'text-yellow-400'
  }
];

export function ActivityTabs({
  user,
  recentlyCompleted,
  recentQuizAttempts,
  achievements,
  isLoading = false
}: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('streak');

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Tab skeleton */}
        <div className="flex space-x-1 rounded-2xl bg-white/5 p-1 backdrop-blur-sm">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="flex-1 rounded-xl bg-white/10 px-4 py-3 animate-pulse"
            />
          ))}
        </div>
        
        {/* Content skeleton */}
        <div className="rounded-2xl bg-white/[0.02] p-6 backdrop-blur-xl border border-white/5">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-32 rounded bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 w-full rounded bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'streak':
        return <StreakOverview user={user} />;
      case 'activity':
        return (
          <ActivityFeed
            recentlyCompletedContent={recentlyCompleted}
            recentQuizAttempts={recentQuizAttempts}
          />
        );
      case 'achievements':
        return <AchievementsBadges achievements={achievements} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 rounded-2xl bg-white/5 p-1 backdrop-blur-sm border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-text-primary shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? tab.color : '')} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <div className="rounded-2xl bg-white/[0.02] p-6 backdrop-blur-xl border border-white/5 transition-all duration-300 hover:border-white/10">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}