import { BookOpen, Clock } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { MarkdownRenderer } from '~/features/courses/detail/chapters/markdown-renderer';
import type { Route } from './+types/chapter-detail';

const mockChapterContent = {
  introduction: {
    title: 'Introduction to UI/UX',
    description:
      'Learn the fundamentals of user interface and user experience design.',
    duration: '45 minutes',
    difficulty: 'Beginner',
    content: `
      <h1>Introduction to UI/UX Design</h1>
      <p>Welcome to the world of UI/UX design! This chapter will introduce you to the fundamental concepts that form the foundation of great user experiences.</p>
      
      <h2>What You'll Learn</h2>
      <ul>
        <li>The difference between UI and UX design</li>
        <li>Core principles of good design</li>
        <li>How to think like a user</li>
        <li>The importance of user research</li>
      </ul>
      
      <h2>UI vs UX: Understanding the Difference</h2>
      <p>User Interface (UI) and User Experience (UX) are often used interchangeably, but they represent different aspects of design:</p>
      
      <blockquote>
        <p><strong>UI Design</strong> focuses on the visual elements - colors, typography, buttons, icons, and layout. It's about how things look.</p>
      </blockquote>
      
      <blockquote>
        <p><strong>UX Design</strong> focuses on the overall experience - how users interact with the product, how they feel, and whether they can accomplish their goals efficiently.</p>
      </blockquote>
      
      <h2>The Design Process</h2>
      <p>Great design doesn't happen by accident. It follows a structured process:</p>
      <ol>
        <li><strong>Research</strong> - Understanding your users and their needs</li>
        <li><strong>Define</strong> - Clearly articulating the problem to solve</li>
        <li><strong>Ideate</strong> - Brainstorming and exploring solutions</li>
        <li><strong>Prototype</strong> - Creating testable versions of your ideas</li>
        <li><strong>Test</strong> - Validating your solutions with real users</li>
      </ol>
      
      <h2>Key Takeaways</h2>
      <p>Remember these fundamental principles as you continue your design journey:</p>
      <ul>
        <li>Always design with the user in mind</li>
        <li>Simplicity is often the best approach</li>
        <li>Consistency builds trust and usability</li>
        <li>Test early and test often</li>
      </ul>
    `,
  },
  'usability-principles': {
    title: 'Usability Principles',
    description:
      "Explore Jakob Nielsen's 10 usability heuristics and how to apply them.",
    duration: '60 minutes',
    difficulty: 'Intermediate',
    content: `
      <h1>Usability Principles</h1>
      <p>Jakob Nielsen's 10 usability heuristics are fundamental principles for interaction design. These guidelines help create user-friendly interfaces that are intuitive and efficient.</p>
      
      <h2>The 10 Usability Heuristics</h2>
      <p>Let's explore each principle with practical examples:</p>
      
      <h3>1. Visibility of System Status</h3>
      <p>The system should always keep users informed about what is going on through appropriate feedback within reasonable time.</p>
      <ul>
        <li>Progress bars for file uploads</li>
        <li>Loading indicators</li>
        <li>Confirmation messages</li>
      </ul>
      
      <h3>2. Match Between System and Real World</h3>
      <p>The system should speak the users' language, with words, phrases, and concepts familiar to the user.</p>
      
      <h3>3. User Control and Freedom</h3>
      <p>Users often choose system functions by mistake and need a clearly marked "emergency exit" to leave the unwanted state.</p>
      
      <code>Example: Undo/Redo functionality, Cancel buttons</code>
      
      <h2>Applying These Principles</h2>
      <p>When designing your interfaces, constantly ask yourself:</p>
      <ul>
        <li>Is it clear what's happening?</li>
        <li>Can users easily recover from mistakes?</li>
        <li>Are we using familiar language and concepts?</li>
        <li>Is the interface consistent?</li>
      </ul>
    `,
  },
  'design-process': {
    title: 'Design Process',
    description:
      'Learn the step-by-step process of creating user-centered designs.',
    duration: '90 minutes',
    difficulty: 'Advanced',
    content: `
      <h1>The Design Process</h1>
      <p>A structured design process ensures that your solutions are user-centered, well-researched, and thoroughly tested.</p>
      
      <h2>Phase 1: Research and Discovery</h2>
      <p>Before jumping into solutions, we need to understand the problem space:</p>
      
      <h3>User Research Methods</h3>
      <ul>
        <li><strong>Interviews</strong> - One-on-one conversations with users</li>
        <li><strong>Surveys</strong> - Quantitative data from larger groups</li>
        <li><strong>Observation</strong> - Watching users in their natural environment</li>
        <li><strong>Analytics</strong> - Data from existing products</li>
      </ul>
      
      <h2>Phase 2: Define and Synthesize</h2>
      <p>Transform your research insights into actionable design requirements:</p>
      
      <blockquote>
        <p>Create user personas, journey maps, and problem statements that guide your design decisions.</p>
      </blockquote>
      
      <h2>Phase 3: Ideation and Concept Development</h2>
      <p>Generate multiple solutions before settling on one:</p>
      
      <pre><code>Brainstorming → Sketching → Concept Selection → Refinement</code></pre>
      
      <h2>Phase 4: Prototyping</h2>
      <p>Create testable versions of your ideas:</p>
      <ul>
        <li><strong>Low-fidelity</strong> - Paper sketches, wireframes</li>
        <li><strong>Medium-fidelity</strong> - Digital wireframes, clickable prototypes</li>
        <li><strong>High-fidelity</strong> - Pixel-perfect, interactive prototypes</li>
      </ul>
      
      <h2>Phase 5: Testing and Iteration</h2>
      <p>Validate your designs with real users and iterate based on feedback.</p>
      
      <h3>Testing Methods</h3>
      <ul>
        <li>Usability testing</li>
        <li>A/B testing</li>
        <li>Heuristic evaluation</li>
        <li>Accessibility testing</li>
      </ul>
    `,
  },
};

export default function ChapterDetailPage(props: Route.ComponentProps) {
  const chapterSlug = props.params.chapterSlug || 'introduction';
  const chapterData =
    mockChapterContent[chapterSlug as keyof typeof mockChapterContent] ||
    mockChapterContent.introduction;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Chapter Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
          <BookOpen className="h-4 w-4" />
          <span>Chapter</span>
        </div>

        <h1 className="font-bold text-2xl text-foreground leading-tight sm:text-3xl">
          {chapterData.title}
        </h1>

        <p className="text-base text-muted-foreground sm:text-lg">
          {chapterData.description}
        </p>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {chapterData.duration}
            </span>
          </div>
          <Badge className="text-xs sm:text-sm" variant="secondary">
            {chapterData.difficulty}
          </Badge>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="border-t pt-4 sm:pt-6">
        <MarkdownRenderer content={chapterData.content} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6 sm:pt-8">
        <div className="text-muted-foreground text-xs sm:text-sm">
          Continue with the lessons and quizzes in this chapter
        </div>
      </div>
    </div>
  );
}
