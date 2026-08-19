'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav';
import * as Icons from 'iconsax-react';

interface WikiBottomNavProps {
  navItems?: NavItem[];
  basePath?: string;
  theme?: 'light' | 'dark';
}

export default function WikiBottomNav({
  navItems = NAV_ITEMS,
  basePath = '/wiki',
  theme = 'light',
}: WikiBottomNavProps) {
  const pathname = usePathname();
  const dark = theme === 'dark';
  const isInternal = basePath === '/wiki-internal';
  const ctaHref = isInternal ? '/wiki' : '/wiki-internal';
  const ctaLabel = isInternal ? 'Về Wiki public' : 'Mở Wiki internal';

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t safe-area-pb ${dark ? 'bg-[#111111] border-[#2A2A2A]' : 'bg-white border-[#E0E0E6]'}`}>
      <div className="px-3 pt-2">
        <Link
          href={ctaHref}
          className={`flex items-center justify-between rounded-xl border px-4 py-2.5 no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB223] focus:ring-offset-2 ${
            dark
              ? 'border-[#3A3A3A] bg-[#191919] text-[#E6E6E6] hover:border-[#FFB223]'
              : 'border-[#E0E0E6] bg-[#FAFAFB] text-[#1A1A2E] hover:border-[#FFB223] hover:bg-[#FFF9ED]'
          }`}
        >
          <span>
            <span className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${dark ? 'text-[#A3A3A3]' : 'text-[#777784]'}`}>
              {isInternal ? <><Icons.Global size={13} color="currentColor" variant="Linear" aria-hidden="true" /><span className="sr-only">Wiki nội bộ</span></> : <><Icons.Lock1 size={13} color="currentColor" variant="Linear" aria-hidden="true" /><span className="sr-only">Wiki public</span></>}
            </span>
            <span className="mt-0.5 block text-xs font-semibold">{ctaLabel}</span>
          </span>
          <span aria-hidden="true" className="text-base">→</span>
        </Link>
      </div>
      <nav className="flex h-16 items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => {
        const href = item.slug === '' ? basePath : `${basePath}/${item.slug}`;
        const isActive =
          item.slug === ''
            ? pathname === basePath
            : pathname === `${basePath}/${item.slug}`;

        const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string; variant?: string }>>)[item.icon];

        return (
          <Link
            key={item.slug}
            href={href}
            className={[
              'flex flex-col items-center justify-center gap-1 flex-1 h-full no-underline transition-colors',
              isActive ? (dark ? 'text-white' : 'text-[#FFB223]') : 'text-[#555555]',
            ].join(' ')}
          >
            {IconComponent && (
              <IconComponent
                size={22}
                color="currentColor"
                variant={isActive ? 'Bold' : 'Linear'}
              />
            )}
          </Link>
        );
        })}
      </nav>
    </div>
  );
}
