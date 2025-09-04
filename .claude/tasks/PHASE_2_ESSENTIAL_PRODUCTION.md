# Phase 2: Essential Production Features

**Timeline: 1-2 weeks**  
**Prerequisites: Phase 1 Complete (Security & Environment Setup)**

## Overview

Phase 2 focuses on the essential systems needed for a production deployment: error monitoring, basic testing, performance optimizations, and SEO fundamentals. These are the minimum requirements before going live.

---

## 🔥 Critical Tasks (Must Complete)

### 1. Error Monitoring & Logging Setup
**Time Estimate: 1 day**

#### 1.1 Integrate Sentry for Error Tracking
- [ ] Install Sentry SDK: `bun add @sentry/react @sentry/node`
- [ ] Add environment variables:
  ```env
  SENTRY_DSN=your_sentry_dsn_here
  SENTRY_ORG=your_org
  SENTRY_PROJECT=ngecourse
  ```
- [ ] Create `app/lib/sentry.ts` configuration
- [ ] Update `app/root.tsx` with Sentry error boundary
- [ ] Configure server-side error capture in `entry.server.tsx`
- [ ] Test error reporting in development

#### 1.2 Structured Logging System  
- [ ] Install logging library: `bun add winston pino`
- [ ] Create `app/lib/logger.ts` with different log levels
- [ ] Replace all `console.log` statements with structured logging
- [ ] Add request ID tracking for trace correlation
- [ ] Configure log rotation and retention

#### 1.3 Performance Monitoring
- [ ] Add Sentry performance monitoring
- [ ] Configure Core Web Vitals tracking
- [ ] Set up custom performance metrics for:
  - Course loading times
  - Quiz completion times
  - AI chat response times
- [ ] Create performance dashboard alerts

---

### 2. Testing Framework Foundation
**Time Estimate: 2 days**

#### 2.1 Unit Testing Setup
- [ ] Install Vitest: `bun add -D vitest @testing-library/react @testing-library/jest-dom`
- [ ] Create `vitest.config.ts` configuration
- [ ] Set up test utilities in `tests/utils/`
- [ ] Write tests for critical utilities:
  - [ ] Environment validation functions
  - [ ] Security utilities (sanitize functions)
  - [ ] Rate limiting logic
- [ ] Add npm script: `"test": "vitest"`

#### 2.2 Integration Testing
- [ ] Install Playwright: `bun add -D @playwright/test`
- [ ] Create `playwright.config.ts`
- [ ] Write critical user journey tests:
  - [ ] User signup/signin flow
  - [ ] Course enrollment process
  - [ ] Quiz completion flow
  - [ ] AI chat functionality
- [ ] Set up test databases for integration tests

#### 2.3 Component Testing
- [ ] Set up React Testing Library
- [ ] Write tests for key components:
  - [ ] Course card component
  - [ ] Quiz components
  - [ ] Navigation components
  - [ ] Error fallback components
- [ ] Achieve >70% test coverage on critical paths

---

### 3. Performance Optimizations
**Time Estimate: 1.5 days**

#### 3.1 Bundle Optimization
- [ ] Install bundle analyzer: `bun add -D @next/bundle-analyzer`
- [ ] Analyze current bundle size
- [ ] Implement code splitting for:
  - [ ] Course content routes
  - [ ] Admin/dashboard sections
  - [ ] AI chat components
- [ ] Add dynamic imports for heavy libraries
- [ ] Target <300KB initial bundle size

#### 3.2 Image Optimization
- [ ] Audit current image usage with `next/image` equivalent
- [ ] Implement lazy loading for course images
- [ ] Add WebP/AVIF format support
- [ ] Optimize hero images and thumbnails
- [ ] Set up image CDN (Cloudinary/Sanity CDN)

#### 3.3 Caching Strategy
- [ ] Implement service worker for offline functionality
- [ ] Add caching headers for static assets
- [ ] Set up Redis for session/rate limiting (production)
- [ ] Configure Sanity CDN caching
- [ ] Add browser caching for course content

#### 3.4 Database Query Optimization
- [ ] Audit Sanity GROQ queries for efficiency
- [ ] Implement query result caching
- [ ] Add pagination for course listings
- [ ] Optimize data fetching patterns
- [ ] Set up query performance monitoring

---

## 🎯 Important Tasks (Should Complete)

### 4. SEO & Metadata Enhancement
**Time Estimate: 1 day**

#### 4.1 Meta Tags & Open Graph
- [ ] Create `app/lib/seo.ts` utility
- [ ] Add dynamic meta tags for:
  - [ ] Course pages
  - [ ] Lesson pages
  - [ ] User profile pages
- [ ] Implement Open Graph tags
- [ ] Add Twitter Card metadata
- [ ] Test with social media preview tools

#### 4.2 Structured Data
- [ ] Add JSON-LD structured data for:
  - [ ] Course schema
  - [ ] Educational organization
  - [ ] FAQ sections
- [ ] Validate with Google Structured Data Testing Tool
- [ ] Add breadcrumb schema

#### 4.3 Sitemap & Robots.txt
- [ ] Generate dynamic sitemap.xml
- [ ] Create robots.txt with proper directives
- [ ] Add sitemap to Google Search Console
- [ ] Implement XML sitemap index for large sites

### 5. Health Checks & Monitoring
**Time Estimate: 0.5 days**

#### 5.1 Enhanced Health Checks
- [ ] Extend `/health` endpoint with:
  - [ ] Database connectivity
  - [ ] External service health
  - [ ] Memory usage metrics
  - [ ] Response time metrics
- [ ] Add `/health/ready` for readiness probes
- [ ] Add `/health/live` for liveness probes

#### 5.2 Uptime Monitoring
- [ ] Set up external monitoring (UptimeRobot, Pingdom)
- [ ] Configure alerts for downtime
- [ ] Monitor critical user journeys
- [ ] Set up SSL certificate monitoring

---

## 📊 Optional Tasks (Nice to Have)

### 6. Analytics & User Tracking
**Time Estimate: 1 day**

#### 6.1 Enhanced Analytics
- [ ] Extend Vercel Analytics with custom events
- [ ] Track user engagement metrics:
  - [ ] Course completion rates
  - [ ] Time spent on lessons
  - [ ] Quiz success rates
  - [ ] AI chat usage
- [ ] Set up conversion funnels
- [ ] Create analytics dashboard

#### 6.2 User Behavior Tracking
- [ ] Implement user session recording (LogRocket, Hotjar)
- [ ] Add heatmap tracking for course pages
- [ ] Track feature usage analytics
- [ ] Monitor user drop-off points

### 7. Content Delivery Optimization
**Time Estimate: 0.5 days**

#### 7.1 CDN Configuration
- [ ] Configure Vercel Edge Network
- [ ] Set up geographic content delivery
- [ ] Implement edge caching for static assets
- [ ] Add edge functions for dynamic content

---

## 🛠 Implementation Guides

### Sentry Setup Example
```typescript
// app/lib/sentry.ts
import * as Sentry from '@sentry/react';
import { getEnv } from '~/env.server';

const env = getEnv(process.env);

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

### Logging Setup Example
```typescript
// app/lib/logger.ts
import winston from 'winston';
import { getEnv } from '~/env.server';

const env = getEnv(process.env);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### Test Configuration Example
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      threshold: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
```

---

## 📋 Success Criteria

### Phase 2 Complete When:
- [ ] Error monitoring captures and reports all production errors
- [ ] Critical user journeys have automated tests
- [ ] Bundle size is optimized (<300KB initial)
- [ ] Core Web Vitals scores are Good (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Health checks provide comprehensive system status
- [ ] SEO meta tags are properly configured for all pages
- [ ] Structured logging is implemented throughout the application

### Key Metrics to Track:
- **Error Rate**: <0.1% of requests result in errors
- **Response Time**: 95th percentile <2 seconds
- **Test Coverage**: >70% for critical business logic
- **Lighthouse Score**: >90 for Performance, Accessibility, SEO
- **Bundle Size**: <300KB initial load, <100KB per route

### Tools Integration:
- Sentry dashboard showing error trends
- Test reports showing coverage and pass rates
- Performance monitoring dashboard
- SEO audit results showing improved scores

---

## 🔗 Dependencies

**Blocks Phase 3:** Performance optimizations and monitoring setup  
**Blocks Phase 4:** User analytics for privacy compliance  
**External Dependencies:** 
- Sentry account setup
- Performance monitoring service
- CDN configuration (if using external)

---

## 📝 Notes

- Focus on critical path first - error monitoring and basic testing
- Performance optimizations should be measured, not assumed
- SEO improvements will take time to show in search results
- Consider staging environment for testing production configurations
- Document all monitoring thresholds and alert conditions

**Next Phase:** After completing Phase 2, proceed to Phase 3 for comprehensive testing, CI/CD pipeline, and advanced monitoring setup.