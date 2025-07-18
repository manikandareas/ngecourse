import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { MarkdownRenderer } from '~/features/courses/detail/chapters/markdown-renderer';
import type { Route } from './+types/lesson-detail';

const mockLessonContent = {
  'what-is-ui-ux': {
    title: 'What is UI/UX?',
    description:
      'Understanding the fundamental difference between UI and UX design.',
    duration: '15 minutes',
    difficulty: 'Beginner',
    chapterTitle: 'Introduction to UI/UX',
    content: `
      <h1>What is UI/UX?</h1>
      <p>Let's start with the basics. UI and UX are two terms that are often used interchangeably, but they represent very different aspects of design.</p>
      
      <h2>User Interface (UI) Design</h2>
      <p>UI design is all about the visual elements of a product:</p>
      <ul>
        <li><strong>Colors</strong> - The color palette that creates mood and hierarchy</li>
        <li><strong>Typography</strong> - Font choices that affect readability and personality</li>
        <li><strong>Layout</strong> - How elements are arranged on the screen</li>
        <li><strong>Interactive elements</strong> - Buttons, forms, menus, and other clickable items</li>
      </ul>
      
      <blockquote>
        <p>Think of UI as the "look" of your product - it's what users see and interact with directly.</p>
      </blockquote>
      
      <h2>User Experience (UX) Design</h2>
      <p>UX design focuses on the overall experience:</p>
      <ul>
        <li><strong>User research</strong> - Understanding who your users are and what they need</li>
        <li><strong>Information architecture</strong> - How information is organized and structured</li>
        <li><strong>User flows</strong> - The paths users take to complete tasks</li>
        <li><strong>Usability</strong> - How easy and efficient it is to use the product</li>
      </ul>
      
      <blockquote>
        <p>UX is about the "feel" of your product - it's how users experience and interact with it.</p>
      </blockquote>
      
      <h2>The Relationship</h2>
      <p>UI and UX work together to create great products:</p>
      <ul>
        <li>UX research informs UI design decisions</li>
        <li>UI design affects the overall user experience</li>
        <li>Both are essential for creating products people love to use</li>
      </ul>
      
      <h2>Key Takeaway</h2>
      <p>Remember: <strong>UI is what you see, UX is how it works.</strong> Both are crucial for creating successful digital products.</p>
    `,
  },
  'design-principles': {
    title: 'Design Principles',
    description: 'Core principles that guide effective UI/UX design decisions.',
    duration: '20 minutes',
    difficulty: 'Beginner',
    chapterTitle: 'Introduction to UI/UX',
    content: `
      <h1>Fundamental Design Principles</h1>
      <p>Great design isn't just about making things look pretty. It's about following proven principles that make interfaces intuitive and effective.</p>
      
      <h2>1. Hierarchy</h2>
      <p>Visual hierarchy guides users through your content in order of importance:</p>
      <ul>
        <li><strong>Size</strong> - Larger elements draw more attention</li>
        <li><strong>Color</strong> - Bright or contrasting colors stand out</li>
        <li><strong>Position</strong> - Items at the top or center get noticed first</li>
        <li><strong>Typography</strong> - Bold, italic, or different fonts create emphasis</li>
      </ul>
      
      <h2>2. Contrast</h2>
      <p>Contrast helps users distinguish between different elements:</p>
      <blockquote>
        <p>Good contrast improves readability and accessibility for all users, including those with visual impairments.</p>
      </blockquote>
      
      <h2>3. Alignment</h2>
      <p>Proper alignment creates order and makes interfaces feel organized:</p>
      <ul>
        <li>Left-align text for easy reading</li>
        <li>Center-align headings for emphasis</li>
        <li>Use consistent margins and padding</li>
      </ul>
      
      <h2>4. Repetition</h2>
      <p>Consistent patterns help users learn your interface:</p>
      <ul>
        <li>Use the same button styles throughout</li>
        <li>Maintain consistent spacing</li>
        <li>Apply color schemes systematically</li>
      </ul>
      
      <h2>5. Proximity</h2>
      <p>Related elements should be grouped together:</p>
      <ul>
        <li>Form fields and their labels</li>
        <li>Navigation items</li>
        <li>Related content sections</li>
      </ul>
      
      <h2>Practice Exercise</h2>
      <p>Look at your favorite app or website. Can you identify how these principles are being used? Notice how hierarchy guides your eye and how grouping makes information easier to understand.</p>
    `,
  },
  'visibility-system-status': {
    title: 'Visibility of System Status',
    description:
      "Learn how to keep users informed about what's happening in your interface.",
    duration: '25 minutes',
    difficulty: 'Intermediate',
    chapterTitle: 'Usability Principles',
    content: `
      <h1>Visibility of System Status</h1>
      <p>This is the first of Nielsen's 10 usability heuristics, and for good reason. Users should always know what's happening in your system.</p>
      
      <h2>Why It Matters</h2>
      <p>When users don't know what's happening, they:</p>
      <ul>
        <li>Feel confused and frustrated</li>
        <li>May think the system is broken</li>
        <li>Might abandon their task</li>
        <li>Lose trust in your product</li>
      </ul>
      
      <h2>Common Examples</h2>
      
      <h3>Loading States</h3>
      <p>Always show when something is loading:</p>
      <ul>
        <li><strong>Progress bars</strong> - For file uploads or downloads</li>
        <li><strong>Spinners</strong> - For quick operations</li>
        <li><strong>Skeleton screens</strong> - For content that's loading</li>
      </ul>
      
      <h3>Form Feedback</h3>
      <p>Let users know about their input:</p>
      <ul>
        <li><strong>Validation messages</strong> - Show errors immediately</li>
        <li><strong>Success states</strong> - Confirm when actions complete</li>
        <li><strong>Character counters</strong> - Show remaining characters</li>
      </ul>
      
      <h3>System Status</h3>
      <p>Keep users informed about the system:</p>
      <ul>
        <li><strong>Online/offline status</strong> - Especially important for mobile</li>
        <li><strong>Save status</strong> - "Saving...", "Saved", "Error saving"</li>
        <li><strong>Connection status</strong> - Network connectivity</li>
      </ul>
      
      <h2>Best Practices</h2>
      
      <h3>Timing</h3>
      <ul>
        <li>Show feedback within <strong>0.1 seconds</strong> for immediate actions</li>
        <li>Show loading indicators after <strong>1 second</strong> of waiting</li>
        <li>Provide progress updates for operations longer than <strong>10 seconds</strong></li>
      </ul>
      
      <h3>Clarity</h3>
      <blockquote>
        <p>Use clear, human-readable messages. Instead of "Error 404", say "Page not found".</p>
      </blockquote>
      
      <h3>Consistency</h3>
      <ul>
        <li>Use the same loading patterns throughout your app</li>
        <li>Maintain consistent styling for status messages</li>
        <li>Place status indicators in predictable locations</li>
      </ul>
      
      <h2>Common Mistakes</h2>
      <ul>
        <li>No feedback for slow operations</li>
        <li>Generic error messages that don't help users</li>
        <li>Inconsistent loading states</li>
        <li>Status messages that disappear too quickly</li>
      </ul>
      
      <h2>Implementation Tips</h2>
      <p>When designing status feedback:</p>
      <ol>
        <li>Map out all possible states in your user flows</li>
        <li>Design for error states, not just success</li>
        <li>Test with real data and slow connections</li>
        <li>Consider accessibility - use more than just color</li>
      </ol>
    `,
  },
};

export default function LessonDetailPage(props: Route.ComponentProps) {
  const lessonSlug = props.params.lessonSlug || 'what-is-ui-ux';
  const lessonData =
    mockLessonContent[lessonSlug as keyof typeof mockLessonContent] ||
    mockLessonContent['what-is-ui-ux'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Lesson Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
          <PlayCircle className="h-4 w-4" />
          <span>Lesson</span>
          <span>•</span>
          <span className="truncate">{lessonData.chapterTitle}</span>
        </div>

        <h1 className="font-bold text-2xl text-foreground leading-tight sm:text-3xl">
          {lessonData.title}
        </h1>

        <p className="text-base text-muted-foreground sm:text-lg">
          {lessonData.description}
        </p>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {lessonData.duration}
            </span>
          </div>
          <Badge className="text-xs sm:text-sm" variant="secondary">
            {lessonData.difficulty}
          </Badge>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="border-t pt-4 sm:pt-6">
        <MarkdownRenderer content={lessonData.content} />
      </div>
    </div>
  );
}
