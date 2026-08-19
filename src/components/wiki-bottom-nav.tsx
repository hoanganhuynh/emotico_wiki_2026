'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav';
import * as Icons from 'iconsax-react';

interface WikiBottomNavProps {
  navItems?: NavItem[];
  basePath?: string;
}

export default function WikiBottomNav({
  navItems = NAV_ITEMS,
  basePath = '/wiki',
}: WikiBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E0E0E6] flex items-center justify-around px-2 h-16 safe-area-pb">
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
              isActive ? 'text-[#FFB223]' : 'text-[#9B9BB0]',
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
