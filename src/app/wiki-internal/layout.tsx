'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import WikiSidebar from '@/components/wiki-sidebar';
import WikiBottomNav from '@/components/wiki-bottom-nav';
import { TOCProvider, useTOC } from '@/lib/toc-context';
import { NAV_INTERNAL_ITEMS } from '@/lib/nav';

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
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const tocToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!sidebarOpen && !tocOpen) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();

      if (tocOpen) {
        setTocOpen(false);
        window.setTimeout(() => tocToggleRef.current?.focus(), 0);
        return;
      }

      onOpenSidebar();
      window.setTimeout(() => menuToggleRef.current?.focus(), 0);
    };

    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [onOpenSidebar, sidebarOpen, tocOpen]);

  if (!mounted) return null;

  const header = document.getElementById('top-nav');
  if (!header) return null;

  return createPortal(
    <div className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 md:hidden">
      <button
        ref={menuToggleRef}
        type="button"
        onClick={onOpenSidebar}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-[#A3A3A3] transition-colors hover:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FFB223] focus:ring-offset-2 focus:ring-offset-[#111111]"
        aria-label={sidebarOpen ? 'Đóng menu Wiki' : 'Mở menu Wiki'}
        aria-expanded={sidebarOpen}
        aria-controls="wiki-mobile-navigation"
        title={sidebarOpen ? 'Đóng menu' : 'Mở menu'}
      >
        {sidebarOpen ? (
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {headings.length > 0 && (
        <div className="relative">
          <button
            ref={tocToggleRef}
            type="button"
            onClick={() => setTocOpen(o => !o)}
            className="flex h-11 items-center gap-1.5 rounded-lg border border-[#333333] px-3 text-sm text-[#888888] transition-colors hover:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FFB223] focus:ring-offset-2 focus:ring-offset-[#111111]"
            aria-expanded={tocOpen}
            aria-controls="wiki-mobile-toc"
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
              <div id="wiki-mobile-toc" className="fixed left-0 right-0 top-16 z-20 border-b border-[#333333] bg-[#111111] px-5 py-4 shadow-lg">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9B9B9B]">Mục lục</p>
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
                          'block py-2 text-sm leading-snug text-[#E6E6E6] no-underline transition-colors hover:text-[#FFB223]',
                          h.level === 3 ? 'pl-4 text-[#A3A3A3]' : 'font-medium',
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

    </div>,
    header,
  );
}

function WikiInternalLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden">
      <WikiSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={NAV_INTERNAL_ITEMS}
        basePath="/wiki-internal"
        theme="dark"
      />
      <MobileNavControls onOpenSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
      <main className="flex min-w-0 flex-1 overflow-hidden bg-white pb-28 md:pb-0">
        {children}
      </main>
      <WikiBottomNav navItems={NAV_INTERNAL_ITEMS} basePath="/wiki-internal" theme="dark" />
    </div>
  );
}

export default function WikiInternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <TOCProvider>
      <WikiInternalLayoutInner>{children}</WikiInternalLayoutInner>
    </TOCProvider>
  );
}
