import { getInternalWikiPageResolved } from '@/lib/wiki-internal';
import { notFound } from 'next/navigation';
import MarkdownContent from '@/components/markdown-content';
import WikiTOC from '@/components/wiki-toc';

export const dynamic = 'force-dynamic';

export default async function WikiInternalHome() {
  const page = await getInternalWikiPageResolved('');
  if (!page) notFound();

  return (
    <div className="flex flex-1 min-h-0">
      <article className="flex-1 px-4 sm:px-8 py-6 sm:py-10 overflow-y-auto min-w-0">
        <div className="max-w-3xl mx-auto">
          <MarkdownContent content={page.content} />
        </div>
      </article>
      <WikiTOC content={page.content} />
    </div>
  );
}
