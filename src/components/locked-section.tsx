'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LockedSectionProps { section: string; title?: string; }

export default function LockedSection({ section, title = 'Nội dung nội bộ' }: LockedSectionProps) {
  const pathname = usePathname();
  const isInternal = pathname?.startsWith('/wiki-internal');
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  useEffect(() => {
    if (!isInternal || content) return;
    fetch('/api/wiki/private', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, password: '' }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.content) setContent(data.content); })
      .catch(() => {});
  }, [isInternal, section, content]);

  async function unlock(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/wiki/private', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, password }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || 'Mật khẩu không đúng.'); return; }
      setContent(result.content);
      setOpen(false);
      setPassword('');
    } catch { setError('Không thể kết nối máy chủ.'); }
    finally { setLoading(false); }
  }

  if (!isInternal && !content) return null;

  if (content) {
    return (
      <section className="my-8 rounded-2xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#9B9BB0]">🔓 {title}</div>
          <button
            type="button"
            onClick={() => setContent(null)}
            className="rounded-lg border border-[#D6D3D1] px-3 py-1.5 text-xs font-semibold text-[#57534E] transition hover:border-[#FFB223] hover:bg-[#FFF9ED] focus:outline-none focus:ring-2 focus:ring-[#FFB223] focus:ring-offset-2"
          >
            🔒 Khóa lại
          </button>
        </div>
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-slate max-w-none">{content}</ReactMarkdown>
      </section>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Mở khóa ${title}`} className="my-6 flex w-full items-center justify-between rounded-2xl border border-dashed border-[#D6D3D1] bg-[#FAFAF9] px-5 py-4 text-left transition hover:border-[#FFB223] hover:bg-[#FFF9ED] focus:outline-none focus:ring-2 focus:ring-[#FFB223] focus:ring-offset-2">
        <span><span className="block text-sm font-semibold text-[#1C1917]">{title}</span><span className="mt-1 block text-xs text-[#78716C]">Private · Cần mật khẩu để xem</span></span>
        <span aria-hidden="true" className="text-lg">🔒</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/45 px-4" role="dialog" aria-modal="true" aria-labelledby={`${section}-title`}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#9B9BB0]">Private</p><h2 id={`${section}-title`} className="mt-1 text-lg font-bold text-[#1C1917]">{title}</h2></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-xl text-[#78716C] hover:bg-[#F5F5F4]" aria-label="Đóng">×</button></div>
            <form onSubmit={unlock}><label htmlFor={`${section}-password`} className="mb-2 block text-sm font-medium text-[#44403C]">Mật khẩu</label><input ref={inputRef} id={`${section}-password`} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="w-full rounded-xl border border-[#D6D3D1] px-4 py-3 text-sm text-[#1C1917] outline-none focus:border-[#FFB223] focus:ring-2 focus:ring-[#FFB223]/30" />{error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}<button type="submit" disabled={loading || !password} className="mt-5 w-full rounded-xl bg-[#FFB223] px-4 py-3 text-sm font-semibold text-[#1C1917] transition hover:bg-[#FFA800] disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Đang mở khóa…' : 'Mở khóa nội dung'}</button></form>
          </div>
        </div>
      )}
    </>
  );
}
