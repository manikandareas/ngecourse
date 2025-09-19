import { Loader2, MessageCircle, Sparkles, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { AskContextChip } from '~/components/ai-elements/context-chip';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { cn } from '~/lib/utils';

export interface AIResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  contextTitle?: string;
  streamedText: string;
  isLoading: boolean;
}

export function AIResponseDialog({
  open,
  onOpenChange,
  question,
  contextTitle,
  streamedText,
  isLoading,
}: AIResponseDialogProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [streamedText, open]);

  const hasQuestion = question.trim().length > 0;
  const hasResponse = streamedText.trim().length > 0;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="min-w-[46rem] gap-4">
        <DialogHeader className="gap-2.5">
          <DialogTitle className="flex items-center text-xl">
            Tanya
            <span aria-hidden className=" text-amber-500">
              Genii
            </span>
          </DialogTitle>
          {hasQuestion && (
            <DialogDescription className="text-muted-foreground text-sm">
              Pertanyaan:{' '}
              <span className="font-medium text-foreground">{question}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <div
          aria-live="polite"
          className={cn(
            'relative overflow-hidden rounded-xl border border-border p-4',
            hasResponse ? 'min-h-[200px]' : 'min-h-[160px]'
          )}
        >
          {isLoading && !hasResponse && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 aria-hidden className="size-6 animate-spin" />
              <span className="font-medium text-sm">Menyiapkan jawaban…</span>
            </div>
          )}

          <div
            className="h-full space-y-3 overflow-y-auto pr-1 text-foreground text-sm leading-6 lg:max-h-[36rem]"
            ref={scrollRef}
          >
            {hasResponse && (
              <p className="whitespace-pre-wrap text-muted-foreground">
                {streamedText}
                {isLoading && (
                  <span className="ml-1 inline-block animate-pulse text-foreground">
                    ▍
                  </span>
                )}
              </p>
            )}
            {!(hasResponse || isLoading) && (
              <p className="text-muted-foreground">
                Ajukan pertanyaan tentang bagian materi untuk melihat respons
                AI.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          {contextTitle && (
            <AskContextChip className="bg-primary/5" title={contextTitle} />
          )}
          <span className="flex-1" />
          <Button
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
