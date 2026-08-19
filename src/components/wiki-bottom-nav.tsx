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

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex items-center justify-around px-2 h-16 safe-area-pb ${dark ? 'bg-[#111111] border-[#2A2A2A]' : 'bg-white border-[#E0E0E6]'}`}>
      {navItems.map((item) => {
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
  );
}
