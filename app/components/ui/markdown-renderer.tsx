import type React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { cn } from '~/lib/utils';

// Define a generic type for ReactMarkdown components
type MarkdownComponentProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;

  // biome-ignore lint/suspicious/noExplicitAny: rest of the props
  [key: string]: any;
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * A reusable Markdown renderer component with math and code highlighting support
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  return (
    <div
      className={cn(
        'prose prose-slate prose-lg max-w-none',
        'prose-headings:font-light prose-headings:text-text-primary prose-headings:tracking-tight',
        'prose-p:text-lg prose-p:text-text-secondary prose-p:leading-8',
        'prose-em:text-text-primary prose-strong:text-text-primary',
        'prose-li:text-text-secondary prose-li:leading-7',
        'prose-blockquote:border-accent/30 prose-blockquote:text-text-secondary',
        'prose-hr:border-hairline',
        className
      )}
    >
      <ReactMarkdown
        components={{
          // Code block styling
          code({ inline, children, ...props }: MarkdownComponentProps) {
            // biome-ignore lint/performance/useTopLevelRegex: regex for validate language
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && language) {
              return (
                <div className="relative my-6 overflow-hidden rounded-xl border border-hairline bg-white/3 backdrop-blur-sm">
                  <div className="border-hairline border-b bg-white/5 px-4 py-2 font-mono text-text-muted text-xs uppercase tracking-wider">
                    {language}
                  </div>
                  <SyntaxHighlighter
                    customStyle={{
                      margin: 0,
                      borderRadius: '0 0 0.75rem 0.75rem',
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary)',
                      padding: '1.5rem',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                    }}
                    language={language}
                    // style={oneDark}
                    {...props}
                  >
                    {/** biome-ignore lint/performance/useTopLevelRegex: regex for remove trailing newline */}
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }
            if (inline) {
              return (
                <code
                  className="rounded-md border border-hairline bg-white/10 px-2 py-1 font-mono text-accent text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-hairline bg-white/3 p-6 backdrop-blur-sm">
                <code
                  className="whitespace-pre-wrap font-mono text-sm text-text-primary leading-6"
                  {...props}
                >
                  {children}
                </code>
              </div>
            );
          },

          // Table styling
          table({ children, ...props }: MarkdownComponentProps) {
            return (
              <div className="my-8 overflow-x-auto rounded-xl border border-hairline bg-white/3 backdrop-blur-sm">
                <table className="w-full border-collapse" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: MarkdownComponentProps) {
            return (
              <th
                className="border-hairline border-b bg-white/5 px-6 py-4 text-left font-medium text-text-primary"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }: MarkdownComponentProps) {
            return (
              <td
                className="border-hairline border-b px-6 py-4 text-text-secondary"
                {...props}
              >
                {children}
              </td>
            );
          },
          hr({ ...props }: MarkdownComponentProps) {
            return <hr className="my-12 border-hairline" {...props} />;
          },

          // List styling
          ul({ children, ...props }: MarkdownComponentProps) {
            return (
              <ul
                className="list-disc space-y-3 pl-8 marker:text-accent"
                {...props}
              >
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: MarkdownComponentProps) {
            return (
              <ol
                className="list-decimal space-y-3 pl-8 marker:font-medium marker:text-accent"
                {...props}
              >
                {children}
              </ol>
            );
          },
          li({ children, ...props }: MarkdownComponentProps) {
            return (
              <li className="pl-2 leading-7" {...props}>
                {children}
              </li>
            );
          },

          // Heading styling
          h1({ children, ...props }: MarkdownComponentProps) {
            return (
              <h1
                className="mt-12 mb-6 font-light text-4xl text-text-primary leading-tight tracking-tight"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: MarkdownComponentProps) {
            return (
              <h2
                className="mt-10 mb-5 font-light text-3xl text-text-primary leading-tight tracking-tight"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: MarkdownComponentProps) {
            return (
              <h3
                className="mt-8 mb-4 font-medium text-2xl text-text-primary leading-tight tracking-tight"
                {...props}
              >
                {children}
              </h3>
            );
          },

          // Paragraph styling
          p({ children, ...props }: MarkdownComponentProps) {
            // To avoid hydration errors with nested divs in paragraphs
            return (
              <div
                className="paragraph mb-6 text-lg text-text-secondary leading-8"
                {...props}
              >
                {children}
              </div>
            );
          },

          // Blockquote styling
          blockquote({ children, ...props }: MarkdownComponentProps) {
            return (
              <blockquote
                className="my-8 rounded-xl border-accent/30 border-l-4 bg-white/3 py-4 pr-6 pl-6 text-text-secondary italic backdrop-blur-sm"
                {...props}
              >
                {children}
              </blockquote>
            );
          },

          a({
            children,
            href,
            ...props
          }: MarkdownComponentProps & { href?: string }) {
            // biome-ignore lint/performance/useTopLevelRegex: regex for validate external link
            const isExternal = href && /^https?:\/\//.test(href);
            return (
              <a
                className="inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-all duration-200 hover:text-accent-alt hover:decoration-accent/60 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                href={href}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                target={isExternal ? '_blank' : undefined}
                {...props}
              >
                {children}
                {isExternal && (
                  <svg
                    aria-label="(opens in a new tab)"
                    className="ml-1 inline-block h-4 w-4 text-accent/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <title>(opens in a new tab)</title>
                    <path
                      d="M17 7V17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10m-1-4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </a>
            );
          },
        }}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              throwOnError: false,
              strict: false,
              output: 'html',
              displayMode: false,
            },
          ],
        ]}
        remarkPlugins={[remarkGfm, remarkMath]}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
