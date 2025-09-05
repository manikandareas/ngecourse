# Recommendation Page Copywriting Rewrite with KASIAN BAGINDA Formula

## Task Overview
Rewrite all copywriting for the recommendation page (`app/routes/recommendation.tsx`) using the KASIAN BAGINDA formula (5W1H framework: Kenapa/Why, Apa/What, Siapa/Who, Kapan/When, Bagaimana/How, Di mana/Where) to create more compelling, conversion-focused copy in Indonesian language.

## Current Analysis

### Current State Issues:
1. **Generic English copy** - Not engaging, lacks emotional connection
2. **No clear value proposition** - Missing urgency and pain point addressing
3. **Weak CTAs** - "Skip for now" doesn't create motivation to act
4. **No social proof** - Missing credibility elements
5. **Inconsistent tone** - Doesn't match the successful courses page pattern

### Reference Pattern (courses/constants/copy.ts):
- Uses Indonesian language with colloquial, bright, empathetic tone
- Follows KASIAN BAGINDA formula effectively
- Addresses career stagnation pain points with urgency
- Includes social proof (12k+ professionals)
- Strong CTAs with clear value propositions

## Implementation Plan

### Phase 1: Create Constants File
**File**: `app/features/recommendation/constants/copy.ts`

Apply KASIAN BAGINDA formula for recommendation context:
- **Kenapa (Why)**: Career stagnation + generic learning paths don't work
- **Apa (What)**: AI-powered personalized course recommendations
- **Siapa (Who)**: Indonesian professionals seeking targeted skill development
- **Kapan (When)**: Act now on personalized suggestions + limited-time relevance
- **Bagaimana (How)**: AI analyzes goals → curates perfect courses → direct enrollment
- **Di mana (Where)**: Start learning immediately, don't skip opportunity

### Phase 2: Update Main Component
**File**: `app/routes/recommendation.tsx`

Replace hardcoded strings with constants:
- Meta title and description (lines 39-40)
- Success state heading and description (lines 233-244)
- Skip button text (line 307)

### Phase 3: Update Component Files
**Files to update**:
- `app/features/recommendation/components/error-states.tsx`
- `app/features/recommendation/components/recommendation-status.tsx`
- `app/features/recommendation/components/loading-course-cards.tsx`

Replace English text with Indonesian KASIAN BAGINDA-focused copy.

## Detailed KASIAN BAGINDA Application

### For Recommendation Context:

**Kenapa (Why)**:
- Problem: Generic learning paths waste time and don't match career goals
- Pain point: Professionals struggling to find relevant courses for their specific needs
- Insight: Most people learn random skills instead of strategic career-building ones

**Apa (What)**:
- Solution: AI-powered course recommendations based on personal goals
- Promise: Perfectly curated learning path for your specific career trajectory
- Value: Skip the guesswork, get exactly what you need

**Siapa (Who)**:
- Target: Indonesian professionals who want strategic skill development
- Specific roles: Career-focused individuals, skill upgraders, career changers
- Psychographic: People who value efficiency and strategic learning

**Kapan (When)**:
- Urgency: Your personalized recommendations are ready NOW
- Timing: Don't waste time browsing - act on curated suggestions
- FOMO: These recommendations are specifically for your current goals

**Bagaimana (How)**:
- Process: AI analyzed your goals → curated perfect matches → one-click enrollment
- Mechanism: Personalized algorithm considers experience, goals, and career path
- Simplicity: No need to search, everything is pre-selected for you

**Di mana (Where)**:
- CTA: Enroll in recommended courses immediately
- Action: Start your personalized learning journey now
- Alternative: Explore all courses if recommendations don't fit

## Expected Outcomes

1. **Higher engagement**: Indonesian copy with emotional connection
2. **Better conversion**: KASIAN BAGINDA formula drives action
3. **Consistent brand voice**: Matches successful courses page tone
4. **Clearer value prop**: Users understand why recommendations matter
5. **Reduced skip rate**: More compelling reasons to engage with recommendations

## Success Metrics
- Increased course enrollment from recommendation page
- Reduced "skip for now" clicks
- Higher time spent on recommendation cards
- Better user feedback on copy relevance

## Implementation Sequence

1. **Create constants file** with complete KASIAN BAGINDA copy
2. **Update main route component** with new copy imports
3. **Update error states component** with Indonesian engaging copy
4. **Update status component** with motivational process messaging
5. **Test all states** to ensure copy flows naturally
6. **Review and refine** based on tone consistency with courses page

The new copy will transform the recommendation page from a generic suggestion interface into a compelling, action-driving experience that addresses real career development pain points with urgency and clear value propositions.