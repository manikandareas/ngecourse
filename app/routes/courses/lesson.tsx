import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigation } from 'react-router';
import type { ChatMessage } from 'sanity.types';
import { useMediaQuery } from 'usehooks-ts';
import { ChatCloseButton } from '~/components/ui/chat-close-button';
import { ChatSideTrigger } from '~/components/ui/chat-side-trigger';
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
import { useEventTracking } from '~/hooks/use-event-tracking';
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
  const { startSession, endSession, startActivity } = useEventTracking();

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
  // Session and activity tracking
  useEffect(() => {
    let sessionStarted = false;

    const initializeTracking = async () => {
      // Start session for the course
      const courseId = props.loaderData.enrollment.course?._id; // Using lesson ID as course context
      if (courseId) {
        await startSession(courseId);
        sessionStarted = true;

        // Start activity timing for this specific lesson
        startActivity();
      }
    };

    initializeTracking();

    // Cleanup on unmount or route change
    return () => {
      if (sessionStarted) {
        endSession('navigation');
      }
    };
  }, [
    props.loaderData.enrollment.course?._id,
    startSession,
    endSession,
    startActivity,
  ]);

  // Handle page visibility changes to pause/resume tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, could pause tracking if needed
      } else {
        // Page is visible again, resume tracking
        startActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startActivity]);

  // Focus management for chat
  useEffect(() => {
    if (isChatOpen && !chatHistoryPending) {
      // Small delay to ensure chat window is rendered
      const focusTimer = setTimeout(() => {
        const chatInput = document.querySelector(
          '[data-chat-input]'
        ) as HTMLTextAreaElement;
        if (chatInput) {
          chatInput.focus();
        }
      }, 150);

      return () => clearTimeout(focusTimer);
    }
  }, [isChatOpen, chatHistoryPending]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const chatMessages = useMemo(() => {
    return (
      chatHistory?.map((msg) => toUIMessage(msg as unknown as ChatMessage)) ||
      []
    );
  }, [chatHistory]);

  const commonProps = {
    courseSlug: props.params.slug,
    userId: props.loaderData.currentSession._id,
  };

  const lessonContent = (
    <div className="space-y-8">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <MarkdownRenderer content={lesson?.content ?? ''} />
      </div>
      <Separator className="my-8 border-hairline" />
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
    <div className="relative w-full ">
      <LessonHeader
        {...commonProps}
        isChatOpen={isChatOpen}
        onChatToggle={toggleChat}
        title={lesson.title || 'Lesson Title'}
      />

      {/* Desktop Chat Trigger */}
      {isDesktop && (
        <ChatSideTrigger
          isOpen={isChatOpen}
          onClick={toggleChat}
          text="Butuh Bantuan?"
        />
      )}

      {isDesktop ? (
        <div
          className={`grid gap-6 px-4 transition-all duration-300 sm:px-6 ${
            isChatOpen ? 'grid-cols-[2fr_1fr]' : 'grid-cols-1'
          }`}
        >
          <main
            className={'mx-auto w-full max-w-5xl transition-all duration-300'}
          >
            <article>{lessonContent}</article>
          </main>

          {isChatOpen && !chatHistoryPending && (
            <aside className="slide-in-from-right-full relative max-w-2xl animate-in duration-300">
              {/* Close Button positioned outside chat */}
              <ChatCloseButton isOpen={isChatOpen} onClick={toggleChat} />
              <div className="sticky top-4 h-[calc(100vh-4rem-1rem)] overflow-hidden rounded-r-2xl border-hairline border-l bg-background">
                <ChatWindow
                  chatHistory={chatMessages}
                  lessonId={lesson._id}
                  variant="desktop"
                />
              </div>
            </aside>
          )}
        </div>
      ) : (
        <>
          <main className="mx-auto max-w-4xl px-4 sm:px-6">
            <article className="glass-card">{lessonContent}</article>
          </main>

          {isChatOpen && (
            <Drawer onOpenChange={setIsChatOpen} open={isChatOpen}>
              <DrawerContent className="h-[100vh] max-h-[100vh] border-strong border-t bg-background/95 backdrop-blur-xl">
                {chatHistoryPending ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      <p className="text-text-secondary">Loading chat...</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col p-4">
                    {/* Mobile Chat Header */}
                    <div className="mb-4 flex items-center justify-between border-hairline border-b pb-4">
                      <h2 className="font-semibold text-lg text-text-primary">
                        Ask Genii
                      </h2>
                      <button
                        aria-label="Close chat"
                        className="btn-ghost p-2"
                        onClick={() => setIsChatOpen(false)}
                        type="button"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <title>Close</title>
                          <path
                            d="M6 18L18 6M6 6l12 12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ChatWindow
                        chatHistory={chatMessages}
                        lessonId={lesson._id}
                        onClose={() => setIsChatOpen(false)}
                        variant="mobile"
                      />
                    </div>
                  </div>
                )}
              </DrawerContent>
            </Drawer>
          )}
        </>
      )}
    </div>
  );
}
