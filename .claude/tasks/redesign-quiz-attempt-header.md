# Redesign Quiz Attempt Header - Cosmic Dark Tinted-Blur Implementation

## Overview
Redesign the quiz attempt header component to follow the Cosmic Dark Tinted-Blur design system and improve UX behavior with scroll-based background visibility.

## Current Issues Analysis
1. **Design System Inconsistency**: Current styling uses `bg-gray-900/80` and `border-gray-800/50` instead of design system tokens
2. **Poor Background Behavior**: Glass background is always visible instead of appearing only on scroll
3. **Suboptimal Visual Hierarchy**: Lacks proper spacing and typography according to design system
4. **Component Integration**: Doesn't integrate well with the cosmic dark theme

## Requirements
- Apply proper Cosmic Dark Tinted-Blur design system styling
- Implement scroll-based background visibility (transparent at top, glass when scrolled)
- Improve visual hierarchy with proper spacing, colors, and typography
- Maintain existing functionality (progress bar, back button, progress badge)
- Ensure seamless integration with quiz attempt page design

## Implementation Plan

### Phase 1: Create Scroll Detection Hook
**File**: `/app/lib/hooks/use-scroll-position.ts` (new)
- Create reusable hook to track scroll position
- Implement debounced scroll detection for performance
- Return boolean indicating whether user has scrolled past threshold (e.g., 50px)

### Phase 2: Design System Token Application
**File**: `/app/features/quizzes/components/quiz-attempt.tsx` (modify header section)

#### Current Problematic Styling:
```jsx
<div className="glass-card sticky top-4 z-10 bg-gray-900/80 backdrop-blur-sm border-gray-800/50">
```

#### New Cosmic Dark Implementation:
- Replace hard-coded colors with design system tokens
- Apply proper `.tinted-blur` class with conditional visibility
- Use system typography and spacing tokens
- Implement proper focus states and accessibility

### Phase 3: Enhanced Component Structure
Create improved header component with:

#### Visual Hierarchy Improvements:
1. **Typography**: Apply system font weights and sizes
   - Use `text-text-primary` for main elements
   - Use `text-text-secondary` for labels
   - Use `text-text-muted` for supplementary info

2. **Spacing**: Follow 4px increment system
   - Use `space-y-6` for main sections
   - Use `gap-3` for button groups
   - Apply proper touch targets (44px minimum)

3. **Color System**: 
   - Use `border-hairline` and `border-strong` tokens
   - Apply `text-text-*` hierarchy
   - Use accent colors for interactive states

#### Scroll-based Behavior:
- **Top Position (scrollY <= 50px)**: 
  - Transparent background
  - Subtle border only
  - Maintains layout space

- **Scrolled Position (scrollY > 50px)**:
  - Full `.tinted-blur` glass effect
  - Enhanced shadow and backdrop blur
  - Smooth transition animation

### Phase 4: Progress Component Enhancement
**File**: `/app/components/ui/progress.tsx` (verify/update)
- Ensure progress bar follows design system
- Apply proper accent colors
- Implement smooth animations

### Phase 5: Enhanced Interaction States
- **Button States**: Use `.btn-ghost` class for back button
- **Badge Styling**: Apply design system badge variants
- **Focus Management**: Implement proper focus rings
- **Hover States**: Apply subtle accent color transitions

## Technical Implementation Details

### Scroll Hook Implementation:
```typescript
export function useScrollPosition(threshold: number = 50) {
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = debounce(() => {
      setHasScrolled(window.scrollY > threshold);
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  
  return hasScrolled;
}
```

### Header Component Structure:
```jsx
function QuizAttemptHeader({ hasScrolled, ...props }) {
  return (
    <header className={cn(
      "sticky top-4 z-50 mx-4 rounded-2xl transition-all duration-300 ease-out",
      hasScrolled 
        ? "tinted-blur shadow-soft" 
        : "bg-transparent border border-hairline/50"
    )}>
      <div className="p-6 space-y-6">
        {/* Navigation & Progress Badge */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="btn-ghost">
            <ArrowLeft className="size-4" />
            <span className="text-text-primary">Back to Quiz</span>
          </Button>
          <Badge variant="outline" className="text-text-secondary border-hairline">
            Progress: {clientAnswers.length} / {totalQuestions}
          </Badge>
        </div>
        
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="field-label">Quiz Progress</span>
            <span className="field-help">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </header>
  );
}
```

### Performance Considerations:
- Debounced scroll events (10ms) for smooth performance
- CSS transforms for animations (GPU acceleration)
- Limit backdrop-filter usage (design system already optimized)
- Efficient re-renders with proper React state management

### Accessibility Enhancements:
- Proper ARIA labels for progress indicators
- Keyboard navigation support
- Screen reader announcements for progress changes
- Focus visible states with design system rings
- Color contrast compliance (WCAG AA)

## Expected Outcomes
1. **Visual Consistency**: Header fully aligned with Cosmic Dark Tinted-Blur system
2. **Enhanced UX**: Smooth scroll-based background transitions
3. **Improved Performance**: Optimized scroll detection and animations
4. **Better Accessibility**: Full WCAG AA compliance with proper focus management
5. **Maintainability**: Reusable components and design system adherence

## Testing Requirements
- Verify scroll behavior across different screen sizes
- Test keyboard navigation and focus states
- Validate color contrast and accessibility
- Check performance with rapid scrolling
- Ensure compatibility with existing quiz functionality

## Files to Modify/Create
1. **New**: `/app/lib/hooks/use-scroll-position.ts` - Scroll detection hook
2. **Modify**: `/app/features/quizzes/components/quiz-attempt.tsx` - Header implementation
3. **Verify**: `/app/components/ui/progress.tsx` - Design system compliance
4. **Update**: Add any missing CSS utilities if needed

This implementation will create a premium, cohesive header experience that enhances the quiz-taking flow while maintaining all existing functionality.