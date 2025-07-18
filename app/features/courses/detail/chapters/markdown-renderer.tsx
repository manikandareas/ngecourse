import { cn } from '~/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  // For now, we'll render the content as HTML
  // In a real implementation, you'd want to use a proper markdown parser like react-markdown
  return (
    <div
      className={cn(
        'prose prose-slate max-w-none',
        // Mobile-first responsive typography
        'prose-sm sm:prose-base',
        // Headings
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-h1:text-xl sm:prose-h1:text-2xl lg:prose-h1:text-3xl',
        'prose-h2:text-lg sm:prose-h2:text-xl lg:prose-h2:text-2xl',
        'prose-h3:text-base sm:prose-h3:text-lg lg:prose-h3:text-xl',
        // Paragraphs and text
        'prose-p:text-muted-foreground prose-p:leading-relaxed',
        'prose-p:text-sm sm:prose-p:text-base',
        // Links
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        // Code
        'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5',
        'prose-code:text-xs sm:prose-code:text-sm',
        'prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted',
        'prose-pre:text-xs sm:prose-pre:text-sm',
        'prose-pre:max-w-full prose-pre:overflow-x-auto',
        // Blockquotes
        'prose-blockquote:rounded-r prose-blockquote:border-l-primary',
        'prose-blockquote:bg-muted/50 prose-blockquote:px-3 sm:prose-blockquote:px-4',
        'prose-blockquote:py-2 prose-blockquote:text-sm sm:prose-blockquote:text-base',
        // Lists
        'prose-ol:text-muted-foreground prose-ul:text-muted-foreground',
        'prose-li:marker:text-muted-foreground',
        'prose-li:text-sm sm:prose-li:text-base',
        // Spacing adjustments for mobile
        'prose-headings:mb-2 sm:prose-headings:mb-3',
        'prose-p:mb-3 sm:prose-p:mb-4',
        'prose-ul:mb-3 sm:prose-ul:mb-4',
        'prose-ol:mb-3 sm:prose-ol:mb-4',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
