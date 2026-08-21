'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import WikiSearch from '@/components/wiki-search';
import { Edit2, Setting2 } from 'iconsax-react';

export default function TopNav({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentInternalSlug = pathname?.startsWith('/wiki-internal/')
    ? pathname.split('/')[2]
    : '';

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <header
      id="top-nav"
      className={`fixed top-0 left-0 right-0 z-50 flex h-16 items-center px-3 pl-14 md:h-14 md:px-6 transition-colors ${
        dark
          ? 'bg-[#111111] border-[#2A2A2A]'
          : 'bg-white border-[#E0E0E6]'
      }`}
    >
      {/* Logo */}
      <Link href={dark ? '/wiki-internal' : '/wiki'} className="flex shrink-0 items-center no-underline">
        <Image
          src="/logo.png"
          alt="Emotico"
          width={96}
          height={32}
          className={`h-7 w-auto sm:h-8 ${dark ? 'brightness-0 invert' : ''}`}
          priority
        />
      </Link>

      <WikiSearch />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Metadata */}
      <div className={`hidden sm:flex items-center gap-3 text-xs font-medium ${dark ? 'text-[#A3A3A3]' : 'text-[#777784]'}`}>
        <Link href="/wiki/updates" className="no-underline hover:underline" title="Xem các thay đổi đã xuất bản">Phiên bản cập nhật</Link>
      </div>

      {dark && (
        <div className="ml-4 hidden items-center gap-1 sm:flex">
          <Link
            href={currentInternalSlug && currentInternalSlug !== 'edit' ? `/wiki-internal/edit?slug=${encodeURIComponent(currentInternalSlug)}` : '/wiki-internal/edit'}
            aria-label="Chỉnh sửa wiki internal"
            title="Chỉnh sửa nội dung"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A3A3A3] transition-colors hover:bg-[#1A1A1A] hover:text-white"
          >
            <Edit2 size={20} color="currentColor" />
          </Link>
          <Link
            href="/wiki-internal/settings"
            aria-label="Cài đặt wiki internal"
            title="Cài đặt bảo mật"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A3A3A3] transition-colors hover:bg-[#1A1A1A] hover:text-white"
          >
            <Setting2 size={20} color="currentColor" />
          </Link>
          <button
            type="button"
            onClick={logout}
            aria-label="Đăng xuất"
            title="Đăng xuất"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A3A3A3] transition-colors hover:bg-[#1A1A1A] hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
