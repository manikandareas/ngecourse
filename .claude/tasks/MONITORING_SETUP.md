# 📊 Comprehensive Monitoring Setup Guide

**Complete monitoring implementation for production readiness**

This guide provides detailed implementation steps for setting up production-grade monitoring, alerting, and observability for your Ngecourse application.

---

## 🎯 Monitoring Strategy Overview

### Monitoring Pillars
1. **Application Performance Monitoring (APM)**
2. **Infrastructure & Resource Monitoring** 
3. **Business & User Experience Metrics**
4. **Security & Compliance Monitoring**
5. **Log Management & Analytics**

### Key Objectives
- Detect issues before users are impacted
- Understand user behavior and application usage
- Optimize performance and resource utilization
- Ensure security and compliance requirements
- Enable data-driven decision making

---

## 🔧 Core Monitoring Stack Implementation

### 1. Sentry Setup for Error Tracking
**Implementation Time: 2 hours**

#### 1.1 Install and Configure Sentry
```bash
bun add @sentry/react @sentry/node @sentry/integrations
```

#### 1.2 Environment Configuration
```env
# Add to your environment schemas and .env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-organization
SENTRY_PROJECT=ngecourse
SENTRY_AUTH_TOKEN=your-auth-token
```

#### 1.3 Client-side Setup
```typescript
// app/lib/sentry.client.ts
import * as Sentry from '@sentry/react';
import { getPublicEnv } from '~/env.public';

const env = getPublicEnv(import.meta.env);

if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV || 'development',
    
    // Performance Monitoring
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // User Context
    beforeSend(event, hint) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error && error.message.includes('ResizeObserver')) {
          return null; // Ignore ResizeObserver errors
        }
      }
      return event;
    },
    
    // Custom Tags
    tags: {
      component: 'frontend',
    },
    
    // Integrations
    integrations: [
      new Sentry.BrowserTracing({
        // Track navigation and page loads
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      new Sentry.Replay({
        // Session replay for debugging
        maskAllText: false,
        blockAllMedia: false,
        sampleRate: 0.1,
        errorSampleRate: 1.0,
      }),
    ],
  });
}
```

#### 1.4 Server-side Setup  
```typescript
// app/lib/sentry.server.ts
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { getEnv } from '~/env.server';

const env = getEnv(process.env);

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  
  // Performance and Profiling
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  integrations: [
    nodeProfilingIntegration(),
  ],
  
  // Custom Tags
  tags: {
    component: 'backend',
    version: process.env.npm_package_version || 'unknown',
  },
  
  // Context
  beforeSend(event) {
    // Add additional context
    event.server_name = process.env.VERCEL_REGION || 'unknown';
    return event;
  },
});

export { Sentry };
```

#### 1.5 Integration with React Router
```typescript
// app/root.tsx - Update error boundary
import * as Sentry from '@sentry/react';

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Send error to Sentry
  Sentry.captureException(error);
  
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  
  // ... rest of error boundary implementation
}
```

### 2. Performance Monitoring Setup
**Implementation Time: 3 hours**

#### 2.1 Core Web Vitals Tracking
```typescript
// app/lib/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import * as Sentry from '@sentry/react';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export function initializeWebVitals() {
  function sendToAnalytics(metric: WebVital) {
    // Send to Sentry
    Sentry.metrics.gauge(`web_vitals.${metric.name}`, metric.value, {
      tags: {
        rating: metric.rating,
        page: window.location.pathname,
      },
    });
    
    // Send to your analytics service
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  }
  
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

#### 2.2 Custom Performance Metrics
```typescript
// app/lib/metrics.ts
import * as Sentry from '@sentry/react';
import { logger } from './logger';

export class ApplicationMetrics {
  private static timers = new Map<string, number>();
  
  // Course-specific metrics
  static startCourseLoad(courseId: string) {
    const key = `course_load_${courseId}`;
    this.timers.set(key, performance.now());
  }
  
  static endCourseLoad(courseId: string, success: boolean) {
    const key = `course_load_${courseId}`;
    const startTime = this.timers.get(key);
    
    if (startTime) {
      const duration = performance.now() - startTime;
      
      Sentry.metrics.timing('course.load_time', duration, {
        tags: { courseId, success: success.toString() },
      });
      
      logger.info('Course load completed', {
        courseId,
        duration,
        success,
      });
      
      this.timers.delete(key);
    }
  }
  
  // Quiz completion metrics
  static trackQuizCompletion(quizId: string, score: number, timeSpent: number) {
    Sentry.metrics.gauge('quiz.completion_score', score, {
      tags: { quizId },
    });
    
    Sentry.metrics.timing('quiz.completion_time', timeSpent, {
      tags: { quizId },
    });
    
    logger.info('Quiz completed', {
      quizId,
      score,
      timeSpent,
    });
  }
  
  // AI Chat metrics
  static trackAIResponse(responseTime: number, success: boolean, tokens?: number) {
    Sentry.metrics.timing('ai.response_time', responseTime, {
      tags: { success: success.toString() },
    });
    
    if (tokens) {
      Sentry.metrics.gauge('ai.tokens_used', tokens);
    }
    
    logger.info('AI response tracked', {
      responseTime,
      success,
      tokens,
    });
  }
}
```

### 3. Structured Logging Implementation
**Implementation Time: 2 hours**

#### 3.1 Logger Configuration
```typescript
// app/lib/logger.ts
import winston from 'winston';
import { getEnv } from '~/env.server';

const env = getEnv(process.env);

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
);

// Create logger instance
export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: {
    service: 'ngecourse',
    version: process.env.npm_package_version || 'unknown',
    environment: env.NODE_ENV,
  },
  transports: [
    // Console for development
    new winston.transports.Console({
      format: env.NODE_ENV === 'development' 
        ? winston.format.combine(winston.format.colorize(), winston.format.simple())
        : winston.format.json(),
    }),
    
    // File transport for production
    ...(env.NODE_ENV === 'production' ? [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 10485760, // 10MB
        maxFiles: 10,
      }),
    ] : []),
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.Console(),
    ...(env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/exceptions.log' })
    ] : []),
  ],
  
  rejectionHandlers: [
    new winston.transports.Console(),
    ...(env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/rejections.log' })
    ] : []),
  ],
});

// Context-aware logging helpers
export const createContextLogger = (context: Record<string, any>) => ({
  debug: (message: string, meta?: Record<string, any>) => 
    logger.debug(message, { ...context, ...meta }),
  info: (message: string, meta?: Record<string, any>) => 
    logger.info(message, { ...context, ...meta }),
  warn: (message: string, meta?: Record<string, any>) => 
    logger.warn(message, { ...context, ...meta }),
  error: (message: string, error?: Error, meta?: Record<string, any>) => 
    logger.error(message, { ...context, error: error?.stack, ...meta }),
});
```

#### 3.2 Request Logging Middleware
```typescript
// app/lib/request-logger.ts
import { logger, createContextLogger } from './logger';
import { randomUUID } from 'crypto';

export function createRequestLogger(request: Request) {
  const requestId = randomUUID();
  const startTime = performance.now();
  
  // Extract request context
  const context = {
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    timestamp: new Date().toISOString(),
  };
  
  const requestLogger = createContextLogger(context);
  
  // Log request start
  requestLogger.info('Request started');
  
  return {
    logger: requestLogger,
    requestId,
    logResponse: (status: number, error?: Error) => {
      const duration = performance.now() - startTime;
      
      if (error) {
        requestLogger.error('Request failed', error, {
          status,
          duration,
        });
      } else {
        requestLogger.info('Request completed', {
          status,
          duration,
        });
      }
    },
  };
}
```

### 4. Business Metrics Dashboard
**Implementation Time: 4 hours**

#### 4.1 User Engagement Tracking
```typescript
// app/lib/analytics.ts
import * as Sentry from '@sentry/react';
import { logger } from './logger';

interface UserEvent {
  eventName: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

export class BusinessAnalytics {
  private static userId?: string;
  
  static setUser(userId: string, properties: Record<string, any> = {}) {
    this.userId = userId;
    
    Sentry.setUser({
      id: userId,
      ...properties,
    });
    
    logger.info('User identified', { userId, properties });
  }
  
  static track(event: UserEvent) {
    const eventData = {
      ...event,
      userId: event.userId || this.userId,
      timestamp: event.timestamp || new Date(),
      sessionId: this.getSessionId(),
      page: window?.location?.pathname,
    };
    
    // Send to Sentry as custom metric
    Sentry.addBreadcrumb({
      message: event.eventName,
      data: eventData.properties,
      type: 'user',
    });
    
    // Log for analysis
    logger.info('User event tracked', eventData);
    
    // Send to external analytics if configured
    this.sendToExternalAnalytics(eventData);
  }
  
  // Course-specific events
  static trackCourseEnrollment(courseId: string, courseName: string) {
    this.track({
      eventName: 'Course Enrolled',
      properties: {
        courseId,
        courseName,
        timestamp: new Date(),
      },
    });
  }
  
  static trackLessonCompletion(lessonId: string, courseId: string, timeSpent: number) {
    this.track({
      eventName: 'Lesson Completed',
      properties: {
        lessonId,
        courseId,
        timeSpent,
        completionDate: new Date(),
      },
    });
  }
  
  static trackQuizAttempt(quizId: string, score: number, passed: boolean) {
    this.track({
      eventName: 'Quiz Attempted',
      properties: {
        quizId,
        score,
        passed,
        attemptDate: new Date(),
      },
    });
  }
  
  static trackAIChatUsage(messageCount: number, sessionDuration: number) {
    this.track({
      eventName: 'AI Chat Session',
      properties: {
        messageCount,
        sessionDuration,
        endTime: new Date(),
      },
    });
  }
  
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
  
  private static sendToExternalAnalytics(event: any) {
    // Integrate with external analytics services
    // Example: Google Analytics, Mixpanel, Amplitude, etc.
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.eventName, {
        custom_parameters: event.properties,
        user_id: event.userId,
      });
    }
  }
}
```

#### 4.2 Real-time Metrics Collection
```typescript
// app/lib/realtime-metrics.ts
interface MetricCollector {
  collect(): Promise<Record<string, number>>;
}

class SystemMetrics implements MetricCollector {
  async collect(): Promise<Record<string, number>> {
    if (typeof window === 'undefined') {
      // Server-side metrics
      return {
        memory_usage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        uptime: process.uptime(),
        cpu_usage: process.cpuUsage().user / 1000, // Convert to ms
      };
    } else {
      // Client-side metrics
      const connection = (navigator as any).connection;
      return {
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        network_speed: connection?.downlink || 0,
        device_memory: (navigator as any).deviceMemory || 0,
      };
    }
  }
}

class UserMetrics implements MetricCollector {
  async collect(): Promise<Record<string, number>> {
    // Collect user behavior metrics
    const activeTime = this.getActiveTime();
    const scrollDepth = this.getScrollDepth();
    
    return {
      session_duration: activeTime,
      scroll_depth_percent: scrollDepth,
      clicks_count: this.getClickCount(),
      page_views: this.getPageViewCount(),
    };
  }
  
  private getActiveTime(): number {
    const startTime = parseInt(sessionStorage.getItem('session_start') || '0');
    return startTime ? Date.now() - startTime : 0;
  }
  
  private getScrollDepth(): number {
    const scrolled = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    return Math.round((scrolled + viewportHeight) / documentHeight * 100);
  }
  
  private getClickCount(): number {
    return parseInt(sessionStorage.getItem('clicks_count') || '0');
  }
  
  private getPageViewCount(): number {
    return parseInt(sessionStorage.getItem('page_views') || '0');
  }
}

export class MetricsCollector {
  private collectors: MetricCollector[] = [
    new SystemMetrics(),
    new UserMetrics(),
  ];
  
  async collectAll(): Promise<Record<string, number>> {
    const results = await Promise.all(
      this.collectors.map(collector => collector.collect())
    );
    
    return results.reduce((acc, metrics) => ({ ...acc, ...metrics }), {});
  }
  
  startPeriodicCollection(intervalMs: number = 60000) {
    setInterval(async () => {
      try {
        const metrics = await this.collectAll();
        
        // Send metrics to monitoring service
        Object.entries(metrics).forEach(([key, value]) => {
          Sentry.metrics.gauge(`realtime.${key}`, value);
        });
        
        logger.debug('Realtime metrics collected', metrics);
      } catch (error) {
        logger.error('Failed to collect realtime metrics', error);
      }
    }, intervalMs);
  }
}
```

---

## 🚨 Alerting Configuration

### 1. Alert Thresholds and Rules
```typescript
// monitoring/alert-config.ts
export const alertConfig = {
  // Error Rate Alerts
  errorRate: {
    warning: 0.5, // 0.5% error rate
    critical: 1.0, // 1% error rate
    timeWindow: '5m',
  },
  
  // Response Time Alerts
  responseTime: {
    warning: 2000, // 2 seconds
    critical: 5000, // 5 seconds
    percentile: 95,
    timeWindow: '5m',
  },
  
  // Core Web Vitals Alerts
  webVitals: {
    lcp: { warning: 2500, critical: 4000 }, // ms
    fid: { warning: 100, critical: 300 }, // ms
    cls: { warning: 0.1, critical: 0.25 }, // score
  },
  
  // Business Metrics Alerts
  business: {
    registrationRate: {
      warning: -20, // 20% decrease
      critical: -40, // 40% decrease
      timeWindow: '1h',
    },
    courseCompletionRate: {
      warning: -15, // 15% decrease
      critical: -30, // 30% decrease
      timeWindow: '24h',
    },
  },
  
  // Infrastructure Alerts
  infrastructure: {
    memoryUsage: {
      warning: 80, // 80% memory usage
      critical: 95, // 95% memory usage
    },
    diskSpace: {
      warning: 85, // 85% disk usage
      critical: 95, // 95% disk usage
    },
  },
};
```

### 2. Notification Channels Setup
```typescript
// app/lib/notifications.ts
import { logger } from './logger';

interface AlertPayload {
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
}

export class AlertNotifications {
  static async sendAlert(alert: AlertPayload) {
    const message = this.formatAlert(alert);
    
    // Send to multiple channels based on severity
    const promises = [];
    
    if (alert.severity === 'critical') {
      promises.push(this.sendToSlack(message));
      promises.push(this.sendToEmail(message));
      promises.push(this.sendToSMS(message)); // For critical alerts
    } else {
      promises.push(this.sendToSlack(message));
    }
    
    try {
      await Promise.all(promises);
      logger.info('Alert sent successfully', { alert });
    } catch (error) {
      logger.error('Failed to send alert', error, { alert });
    }
  }
  
  private static formatAlert(alert: AlertPayload): string {
    return `
🚨 ${alert.severity.toUpperCase()} ALERT: ${alert.title}

**Metric:** ${alert.metric}
**Current Value:** ${alert.value}
**Threshold:** ${alert.threshold}
**Time:** ${alert.timestamp.toISOString()}

**Description:** ${alert.description}

**Dashboard:** https://your-monitoring-dashboard.com
**Runbook:** https://your-runbooks.com/${alert.metric}
    `.trim();
  }
  
  private static async sendToSlack(message: string) {
    if (!process.env.SLACK_WEBHOOK_URL) return;
    
    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message,
        channel: '#alerts',
        username: 'Monitoring Bot',
        icon_emoji: ':rotating_light:',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Slack notification failed: ${response.statusText}`);
    }
  }
  
  private static async sendToEmail(message: string) {
    // Implement email notification
    // Example: SendGrid, AWS SES, etc.
  }
  
  private static async sendToSMS(message: string) {
    // Implement SMS notification for critical alerts
    // Example: Twilio, AWS SNS, etc.
  }
}
```

---

## 📋 Monitoring Checklist

### Implementation Checklist
- [ ] **Error Tracking**: Sentry configured for client and server
- [ ] **Performance Monitoring**: Core Web Vitals and custom metrics
- [ ] **Structured Logging**: Winston logger with context
- [ ] **Business Analytics**: User behavior and engagement tracking
- [ ] **Real-time Metrics**: System and user metrics collection
- [ ] **Alerting System**: Thresholds and notification channels
- [ ] **Dashboard Setup**: Monitoring visualizations and reports

### Production Readiness
- [ ] **Alert Testing**: All alert conditions tested and verified
- [ ] **Dashboard Access**: Team has access to monitoring dashboards
- [ ] **Runbook Creation**: Incident response procedures documented
- [ ] **Performance Baselines**: Baseline metrics established
- [ ] **Log Retention**: Log storage and retention policies configured

### Ongoing Maintenance
- [ ] **Regular Reviews**: Monthly monitoring effectiveness review
- [ ] **Threshold Tuning**: Adjust alert thresholds based on patterns
- [ ] **Metric Evolution**: Add new metrics as features are added
- [ ] **Tool Updates**: Keep monitoring tools and SDKs updated
- [ ] **Team Training**: Ensure team knows how to use monitoring tools

---

**🎯 Monitoring Success Metrics**
- **Alert Accuracy**: <5% false positive rate
- **MTTR (Mean Time To Recovery)**: <15 minutes for critical issues
- **Monitoring Coverage**: 100% of critical user paths monitored
- **Dashboard Usage**: Daily active usage by development team
- **Incident Response**: <2 minutes from alert to team notification

This comprehensive monitoring setup ensures you have complete visibility into your application's health, performance, and user experience in production.