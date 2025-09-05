# Component Migration Guide

## 🔄 **Migration Philosophy**

**Principle:** Transform components to hybrid readable-first approach with strategic cosmic enhancements, never compromising functionality or accessibility.

## 📋 **Migration Patterns**

### **Pattern 1: Standard Content Components**
**Use Case:** Blog posts, documentation, course content, data tables

#### **Before:**
```jsx
export function BlogPost({ post }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="prose">
          {post.content}
        </div>
      </article>
    </div>
  );
}
```

#### **After:**
```jsx
export function BlogPost({ post }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="prose">
          {post.content}
        </div>
      </article>
    </div>
  );
}
```

**Changes:** ✨ **None** - Content components stay completely standard for maximum readability.

---

### **Pattern 2: Page Layout with Cosmic Background**
**Use Case:** Landing pages, marketing content, discovery pages

#### **Before:**
```jsx
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
```

#### **After:**
```jsx
export default function HomePage() {
  return (
    <div className="cosmic-bg min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
```

**Changes:** ✨ Added `cosmic-bg` class for page-level ambiance.

---

### **Pattern 3: Hero Sections with Glass Enhancement**
**Use Case:** Landing heroes, course detail heroes, important announcements

#### **Before:**
```jsx
export function HeroSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Genii</h1>
          <p className="text-xl text-gray-600 mb-8">Learn coding with AI</p>
          <Button size="lg">Get Started</Button>
        </div>
      </div>
    </section>
  );
}
```

#### **After:**
```jsx
export function HeroSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Genii</h1>
          <p className="text-xl text-muted-foreground mb-8">Learn coding with AI</p>
          
          {/* Glass card for CTA section */}
          <div className="glass-card max-w-md mx-auto">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Ready to start learning?</p>
              <Button size="lg" className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Changes:** 
- ✨ Added glass card for CTA section
- ✨ Used semantic color tokens (`text-muted-foreground`)
- ✨ Enhanced CTA presentation without compromising readability

---

### **Pattern 4: Form Components - Standard vs Premium**

#### **Standard Forms (Default Approach):**
```jsx
export function ContactForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>Send us a message</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Your message..." />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Send Message</Button>
      </CardFooter>
    </Card>
  );
}
```

#### **Premium Forms (Special Contexts):**
```jsx
export function EnrollmentForm({ course }) {
  return (
    <div className="glass-card w-full max-w-md">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Enroll in {course.title}</h3>
          <p className="text-muted-foreground">Join {course.enrolledCount} students</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <input className="glass-input" id="email" type="email" placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Learning Goal</Label>
            <textarea className="glass-textarea" id="goal" placeholder="What do you hope to achieve?" />
          </div>
        </div>
        
        <Button className="w-full" size="lg">
          Enroll Now - ${course.price}
        </Button>
      </div>
    </div>
  );
}
```

**Decision Criteria:**
- **Standard:** Contact forms, settings, user profiles
- **Premium:** Enrollment, subscription, conversion-focused forms

---

### **Pattern 5: Navigation Components**

#### **Standard Navigation (Content Pages):**
```jsx
export function ContentNav() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-6">
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/progress">Progress</NavLink>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
```

#### **Enhanced Navigation (Landing/Marketing Pages):**
```jsx
export function MarketingNav() {
  return (
    <nav className="glass-card sticky top-4 mx-4 rounded-full">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-6">
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/progress">Progress</NavLink>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Decision Criteria:**
- **Standard:** Content-focused pages, learning interfaces
- **Enhanced:** Landing pages, marketing content, floating navigation

---

### **Pattern 6: Card Components - Data vs Marketing**

#### **Data Cards (Always Standard):**
```jsx
export function StatsCard({ title, value, trend }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <TrendIcon trend={trend} />
        </div>
      </CardContent>
    </Card>
  );
}
```

#### **Marketing Cards (Optional Glass Enhancement):**
```jsx
export function FeatureCard({ feature }) {
  return (
    <div className="glass-card text-center">
      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
          <feature.icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  );
}
```

**Decision Criteria:**
- **Standard Cards:** Data, statistics, user content, course listings
- **Glass Cards:** Marketing features, testimonials, special announcements

---

## 🎯 **Component Decision Framework**

### **Quick Decision Tree:**
```
1. Is this primarily text content?
   └─ YES → Use standard components
   
2. Is this a hero section or landing area?
   └─ YES → Consider cosmic-bg + glass-card
   
3. Is this a form?
   └─ Standard inputs for regular forms
   └─ Glass inputs for premium/conversion contexts
   
4. Is this navigation?
   └─ Standard for content pages
   └─ Optional glass for floating/marketing navs
   
5. Is this decorative/marketing content?
   └─ YES → Apply cosmic elements strategically
   
6. When in doubt → Choose standard components
```

## 📝 **Migration Checklist**

### **For Each Component:**

#### **Analysis Phase:**
- [ ] **Identify component purpose** - What is its primary function?
- [ ] **Assess content type** - Text-heavy or interactive?
- [ ] **Determine context** - Marketing, content, or functional?
- [ ] **Check accessibility requirements** - Any special considerations?

#### **Implementation Phase:**
- [ ] **Choose appropriate pattern** - Standard, enhanced, or hybrid?
- [ ] **Test readability first** - Ensure text remains highly legible
- [ ] **Validate functionality** - No feature regressions
- [ ] **Check responsiveness** - Works on all target devices

#### **Quality Assurance:**
- [ ] **Accessibility audit** - Screen reader and keyboard testing
- [ ] **Performance validation** - No significant impact
- [ ] **Cross-browser testing** - Works on target browsers
- [ ] **User testing** - Positive reception and usability

## 🚨 **Common Migration Mistakes**

### **❌ Over-Enhancement:**
```jsx
// DON'T: Too many glass effects
<div className="glass-card">
  <div className="glass-card">
    <input className="glass-input" />
  </div>
</div>
```

```jsx
// DO: Strategic single enhancement
<div className="glass-card">
  <div className="space-y-4">
    <Input placeholder="Standard input for readability" />
  </div>
</div>
```

### **❌ Content Readability Loss:**
```jsx
// DON'T: Glass effects on text-heavy content
<article className="glass-card">
  <div className="prose">
    {/* Long article content becomes hard to read */}
  </div>
</article>
```

```jsx
// DO: Clean presentation for content
<article className="bg-background">
  <div className="prose">
    {/* Content remains perfectly readable */}
  </div>
</article>
```

### **❌ Accessibility Compromise:**
```jsx
// DON'T: Low contrast on glass backgrounds
<div className="glass-card">
  <p className="text-gray-400">{/* Hard to read */}</p>
</div>
```

```jsx
// DO: High contrast text
<div className="glass-card">
  <p className="text-foreground">{/* Always readable */}</p>
</div>
```

## ⚡ **Performance Migration Notes**

### **Before Migration:**
- Document current performance metrics
- Identify critical rendering paths
- Note any existing performance issues

### **During Migration:**
- Test blur effects on low-end devices
- Monitor bundle size increases
- Validate Core Web Vitals impact

### **After Migration:**
- Compare performance metrics
- Monitor real user performance
- Optimize based on data

---

**Next:** See [Decision Framework](./decision-framework.md) for detailed guidance on when to apply each approach.