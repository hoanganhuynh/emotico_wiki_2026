'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const pathname = usePathname();
  const isDS = pathname.startsWith('/design-system');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[#E0E0E6] flex items-center px-6 gap-8">
      {/* Logo */}
      <Link href="/wiki" className="flex items-center gap-2 no-underline">
        <span className="w-7 h-7 rounded-lg bg-[#FFB223] flex items-center justify-center text-white text-sm font-bold select-none">
          ♥
        </span>
        <span className="font-semibold text-[#1A1A2E] text-sm tracking-wide">
          emotico
        </span>
      </Link>

      {/* Tabs */}
      <nav className="flex items-center gap-1">
        <Link
          href="/wiki"
          className={[
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline',
            !isDS
              ? 'bg-[#FFB223]/15 text-[#FFB223]'
              : 'text-[#6B6B80] hover:text-[#1A1A2E] hover:bg-[#F7F7F9]',
          ].join(' ')}
        >
          Wiki
        </Link>
        <Link
          href="/design-system"
          className={[
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline',
            isDS
              ? 'bg-[#FFB223]/15 text-[#FFB223]'
              : 'text-[#6B6B80] hover:text-[#1A1A2E] hover:bg-[#F7F7F9]',
          ].join(' ')}
        >
          Design System
        </Link>
      </nav>

      {/* Right spacer — version badge */}
      <div className="ml-auto">
        <span className="text-xs text-[#9B9BB0] font-medium">
          2026 · MVP
        </span>
      </div>
    </header>
  );
}
