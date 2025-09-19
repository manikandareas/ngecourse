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
  Tag,
  Zap,
} from 'lucide-react';
import { type KeyboardEvent, useContext, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';
import type { BlockContent, Code } from 'sanity.types';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { SectionAskContext } from '~/features/ai-ask/context/ask-context';
import { urlFor } from '~/lib/sanity-client';
import { cn } from '~/lib/utils';

interface PortableTextRendererProps {
  value: BlockContent;
  className?: string;
  lessonId?: string;
}

const HEADING_STYLES = new Set(['h1', 'h2', 'h3', 'h4']);
const MAX_SECTION_CONTEXT_CHARS = 1500;

type PortableBlock = BlockContent[number];

function isHeadingBlock(block: PortableBlock): block is Extract<PortableBlock, { _type: 'block' }> {
  return (
    typeof block === 'object' &&
    block !== null &&
    block._type === 'block' &&
    typeof block.style === 'string' &&
    HEADING_STYLES.has(block.style)
  );
}

function blocksToPlainText(
  blocks: PortableBlock[] | undefined
): string {
  if (!blocks || blocks.length === 0) {
    return '';
  }

  const plain = toPlainText(blocks as Parameters<typeof toPlainText>[0]);
  return plain.trim();
}

function blockToContextString(block: PortableBlock): string | null {
  if (!block) return null;

  switch (block._type) {
    case 'block': {
      const text = blocksToPlainText([block]);
      return text.length ? text : null;
    }
    case 'code': {
      if (!block.code) return null;
      const languageLabel = block.language ? ` (${block.language})` : '';
      return `Kode contoh${languageLabel}:\n${block.code}`;
    }
    case 'callout': {
      const contentText = blocksToPlainText(block.content as PortableBlock[] | undefined);
      if (!contentText) return null;
      const typeLabel = block.type ? block.type.toUpperCase() : 'CATATAN';
      return `Catatan ${typeLabel}: ${contentText}`;
    }
    case 'badge': {
      const details = [block.type, block.label].filter(Boolean).join(' - ');
      return details ? `Badge: ${details}` : null;
    }
    case 'table': {
      const rows = block.rows
        ?.map((row) =>
          row.cells
            ?.map((cell) => blocksToPlainText(cell.content as PortableBlock[] | undefined))
            .filter(Boolean)
            .join(' | ')
        )
        .filter(Boolean)
        .join('\n');
      return rows ? `Tabel:\n${rows}` : null;
    }
    case 'image': {
      const altText = (block as { alt?: string }).alt;
      return altText ? `Gambar: ${altText}` : null;
    }
    default:
      return null;
  }
}

function buildSectionContentMap(blocks: BlockContent): Record<string, string> {
  if (!Array.isArray(blocks)) {
    return {};
  }

  const contentMap: Record<string, string> = {};
  let activeKey: string | null = null;
  let activeContent: string[] = [];

  const flushActive = () => {
    if (!activeKey) return;
    const text = activeContent.join('\n\n').trim();
    if (!text) return;
    const truncated =
      text.length > MAX_SECTION_CONTEXT_CHARS
        ? `${text.slice(0, MAX_SECTION_CONTEXT_CHARS)}...`
        : text;
    contentMap[activeKey] = truncated;
  };

  for (const block of blocks) {
    if (!block || typeof block !== 'object') {
      continue;
    }

    if (isHeadingBlock(block)) {
      if (activeKey) {
        flushActive();
      }
      activeKey = block._key;
      activeContent = [];
      continue;
    }

    if (!activeKey) {
      continue;
    }

    const text = blockToContextString(block);
    if (text) {
      activeContent.push(text);
    }
  }

  if (activeKey) {
    flushActive();
  }

  return contentMap;
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

// Badge component for lesson categorization
interface BadgeProps {
  type: 'praktek' | 'teori';
  label?: string;
}

function Badge({ type, label }: BadgeProps) {
  const displayLabel = label || type.charAt(0).toUpperCase() + type.slice(1);

  const configs = {
    praktek: {
      className:
        'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
      iconClassName: 'text-green-600 dark:text-green-400',
    },
    teori: {
      className:
        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
      iconClassName: 'text-blue-600 dark:text-blue-400',
    },
  };

  const config = configs[type];

  return (
    <div className="my-4 flex">
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-sm',
          config.className
        )}
      >
        <Tag className={cn('h-4 w-4', config.iconClassName)} />
        {displayLabel}
      </div>
    </div>
  );
}

// Table component for structured data
interface TableProps {
  rows: Array<{
    cells: Array<{
      content: BlockContent;
      isHeader?: boolean;
    }>;
  }>;
  caption?: string;
  components: PortableTextComponents;
}

function Table({ rows, caption, components }: TableProps) {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 border border-gray-200 dark:divide-gray-600 dark:border-gray-700">
        {caption && (
          <caption className="mb-2 caption-bottom text-gray-600 text-sm dark:text-gray-400">
            {caption}
          </caption>
        )}
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {rows.map((row, rowIndex) => (
            <tr
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
              key={`row-${rowIndex.toString()}`}
            >
              {row.cells.map((cell, cellIndex) => {
                const CellTag = cell.isHeader ? 'th' : 'td';
                return (
                  <CellTag
                    className={cn(
                      'px-4 py-3 text-left text-sm',
                      cell.isHeader
                        ? 'bg-gray-50 font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                    key={`cell-${rowIndex.toString()}-${cellIndex.toString()}`}
                    scope={cell.isHeader ? 'col' : undefined}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <PortableText
                        components={components}
                        value={cell.content}
                      />
                    </div>
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Linkable heading component
function LinkableHeading({
  level,
  children,
  value,
  lessonId,
  sectionContent,
}: {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  value: unknown;
  lessonId?: string;
  sectionContent?: string;
}) {
  const askContext = useContext(SectionAskContext);
  const slug = slugify(toPlainText(value as Parameters<typeof toPlainText>[0]));
  const HeadingTag = `h${level}` as const;

  const headingClasses = {
    1: 'text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-8',
    2: 'text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-6',
    3: 'text-2xl font-medium text-gray-900 dark:text-gray-100 mb-3 mt-5',
    4: 'text-xl font-medium text-gray-900 dark:text-gray-100 mb-2 mt-4',
  };

  const block = value as { _key?: string } | undefined;
  const blockKey = block?._key;
  const title = toPlainText(value as Parameters<typeof toPlainText>[0]);
  const isActive = askContext?.context?.sectionKey === blockKey;
  const hasHistory = blockKey ? askContext?.hasHistory(blockKey) : false;

  const handleHeadingAsk = () => {
    if (!(lessonId && blockKey && askContext)) return;

    askContext.setContext({
      lessonId,
      sectionKey: blockKey,
      title,
      content: sectionContent?.trim() ? sectionContent.trim() : undefined,
    });
  };

  const handleHistoryOpen = () => {
    if (!(lessonId && blockKey && askContext)) return;

    askContext.openHistory({
      lessonId,
      sectionKey: blockKey,
      title,
    });
  };

  const buttonColorClass = isActive
    ? 'text-green-500 hover:text-green-400'
    : 'text-muted-foreground hover:text-green-500';

  const iconFillClass = isActive ? 'fill-green-500 text-green-500' : undefined;

  const iconHoverClass = isActive
    ? 'group-hover/h1:fill-green-500 group-hover/h1:text-green-500'
    : hasHistory
      ? 'group-hover/h1:fill-amber-500 group-hover/h1:text-amber-500'
      : 'group-hover/h1:fill-green-500 group-hover/h1:text-green-500';

  const handleHeadingKeyDown = (event: KeyboardEvent<HTMLHeadingElement>) => {
    if (!hasHistory) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHistoryOpen();
    }
  };

  const headingContent = hasHistory ? (
    <span className="after:-z-10 relative inline-block px-1 after:absolute after:inset-x-0 after:bottom-1 after:h-2 after:rounded-sm after:bg-amber-200/70 after:transition-colors after:duration-200 after:content-[''] group-hover/h1:after:bg-amber-300/80 dark:after:bg-amber-500/30">
      {children}
    </span>
  ) : (
    children
  );

  return (
    <div className="group/h1 relative">
      {!hasHistory && (
        <Button
          aria-pressed={isActive}
          className={cn(
            '-left-12 absolute top-0 opacity-0 transition-colors group-hover/h1:opacity-100',
            isActive ? 'opacity-100' : 'opacity-0',
            buttonColorClass
          )}
          disabled={!(askContext && lessonId)}
          onClick={handleHeadingAsk}
          size={'icon'}
          type="button"
          variant={'ghost'}
        >
          <Zap
            className={cn(
              'transition-colors ease-in-out',
              iconHoverClass,
              iconFillClass
            )}
            size={16}
          />
        </Button>
      )}
      <HeadingTag
        className={cn(
          headingClasses[level],
          'group scroll-mt-24',
          hasHistory &&
            'hover:-translate-y-0.5 w-fit cursor-pointer rounded-md transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 dark:focus-visible:outline-amber-300'
        )}
        id={slug}
        onClick={() => (hasHistory ? handleHistoryOpen() : null)}
        onKeyDown={handleHeadingKeyDown}
        tabIndex={hasHistory ? 0 : undefined}
      >
        {headingContent}
        <a
          aria-label={`Link to ${toPlainText(value as Parameters<typeof toPlainText>[0])}`}
          className={cn(
            'z-50 ml-2 text-gray-400 no-underline opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100 dark:hover:text-gray-300',
            hasHistory &&
              'text-amber-400 hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-200'
          )}
          href={`#${slug}`}
        >
          #
        </a>
      </HeadingTag>
    </div>
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
  lessonId,
}: PortableTextRendererProps) {
  const sectionContentMap = useMemo(() => buildSectionContentMap(value), [value]);

  const components: PortableTextComponents = useMemo(() => {
    const getSectionContent = (blockValue: unknown) => {
      const key = (blockValue as { _key?: string })?._key;
      return key ? sectionContentMap[key] : undefined;
    };

    const components: PortableTextComponents = {
      block: {
        h1: ({ children, value }) => (
          <LinkableHeading
            lessonId={lessonId}
            level={1}
            sectionContent={getSectionContent(value)}
            value={value}
          >
            {children}
          </LinkableHeading>
        ),
        h2: ({ children, value }) => (
          <LinkableHeading
            lessonId={lessonId}
            level={2}
            sectionContent={getSectionContent(value)}
            value={value}
          >
            {children}
          </LinkableHeading>
        ),
        h3: ({ children, value }) => (
          <LinkableHeading
            lessonId={lessonId}
            level={3}
            sectionContent={getSectionContent(value)}
            value={value}
          >
            {children}
          </LinkableHeading>
        ),
        h4: ({ children, value }) => (
          <LinkableHeading
            lessonId={lessonId}
            level={4}
            sectionContent={getSectionContent(value)}
            value={value}
          >
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
        badge: ({ value }) => <Badge label={value.label} type={value.type} />,
        table: ({ value }) => (
          <Table
            caption={value.caption}
            components={components}
            rows={value.rows}
          />
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
    };

    return components;
  }, [lessonId, sectionContentMap]);

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
