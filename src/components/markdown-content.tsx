import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { ComponentPropsWithoutRef } from 'react';
import type { Components } from 'react-markdown';
import LockedSection from './locked-section';

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function headingWithId(level: 2 | 3 | 4): Components['h2'] {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  return function HeadingComponent({ children, ...props }) {
    const text = typeof children === 'string' ? children : String(children ?? '');
    const id = slugify(text.replace(/\*\*/g, ''));
    return <Tag id={id} {...props} className={`scroll-mt-24 ${props.className ?? ''}`}>{children}</Tag>;
  };
}

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'private-section'],
  attributes: {
    ...defaultSchema.attributes,
    'private-section': ['section', 'title'],
  },
};

export default function MarkdownContent({ content, blueLinks = false }: { content: string; blueLinks?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema]]}
      className="prose prose-slate max-w-none
        prose-headings:text-[#1A1A2E]
        prose-a:text-[#1A1A2E] prose-a:no-underline hover:prose-a:text-black hover:prose-a:underline
        prose-code:text-[#1A1A2E] prose-code:bg-[#F7F7F9] prose-code:rounded prose-code:border prose-code:border-[#E0E0E6]
        prose-pre:bg-[#1A1A2E]
        prose-th:bg-[#F7F7F9]
        prose-blockquote:border-l-[#FFB223]"
      components={{
        h2: headingWithId(2),
        h3: headingWithId(3),
        h4: headingWithId(4),
        a: ({ children, ...props }: ComponentPropsWithoutRef<'a'>) => (
          <a {...props} className={blueLinks ? 'text-[#2563EB] no-underline hover:text-[#1D4ED8] hover:underline' : undefined}>
            {children}
          </a>
        ),
        table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
          <div className="wiki-table-scroll">
            <table {...props}>{children}</table>
          </div>
        ),
        'private-section': ({ section, title }: { section?: string; title?: string }) => (
          <LockedSection section={section || ''} title={title} />
        ),
      } as unknown as Components}
    >
      {content}
    </ReactMarkdown>
  );
}
