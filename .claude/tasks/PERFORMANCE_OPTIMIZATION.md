# ⚡ Performance Optimization Guide

**Comprehensive performance tuning for production-ready application**

This guide covers performance optimization strategies, implementation techniques, and monitoring approaches to ensure your Ngecourse application delivers excellent user experience.

---

## 🎯 Performance Goals & Targets

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: <2.5 seconds
- **First Input Delay (FID)**: <100 milliseconds
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Contentful Paint (FCP)**: <1.8 seconds
- **Time to Interactive (TTI)**: <3.8 seconds

### Application-Specific Targets
- **Course Page Load**: <2 seconds
- **Quiz Response Time**: <500 milliseconds
- **AI Chat Response**: <3 seconds
- **Search Results**: <1 second
- **Navigation Transitions**: <200 milliseconds

### Resource Targets
- **Initial Bundle Size**: <300KB
- **Route Chunks**: <100KB each
- **Image Optimization**: 90% compression without quality loss
- **Cache Hit Rate**: >80% for static assets

---

## 🏗️ Bundle Optimization

### 1. Code Splitting Implementation
**Priority: Critical | Time: 4 hours**

#### 1.1 Route-based Code Splitting
```typescript
// app/routes.ts - Implement lazy loading
import { lazy } from 'react';
import { route, layout, index } from '@react-router/dev/routes';

// Lazy load heavy components
const CoursesPage = lazy(() => import('./routes/courses/courses'));
const CourseDetailPage = lazy(() => import('./routes/courses/course'));
const LessonPage = lazy(() => import('./routes/courses/lesson'));
const QuizPage = lazy(() => import('./routes/courses/quiz'));
const RecommendationPage = lazy(() => import('./routes/recommendation'));

export default [
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('/courses', CoursesPage),
    route('/courses/:slug', CourseDetailPage),
    route('/recommendation', RecommendationPage),
  ]),
  
  route('/courses/:slug/:chapterSlug/lessons/:lessonSlug', LessonPage),
  route('/courses/:slug/:chapterSlug/quizzes/:quizSlug', QuizPage),
  
  // ... other routes
] satisfies RouteConfig;
```

#### 1.2 Component-based Code Splitting
```typescript
// app/components/lazy-components.tsx
import { lazy, Suspense } from 'react';
import { Skeleton } from './ui/skeleton';

// Heavy components
const AIChat = lazy(() => import('./ai-elements/chat-window'));
const VideoPlayer = lazy(() => import('./course/video-player'));
const CodeEditor = lazy(() => import('./course/code-editor'));
const ChartComponents = lazy(() => import('./analytics/charts'));

// Wrapper with loading states
export const LazyAIChat = () => (
  <Suspense fallback={<Skeleton className="h-96 w-full" />}>
    <AIChat />
  </Suspense>
);

export const LazyVideoPlayer = ({ src }: { src: string }) => (
  <Suspense fallback={<Skeleton className="aspect-video w-full" />}>
    <VideoPlayer src={src} />
  </Suspense>
);

export const LazyCodeEditor = ({ code }: { code: string }) => (
  <Suspense fallback={<Skeleton className="h-64 w-full" />}>
    <CodeEditor initialCode={code} />
  </Suspense>
);
```

#### 1.3 Dynamic Imports for Heavy Libraries
```typescript
// app/lib/dynamic-imports.ts
export const loadHeavyLibraries = {
  // Chart library (only load when needed)
  chartjs: async () => {
    const [{ Chart }, { CategoryScale, LinearScale, PointElement, LineElement }] = await Promise.all([
      import('chart.js/auto'),
      import('chart.js'),
    ]);
    
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement);
    return Chart;
  },
  
  // PDF viewer (only for courses with PDF content)
  pdfViewer: async () => {
    const { Document, Page, pdfjs } = await import('react-pdf');
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    return { Document, Page };
  },
  
  // Markdown editor (only for content creation)
  markdownEditor: async () => {
    const { MDXEditor } = await import('@mdxeditor/editor');
    return { MDXEditor };
  },
  
  // Video processing (only when uploading videos)
  videoProcessor: async () => {
    const ffmpeg = await import('@ffmpeg/ffmpeg');
    return ffmpeg;
  },
};
```

### 2. Bundle Analysis and Optimization
**Priority: High | Time: 2 hours**

#### 2.1 Bundle Analyzer Setup
```bash
# Install bundle analyzer
bun add -D @next/bundle-analyzer webpack-bundle-analyzer

# Add to package.json scripts
"analyze": "ANALYZE=true bun run build",
"analyze:size": "npx webpack-bundle-analyzer build/static/js/*.js"
```

#### 2.2 Vite Bundle Optimization
```typescript
// vite.config.ts - Optimize bundle configuration
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  
  // Build optimization
  build: {
    target: 'es2018',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
          
          // Feature chunks
          auth: ['@clerk/react-router'],
          cms: ['@sanity/client', '@sanity/image-url'],
          ai: ['ai', '@ai-sdk/openai'],
          analytics: ['@vercel/analytics', '@vercel/speed-insights'],
        },
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // Development optimization
  server: {
    warmup: {
      clientFiles: [
        './app/root.tsx',
        './app/routes/**/*',
        './app/components/ui/**/*',
      ],
    },
  },
});
```

### 3. Tree Shaking Optimization
**Priority: High | Time: 1 hour**

#### 3.1 Import Optimization
```typescript
// ❌ Bad - imports entire library
import * as _ from 'lodash';
import { Button, Card, Dialog } from '@radix-ui/react-components';

// ✅ Good - import only what you need
import { debounce } from 'lodash-es/debounce';
import { Button } from '@radix-ui/react-button';
import { Card } from '@radix-ui/react-card';
import { Dialog } from '@radix-ui/react-dialog';

// ✅ Even better - create barrel exports for commonly used items
// app/lib/utils/index.ts
export { debounce } from 'lodash-es/debounce';
export { throttle } from 'lodash-es/throttle';
export { isEmpty } from 'lodash-es/isEmpty';
```

#### 3.2 Icon Optimization
```typescript
// app/lib/icons.ts - Selective icon imports
export {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Settings,
  User,
} from 'lucide-react';

// Custom icon component with lazy loading
export const DynamicIcon = ({ name, ...props }: { name: string } & any) => {
  const [Icon, setIcon] = useState(null);
  
  useEffect(() => {
    import('lucide-react').then((icons) => {
      setIcon(() => icons[name]);
    });
  }, [name]);
  
  if (!Icon) return <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />;
  return <Icon {...props} />;
};
```

---

## 🖼️ Image & Media Optimization

### 1. Image Optimization Strategy
**Priority: Critical | Time: 3 hours**

#### 1.1 Responsive Image Component
```typescript
// app/components/ui/optimized-image.tsx
import { useState } from 'react';
import { cn } from '~/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Generate responsive image URLs (if using Sanity or similar)
  const generateSrcSet = (baseSrc: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths
      .map(w => `${baseSrc}?w=${w}&auto=format&fit=crop&dpr=1 ${w}w`)
      .join(', ');
  };
  
  if (hasError) {
    return (
      <div className={cn("bg-gray-200 flex items-center justify-center", className)}>
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        decoding={priority ? 'sync' : 'async'}
      />
    </div>
  );
}
```

#### 1.2 Image Lazy Loading with Intersection Observer
```typescript
// app/hooks/use-lazy-image.ts
import { useEffect, useRef, useState } from 'react';

interface UseLazyImageProps {
  src: string;
  threshold?: number;
  rootMargin?: string;
}

export function useLazyImage({ 
  src, 
  threshold = 0.1, 
  rootMargin = '50px' 
}: UseLazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  
  useEffect(() => {
    if (isIntersecting && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);
  
  return {
    ref: imgRef,
    src: imageSrc,
    isLoaded,
    onLoad: () => setIsLoaded(true),
  };
}
```

### 2. Video Optimization
**Priority: High | Time: 2 hours**

#### 2.1 Adaptive Video Player
```typescript
// app/components/course/adaptive-video-player.tsx
import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

export function AdaptiveVideoPlayer({
  src,
  poster,
  autoPlay = false,
  controls = true,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quality, setQuality] = useState<'auto' | '720p' | '1080p'>('auto');
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Detect connection speed and adjust quality
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const { effectiveType, downlink } = connection;
      
      // Adjust quality based on connection
      if (effectiveType === '4g' && downlink > 2) {
        setQuality('1080p');
      } else if (effectiveType === '3g' || downlink < 1) {
        setQuality('720p');
      }
    }
  }, []);
  
  // Handle buffering states
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    
    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);
  
  // Generate quality-specific source
  const getVideoSrc = (baseUrl: string, quality: string) => {
    if (quality === 'auto') return baseUrl;
    return `${baseUrl}?quality=${quality}`;
  };
  
  return (
    <div className={cn("relative", className)}>
      {/* Loading overlay */}
      {isBuffering && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      )}
      
      <video
        ref={videoRef}
        src={getVideoSrc(src, quality)}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        className="w-full h-auto"
        preload="metadata"
        playsInline
      >
        <source src={getVideoSrc(src, '720p')} type="video/mp4" media="(max-width: 768px)" />
        <source src={getVideoSrc(src, '1080p')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Quality selector */}
      <div className="absolute top-2 right-2">
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as any)}
          className="bg-black bg-opacity-50 text-white text-sm rounded px-2 py-1"
        >
          <option value="auto">Auto</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
      </div>
    </div>
  );
}
```

---

## 🚀 Loading & Caching Strategies

### 1. Preloading Critical Resources
**Priority: High | Time: 2 hours**

#### 1.1 Resource Hints Implementation
```typescript
// app/lib/preloader.ts
export class ResourcePreloader {
  private static preloadedResources = new Set<string>();
  
  // Preload critical CSS
  static preloadCriticalCSS(href: string) {
    if (this.preloadedResources.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
      this.preloadedResources.add(href);
    };
    document.head.appendChild(link);
  }
  
  // Preload JavaScript modules
  static preloadModule(src: string) {
    if (this.preloadedResources.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = src;
    document.head.appendChild(link);
    this.preloadedResources.add(src);
  }
  
  // Preload images
  static preloadImage(src: string, priority: 'high' | 'low' = 'high') {
    if (this.preloadedResources.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = priority;
    document.head.appendChild(link);
    this.preloadedResources.add(src);
  }
  
  // Preconnect to external domains
  static preconnectDomain(domain: string) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
  
  // DNS prefetch for future navigation
  static dnsPrefetch(domain: string) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  }
}

// Initialize critical preloading
if (typeof window !== 'undefined') {
  // Preconnect to external services
  ResourcePreloader.preconnectDomain('https://fonts.googleapis.com');
  ResourcePreloader.preconnectDomain('https://api.sanity.io');
  ResourcePreloader.preconnectDomain('https://clerk.dev');
  
  // DNS prefetch for likely navigation
  ResourcePreloader.dnsPrefetch('//cdnjs.cloudflare.com');
  ResourcePreloader.dnsPrefetch('//vercel.live');
}
```

#### 1.2 Smart Prefetching
```typescript
// app/hooks/use-prefetch.ts
import { useEffect } from 'react';
import { useFetcher, useLocation } from 'react-router';

interface PrefetchConfig {
  routes: string[];
  delay?: number;
  condition?: () => boolean;
}

export function usePrefetch({ routes, delay = 2000, condition }: PrefetchConfig) {
  const fetcher = useFetcher();
  const location = useLocation();
  
  useEffect(() => {
    if (condition && !condition()) return;
    
    const prefetchTimer = setTimeout(() => {
      routes.forEach(route => {
        // Only prefetch if not current route
        if (route !== location.pathname) {
          fetcher.load(route);
        }
      });
    }, delay);
    
    return () => clearTimeout(prefetchTimer);
  }, [routes, delay, condition, location.pathname]);
}

// Usage in course components
export function CourseCard({ course }: { course: Course }) {
  // Prefetch course detail page when hovering
  const [isHovering, setIsHovering] = useState(false);
  
  usePrefetch({
    routes: [`/courses/${course.slug}`],
    delay: 200,
    condition: () => isHovering,
  });
  
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Course card content */}
    </div>
  );
}
```

### 2. Service Worker Implementation
**Priority: Medium | Time: 3 hours**

#### 2.1 Service Worker Setup
```typescript
// public/sw.js - Service Worker for caching
const CACHE_NAME = 'ngecourse-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Add other critical static files
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event with network-first strategy for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API calls - Network first, cache fallback
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Static assets - Cache first
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request)
        .then((response) => response || fetch(request))
    );
    return;
  }
  
  // HTML pages - Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
```

#### 2.2 Service Worker Registration
```typescript
// app/lib/service-worker.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        
        console.log('Service Worker registered:', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                showUpdateNotification();
              }
            });
          }
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

function showUpdateNotification() {
  // Show user notification about available update
  if (confirm('A new version is available. Would you like to refresh?')) {
    window.location.reload();
  }
}
```

---

## ⚡ Runtime Performance Optimization

### 1. React Performance Patterns
**Priority: High | Time: 3 hours**

#### 1.1 Memoization Strategy
```typescript
// app/components/course/course-list.tsx
import { memo, useMemo, useCallback } from 'react';
import { Course } from '~/types';

interface CourseListProps {
  courses: Course[];
  filters: {
    category?: string;
    difficulty?: string;
    search?: string;
  };
  onCourseSelect: (course: Course) => void;
}

export const CourseList = memo(function CourseList({
  courses,
  filters,
  onCourseSelect,
}: CourseListProps) {
  // Memoize expensive filtering operation
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      if (filters.category && course.category !== filters.category) return false;
      if (filters.difficulty && course.difficulty !== filters.difficulty) return false;
      if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [courses, filters.category, filters.difficulty, filters.search]);
  
  // Memoize callbacks to prevent unnecessary re-renders
  const handleCourseClick = useCallback((course: Course) => {
    onCourseSelect(course);
  }, [onCourseSelect]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onClick={handleCourseClick}
        />
      ))}
    </div>
  );
});

// Memoized course card component
const CourseCard = memo(function CourseCard({
  course,
  onClick,
}: {
  course: Course;
  onClick: (course: Course) => void;
}) {
  const handleClick = useCallback(() => {
    onClick(course);
  }, [course, onClick]);
  
  return (
    <div onClick={handleClick} className="cursor-pointer">
      {/* Course card content */}
    </div>
  );
});
```

#### 1.2 Virtual Scrolling for Large Lists
```typescript
// app/components/ui/virtual-list.tsx
import { useMemo, useState, useEffect, useRef } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length, start + visibleCount + overscan * 2);
    
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
    }));
  }, [items, visibleRange]);
  
  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;
    
    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };
    
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div
      ref={scrollElementRef}
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              width: '100%',
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. Database Query Optimization
**Priority: Critical | Time: 2 hours**

#### 2.1 Optimized Sanity Queries
```typescript
// app/lib/sanity-queries-optimized.ts
import { defineQuery } from 'groq';

// ❌ Unoptimized query
const badCourseQuery = defineQuery(`
  *[_type == "course"] {
    _id,
    title,
    description,
    chapters[]-> {
      _id,
      title,
      lessons[]-> {
        _id,
        title,
        content
      }
    }
  }
`);

// ✅ Optimized query with selective fields
const optimizedCourseListQuery = defineQuery(`
  *[_type == "course"] | order(publishedAt desc) [0...$limit] {
    _id,
    slug,
    title,
    description[0..200], // Limit description length
    "imageUrl": image.asset->url,
    difficulty,
    duration,
    "chaptersCount": count(chapters),
    "lessonsCount": count(chapters[]->lessons),
    publishedAt
  }
`);

// ✅ Optimized single course query
const optimizedCourseDetailQuery = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    description,
    "imageUrl": image.asset->url,
    difficulty,
    duration,
    chapters[]-> {
      _id,
      title,
      "lessonsCount": count(lessons),
      "quizzesCount": count(quizzes),
      lessons[]-> {
        _id,
        slug,
        title,
        duration,
        _type
      }[0..3] // Limit initial lessons load
    }
  }
`);

// ✅ Progressive loading for course content
const courseChapterContentQuery = defineQuery(`
  *[_type == "chapter" && _id == $chapterId][0] {
    _id,
    title,
    lessons[]-> {
      _id,
      slug,
      title,
      content,
      duration,
      "videoUrl": video.asset->url,
      "nextLesson": *[_type == "lesson" && order > ^.order][0] {
        _id,
        slug,
        title
      }
    },
    quizzes[]-> {
      _id,
      slug,
      title,
      questions[] {
        _id,
        question,
        options,
        correctAnswer
      }
    }
  }
`);
```

#### 2.2 Smart Caching with React Query
```typescript
// app/lib/query-client-config.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time optimization
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      
      // Retry strategy
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      
      // Background refetch optimization
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
    },
    
    mutations: {
      // Mutation retry strategy
      retry: 1,
    },
  },
});

// Cache invalidation patterns
export const cacheKeys = {
  courses: ['courses'] as const,
  courseDetail: (slug: string) => ['courses', slug] as const,
  userProgress: (userId: string) => ['progress', userId] as const,
  aiChat: (sessionId: string) => ['ai-chat', sessionId] as const,
};
```

---

## 📋 Performance Monitoring & Testing

### 1. Performance Testing Suite
**Priority: High | Time: 3 hours**

#### 1.1 Automated Performance Testing
```typescript
// tests/performance/lighthouse.test.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Homepage meets Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Measure Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
          const vitals = {};
          
          getCLS((metric) => vitals.cls = metric.value);
          getFID((metric) => vitals.fid = metric.value);
          getLCP((metric) => {
            vitals.lcp = metric.value;
            resolve(vitals);
          });
        });
      });
    });
    
    // Assert Core Web Vitals thresholds
    expect(webVitals.lcp).toBeLessThan(2500); // 2.5s
    expect(webVitals.fid).toBeLessThan(100); // 100ms
    expect(webVitals.cls).toBeLessThan(0.1); // 0.1
  });
  
  test('Course page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/courses/javascript-fundamentals');
    await page.waitForSelector('[data-testid="course-content"]');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // 2 seconds
  });
  
  test('Bundle size is within limits', async ({ page }) => {
    // Navigate to page and collect performance entries
    await page.goto('/');
    
    const bundleSize = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter(r => r.name.includes('.js'))
        .reduce((total, r) => total + (r.transferSize || 0), 0);
    });
    
    expect(bundleSize).toBeLessThan(300 * 1024); // 300KB
  });
});
```

#### 1.2 Real User Monitoring
```typescript
// app/lib/performance-monitor.ts
export class PerformanceMonitor {
  private static observer: PerformanceObserver | null = null;
  
  static initialize() {
    if (typeof window === 'undefined') return;
    
    // Monitor Long Tasks
    this.observeLongTasks();
    
    // Monitor Layout Shifts
    this.observeLayoutShifts();
    
    // Monitor Largest Contentful Paint
    this.observeLCP();
    
    // Monitor First Input Delay
    this.observeFID();
  }
  
  private static observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Long task threshold
            this.reportPerformanceIssue('long-task', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }
  
  private static observeLayoutShifts() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            
            if (clsValue > 0.1) { // CLS threshold
              this.reportPerformanceIssue('layout-shift', {
                cumulativeScore: clsValue,
                sources: entry.sources?.map((s: any) => ({
                  element: s.node?.tagName,
                  rect: s.currentRect,
                })),
              });
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  private static reportPerformanceIssue(type: string, data: any) {
    // Send to monitoring service
    if (window.gtag) {
      window.gtag('event', 'performance_issue', {
        event_category: 'Performance',
        event_label: type,
        custom_parameters: data,
      });
    }
    
    // Log for debugging
    console.warn(`Performance Issue - ${type}:`, data);
  }
}

// Initialize monitoring when app starts
if (typeof window !== 'undefined') {
  PerformanceMonitor.initialize();
}
```

---

## 📊 Performance Checklist

### Critical Performance Items
- [ ] **Bundle Size**: <300KB initial load, <100KB per route
- [ ] **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1  
- [ ] **Code Splitting**: Implemented for routes and heavy components
- [ ] **Image Optimization**: WebP/AVIF formats, responsive images, lazy loading
- [ ] **Caching**: Service worker, browser caching, CDN configuration

### Important Optimizations
- [ ] **Tree Shaking**: Optimized imports, unused code elimination
- [ ] **Preloading**: Critical resources preloaded, smart prefetching
- [ ] **Memoization**: React.memo, useMemo, useCallback properly used
- [ ] **Database Queries**: Optimized GROQ queries, result caching
- [ ] **Video/Media**: Adaptive streaming, proper compression

### Monitoring & Testing  
- [ ] **Performance Testing**: Automated Core Web Vitals testing
- [ ] **Real User Monitoring**: Performance tracking in production
- [ ] **Bundle Analysis**: Regular bundle size monitoring
- [ ] **Performance Budgets**: CI/CD performance gate configured
- [ ] **Alert Thresholds**: Performance degradation alerts set up

### Success Metrics
- **Lighthouse Scores**: >90 for Performance, Accessibility, SEO, Best Practices
- **Load Time**: 95th percentile <2 seconds for critical pages
- **Error Rate**: <0.1% of requests result in performance-related errors
- **User Experience**: <2% bounce rate due to slow loading
- **Resource Usage**: Optimized memory and CPU consumption

This comprehensive performance optimization ensures your application delivers excellent user experience while maintaining scalability and reliability in production.