'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import WikiSidebar from '@/components/wiki-sidebar';
import WikiBottomNav from '@/components/wiki-bottom-nav';
import { TOCProvider, useTOC } from '@/lib/toc-context';

function MobileNavControls({
  onOpenSidebar,
  sidebarOpen,
}: {
  onOpenSidebar: () => void;
  sidebarOpen: boolean;
}) {
  const [tocOpen, setTocOpen] = useState(false);
  const { headings } = useTOC();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const header = document.getElementById('top-nav');
  if (!header) return null;

  return createPortal(
    <div className="md:hidden flex items-center gap-2">
      {headings.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setTocOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0E0E6] text-sm text-[#6B6B80] hover:bg-[#F7F7F9] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M1 7h8M1 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Mục lục
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={`transition-transform ${tocOpen ? 'rotate-180' : ''}`}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {tocOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setTocOpen(false)} />
              <div className="fixed left-0 right-0 top-14 z-20 bg-white border-b border-[#E0E0E6] shadow-lg px-5 py-4">
                <p className="mb-3 text-xs font-semibold text-[#9B9BB0] uppercase tracking-widest">Mục lục</p>
                <ul className="space-y-0.5">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setTocOpen(false);
                        }}
                        className={[
                          'block py-2 text-sm no-underline leading-snug text-[#1A1A2E] hover:text-[#FFB223] transition-colors',
                          h.level === 3 ? 'pl-4 text-[#6B6B80]' : 'font-medium',
                        ].join(' ')}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={onOpenSidebar}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B6B80] hover:bg-[#F7F7F9] transition-colors"
        aria-label={sidebarOpen ? 'Đóng menu' : 'Mở menu'}
      >
        {sidebarOpen ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </div>,
    header,
  );
}

function WikiLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden">
      <WikiSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileNavControls onOpenSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
      <main className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        {children}
      </main>
      <WikiBottomNav />
    </div>
  );
}

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <TOCProvider>
      <WikiLayoutInner>{children}</WikiLayoutInner>
    </TOCProvider>
  );
}
