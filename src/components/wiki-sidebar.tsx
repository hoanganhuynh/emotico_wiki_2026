'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/nav';

interface WikiSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function WikiSidebar({ isOpen = false, onClose }: WikiSidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <nav className="py-6 px-3">
      <p className="px-3 mb-2 text-xs font-semibold text-[#9B9BB0] uppercase tracking-widest">
        Documentation
      </p>
      <ul className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const href = item.slug === '' ? '/wiki' : `/wiki/${item.slug}`;
          const isActive =
            item.slug === ''
              ? pathname === '/wiki'
              : pathname === `/wiki/${item.slug}`;

          return (
            <li key={item.slug}>
              <Link
                href={href}
                onClick={onClose}
                className={[
                  'flex items-center px-3 py-2.5 rounded-lg text-sm no-underline transition-colors',
                  isActive
                    ? 'bg-[#FFB223]/15 text-[#FFB223] font-semibold'
                    : 'text-[#6B6B80] hover:text-[#1A1A2E] hover:bg-white',
                ].join(' ')}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden md:block w-56 shrink-0 border-r border-[#E0E0E6] bg-[#F7F7F9] overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="relative z-10 w-64 bg-[#F7F7F9] h-full overflow-y-auto shadow-xl">
            {/* Close button */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-xs font-semibold text-[#9B9BB0] uppercase tracking-widest">
                Menu
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6B80] hover:bg-white transition-colors"
                aria-label="Đóng menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
