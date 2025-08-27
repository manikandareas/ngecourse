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
    <div className={cn(
      'prose prose-slate max-w-none prose-lg',
      'prose-headings:text-text-primary prose-headings:font-light prose-headings:tracking-tight',
      'prose-p:text-text-secondary prose-p:leading-8 prose-p:text-lg',
      'prose-strong:text-text-primary prose-em:text-text-primary',
      'prose-li:text-text-secondary prose-li:leading-7',
      'prose-blockquote:text-text-secondary prose-blockquote:border-accent/30',
      'prose-hr:border-hairline',
      className
    )}>
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
                  <div className="border-b border-hairline bg-white/5 px-4 py-2 text-text-muted font-mono text-xs uppercase tracking-wider">
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
                  className="rounded-md bg-white/10 px-2 py-1 text-accent font-mono text-sm border border-hairline"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-hairline bg-white/3 p-6 backdrop-blur-sm">
                <code
                  className="whitespace-pre-wrap text-text-primary font-mono text-sm leading-6"
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
                <table
                  className="w-full border-collapse"
                  {...props}
                >
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: MarkdownComponentProps) {
            return (
              <th
                className="border-b border-hairline bg-white/5 px-6 py-4 text-left text-text-primary font-medium"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }: MarkdownComponentProps) {
            return (
              <td className="border-b border-hairline px-6 py-4 text-text-secondary" {...props}>
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
              <ul className="list-disc space-y-3 pl-8 marker:text-accent" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: MarkdownComponentProps) {
            return (
              <ol className="list-decimal space-y-3 pl-8 marker:text-accent marker:font-medium" {...props}>
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
              <h1 className="mt-12 mb-6 text-text-primary font-light text-4xl tracking-tight leading-tight" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: MarkdownComponentProps) {
            return (
              <h2 className="mt-10 mb-5 text-text-primary font-light text-3xl tracking-tight leading-tight" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: MarkdownComponentProps) {
            return (
              <h3 className="mt-8 mb-4 text-text-primary font-medium text-2xl tracking-tight leading-tight" {...props}>
                {children}
              </h3>
            );
          },

          // Paragraph styling
          p({ children, ...props }: MarkdownComponentProps) {
            // To avoid hydration errors with nested divs in paragraphs
            return (
              <div className="paragraph mb-6 text-text-secondary text-lg leading-8" {...props}>
                {children}
              </div>
            );
          },

          // Blockquote styling
          blockquote({ children, ...props }: MarkdownComponentProps) {
            return (
              <blockquote
                className="my-8 rounded-xl border-l-4 border-accent/30 bg-white/3 pl-6 pr-6 py-4 italic text-text-secondary backdrop-blur-sm"
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
                className="inline-flex items-center gap-1 text-accent font-medium underline decoration-accent/30 underline-offset-4 transition-all duration-200 hover:text-accent-alt hover:decoration-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:rounded-sm"
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
