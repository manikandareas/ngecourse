import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigation } from 'react-router';
import type { ChatMessage } from 'sanity.types';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent } from '~/components/ui/drawer';
import { MarkdownRenderer } from '~/components/ui/markdown-renderer';
import { Separator } from '~/components/ui/separator';
import {
  ChatWindow,
  toUIMessage,
} from '~/features/ai-chat/components/chat-window';
import { useChatHistory } from '~/features/ai-chat/hooks/get-chat-history';
import { LessonHeader } from '~/features/courses/components/lesson-header';
import { LessonNavigation } from '~/features/courses/components/lesson-navigation';
import { dataCourses } from '~/features/courses/data';
import { dataEnrollment } from '~/features/enrollments/data';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/lesson';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.lesson.title} | Genii` },
    {
      name: 'description',
      content: data?.lesson.content || 'Lesson detail page of Genii!',
    },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const currentSession = await getCurrentSession(args);
  if (!currentSession) throw new Response('Unauthorized', { status: 401 });

  const lesson = await dataCourses.getLessonBySlug(args.params.lessonSlug);
  if (!lesson) {
    throw new Response('Lesson not found', { status: 404 });
  }

  const enrollment = await dataEnrollment.oneByUserId(
    currentSession._id || '',
    args.params.slug
  );
  if (!enrollment) throw new Response('User not enrolled', { status: 403 });

  return { lesson, enrollment, currentSession };
}

export default function LessonDetailPage(props: Route.ComponentProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    if (navigation.state === 'loading' && isChatOpen) {
      setIsChatOpen(false);
    }
  }, [navigation.state, isChatOpen]);

  useEffect(() => {
    setIsChatOpen(false);
  }, [location.pathname]);

  const {
    data: lesson,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['lesson', props.loaderData.lesson.slug],
    queryFn: () => dataCourses.getLessonBySlug(props.params.lessonSlug),
    initialData: props.loaderData.lesson,
  });

  const { data: chatHistory, isPending: chatHistoryPending } = useChatHistory(
    props.loaderData.currentSession._id,
    lesson?._id as string
  );

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const chatMessages =
    chatHistory?.map((msg) => toUIMessage(msg as unknown as ChatMessage)) || [];

  const commonProps = {
    courseSlug: props.params.slug,
    userId: props.loaderData.currentSession._id,
  };

  const lessonContent = (
    <div className="space-y-6">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <MarkdownRenderer content={lesson?.content ?? ''} />
      </div>
      <Separator className="my-8" />
      <LessonNavigation {...commonProps} />
    </div>
  );

  if (!lesson || isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Could not load courses 😬: {error.message}</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="relative w-full space-y-4 sm:space-y-6">
        <LessonHeader
          {...commonProps}
          isChatOpen={isChatOpen}
          onChatToggle={toggleChat}
          title={lesson.title || 'Lesson Title'}
        />

        {isDesktop ? (
          <div
            className={`grid transition-all duration-300 ${
              isChatOpen ? 'grid-cols-2 divide-x divide-border' : 'grid-cols-1'
            }`}
          >
            <main
              className={`mx-auto px-6 py-8 transition-all duration-300 ${
                isChatOpen ? 'max-w-4xl' : 'max-w-4xl'
              }`}
            >
              <div className="rounded-lg border bg-card/50 p-8 shadow-sm backdrop-blur-sm">
                {lessonContent}
              </div>
            </main>

            {isChatOpen && !chatHistoryPending && (
              <div className="slide-in-from-right-full animate-in bg-card/30 backdrop-blur-sm duration-300">
                <ChatWindow
                  chatHistory={chatMessages}
                  lessonId={lesson._id}
                  variant="desktop"
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <main className="mx-auto max-w-4xl px-4 py-6">
              <div className="rounded-lg border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
                {lessonContent}
              </div>
            </main>

            {isChatOpen && (
              <Drawer onOpenChange={setIsChatOpen} open={isChatOpen}>
                <DrawerContent className="h-[100vh] max-h-[100vh]">
                  {!chatHistoryPending && (
                    <ChatWindow
                      chatHistory={chatMessages}
                      lessonId={lesson._id}
                      onClose={() => setIsChatOpen(false)}
                      variant="mobile"
                    />
                  )}
                </DrawerContent>
              </Drawer>
            )}
          </>
        )}
      </div>
    </div>
  );
}
