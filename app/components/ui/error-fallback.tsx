import { AlertTriangle, ArrowLeft, RefreshCw, SearchX } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedShinyText } from './animated-shiny-text';
import { Button } from './button';
import { PageBackground } from './page-background';

interface ErrorFallbackProps {
  isNotFound: boolean;
  details: string;
  stack?: string;
  refreshing?: boolean;
  onBack: () => void;
  onRefresh: () => void;
}

export function ErrorFallback({
  isNotFound,
  details,
  stack,
  refreshing = false,
  onBack,
  onRefresh,
}: ErrorFallbackProps) {
  const Icon = isNotFound ? SearchX : AlertTriangle;

  return (
    <PageBackground>
      <main className="relative flex min-h-screen items-center justify-center px-4 pt-16">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            aria-hidden="true"
            className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
            initial={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 20,
              delay: 0.05,
            }}
          >
            <Icon className="size-8 text-white/80" />
          </motion.div>

          <motion.h1
            animate={{ opacity: 1 }}
            className="mb-2 font-light text-3xl text-text-primary tracking-tight"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
          >
            {isNotFound ? 'Page not found' : 'Something went wrong'}
          </motion.h1>

          <AnimatedShinyText className="mb-6 text-muted-foreground text-sm">
            {details}
          </AnimatedShinyText>

          {stack && (
            <motion.details
              animate={{ opacity: 1 }}
              className="mx-auto mb-6 w-full overflow-hidden rounded-md border border-white/10 bg-black/20 text-left"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.25 }}
            >
              <summary className="cursor-pointer px-3 py-2 text-text-secondary text-xs">
                Technical details (dev)
              </summary>
              <pre className="max-h-60 w-full overflow-auto px-3 pb-3 text-xs leading-relaxed">
                <code>{stack}</code>
              </pre>
            </motion.details>
          )}

          <motion.div
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={onBack}
              size="lg"
              type="button"
              variant="secondary"
            >
              <ArrowLeft className="mr-2 size-4" />
              Go back
            </Button>

            <Button
              disabled={refreshing}
              onClick={onRefresh}
              size="lg"
              type="button"
            >
              <RefreshCw
                className={`mr-2 size-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
          </motion.div>
        </motion.section>
      </main>
    </PageBackground>
  );
}
