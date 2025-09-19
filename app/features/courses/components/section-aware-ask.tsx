import { useAuth } from '@clerk/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AIResponseDialog } from '~/components/ai-elements/ai-response-dialog';
import { AskContextChip } from '~/components/ai-elements/context-chip';
import { FloatingBar } from '~/components/ai-elements/floating-input';
import { useSectionAsk } from '~/features/ai-ask/context/ask-context';

interface SectionAwareAskProps {
  lessonId: string;
}

const FALLBACK_ENDPOINT = 'http://localhost:4000/api/agent/ask';
const SSE_DONE_TOKEN = '[DONE]';

function sanitizeStreamChunk(rawChunk: string) {
  if (!rawChunk) return '';

  return rawChunk
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => {
      if (line.startsWith('data:')) {
        return line.slice(5);
      }
      return line;
    })
    .filter((line) => line.trim() !== SSE_DONE_TOKEN)
    .join('\n');
}

export function SectionAwareAsk({ lessonId }: SectionAwareAskProps) {
  const { context, clearContext, isDialogOpen, setDialogOpen } =
    useSectionAsk();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { getToken } = useAuth();

  const endpoint = useMemo(
    () => import.meta.env.VITE_AGENT_ASK_ENDPOINT ?? FALLBACK_ENDPOINT,
    []
  );

  const appendChunk = useCallback((chunk: string) => {
    const sanitized = sanitizeStreamChunk(chunk);
    if (!sanitized) return;

    setResponse((prev) => {
      if (!prev) return sanitized;

      const needsSeparator = !(
        prev.endsWith(' ') ||
        prev.endsWith('\n') ||
        sanitized.startsWith(' ') ||
        sanitized.startsWith('\n')
      );

      return `${prev}${needsSeparator ? ' ' : ''}${sanitized}`;
    });
  }, []);

  const cancelInFlight = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelInFlight();
    };
  }, [cancelInFlight]);

  const handleSubmit = useCallback(
    async (value: string) => {
      cancelInFlight();
      setQuestion(value);
      setResponse('');
      setDialogOpen(true);
      setIsLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getToken()}`,
          },
          body: JSON.stringify({
            prompt: value,
            lessonId,
            sectionKey: context?.sectionKey ?? undefined,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || 'Permintaan gagal diproses');
        }

        if (!res.body) {
          const text = await res.text();
          appendChunk(text);
          setIsLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value: chunk, done } = await reader.read();
          if (done) {
            const remaining = decoder.decode();
            appendChunk(remaining);
            break;
          }

          if (chunk) {
            const text = decoder.decode(chunk, { stream: true });
            appendChunk(text);
          }
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Section-aware ask failed', error);
        setResponse(
          'Maaf, kami tidak bisa mendapatkan jawaban sekarang. Silakan coba lagi nanti.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [
      appendChunk,
      cancelInFlight,
      context?.sectionKey,
      endpoint,
      lessonId,
      setDialogOpen,
    ]
  );

  const handleDialogChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
        cancelInFlight();
        setIsLoading(false);
      }
    },
    [cancelInFlight, setDialogOpen]
  );

  return (
    <>
      <FloatingBar
        leftSlot={
          context ? (
            <AskContextChip
              key={context.sectionKey}
              onClear={clearContext}
              title={context.title ?? 'Bagian terpilih'}
            />
          ) : null
        }
        onSubmit={handleSubmit}
      />

      <AIResponseDialog
        contextTitle={context?.title}
        isLoading={isLoading}
        onOpenChange={handleDialogChange}
        open={isDialogOpen}
        question={question}
        streamedText={response}
      />
    </>
  );
}
