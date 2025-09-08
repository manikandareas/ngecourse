import {
  PortableText,
  type PortableTextComponents,
  toPlainText,
} from '@portabletext/react';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  HelpCircle,
  Info,
  Lightbulb,
} from 'lucide-react';
import { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/material-oceanic';
import type { BlockContent, Code } from 'sanity.types';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { urlFor } from '~/lib/sanity-client';
import { cn } from '~/lib/utils';

interface PortableTextRendererProps {
  value: BlockContent;
  className?: string;
}

// Utility function to slugify text for anchor links
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Copy to clipboard functionality
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch {
      // Silent fail for copy operation
    }
    document.body.removeChild(textArea);
  });
}

// Enhanced code block component
function CodeBlock({ value }: { value: Code }) {
  const handleCopy = () => {
    if (value.code) {
      copyToClipboard(value.code);
    }
  };

  return (
    <div className="group relative my-6">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-800 px-4 py-2">
        <span className="text-gray-300 text-sm">
          {value.filename ||
            (value.language ? getLanguage(value.language) : 'CODE')}
        </span>
        <Button
          className="text-gray-300 opacity-0 transition-opacity hover:bg-gray-700 hover:text-white group-hover:opacity-100"
          onClick={handleCopy}
          size="sm"
          variant="ghost"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
      <SyntaxHighlighter
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
        language={value.language === 'sh' ? 'bash' : value.language || 'bash'}
        lineProps={(lineNumber) => {
          const isHighlighted = value.highlightedLines?.includes(lineNumber);
          return {
            style: {
              backgroundColor: isHighlighted
                ? 'rgba(59, 130, 246, 0.15)'
                : 'transparent',
              borderLeft: isHighlighted
                ? '3px solid #3b82f6'
                : '3px solid transparent',
              paddingLeft: '0.5rem',
              display: 'block',
            },
          };
        }}
        showLineNumbers={true}
        style={dark}
        wrapLines={true}
      >
        {value.code || ''}
      </SyntaxHighlighter>
    </div>
  );
}

// Educational callout component
interface CalloutProps {
  type: 'info' | 'warning' | 'tip' | 'quiz' | 'important';
  children: React.ReactNode;
}

function Callout({ type, children }: CalloutProps) {
  const configs = {
    info: {
      icon: Info,
      className:
        'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
      iconClassName: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      icon: AlertCircle,
      className:
        'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
      iconClassName: 'text-yellow-600 dark:text-yellow-400',
    },
    tip: {
      icon: Lightbulb,
      className:
        'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
      iconClassName: 'text-green-600 dark:text-green-400',
    },
    quiz: {
      icon: HelpCircle,
      className:
        'border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-100',
      iconClassName: 'text-purple-600 dark:text-purple-400',
    },
    important: {
      icon: CheckCircle,
      className:
        'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
      iconClassName: 'text-red-600 dark:text-red-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Card className={cn('my-6 max-h-fit border-l-4 py-2', config.className)}>
      <CardContent className="flex items-center gap-3">
        <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.iconClassName)} />
        <div className="flex-1">{children}</div>
      </CardContent>
    </Card>
  );
}

// Linkable heading component
function LinkableHeading({
  level,
  children,
  value,
}: {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  value: unknown;
}) {
  const slug = slugify(toPlainText(value as Parameters<typeof toPlainText>[0]));
  const HeadingTag = `h${level}` as const;

  const headingClasses = {
    1: 'text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-8',
    2: 'text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-6',
    3: 'text-2xl font-medium text-gray-900 dark:text-gray-100 mb-3 mt-5',
    4: 'text-xl font-medium text-gray-900 dark:text-gray-100 mb-2 mt-4',
  };

  return (
    <HeadingTag
      className={cn(headingClasses[level], 'group scroll-mt-24')}
      id={slug}
    >
      {children}
      <a
        aria-label={`Link to ${toPlainText(value as Parameters<typeof toPlainText>[0])}`}
        className="ml-2 text-gray-400 no-underline opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100 dark:hover:text-gray-300"
        href={`#${slug}`}
      >
        #
      </a>
    </HeadingTag>
  );
}

// Enhanced image component
function EnhancedImage({
  value,
  isInline,
}: {
  value: {
    asset?: { _ref: string };
    alt?: string;
  };
  isInline?: boolean;
}) {
  // In a real implementation, you'd use @sanity/image-url here
  // For now, we'll use a placeholder approach
  const imageUrl = urlFor(value)?.url();

  if (!imageUrl) {
    return null;
  }

  return (
    <figure className={cn('my-6', isInline ? 'inline-block' : 'block')}>
      <img
        alt={value.alt || 'Content image'}
        className={cn(
          'rounded-lg border border-gray-200 dark:border-gray-700',
          isInline ? 'max-w-sm' : 'mx-auto w-full max-w-4xl'
        )}
        loading="lazy"
        src={imageUrl}
      />
      {value.alt && !isInline && (
        <figcaption className="mt-2 text-center text-gray-600 text-sm italic dark:text-gray-400">
          {value.alt}
        </figcaption>
      )}
    </figure>
  );
}

// Create memoized components configuration
export function PortableTextRenderer({
  value,
  className,
}: PortableTextRendererProps) {
  const components: PortableTextComponents = useMemo(
    () => ({
      block: {
        h1: ({ children, value }) => (
          <LinkableHeading level={1} value={value}>
            {children}
          </LinkableHeading>
        ),
        h2: ({ children, value }) => (
          <LinkableHeading level={2} value={value}>
            {children}
          </LinkableHeading>
        ),
        h3: ({ children, value }) => (
          <LinkableHeading level={3} value={value}>
            {children}
          </LinkableHeading>
        ),
        h4: ({ children, value }) => (
          <LinkableHeading level={4} value={value}>
            {children}
          </LinkableHeading>
        ),
        normal: ({ children }) => (
          <p className="mb-4 text-gray-700 leading-7 dark:text-gray-300">
            {children}
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-6 border-gray-300 border-l-4 pl-4 text-gray-600 italic dark:border-gray-600 dark:text-gray-400">
            {children}
          </blockquote>
        ),
      },

      list: {
        bullet: ({ children }) => (
          <ul className="my-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="my-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
            {children}
          </ol>
        ),
      },

      listItem: {
        bullet: ({ children }) => <li className="pl-1">{children}</li>,
        number: ({ children }) => <li className="pl-1">{children}</li>,
      },

      marks: {
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-gray-100">
            {children}
          </strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
          <code className="rounded bg-gray-100 px-2 py-1 font-mono text-gray-800 text-sm dark:bg-gray-800 dark:text-gray-200">
            {children}
          </code>
        ),
        link: ({ children, value }) => {
          const isExternal = value?.href?.startsWith('http');
          return (
            <a
              className="inline-flex items-center gap-1 text-blue-600 underline underline-offset-2 transition-all hover:text-blue-800 hover:underline-offset-4 dark:text-blue-400 dark:hover:text-blue-300"
              href={value?.href}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              target={isExternal ? '_blank' : undefined}
            >
              {children}
              {isExternal && <ExternalLink className="h-3 w-3" />}
            </a>
          );
        },
      },

      types: {
        image: ({ value, isInline }) => (
          <EnhancedImage isInline={isInline} value={value} />
        ),
        code: ({ value }) => <CodeBlock value={value} />,
        // You can extend this with custom callout types from your Sanity schema
        callout: ({ value }) => (
          <Callout type={value.type || 'info'}>
            <PortableText components={components} value={value.content || []} />
          </Callout>
        ),
      },

      // Handle unknown elements gracefully
      unknownType: ({ value }) => (
        <div className="my-4 rounded-lg border border-gray-300 border-dashed bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
          <p className="text-gray-600 text-sm dark:text-gray-400">
            Unknown block type: {value._type}
          </p>
        </div>
      ),
    }),
    []
  );

  return (
    <div
      className={cn(
        'prose prose-slate dark:prose-invert max-w-none',
        className
      )}
    >
      <PortableText components={components} value={value} />
    </div>
  );
}

const getLanguage = (language: string) => {
  switch (language) {
    case 'sh':
      return 'bash';
    case 'typescript':
      return 'tsx';
    default:
      return language;
  }
};
