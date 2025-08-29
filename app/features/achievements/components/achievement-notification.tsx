import { Trophy, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { Achievement } from '../types';

interface AchievementNotificationProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const AchievementNotification: React.FC<
  AchievementNotificationProps
> = ({
  achievement,
  isVisible,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
        isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="w-80 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 shadow-2xl backdrop-blur-lg">
        <div className="relative p-4">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 rounded-full p-1 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3 pr-6">
            {/* Icon */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-xl">
              <Trophy className="h-6 w-6 text-yellow-400" />
            </div>

            {/* Achievement Details */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 font-bold text-sm text-yellow-400">
                🎉 Achievement Unlocked!
              </div>
              <div className="mb-1 font-medium text-sm text-text-primary">
                {achievement.title}
              </div>
              <div className="mb-2 text-text-secondary text-xs">
                {achievement.description}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="text-accent text-xs">
                  +{achievement.points} XP
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {autoClose && (
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all ease-linear"
                style={{
                  width: '100%',
                  animation: `shrink ${autoCloseDelay}ms linear`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Achievement Notification Manager Hook
export const useAchievementNotifications = () => {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      achievement: Achievement;
      visible: boolean;
    }>
  >([]);

  const showNotification = (achievement: Achievement) => {
    const id = `${achievement.id}-${Date.now()}`;
    setNotifications((prev) => [...prev, { id, achievement, visible: true }]);
  };

  const hideNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, visible: false } : notif
      )
    );

    // Remove from array after animation
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 300);
  };

  const NotificationContainer: React.FC = () => (
    <div className="fixed top-0 right-0 z-50">
      {notifications.map((notif, index) => (
        <div
          key={notif.id}
          style={{
            transform: `translateY(${index * 100}px)`,
            zIndex: 50 - index,
          }}
        >
          <AchievementNotification
            achievement={notif.achievement}
            isVisible={notif.visible}
            onClose={() => hideNotification(notif.id)}
          />
        </div>
      ))}
    </div>
  );

  return {
    showNotification,
    NotificationContainer,
  };
};
