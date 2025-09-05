# CSS Token System

## 🎨 **Token Architecture**

The hybrid design system uses a layered approach:
1. **Foundation:** Standard shadcn/ui tokens (unchanged)
2. **Enhancement:** Cosmic decorative tokens (new additions)
3. **Application:** Component utility classes (strategic usage)

## 📝 **Implementation Guide**

### **Add to `app/app.css`**

```css
/* Add these tokens to the existing :root block */
:root {
  /* Existing shadcn/ui tokens remain unchanged */
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... all existing tokens ... */
  
  /* NEW: Cosmic decorative tokens */
  /* Background gradients (for page-level decoration only) */
  --cosmic-gradient: radial-gradient(
    circle at 20% 80%, 
    oklch(0.15 0.12 220) 0%, 
    transparent 50%
  ), radial-gradient(
    circle at 80% 20%, 
    oklch(0.12 0.1 180) 0%, 
    transparent 50%
  ), radial-gradient(
    circle at 40% 40%, 
    oklch(0.1 0.08 140) 0%, 
    transparent 50%
  );
  
  /* Glass morphism (optional enhancement) */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: 16px;
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  
  /* Cosmic accents (for special highlights) */
  --cosmic-blue: #3E5BFF;
  --cosmic-purple: #5C3BFF;
}

/* Dark mode additions */
.dark {
  /* Existing dark mode tokens remain unchanged */
  
  /* Enhanced cosmic tokens for dark mode */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Component utilities */
@layer components {
  /* Background decoration utility */
  .cosmic-bg {
    background: var(--cosmic-gradient), var(--background);
  }
  
  /* Optional glass card for special content areas */
  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: 0.75rem;
    box-shadow: var(--glass-shadow);
    @apply p-6;
  }
  
  /* Enhanced glass card for mobile menu with stronger background */
  .glass-card-strong {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(24px) saturate(1.2);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.75rem;
    box-shadow: 
      var(--glass-shadow), 
      0 0 0 1px rgba(255, 255, 255, 0.02) inset;
    @apply p-6;
  }
  
  /* Optional glass input variant for premium forms */
  .glass-input {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(8px);
    @apply w-full rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground;
    
    &:focus {
      border-color: var(--cosmic-blue);
      box-shadow: 0 0 0 2px rgba(62, 91, 255, 0.2);
    }
  }
  
  /* Glass textarea variant */
  .glass-textarea {
    @apply glass-input min-h-[100px] resize-y;
  }
  
  /* Glass select variant */
  .glass-select {
    @apply glass-input;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
}
```

## 🎯 **Token Usage Guidelines**

### **Background Tokens**
```css
/* Cosmic gradient backgrounds */
--cosmic-gradient /* Use for page-level ambiance */

/* Application */
.cosmic-bg {
  background: var(--cosmic-gradient), var(--background);
}

/* Usage */
<div className="cosmic-bg min-h-screen">
  <!-- Page content -->
</div>
```

### **Glass Morphism Tokens**
```css
/* Glass effect properties */
--glass-bg          /* Semi-transparent background */
--glass-border      /* Subtle border for definition */
--glass-blur        /* Backdrop blur amount */
--glass-shadow      /* Soft shadow for depth */

/* Usage examples */
.glass-card         /* General glass card */
.glass-card-strong  /* Enhanced glass for important elements */
.glass-input        /* Glass input fields */
```

### **Accent Tokens**
```css
/* Cosmic brand colors */
--cosmic-blue   /* Primary cosmic accent */
--cosmic-purple /* Secondary cosmic accent */

/* Usage for special highlights and CTAs */
.text-cosmic-blue { color: var(--cosmic-blue); }
.border-cosmic-blue { border-color: var(--cosmic-blue); }
```

## 📱 **Responsive Considerations**

### **Mobile Optimizations**
```css
/* Reduce glass effects on mobile for performance */
@media (max-width: 768px) {
  .glass-card {
    --glass-blur: 8px; /* Reduce blur for better performance */
    backdrop-filter: blur(var(--glass-blur));
  }
  
  /* Stronger background on mobile to maintain readability */
  .glass-card-strong {
    background: rgba(255, 255, 255, 0.12);
  }
}
```

### **High Contrast Mode Support**
```css
@media (prefers-contrast: high) {
  .glass-card {
    background: var(--background);
    border-color: var(--border);
    backdrop-filter: none;
  }
  
  .glass-input {
    background: var(--input);
    border-color: var(--border);
    backdrop-filter: none;
  }
}
```

### **Reduced Motion Support**
```css
@media (prefers-reduced-motion: reduce) {
  .glass-card {
    transition: none;
  }
  
  .cosmic-bg {
    background: var(--background); /* Remove gradient for reduced motion */
  }
}
```

## ⚡ **Performance Considerations**

### **Blur Effect Optimization**
```css
/* Use will-change for elements that will animate */
.glass-card-animated {
  will-change: backdrop-filter;
}

/* Remove will-change after animations complete */
.glass-card-animated.animation-complete {
  will-change: auto;
}
```

### **GPU Acceleration**
```css
/* Force GPU acceleration for smooth effects */
.glass-card {
  transform: translateZ(0); /* Creates new stacking context */
}
```

### **Fallbacks for Unsupported Browsers**
```css
/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(1px)) {
  .glass-card {
    background: rgba(var(--background), 0.95);
    backdrop-filter: none;
  }
}
```

## 🧪 **Testing Utilities**

### **Debug Classes (Remove in Production)**
```css
/* Temporary debug utilities */
.debug-glass {
  outline: 2px solid red !important;
}

.debug-cosmic {
  background: linear-gradient(45deg, red 25%, transparent 25%) !important;
}
```

### **A/B Testing Support**
```css
/* Feature flag classes for gradual rollout */
.feature-cosmic-enabled .standard-bg {
  @apply cosmic-bg;
}

.feature-glass-enabled .standard-card {
  @apply glass-card;
}
```

## 📋 **Migration Checklist**

### **Before Implementation**
- [ ] Backup current app.css
- [ ] Test performance impact of blur effects
- [ ] Verify browser compatibility requirements
- [ ] Document existing color usage

### **During Implementation**
- [ ] Add tokens gradually, test each addition
- [ ] Validate no conflicts with existing styles
- [ ] Test on target devices and browsers
- [ ] Verify accessibility compliance

### **After Implementation**
- [ ] Performance audit with new tokens
- [ ] User testing for visual improvements
- [ ] Monitor for any regression issues
- [ ] Document final token system

## 🚨 **Common Pitfalls**

### **Performance Issues**
- **Too many blur effects:** Limit to 2-3 per viewport
- **Heavy gradients:** Use CSS gradients, not images
- **Memory leaks:** Remove will-change after animations

### **Accessibility Issues**
- **Low contrast:** Always test against WCAG standards
- **Focus indicators:** Ensure visible focus states
- **Motion sensitivity:** Respect user preferences

### **Browser Compatibility**
- **backdrop-filter:** Not supported in older browsers
- **CSS gradients:** Test complex gradient syntax
- **Variable support:** Ensure fallbacks exist

---

**Next:** See [Component Migration Guide](./component-migration.md) for implementation patterns.