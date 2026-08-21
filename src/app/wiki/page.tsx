import { getPublishedWikiPage } from '@/lib/wiki';
import { notFound } from 'next/navigation';
import MarkdownContent from '@/components/markdown-content';
import WikiTOC from '@/components/wiki-toc';

export const dynamic = 'force-dynamic';

export default async function WikiHomePage() {
  const page = await getPublishedWikiPage('');
  if (!page) notFound();

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <article className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <MarkdownContent content={page.content} blueLinks />
        </div>
      </article>
      <WikiTOC content={page.content} />
    </div>
  );
}
