import { CheckIcon, CopyIcon } from 'lucide-react';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import {
  createContext,
  lazy,
  memo,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

// Type for syntax styles
type SyntaxStyles = {
  oneDark: Record<string, React.CSSProperties>;
  oneLight: Record<string, React.CSSProperties>;
};

// Lazy load the heavy SyntaxHighlighter only when needed
const LazyPrismHighlighter = lazy(() =>
  import('react-syntax-highlighter').then((module) => ({
    default: module.Prism,
  }))
);

// Import styles dynamically
let syntaxStyles: SyntaxStyles | null = null;
const loadStyles = async (): Promise<SyntaxStyles> => {
  if (!syntaxStyles) {
    const styles = await import(
      'react-syntax-highlighter/dist/cjs/styles/prism'
    );
    syntaxStyles = { oneDark: styles.oneDark, oneLight: styles.oneLight };
  }
  return syntaxStyles;
};

// Lightweight fallback component for better performance
const LightweightCodeBlock = memo(
  ({
    code,
    className,
  }: {
    code: string;
    language?: string;
    className?: string;
  }) => {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-md border bg-background text-foreground',
          className
        )}
      >
        <pre className="overflow-x-auto p-4 text-sm">
          <code className="font-mono text-sm">{code}</code>
        </pre>
      </div>
    );
  }
);

// Hook for intersection observer
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, hasBeenVisible]);

  return { ref, isVisible, hasBeenVisible };
};

// Custom hook to detect dark mode
const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
      }
    };

    const observer = new MutationObserver(checkDarkMode);
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => observer.disconnect();
  }, []);

  return isDark;
};

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: '',
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  children?: ReactNode;
};

// Heavy syntax highlighter component
const HeavySyntaxHighlighter = memo(
  ({
    code,
    language,
    showLineNumbers,
    isDark,
    className,
    children,
  }: {
    code: string;
    language: string;
    showLineNumbers?: boolean;
    isDark: boolean;
    className?: string;
    children?: ReactNode;
  }) => {
    const [styles, setStyles] = useState<SyntaxStyles | null>(null);

    useEffect(() => {
      loadStyles().then(setStyles);
    }, []);

    const syntaxStyle = useMemo(() => {
      if (!styles) return {};
      return isDark ? styles.oneDark : styles.oneLight;
    }, [isDark, styles]);

    const customStyle = useMemo(
      () => ({
        margin: 0,
        padding: '1rem',
        fontSize: '0.875rem',
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
      }),
      []
    );

    const lineNumberStyle = useMemo(
      () => ({
        color: 'hsl(var(--muted-foreground))',
        paddingRight: '1rem',
        minWidth: '2.5rem',
      }),
      []
    );

    const codeTagProps = useMemo(
      () => ({
        className: 'font-mono text-sm',
      }),
      []
    );

    if (!styles) {
      return (
        <LightweightCodeBlock
          className={className}
          code={code}
          language={language}
        />
      );
    }

    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-md border bg-background text-foreground',
          className
        )}
      >
        <div className="relative">
          <Suspense
            fallback={<LightweightCodeBlock code={code} language={language} />}
          >
            <LazyPrismHighlighter
              className="overflow-hidden"
              codeTagProps={codeTagProps}
              customStyle={customStyle}
              language={language}
              lineNumberStyle={lineNumberStyle}
              showLineNumbers={showLineNumbers}
              style={syntaxStyle}
            >
              {code}
            </LazyPrismHighlighter>
          </Suspense>
          {children && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Main CodeBlock component with lazy loading and intersection observer
export const CodeBlock = memo(
  ({
    code,
    language,
    showLineNumbers = false,
    className,
    children,
    ...props
  }: CodeBlockProps) => {
    const isDark = useIsDarkMode();
    const { ref, hasBeenVisible } = useIntersectionObserver(0.1);
    const [shouldLoadHeavy, setShouldLoadHeavy] = useState(false);

    // Delay loading heavy syntax highlighter to improve initial render
    useEffect(() => {
      if (hasBeenVisible) {
        const timer = setTimeout(() => {
          setShouldLoadHeavy(true);
        }, 100); // Small delay to let the page settle
        return () => clearTimeout(timer);
      }
    }, [hasBeenVisible]);

    return (
      <CodeBlockContext.Provider value={{ code }}>
        <div className={cn('relative w-full', className)} ref={ref} {...props}>
          {shouldLoadHeavy ? (
            <HeavySyntaxHighlighter
              className={className}
              code={code}
              isDark={isDark}
              language={language}
              showLineNumbers={showLineNumbers}
            >
              {children}
            </HeavySyntaxHighlighter>
          ) : (
            <LightweightCodeBlock
              className={className}
              code={code}
              language={language}
            />
          )}
          {children && !shouldLoadHeavy && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </CodeBlockContext.Provider>
    );
  }
);

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
      onError?.(new Error('Clipboard API not available'));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn('shrink-0', className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};
