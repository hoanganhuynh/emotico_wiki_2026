'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, MouseEvent, ReactNode } from 'react';
import { flattenNavItems, NAV_INTERNAL_ITEMS } from '@/lib/nav';

interface Version {
  id: number;
  versionName: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

function Icon({ children }: { children: ReactNode }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">{children}</svg>;
}

function HistoryIcon() { return <Icon><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></Icon>; }
function ExitIcon() { return <Icon><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></Icon>; }
function UploadIcon() { return <Icon><path d="M12 16V4m0 0L8 8m4-4 4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></Icon>; }
function SaveIcon() { return <Icon><path d="M5 4h11l3 3v13H5V4Zm3 0v5h7V4M8 20v-6h8v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></Icon>; }
function EyeIcon() { return <Icon><path d="M3 12s3.2-5 9-5 9 5 9 5-3.2 5-9 5-9-5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" /></Icon>; }
function RollbackIcon() { return <Icon><path d="M9 7H4v5M4 12a8 8 0 1 0 2.3-5.6L4 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></Icon>; }

interface EditorResponse {
  page: { slug: string; title: string; content: string };
  history: Version[];
}

const EDITABLE_PAGES = flattenNavItems(NAV_INTERNAL_ITEMS).filter((item) => item.slug !== '');

export default function WikiEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedSlug = params.get('slug') || EDITABLE_PAGES[0]?.slug || '';
  const [slug, setSlug] = useState(requestedSlug);
  const [page, setPage] = useState<EditorResponse['page'] | null>(null);
  const [originalContent, setOriginalContent] = useState('');
  const [history, setHistory] = useState<Version[]>([]);
  const [versionName, setVersionName] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);

  const selectedLabel = useMemo(() => EDITABLE_PAGES.find((item) => item.slug === slug)?.label || slug, [slug]);

  useEffect(() => {
    if (requestedSlug !== slug) setSlug(requestedSlug);
  }, [requestedSlug, slug]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(`/api/wiki-internal/edit?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Không thể tải nội dung (HTTP ${response.status}).`);
        return data as EditorResponse;
      })
      .then((data) => {
        if (cancelled) return;
        setPage(data.page);
        setOriginalContent(data.page.content);
        setHistory(data.history);
        setSelectedVersion(null);
        setMessage('');
      })
      .catch((reason: Error) => { if (!cancelled) setError(reason.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const exitHref = page ? `/wiki-internal/${page.slug}` : '/wiki-internal';
  const hasUnsavedChanges = Boolean(page && page.content !== originalContent);

  async function save(): Promise<boolean> {
    if (!page || !versionName.trim()) {
      setError('Bạn phải đặt tên phiên bản trước khi lưu.');
      return false;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/wiki-internal/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content: page.content, versionName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Không thể lưu (HTTP ${response.status}).`);
      setMessage(`Đã lưu phiên bản “${data.version.versionName}” trên máy chủ.`);
      setVersionName('');
      await reload();
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể lưu nội dung.');
      return false;
    } finally { setSaving(false); }
  }

  async function reload() {
    const response = await fetch(`/api/wiki-internal/edit?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
    const data = await response.json() as EditorResponse;
    if (!response.ok) throw new Error((data as unknown as { error?: string }).error || 'Không thể tải lại lịch sử.');
    setPage(data.page);
    setOriginalContent(data.page.content);
    setHistory(data.history);
  }

  function requestExit(event: MouseEvent<HTMLAnchorElement>) {
    if (!hasUnsavedChanges) return;
    event.preventDefault();
    setShowExitPrompt(true);
  }

  async function saveAndExit() {
    const saved = await save();
    if (saved) router.push(exitHref);
  }

  function discardAndExit() {
    setShowExitPrompt(false);
    router.replace(exitHref);
  }

  function restore(version: Version) {
    if (!page) return;
    setPage({ ...page, content: version.content });
    setVersionName(`Khôi phục: ${version.versionName}`);
    setSelectedVersion(null);
    setMessage('Đã nạp bản cũ vào trình soạn thảo. Hãy kiểm tra rồi lưu để tạo phiên bản mới.');
  }

  async function uploadMarkdown(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !page) return;
    if (!file.name.toLowerCase().endsWith('.md') && file.type !== 'text/markdown') {
      setError('Chỉ hỗ trợ file Markdown (.md).');
      return;
    }
    setPage({ ...page, content: await file.text() });
    setMessage(`Đã nạp “${file.name}” vào editor. Hãy đặt tên phiên bản rồi lưu để ghi lên máy chủ.`);
    setError('');
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-10">
      <div className="-mx-4 -mt-6 mb-6 flex h-12 items-center bg-[#FFB223] px-4 text-sm font-semibold text-[#111111] sm:-mx-8 sm:-mt-10 sm:px-8">
        Đang chỉnh sửa: <span className="ml-1">{selectedLabel}</span>
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777784]">Wiki internal · Edit mode</p>
            <h1 className="mt-2 text-3xl font-bold text-[#1A1A2E]">Chỉnh sửa nội dung</h1>
            <p className="mt-2 text-sm text-[#6B6B80]">Mọi thay đổi được lưu vào database dùng chung, không lưu riêng trên trình duyệt.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowHistory((open) => !open)} className="inline-flex items-center gap-2 rounded-lg border border-[#D9D9E0] px-4 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-[#F7F7F9]"><HistoryIcon />{showHistory ? 'Ẩn lịch sử' : 'Lịch sử phiên bản'}</button>
            <Link href={exitHref} onClick={requestExit} className="inline-flex items-center gap-2 rounded-lg border border-[#D9D9E0] px-4 py-2 text-sm font-semibold text-[#1A1A2E] no-underline hover:bg-[#F7F7F9]"><ExitIcon />Thoát edit mode</Link>
          </div>
        </div>

        <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,280px)_minmax(260px,1fr)_minmax(220px,1fr)]">
          <label className="text-sm font-semibold text-[#1A1A2E]">Tài liệu
            <select value={slug} onChange={(event) => setSlug(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D9D9E0] bg-white px-3 py-3 font-normal outline-none focus:border-[#1A1A2E]">
              {EDITABLE_PAGES.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#1A1A2E]">Tên phiên bản bắt buộc
            <input value={versionName} onChange={(event) => setVersionName(event.target.value)} placeholder="Ví dụ: Cập nhật Đoán vui" className="mt-2 w-full rounded-xl border border-[#D9D9E0] px-3 py-3 font-normal text-[#1A1A2E] outline-none focus:border-[#1A1A2E]" maxLength={120} />
          </label>
        </div>

        {error && <p role="alert" className="mb-4 rounded-xl bg-[#FFF1F2] px-4 py-3 text-sm text-[#B42318]">{error}</p>}
        {message && <p role="status" className="mb-4 rounded-xl bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">{message}</p>}

        <div className={showHistory ? 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]' : ''}>
          <section className="rounded-2xl border border-[#E0E0E6] bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm font-semibold text-[#1A1A2E]">Nội dung Markdown</label>
              <label className="cursor-pointer rounded-lg border border-[#D9D9E0] px-3 py-2 text-xs font-semibold text-[#1A1A2E] hover:bg-[#F7F7F9]">
                <span className="inline-flex items-center gap-2"><UploadIcon />Upload .md</span>
                <input type="file" accept=".md,text/markdown" onChange={uploadMarkdown} className="sr-only" disabled={loading || !page} />
              </label>
            </div>
            <label className="block">
              <textarea value={page?.content || ''} onChange={(event) => page && setPage({ ...page, content: event.target.value })} disabled={loading || !page} className="mt-2 min-h-[620px] w-full resize-y rounded-xl border border-[#D9D9E0] bg-[#FCFCFD] p-4 font-mono text-sm leading-6 text-[#1A1A2E] outline-none focus:border-[#1A1A2E]" spellCheck={false} />
            </label>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="flex-1 text-xs text-[#777784]">File upload chỉ thay nội dung trong editor; bấm “Lưu phiên bản” để lưu server-side.</p>
              <button type="button" onClick={save} disabled={saving || loading || !page} className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><SaveIcon />{saving ? 'Đang lưu…' : 'Lưu phiên bản'}</button>
            </div>
          </section>

          {showHistory && <aside className="rounded-2xl border border-[#E0E0E6] bg-[#FAFAFB] p-4 sm:p-5">
            <h2 className="text-lg font-bold text-[#1A1A2E]">Lịch sử phiên bản</h2>
            <p className="mt-1 text-xs text-[#777784]">Giữ tối đa 30 phiên bản mới nhất.</p>
            {loading ? <p className="mt-5 text-sm text-[#777784]">Đang tải…</p> : history.length === 0 ? <p className="mt-5 text-sm text-[#777784]">Chưa có phiên bản đã lưu.</p> : <ol className="mt-5 space-y-3">{history.map((version) => <li key={version.id} className="rounded-xl border border-[#E0E0E6] bg-white p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-semibold text-[#1A1A2E]">{version.versionName}</p><p className="mt-1 text-xs text-[#777784]">{new Date(version.createdAt).toLocaleString('vi-VN')}</p></div><button type="button" onClick={() => setSelectedVersion(selectedVersion?.id === version.id ? null : version)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1A2E] underline"><EyeIcon />Xem</button></div>{selectedVersion?.id === version.id && <><pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-[#F7F7F9] p-2 text-[11px] leading-5 text-[#4B4B59]">{version.content}</pre><button type="button" onClick={() => restore(version)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#C9C9D2] px-3 py-2 text-xs font-semibold text-[#1A1A2E] hover:bg-[#F7F7F9]"><RollbackIcon />Nạp bản này để rollback</button></>}</li>)}</ol>}
          </aside>}
        </div>
      </div>
      {showExitPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111111]/45 px-4" role="dialog" aria-modal="true" aria-labelledby="unsaved-changes-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="unsaved-changes-title" className="text-xl font-bold text-[#1A1A2E]">Bạn có thay đổi chưa lưu</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B6B80]">Nếu thoát lúc này, nội dung đang chỉnh sửa sẽ không được lưu vào database.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setShowExitPrompt(false)} className="rounded-lg border border-[#D9D9E0] px-4 py-2 text-sm font-semibold text-[#1A1A2E]">Ở lại</button>
              <button type="button" onClick={discardAndExit} className="rounded-lg border border-[#D9D9E0] px-4 py-2 text-sm font-semibold text-[#6B6B80]">Thoát không lưu</button>
              <button type="button" onClick={saveAndExit} disabled={saving || !versionName.trim()} className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Lưu & thoát</button>
            </div>
            {!versionName.trim() && <p className="mt-3 text-right text-xs text-[#B42318]">Hãy đặt tên phiên bản để lưu trước khi thoát.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
