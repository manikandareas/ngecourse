// Event types that match the Hono API specification
export type EventType = 'session_started' | 'lesson_completed' | 'quiz_completed' | 'session_ended';

// Base event payload interface
export interface BaseEventPayload {
  eventType: EventType;
  courseId?: string;
  metadata?: Record<string, any>;
}

// Session started event
export interface SessionStartedPayload extends BaseEventPayload {
  eventType: 'session_started';
  courseId?: string;
  metadata?: {
    platform?: 'web' | 'mobile' | 'tablet';
    device?: string;
    timestamp?: string;
    [key: string]: any;
  };
}

// Lesson completed event
export interface LessonCompletedPayload extends BaseEventPayload {
  eventType: 'lesson_completed';
  contentId: string;
  courseId?: string;
  timeSpent?: number; // minutes
  metadata?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    completionRate?: number;
    completedAt?: string;
    [key: string]: any;
  };
}

// Quiz completed event
export interface QuizCompletedPayload extends BaseEventPayload {
  eventType: 'quiz_completed';
  contentId: string;
  courseId?: string;
  timeSpent?: number; // minutes
  metadata?: {
    score?: number;
    percentage?: number;
    totalQuestions?: number;
    correctAnswers?: number;
    completedAt?: string;
    [key: string]: any;
  };
}

// Session ended event
export interface SessionEndedPayload extends BaseEventPayload {
  eventType: 'session_ended';
  metadata?: {
    reason?: 'manual' | 'timeout' | 'navigation';
    endedAt?: string;
    [key: string]: any;
  };
}

// Union type for all event payloads
export type EventPayload = 
  | SessionStartedPayload 
  | LessonCompletedPayload 
  | QuizCompletedPayload 
  | SessionEndedPayload;

// API Response types
export interface EventResponse {
  success: boolean;
  data?: {
    message?: string;
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Queued event for offline handling
export interface QueuedEvent extends EventPayload {
  id: string;
  timestamp: number;
  retryCount: number;
  lastAttempt?: number;
}

// Event tracker configuration
export interface EventTrackerConfig {
  apiEndpoint: string;
  maxRetries: number;
  retryDelayMs: number;
  offlineStorageKey: string;
  enableOfflineQueue: boolean;
}