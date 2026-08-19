import { NextRequest, NextResponse } from 'next/server';
import { getWikiPage } from '@/lib/wiki';
import { NAV_ITEMS, flattenNavItems } from '@/lib/nav';

function plainText(markdown: string) {
  return markdown
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function snippet(text: string, query: string) {
  const index = text.toLocaleLowerCase('vi').indexOf(query.toLocaleLowerCase('vi'));
  if (index < 0) return text.slice(0, 150);
  const start = Math.max(0, index - 55);
  return `${start > 0 ? '…' : ''}${text.slice(start, start + 180)}${start + 180 < text.length ? '…' : ''}`;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || '';
  if (query.length < 2) return NextResponse.json({ results: [] });

  const normalized = query.toLocaleLowerCase('vi');
  const results = flattenNavItems(NAV_ITEMS).map((item) => {
    const page = getWikiPage(item.slug);
    if (!page) return null;
    const text = plainText(page.content);
    const haystack = `${page.title} ${item.label} ${text}`.toLocaleLowerCase('vi');
    if (!haystack.includes(normalized)) return null;
    return {
      slug: item.slug,
      title: page.title,
      excerpt: snippet(text, query),
    };
  }).filter(Boolean).slice(0, 8);

  return NextResponse.json({ results }, { headers: { 'Cache-Control': 'no-store' } });
}
