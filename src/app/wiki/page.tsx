import { getWikiPage } from '@/lib/wiki';
import { notFound } from 'next/navigation';
import MarkdownContent from '@/components/markdown-content';

export default function WikiHomePage() {
  const page = getWikiPage('');
  if (!page) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <MarkdownContent content={page.content} />
    </article>
  );
}
