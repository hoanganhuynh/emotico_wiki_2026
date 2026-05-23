import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-slate max-w-none
        prose-headings:text-[#1A1A2E]
        prose-a:text-[#FFB223] prose-a:no-underline hover:prose-a:underline
        prose-code:text-[#1A1A2E] prose-code:bg-[#F7F7F9] prose-code:rounded prose-code:border prose-code:border-[#E0E0E6]
        prose-pre:bg-[#1A1A2E]
        prose-th:bg-[#F7F7F9]
        prose-blockquote:border-l-[#FFB223]"
    >
      {content}
    </ReactMarkdown>
  );
}
