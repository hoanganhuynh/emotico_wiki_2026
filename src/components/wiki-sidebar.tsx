'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav';
import * as Icons from 'iconsax-react';

interface WikiSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  navItems?: NavItem[];
  basePath?: string;
  theme?: 'light' | 'dark';
}

export default function WikiSidebar({
  isOpen = false,
  onClose,
  navItems = NAV_ITEMS,
  basePath = '/wiki',
  theme = 'light',
}: WikiSidebarProps) {
  const pathname = usePathname();
  const dark = theme === 'dark';

  const sidebarBg = dark ? 'bg-[#111111]' : 'bg-[#F7F7F9]';
  const sidebarBorder = dark ? 'border-[#2A2A2A]' : 'border-[#E0E0E6]';
  const labelColor = dark ? 'text-[#555555]' : 'text-[#9B9BB0]';
  const closeBtnColor = dark ? 'text-[#888888] hover:bg-[#222222]' : 'text-[#6B6B80] hover:bg-white';

  const navContent = (
    <nav className="py-6 px-3">
      <p className={`px-3 mb-2 text-xs font-semibold uppercase tracking-widest ${labelColor}`}>
        Tài liệu
      </p>
      <ul className="space-y-0.5">
        {navItems.map((item) => {
          const href = item.slug === '' ? basePath : `${basePath}/${item.slug}`;
          const isActive =
            item.slug === ''
              ? pathname === basePath
              : pathname === `${basePath}/${item.slug}`;

          const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string; variant?: string }>>)[item.icon];

          const linkClass = dark
            ? isActive
              ? 'bg-white text-[#111111] font-semibold'
              : 'text-[#888888] hover:text-white hover:bg-[#222222]'
            : isActive
              ? 'bg-[#FFB223] text-[#1A1A2E] font-semibold'
              : 'text-[#6B6B80] hover:text-[#1A1A2E] hover:bg-white';

          return (
            <li key={item.slug}>
              <Link
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${linkClass}`}
              >
                {IconComponent && (
                  <IconComponent size={16} color="currentColor" variant={isActive ? 'Bold' : 'Linear'} />
                )}
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
      {/* Desktop sidebar */}
      <aside className={`hidden md:block w-64 shrink-0 border-r ${sidebarBorder} ${sidebarBg} overflow-y-auto`}>
        {navContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
          <aside className={`relative z-10 w-64 ${sidebarBg} h-full overflow-y-auto shadow-xl`}>
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className={`text-xs font-semibold uppercase tracking-widest ${labelColor}`}>Menu</span>
              <button
                onClick={onClose}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${closeBtnColor}`}
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
