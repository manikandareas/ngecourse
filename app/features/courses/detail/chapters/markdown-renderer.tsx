import type React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { buttonVariants } from '~/components/ui/button';
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
    <div className={cn('prose prose-slate max-w-none', className)}>
      <ReactMarkdown
        components={{
          // Code block styling
          code({ inline, children, ...props }: MarkdownComponentProps) {
            // biome-ignore lint/performance/useTopLevelRegex: regex for validate language
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && language) {
              return (
                <div className="relative my-4 overflow-hidden rounded-md">
                  <div className="bg-gray-800 px-4 py-1 font-mono text-gray-300 text-xs">
                    {language}
                  </div>
                  <SyntaxHighlighter
                    customStyle={{
                      margin: 0,
                      borderRadius: '0 0 0.375rem 0.375rem',
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
                  className="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-800 text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-4 overflow-x-auto rounded-md bg-gray-100 p-4">
                <code
                  className="whitespace-pre-wrap font-mono text-sm"
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
              <div className="my-6 overflow-x-auto">
                <table
                  className="w-full border-collapse border border-gray-300"
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
                className="border border-gray-300 bg-gray-100 px-4 py-2 text-left"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }: MarkdownComponentProps) {
            return (
              <td className="border border-gray-300 px-4 py-2" {...props}>
                {children}
              </td>
            );
          },
          hr({ ...props }: MarkdownComponentProps) {
            return <hr className="my-8" {...props} />;
          },

          // List styling
          ul({ children, ...props }: MarkdownComponentProps) {
            return (
              <ul className="list-disc space-y-2 pl-6" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: MarkdownComponentProps) {
            return (
              <ol className="list-decimal space-y-2 pl-6" {...props}>
                {children}
              </ol>
            );
          },
          li({ children, ...props }: MarkdownComponentProps) {
            return (
              <li className="pl-1" {...props}>
                {children}
              </li>
            );
          },

          // Heading styling
          h1({ children, ...props }: MarkdownComponentProps) {
            return (
              <h1 className="mt-6 mb-4 font-bold text-2xl" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: MarkdownComponentProps) {
            return (
              <h2 className="mt-5 mb-3 font-bold text-xl" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: MarkdownComponentProps) {
            return (
              <h3 className="mt-4 mb-2 font-bold text-lg" {...props}>
                {children}
              </h3>
            );
          },

          // Paragraph styling
          p({ children, ...props }: MarkdownComponentProps) {
            // To avoid hydration errors with nested divs in paragraphs
            return (
              <div className="paragraph mb-4" {...props}>
                {children}
              </div>
            );
          },

          // Blockquote styling
          blockquote({ children, ...props }: MarkdownComponentProps) {
            return (
              <blockquote
                className="my-4 border-gray-300 border-l-4 pl-4 italic"
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
                className={buttonVariants({
                  variant: 'link',
                  className:
                    'mt-2 inline-flex items-center gap-1 font-semibold text-blue-600 underline decoration-dashed transition-colors hover:text-blue-800',
                })}
                href={href}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                target={isExternal ? '_blank' : undefined}
                {...props}
              >
                {children}
                {isExternal && (
                  <svg
                    aria-label="(opens in a new tab)"
                    className="ml-1 inline-block h-4 w-4 text-blue-400"
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
