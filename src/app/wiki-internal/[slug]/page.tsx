import { getInternalWikiPage, NAV_INTERNAL_ITEMS } from '@/lib/wiki-internal';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MarkdownContent from '@/components/markdown-content';
import WikiTOC from '@/components/wiki-toc';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NAV_INTERNAL_ITEMS.filter((n) => n.slug !== '').map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getInternalWikiPage(slug);
  return { title: page ? `${page.title} — Emotico Internal` : 'Emotico Internal' };
}

export default async function WikiInternalPage({ params }: Props) {
  const { slug } = await params;
  const page = getInternalWikiPage(slug);
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
