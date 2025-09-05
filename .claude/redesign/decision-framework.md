# Decision Framework: When to Use What

## 🎯 **Core Principle**

**Readable First, Beautiful Second.** Every design decision must prioritize content readability and accessibility before visual enhancement.

## 🧭 **Primary Decision Matrix**

### **Content Type → Approach Mapping**

| Content Type | Default Approach | Glass Enhancement | Cosmic Background |
|--------------|------------------|-------------------|-------------------|
| **Text Content** (articles, docs) | ✅ Standard | ❌ Never | ❌ No |
| **Data Display** (tables, stats) | ✅ Standard | ❌ Never | ❌ No |
| **Forms - Regular** (settings, profile) | ✅ Standard | ❌ Never | ❌ No |
| **Forms - Premium** (enrollment, signup) | ⚠️ Consider | ✅ Optional | ✅ Yes |
| **Navigation - Content** | ✅ Standard | ❌ Never | ❌ No |
| **Navigation - Marketing** | ⚠️ Consider | ✅ Optional | ✅ Yes |
| **Hero Sections** | ⚠️ Consider | ✅ Recommended | ✅ Yes |
| **Marketing Content** | ⚠️ Consider | ✅ Optional | ✅ Yes |
| **Learning Interface** | ✅ Standard | ❌ Never | ❌ No |

### **Context Type → Enhancement Level**

| Page Context | Background | Cards | Forms | Navigation |
|--------------|------------|-------|-------|------------|
| **Learning Content** | Standard | Standard | Standard | Standard |
| **Course Browsing** | Cosmic | Standard | Standard | Standard |
| **Landing Pages** | Cosmic | Glass (selective) | Glass (premium) | Glass (optional) |
| **User Dashboard** | Cosmic | Standard | Standard | Standard |
| **Authentication** | Cosmic | Glass | Glass | Standard |

## 📋 **Detailed Decision Trees**

### **1. Page Background Decision**

```
Is this page primarily for content consumption?
├─ YES → Use standard background
│   └─ Examples: Lesson pages, documentation, blog posts
│
└─ NO → Is this a marketing/discovery page?
    ├─ YES → Use cosmic-bg
    │   └─ Examples: Homepage, course listing, landing pages
    │
    └─ NO → Is this a dashboard/tool page?
        ├─ YES → Use cosmic-bg (for motivation/engagement)
        │   └─ Examples: Progress dashboard, user profile
        │
        └─ NO → Use standard background (safe default)
```

### **2. Component Enhancement Decision**

```
What is the primary function of this component?
├─ Information Display → Always use standard components
│   └─ Examples: Course content, data tables, statistics
│
├─ User Input → Is this a premium/conversion context?
│   ├─ YES → Consider glass-input variants
│   │   └─ Examples: Course enrollment, subscription forms
│   └─ NO → Use standard Input components
│       └─ Examples: Settings forms, user profiles
│
├─ Navigation → Is this floating or on marketing pages?
│   ├─ YES → Consider glass enhancement
│   │   └─ Examples: Sticky nav on landing pages
│   └─ NO → Use standard navigation
│       └─ Examples: Course page navigation, breadcrumbs
│
└─ Marketing/Presentation → Consider strategic glass enhancement
    └─ Examples: Feature cards, testimonials, hero CTAs
```

### **3. Glass Effect Intensity Decision**

```
How many glass effects are already on the page?
├─ 0-1 → Safe to add another glass effect
├─ 2 → Proceed with caution, test performance
└─ 3+ → Do not add more glass effects

Is the user on a mobile device?
├─ YES → Use glass-card (lighter blur)
└─ NO → Can use glass-card-strong if needed

Does the content need to be highly readable?
├─ YES → Avoid glass effects entirely
└─ NO → Glass effects are acceptable
```

## 🎨 **Component-Specific Guidelines**

### **Forms**

#### **✅ Use Standard Forms For:**
- User settings and preferences
- Profile editing
- Contact forms
- Feedback forms
- Search interfaces
- Admin/management interfaces

#### **✅ Use Glass Forms For:**
- Course enrollment
- Account registration
- Subscription/payment forms
- Newsletter signups (on landing pages)
- Special event registration
- Premium feature access

#### **❌ Never Use Glass For:**
- Long multi-step forms
- Complex data entry forms
- Forms with validation errors
- Accessibility-critical forms

### **Navigation**

#### **✅ Use Standard Navigation For:**
- Course content pages
- Documentation
- User dashboard secondary nav
- Breadcrumb navigation
- In-content navigation (next/prev)
- Mobile navigation menus

#### **✅ Use Glass Navigation For:**
- Landing page headers
- Floating/sticky navigation
- Marketing page headers
- Hero section navigation
- Overlay navigation (modals)

### **Cards and Content Containers**

#### **✅ Use Standard Cards For:**
- Course listings
- User-generated content
- Data displays (stats, analytics)
- Content previews
- Search results
- List items

#### **✅ Use Glass Cards For:**
- Hero section CTAs
- Feature highlights
- Testimonials (on marketing pages)
- Special announcements
- Premium content previews
- Call-to-action sections

### **Backgrounds**

#### **✅ Use Cosmic Backgrounds For:**
- Landing/marketing pages
- Course discovery pages
- User onboarding flows
- Authentication pages
- Success/celebration pages
- Dashboard overview pages

#### **✅ Use Standard Backgrounds For:**
- Course content/lessons
- Documentation
- Long-form reading
- Data-heavy interfaces
- Admin interfaces
- Error pages

## ⚡ **Performance Decision Factors**

### **Device Considerations**
```
Is the target device low-powered?
├─ YES → Limit glass effects, prefer standard components
└─ NO → Glass effects acceptable with monitoring

Is this a critical page for Core Web Vitals?
├─ YES → Minimize glass effects, prioritize loading speed
└─ NO → Visual enhancements acceptable

Does the user have limited bandwidth?
├─ YES → Standard components only
└─ NO → Enhanced components acceptable
```

### **Usage Context**
```
Is this page visited frequently by returning users?
├─ YES → Balance performance with familiarity
└─ NO → First impression matters, enhance strategically

Is this a conversion-critical page?
├─ YES → Consider glass enhancement for premium feel
└─ NO → Prioritize fast loading with standard components
```

## 🔍 **Testing and Validation Framework**

### **Pre-Implementation Checklist**
- [ ] **Content Type Identified** - What is the primary purpose?
- [ ] **User Context Understood** - When/how will users access this?
- [ ] **Performance Budget Available** - Can we afford the enhancement?
- [ ] **Accessibility Requirements Clear** - Any special considerations?

### **Post-Implementation Validation**
- [ ] **Readability Test** - Is text easier or harder to read?
- [ ] **Performance Test** - Loading time impact < 5%?
- [ ] **Accessibility Test** - WCAG AA compliance maintained?
- [ ] **User Test** - Positive feedback on visual improvements?

## 📊 **Success Metrics by Enhancement Type**

### **Cosmic Backgrounds**
- **Goal:** Increased brand perception and page engagement
- **Metrics:** Time on page, scroll depth, brand recall
- **Threshold:** No negative impact on readability scores

### **Glass Cards**
- **Goal:** Improved conversion rates and premium perception  
- **Metrics:** Click-through rates, form completions, user satisfaction
- **Threshold:** Performance impact < 100ms additional load time

### **Glass Forms**
- **Goal:** Higher form completion rates and reduced abandonment
- **Metrics:** Form completion rate, time to complete, error rates
- **Threshold:** Completion rate improvement > 5%

## 🚨 **Red Flags - When NOT to Enhance**

### **Immediate Disqualifiers**
- Content is primarily text (articles, documentation)
- Page is performance-critical (checkout, login)
- Users are primarily on low-end devices
- Accessibility requirements are strict
- Content needs maximum readability

### **Warning Signs**
- Page already has 2+ glass effects
- Loading time is already slow
- Users report readability issues
- Conversion rates are dropping
- Support requests are increasing

## 🎯 **Decision Templates**

### **Quick Component Assessment**
```
Component: [Component Name]
Purpose: [Primary Function]
Content Type: [Text/Data/Interactive/Marketing]
User Context: [Learning/Browsing/Converting/Managing]
Enhancement Recommendation: [Standard/Glass/Cosmic+Glass/None]
Rationale: [Brief explanation of decision]
```

### **Page-Level Assessment**
```
Page: [Page Name]
Primary Goal: [User objective on this page]
Content Density: [High/Medium/Low]
Performance Criticality: [High/Medium/Low]
Recommended Approach: [Standard/Hybrid/Enhanced]
Enhancement Areas: [Specific components to enhance]
```

---

**Next:** See [Success Metrics](./success-metrics.md) for measuring the impact of design decisions.