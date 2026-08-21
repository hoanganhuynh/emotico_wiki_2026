import { getPublishedWikiPage, NAV_ITEMS } from '@/lib/wiki';
import { flattenNavItems } from '@/lib/nav';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MarkdownContent from '@/components/markdown-content';
import WikiTOC from '@/components/wiki-toc';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return flattenNavItems(NAV_ITEMS).filter((n) => n.slug !== '').map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedWikiPage(slug);
  return { title: page ? `${page.title} — Emotico` : 'Emotico' };
}

export default async function WikiPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedWikiPage(slug);
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
