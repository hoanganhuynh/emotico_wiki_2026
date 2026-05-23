'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/nav';

export default function WikiSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-[#E0E0E6] bg-[#F7F7F9] overflow-y-auto">
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
                  className={[
                    'flex items-center px-3 py-2 rounded-lg text-sm no-underline transition-colors',
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
    </aside>
  );
}
