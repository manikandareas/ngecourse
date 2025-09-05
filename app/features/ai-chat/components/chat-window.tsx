import { useChat } from '@ai-sdk/react';
import { useAuth } from '@clerk/react-router';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { GlobeIcon } from 'lucide-react';
import { useState } from 'react';
import type { ChatMessage } from 'sanity.types';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '~/components/ai-elements/conversation';
import { Loader } from '~/components/ai-elements/loader';
import { Message, MessageContent } from '~/components/ai-elements/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '~/components/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '~/components/ai-elements/reasoning';
import { ResponseComponent } from '~/components/ai-elements/response';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '~/components/ai-elements/source';
import { Suggestion, Suggestions } from '~/components/ai-elements/suggestion';
import { getPublicEnv } from '~/env.public';
import { LESSON_COPY } from '~/features/courses/constants/lesson-copy';

interface ChatWindowProps {
  chatHistory: UIMessage[];
  lessonId: string;
  variant?: 'desktop' | 'mobile';
  onClose?: () => void;
}

const EXTERNAL_SERVICE_URL = getPublicEnv(import.meta.env).EXTERNAL_SERVICE_URL;

const suggestions = LESSON_COPY.chat.window.suggestions;

export const ChatWindow = ({
  lessonId,
  chatHistory,
  variant = 'desktop',
}: ChatWindowProps) => {
  const { getToken } = useAuth();

  const [input, setInput] = useState('');
  const [webSearch, setWebSearch] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      setInput('');
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    sendMessage(
      { text: suggestion },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
  };

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${EXTERNAL_SERVICE_URL}/api/chat`,
      body: {
        lessonId,
      },
    }),
    messages: chatHistory,
  });
  return (
    <div
      className={`relative mx-auto size-full ${
        variant === 'mobile' ? 'h-full max-w-full p-4' : 'h-full max-w-none p-6'
      }`}
    >
      <div className="flex h-full flex-col">
        <Conversation className={variant === 'mobile' ? 'flex-1' : 'h-full'}>
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' && (
                  <Sources>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'source-url':
                          return (
                            <>
                              <SourcesTrigger
                                count={
                                  message.parts.filter(
                                    (p) => p.type === 'source-url'
                                  ).length
                                }
                              />
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  href={part.url}
                                  key={`${message.id}-${i}`}
                                  title={part.url}
                                />
                              </SourcesContent>
                            </>
                          );
                        default:
                          return null;
                      }
                    })}
                  </Sources>
                )}
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <ResponseComponent
                              key={`${message.id}-${i}`}
                              lazyRender={false}
                            >
                              {part.text}
                            </ResponseComponent>
                          );
                        case 'reasoning':
                          return (
                            <Reasoning
                              className="w-full"
                              isStreaming={status === 'streaming'}
                              key={`${message.id}-${i}`}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="mt-4 flex flex-col gap-4 bg-background">
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              data-chat-input
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton
                  onClick={() => setWebSearch(!webSearch)}
                  variant={webSearch ? 'default' : 'ghost'}
                >
                  <GlobeIcon size={16} />
                  <span>{LESSON_COPY.chat.window.searchButton}</span>
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit disabled={!input} status={status} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

// → UI (convert from Sanity doc to UIMessage)
export function toUIMessage(doc: ChatMessage): UIMessage {
  if (!doc) {
    return {
      id: '',
      role: 'user',
      metadata: undefined,
      parts: [],
    };
  }

  return {
    id: doc.messageId || '',
    role: doc.role || 'user',
    metadata: doc.metadata?.custom
      ? JSON.parse(doc.metadata.custom)
      : undefined,
    parts:
      doc.parts?.map((p) => {
        // Handle based on _type since that's what we have in the simplified query
        if (p._type === 'toolUIPart') {
          return {
            type: `tool-${p.name || 'unknown'}`,
            toolCallId: p.toolCallId,
            ...(p.state === 'input-streaming' && {
              state: 'input-streaming',
              input: p.input?.data ? JSON.parse(p.input.data) : undefined,
            }),
            ...(p.state === 'input-available' && {
              state: 'input-available',
              input: p.input?.data ? JSON.parse(p.input.data) : undefined,
            }),
            ...(p.state === 'output-available' && {
              state: 'output-available',
              input: p.input?.data ? JSON.parse(p.input.data) : undefined,
              output: p.output?.data ? JSON.parse(p.output.data) : undefined,
            }),
            ...(p.state === 'output-error' && {
              state: 'output-error',
              input: p.input?.data ? JSON.parse(p.input.data) : undefined,
              errorText: p.errorText,
            }),
            providerExecuted: p.providerExecuted,
          };
        }
        if (p._type === 'dataUIPart') {
          return {
            type: `data-${p.name || 'unknown'}`,
            id: p.dataId,
            data: p.data?.content ? JSON.parse(p.data.content) : undefined,
          };
        }
        if (p._type === 'reasoningUIPart') {
          return {
            type: 'reasoning',
            text: p.text,
            state: p.state,
            providerMetadata: p.providerMetadata?.data
              ? JSON.parse(p.providerMetadata.data)
              : undefined,
          };
        }
        if (p._type === 'sourceUrlUIPart') {
          return {
            type: 'source-url',
            sourceId: p.sourceId,
            url: p.url,
            title: p.title,
            providerMetadata: p.providerMetadata?.data
              ? JSON.parse(p.providerMetadata.data)
              : undefined,
          };
        }
        if (p._type === 'sourceDocumentUIPart') {
          return {
            type: 'source-document',
            sourceId: p.sourceId,
            mediaType: p.mediaType,
            title: p.title,
            filename: p.filename,
            providerMetadata: p.providerMetadata?.data
              ? JSON.parse(p.providerMetadata.data)
              : undefined,
          };
        }
        if (p._type === 'fileUIPart') {
          return {
            type: 'file',
            mediaType: p.mediaType,
            filename: p.filename,
            url: p.url,
          };
        }
        if (p._type === 'textUIPart') {
          return {
            type: 'text',
            text: p.text || '',
            state: p.state,
          };
        }
        if (p._type === 'stepStartUIPart') {
          return {
            type: 'step-start',
          };
        }
        // Fallback for unknown types
        return p;
      }) || [],
  };
}
