'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav';
import * as Icons from 'iconsax-react';

interface WikiBottomNavProps {
  navItems?: NavItem[];
  basePath?: string;
  theme?: 'light' | 'dark';
  onOpenMenu: () => void;
  menuOpen: boolean;
}

const PUBLIC_QUICK_LINKS = [
  { slug: '', label: 'Bắt đầu' },
  { slug: '02-features', label: 'Tính năng' },
  { slug: '09-chatbot-ai', label: 'Chatbot' },
  { slug: '04-security', label: 'An toàn' },
];

const INTERNAL_QUICK_LINKS = [
  { slug: '', label: 'Bắt đầu' },
  { slug: '08-school-admin', label: 'Nhà trường' },
  { slug: '06-roadmap', label: 'Lộ trình' },
  { slug: '05-business-model', label: 'Kinh doanh' },
];

export default function WikiBottomNav({
  navItems = NAV_ITEMS,
  basePath = '/wiki',
  theme = 'light',
  onOpenMenu,
  menuOpen,
}: WikiBottomNavProps) {
  const pathname = usePathname();
  const dark = theme === 'dark';
  const isInternal = basePath === '/wiki-internal';
  const quickLinks = isInternal ? INTERNAL_QUICK_LINKS : PUBLIC_QUICK_LINKS;
  const quickItems = quickLinks.flatMap((quickLink) => {
    const item = navItems.find((navItem) => navItem.slug === quickLink.slug);
    return item ? [{ ...item, label: quickLink.label }] : [];
  });

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t safe-area-pb ${dark ? 'bg-[#111111] border-[#2A2A2A]' : 'bg-white border-[#E0E0E6]'}`}>
      <nav aria-label="Điều hướng nhanh" className="h-[4.75rem] px-2">
        <ul className="flex h-full items-center justify-around">
        {quickItems.map((item) => {
        const href = item.slug === '' ? basePath : `${basePath}/${item.slug}`;
        const isActive =
          item.slug === ''
            ? pathname === basePath
            : pathname === `${basePath}/${item.slug}` || (item.slug === '02-features' && pathname?.startsWith(`${basePath}/feature-`));

        const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string; variant?: string }>>)[item.icon];

        return (
          <li key={item.slug} className="flex h-full flex-1">
            <Link
              href={href}
              className={[
                'flex h-full w-full flex-col items-center justify-center gap-1 no-underline transition-colors',
                isActive ? (dark ? 'text-white' : 'text-[#9A5A00]') : (dark ? 'text-[#A3A3A3]' : 'text-[#555555]'),
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              {IconComponent && (
                <IconComponent
                  size={22}
                  color="currentColor"
                  variant={isActive ? 'Bold' : 'Linear'}
                />
              )}
              <span className="max-w-full truncate px-1 text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          </li>
        );
        })}
        <li className="flex h-full flex-1">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-expanded={menuOpen}
            aria-controls="wiki-mobile-navigation"
            className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-inset ${dark ? 'text-[#A3A3A3] focus:ring-[#FFB223]' : 'text-[#555555] focus:ring-[#9A5A00]'}`}
          >
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] font-medium leading-none">Thêm</span>
          </button>
        </li>
        </ul>
      </nav>
    </div>
  );
}
