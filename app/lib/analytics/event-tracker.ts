import { getPublicEnv } from '~/env.public';
import type {
  EventPayload,
  EventResponse,
  EventTrackerConfig,
  QueuedEvent,
} from './types';

// Default configuration
const DEFAULT_CONFIG: EventTrackerConfig = {
  apiEndpoint: `${getPublicEnv(import.meta.env).EXTERNAL_SERVICE_URL}/api/events`,
  maxRetries: 3,
  retryDelayMs: 1000,
  offlineStorageKey: 'ngecourse_analytics_queue',
  enableOfflineQueue: true,
};

class EventTracker {
  private config: EventTrackerConfig;
  private eventQueue: QueuedEvent[] = [];
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isProcessingQueue = false;

  constructor(config: Partial<EventTrackerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Only setup browser-specific features on client side
    if (typeof window !== 'undefined') {
      this.loadQueueFromStorage();
      this.setupOnlineListener();
      this.setupBeforeUnloadListener();
    }
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private setupBeforeUnloadListener() {
    window.addEventListener('beforeunload', () => {
      this.saveQueueToStorage();
    });
  }

  private loadQueueFromStorage() {
    if (!this.config.enableOfflineQueue) return;

    try {
      const stored = localStorage.getItem(this.config.offlineStorageKey);
      if (stored) {
        this.eventQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load analytics queue from storage:', error);
    }
  }

  private saveQueueToStorage() {
    if (!this.config.enableOfflineQueue || typeof localStorage === 'undefined')
      return;

    try {
      localStorage.setItem(
        this.config.offlineStorageKey,
        JSON.stringify(this.eventQueue)
      );
    } catch (error) {
      console.warn('Failed to save analytics queue to storage:', error);
    }
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async trackEvent(
    payload: EventPayload,
    authToken?: string
  ): Promise<boolean> {
    // If offline or no auth token, queue the event
    if (!(this.isOnline && authToken)) {
      this.queueEvent(payload);
      return false;
    }

    // Try to send the event immediately
    return await this.sendEvent(payload, authToken);
  }

  private async sendEvent(
    payload: EventPayload,
    authToken: string,
    retryCount = 0
  ): Promise<boolean> {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result: EventResponse = await response.json();
        return result.success;
      }

      // If we get a non-OK response and haven't exceeded retries, try again
      if (retryCount < this.config.maxRetries) {
        await this.delay(this.config.retryDelayMs * 2 ** retryCount);
        return this.sendEvent(payload, authToken, retryCount + 1);
      }

      // Max retries exceeded, queue the event
      this.queueEvent(payload);
      return false;
    } catch (error) {
      console.warn('Event tracking request failed:', error);

      // If we haven't exceeded retries, try again
      if (retryCount < this.config.maxRetries) {
        await this.delay(this.config.retryDelayMs * 2 ** retryCount);
        return this.sendEvent(payload, authToken, retryCount + 1);
      }

      // Max retries exceeded, queue the event
      this.queueEvent(payload);
      return false;
    }
  }

  private queueEvent(payload: EventPayload) {
    if (!this.config.enableOfflineQueue) return;

    const queuedEvent: QueuedEvent = {
      ...payload,
      id: this.generateEventId(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.eventQueue.push(queuedEvent);
    this.saveQueueToStorage();
  }

  async processQueue(authToken?: string) {
    if (
      this.isProcessingQueue ||
      !this.isOnline ||
      !authToken ||
      this.eventQueue.length === 0
    ) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.eventQueue.length > 0 && this.isOnline) {
      const event = this.eventQueue.shift();
      if (!event) continue;

      const success = await this.sendEvent(event, authToken);

      if (!success) {
        event.retryCount++;
        event.lastAttempt = Date.now();

        // If we haven't exceeded retries, put it back in the queue
        if (event.retryCount < this.config.maxRetries) {
          this.eventQueue.unshift(event);
        } else {
          console.warn('Event permanently failed after max retries:', event);
        }
        break; // Stop processing queue on failure
      }
    }

    this.saveQueueToStorage();
    this.isProcessingQueue = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get queue status for debugging
  getQueueStatus() {
    return {
      queueLength: this.eventQueue.length,
      isOnline: this.isOnline,
      isProcessing: this.isProcessingQueue,
    };
  }

  // Clear the queue (useful for testing)
  clearQueue() {
    this.eventQueue = [];
    this.saveQueueToStorage();
  }
}

// Global event tracker instance
export const eventTracker = new EventTracker();

// Main tracking function that handles auth automatically
export async function trackEvent(payload: EventPayload): Promise<boolean> {
  // Get auth token from Clerk (this will be overridden in the hook)
  return await eventTracker.trackEvent(payload);
}

// Export the class for custom configurations
export { EventTracker };
