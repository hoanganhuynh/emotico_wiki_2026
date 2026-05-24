import { getWikiPage, NAV_ITEMS } from '@/lib/wiki';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MarkdownContent from '@/components/markdown-content';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NAV_ITEMS.filter((n) => n.slug !== '').map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getWikiPage(slug);
  return { title: page ? `${page.title} — Emotico` : 'Emotico' };
}

export default async function WikiPage({ params }: Props) {
  const { slug } = await params;
  const page = getWikiPage(slug);
  if (!page) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <MarkdownContent content={page.content} />
    </article>
  );
}
