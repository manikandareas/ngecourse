import { ArrowLeft, ArrowRight, Maximize, Moon, Settings } from 'lucide-react';
import { Outlet } from 'react-router';
import { ExpandableTabs } from '~/components/ui/expandable-tabs';
import { LearningLayout } from '~/features/courses/detail/chapters/learning-layout';

export default function CoursesLayout() {
  const tabs = [
    { title: 'Previous', icon: ArrowLeft },
    { type: 'separator' },
    { title: 'Maximize', icon: Maximize },
    { title: 'Appearance', icon: Settings },
    { title: 'Theme', icon: Moon },
    { type: 'separator' },
    { title: 'Complete', icon: ArrowRight },
  ];
  return (
    <div className="relative min-h-screen">
      <LearningLayout course={mockCourse}>
        <Outlet />
      </LearningLayout>
      <div className="-translate-x-1/2 -translate-y-1/2 fixed right-1/2 bottom-4 left-1/2 z-50 flex w-max gap-4">
        <ExpandableTabs
          activeColor="text-primary"
          className="flex flex-row border-border"
          tabs={tabs}
        />
      </div>
    </div>
  );
}

// Mock data - in a real app, this would come from your API/database
const mockCourse = {
  id: '1',
  title: 'UI/UX Design Fundamentals',
  slug: 'ui-ux-fundamentals',
  chapters: [
    {
      id: '1',
      title: 'Introduction to UI/UX',
      slug: 'introduction',
      contents: [
        {
          id: '1',
          title: 'What is UI/UX?',
          type: 'lesson' as const,
          slug: 'what-is-ui-ux',
        },
        {
          id: '2',
          title: 'Design Principles',
          type: 'lesson' as const,
          slug: 'design-principles',
        },
        {
          id: '3',
          title: 'Quiz: Basics',
          type: 'quiz' as const,
          slug: 'basics-quiz',
        },
      ],
    },
    {
      id: '2',
      title: 'Usability Principles',
      slug: 'usability-principles',
      contents: [
        {
          id: '4',
          title: 'Visibility of System Status',
          type: 'lesson' as const,
          slug: 'visibility-system-status',
        },
        {
          id: '5',
          title: 'User Control and Freedom',
          type: 'lesson' as const,
          slug: 'user-control-freedom',
        },
        {
          id: '6',
          title: 'Consistency and Standards',
          type: 'lesson' as const,
          slug: 'consistency-standards',
        },
        {
          id: '7',
          title: 'Quiz: Usability',
          type: 'quiz' as const,
          slug: 'usability-quiz',
        },
      ],
    },
    {
      id: '3',
      title: 'Design Process',
      slug: 'design-process',
      contents: [
        {
          id: '8',
          title: 'Research Phase',
          type: 'lesson' as const,
          slug: 'research-phase',
        },
        {
          id: '9',
          title: 'Wireframing',
          type: 'lesson' as const,
          slug: 'wireframing',
        },
        {
          id: '10',
          title: 'Prototyping',
          type: 'lesson' as const,
          slug: 'prototyping',
        },
        {
          id: '11',
          title: 'Final Quiz',
          type: 'quiz' as const,
          slug: 'final-quiz',
        },
      ],
    },
  ],
};
