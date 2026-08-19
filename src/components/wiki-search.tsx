'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface SearchResult { slug: string; title: string; excerpt: string; }

export default function WikiSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (event.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/wiki/search?q=${encodeURIComponent(query)}`, { signal: controller.signal, cache: 'no-store' });
        if (response.ok) setResults((await response.json()).results || []);
      } catch { /* Ignore aborted searches. */ }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 180);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  return (
    <div className="relative ml-3 w-full max-w-[360px]">
      <div className="flex h-9 items-center rounded-lg border border-[#E0E0E6] bg-[#FAFAFB] px-3 transition focus-within:border-[#FFB223] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FFB223]/20">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#9B9BB0]"><circle cx="7" cy="7" r="4.5" stroke="currentColor"/><path d="m10.5 10.5 3 3" stroke="currentColor" strokeLinecap="round"/></svg>
        <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Tìm trong wiki…" aria-label="Tìm trong wiki" className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#1A1A2E] outline-none placeholder:text-[#9B9BB0]" />
        <kbd className="hidden rounded border border-[#E0E0E6] bg-white px-1.5 py-0.5 text-[10px] text-[#9B9BB0] sm:inline">⌘K</kbd>
      </div>
      {open && query.trim().length >= 2 && (
        <>
          <button type="button" aria-label="Đóng kết quả tìm kiếm" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div role="listbox" aria-label="Kết quả tìm kiếm" className="absolute left-0 right-0 top-11 z-20 overflow-hidden rounded-xl border border-[#E0E0E6] bg-white shadow-xl">
            {loading && <p className="px-4 py-3 text-sm text-[#78716C]">Đang tìm…</p>}
            {!loading && results.length === 0 && <p className="px-4 py-3 text-sm text-[#78716C]">Không tìm thấy nội dung phù hợp.</p>}
            {!loading && results.map((result) => (
              <Link key={result.slug} href={result.slug ? `/wiki/${result.slug}` : '/wiki'} onClick={() => { setOpen(false); setQuery(''); }} role="option" className="block border-b border-[#F0F0F2] px-4 py-3 no-underline last:border-0 hover:bg-[#FFF9ED] focus:bg-[#FFF9ED] focus:outline-none">
                <span className="block text-sm font-semibold text-[#1A1A2E]">{result.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-[#78716C]">{result.excerpt}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
