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
  const labelColor = dark ? 'text-[#9B9B9B]' : 'text-[#9B9BB0]';
  const closeBtnColor = dark ? 'text-[#A3A3A3] hover:bg-[#222222]' : 'text-[#6B6B80] hover:bg-white';
  const isInternal = basePath === '/wiki-internal';
  const switchHref = isInternal ? '/wiki' : '/wiki-internal';
  const switchLabel = isInternal ? 'Về Wiki public' : 'Mở Wiki internal';
  const switchBanner = (
    <div className={`shrink-0 border-t p-3 ${dark ? 'border-[#2A2A2A] bg-[#111111]' : 'border-[#E0E0E6] bg-[#F7F7F9]'}`}>
      <Link
        href={switchHref}
        onClick={onClose}
        className={`flex items-center justify-between rounded-xl border px-3.5 py-3 no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB223] focus:ring-offset-2 ${
          dark
            ? 'border-[#3A3A3A] bg-[#191919] text-[#E6E6E6] hover:border-[#FFB223]'
            : 'border-[#E0E0E6] bg-white text-[#1A1A2E] hover:border-[#FFB223] hover:bg-[#FFF9ED]'
        }`}
      >
        <span>
            <span className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${dark ? 'text-[#A3A3A3]' : 'text-[#777784]'}`}>
            {isInternal ? <><Icons.Global size={13} color="currentColor" variant="Linear" aria-hidden="true" /><span className="sr-only">Wiki nội bộ</span></> : <><Icons.Lock1 size={13} color="currentColor" variant="Linear" aria-hidden="true" /><span className="sr-only">Wiki public</span></>}
            </span>
          <span className="mt-0.5 block text-xs font-semibold">{switchLabel}</span>
        </span>
        <span aria-hidden="true" className="text-base">→</span>
      </Link>
    </div>
  );

  const navContent = (
    <nav className="flex-1 overflow-y-auto py-6 px-3">
      <p className={`px-3 mb-2 text-xs font-semibold uppercase tracking-widest ${labelColor}`}>
        Tài liệu
      </p>
      <ul className="space-y-0.5">
        {navItems.map((item, index) => {
          const href = item.slug === '' ? basePath : `${basePath}/${item.slug}`;
          const isActive =
            item.slug === ''
              ? pathname === basePath
              : pathname === `${basePath}/${item.slug}`;
          const isChildActive = item.children?.some((child) => pathname === `${basePath}/${child.slug}`) ?? false;
          const itemIsActive = isActive || isChildActive;

          const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string; variant?: string }>>)[item.icon];

          const linkClass = dark
            ? itemIsActive
              ? 'bg-[#000000] text-white font-semibold'
              : 'text-[#A3A3A3] hover:text-white hover:bg-[#222222]'
            : itemIsActive
              ? 'bg-[#FFB223] text-[#1A1A2E] font-semibold'
              : 'text-[#6B6B80] hover:text-[#1A1A2E] hover:bg-white';

          const previousSection = navItems[index - 1]?.section;
          const showSection = item.section && item.section !== previousSection;

          return (
            <li key={item.slug}>
              {showSection && (
                <p className={`px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${labelColor}`}>
                  {item.section}
                </p>
              )}
              <Link
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${linkClass}`}
              >
                {IconComponent && (
                  <IconComponent size={16} color="currentColor" variant={itemIsActive ? 'Bold' : 'Linear'} />
                )}
                {item.label}
              </Link>
              {item.children && itemIsActive && (
                <ul className={`ml-7 mt-1 space-y-0.5 border-l pl-2 ${dark ? 'border-[#343434]' : 'border-[#E0E0E6]'}`}>
                  {item.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={`${basePath}/${child.slug}`}
                        onClick={onClose}
                        className={`block rounded-md px-2 py-1.5 text-xs no-underline transition-colors ${pathname === `${basePath}/${child.slug}` ? (dark ? 'bg-[#222222] text-white font-semibold' : 'bg-[#EAEAEF] text-[#1A1A2E] font-semibold') : (dark ? 'text-[#8F8F8F] hover:bg-[#222222] hover:text-white' : 'text-[#777784] hover:bg-white hover:text-[#1A1A2E]')}`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex md:flex-col w-64 shrink-0 border-r ${sidebarBorder} ${sidebarBg} overflow-hidden`}>
        {navContent}
        {switchBanner}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
          <aside className={`relative z-10 flex w-64 flex-col ${sidebarBg} h-full overflow-hidden shadow-xl`}>
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
            {switchBanner}
          </aside>
        </div>
      )}
    </>
  );
}
