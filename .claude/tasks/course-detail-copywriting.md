# Course Detail Page Copywriting Rewrite - KASIAN BAGINDA Formula

## Task Overview
Rewrite all copywriting for the course detail page and its components using the KASIAN BAGINDA formula to create compelling, conversion-focused copy that resonates with Indonesian professionals wanting career advancement.

## Current Analysis

### Page Structure
- **Main Route**: `app/routes/courses/course.tsx`
- **Components**: DetailHero, DetailContents, DetailPromo
- **Supporting Components**: DetailCTA, DetailEnrollDialog, LearningOutcomes

### Current Copywriting Elements Identified

#### DetailHero Component
- Course title (dynamic from Sanity)
- Course description (dynamic from Sanity)
- Topic badges (dynamic)
- CTA buttons: "Start Learning Now" / "Continue Learning" / "Review Course"

#### DetailContents Component
- Section badge: "Contents"
- Section title: "What's in this course?"
- Section description (uses course description)
- Subsection title: "Course Structure"
- Learning outcomes title: "Yang akan Anda pelajari"
- Learning outcomes items (hardcoded list of 8 items)

#### DetailPromo Component
- Promo title: "Build your portfolio with this course"
- Promo description: "Build 16 web development projects..."
- CTA button: "Enroll Now for Free"

#### DetailEnrollDialog Component
- Dialog title: "Enroll in {title}"
- Level label: "{difficulty} Level"
- Feature labels: duration, lessons count, topics, "Lifetime Access"
- About section title: "About This Course"
- CTA button: "Enroll Now - Free" / "Processing enrollment"

#### Meta Tags
- Title: "{course.title} | Genii"
- Description: course.description or fallback

### KASIAN BAGINDA Framework Application

#### Target Audience Analysis
- **Primary**: Indonesian professionals (developers, career changers, skill upgraders)
- **Pain Points**: Skill stagnation, career plateau, competition in job market
- **Goals**: Career advancement, practical skills, portfolio building
- **Context**: Busy professionals needing efficient, practical learning

## Implementation Plan

### 1. Create Course Detail Copy Constants File
Create `app/features/courses/constants/course-detail-copy.ts` with comprehensive copy following KASIAN BAGINDA formula:

#### Structure:
- Meta tags and SEO copy
- Hero section copy
- Contents section copy
- Promo section copy
- Dialog and modal copy
- CTA variations
- Error states and loading messages
- Social proof and urgency messages

### 2. KASIAN BAGINDA Formula Application

**Kenapa (Why)**: 
- Address skill stagnation and career advancement needs
- Highlight competition in job market
- Emphasize time wasted on irrelevant learning

**Apa (What)**:
- Expert-led courses with real-world projects
- Practical skills that directly impact career
- Portfolio-ready projects

**Siapa (Who)**:
- Indonesian professionals wanting growth
- Career changers and skill upgraders
- Developers seeking advancement

**Kapan (When)**:
- Start immediately, don't wait
- Limited-time enrollment opportunities
- Career momentum timing

**Bagaimana (How)**:
- Step-by-step learning from experts
- Practical project-based approach
- Clear learning progression

**Di mana (Where)**:
- Clear CTAs throughout the page
- Multiple enrollment touchpoints
- Easy navigation to start learning

### 3. Copy Categories to Create

#### Hero Section Copy
- Dynamic title enhancers (prefixes/suffixes)
- Compelling descriptions beyond course description
- Multiple CTA variations based on enrollment status
- Badge copy for course difficulty
- Social proof snippets

#### Contents Section Copy
- Section headers with urgency/value
- Learning outcomes rewritten for career impact
- Course structure descriptions
- Progress indicators copy

#### Promo Section Copy
- Multiple promo scenarios (portfolio, career, skills)
- Urgency messages
- Social proof testimonials
- FOMO-inducing copy

#### Enrollment Dialog Copy
- Compelling dialog titles
- Feature descriptions with benefits
- About course copy templates
- Processing states copy

#### Supporting Copy
- Error messages that motivate retry
- Loading states that build anticipation
- Success messages that encourage progression
- Meta descriptions for SEO

### 4. Implementation Strategy

1. **Create comprehensive constants file**
2. **Map copy elements to component locations**
3. **Provide clear usage instructions**
4. **Include TypeScript types for better DX**
5. **Document KASIAN BAGINDA formula application**

### 5. Key Success Metrics
- Conversion-focused language
- Indonesian market resonance
- Professional tone with empathy
- Clear value propositions
- Strong CTAs throughout user journey

## Next Steps
1. Create the course detail copy constants file
2. Map all copy elements to specific component usage
3. Provide implementation guidance
4. Document the reasoning behind each KASIAN BAGINDA element

## Notes
- Focus only on copywriting, no component logic changes
- Maintain existing component structure
- Use conversational, empathetic Indonesian tone
- Prioritize career advancement messaging
- Include multiple CTA variations for different contexts