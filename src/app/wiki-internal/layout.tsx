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
  const [mounted, setMounted] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!sidebarOpen) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();

      onOpenSidebar();
      window.setTimeout(() => menuToggleRef.current?.focus(), 0);
    };

    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [onOpenSidebar, sidebarOpen]);

  if (!mounted) return null;

  const header = document.getElementById('top-nav');
  if (!header) return null;

  return createPortal(
    <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2 md:hidden">
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

    </div>,
    header,
  );
}

function WikiInternalLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { headings } = useTOC();

  return (
    <div className="flex flex-1 overflow-hidden">
      <WikiSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={NAV_INTERNAL_ITEMS}
        basePath="/wiki-internal"
        theme="dark"
        tocItems={headings}
      />
      <MobileNavControls onOpenSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
      <main className="flex min-w-0 flex-1 overflow-hidden bg-white pb-36 md:pb-0">
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
