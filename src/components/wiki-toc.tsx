'use client';

import { useEffect, useRef, useState } from 'react';
import { useTOC, type Heading } from '@/lib/toc-context';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const text = match[2].replace(/\*\*/g, '').trim();
      headings.push({ id: slugify(text), text, level: match[1].length });
    }
  }
  return headings;
}

function TOCList({ headings, activeId, onSelect }: { headings: Heading[]; activeId: string; onSelect?: () => void }) {
  return (
    <ul className="space-y-0.5 pl-2">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              onSelect?.();
            }}
            className={[
              'block py-1 text-sm no-underline transition-colors leading-snug',
              h.level === 3 ? 'pl-3' : '',
              activeId === h.id
                ? 'text-[#FFB223] font-medium'
                : 'text-[#9B9BB0] hover:text-[#1A1A2E]',
            ].join(' ')}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function WikiTOC({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { setHeadings } = useTOC();

  useEffect(() => {
    setHeadings(headings);
    return () => setHeadings([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    observerRef.current?.disconnect();
    const elements = headings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    elements.forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-16 py-4 pr-4">
        <p className="mb-3 text-xs font-semibold text-[#9B9BB0] uppercase tracking-widest">
          Mục lục
        </p>
        <TOCList headings={headings} activeId={activeId} />
      </div>
    </aside>
  );
}
