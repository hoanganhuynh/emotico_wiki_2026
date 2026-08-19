'use client';

import Link from 'next/link';
import Image from 'next/image';
import WikiSearch from '@/components/wiki-search';

export default function TopNav({ dark = false }: { dark?: boolean }) {
  return (
    <header
      id="top-nav"
      className={`fixed top-0 left-0 right-0 z-50 h-14 border-b flex items-center px-4 sm:px-6 transition-colors ${
        dark
          ? 'bg-[#111111] border-[#2A2A2A]'
          : 'bg-white border-[#E0E0E6]'
      }`}
    >
      {/* Logo */}
      <Link href={dark ? '/wiki-internal' : '/wiki'} className="flex items-center no-underline shrink-0">
        <Image
          src="/logo.png"
          alt="Emotico"
          width={96}
          height={32}
          className={`h-8 w-auto ${dark ? 'brightness-0 invert' : ''}`}
          priority
        />
      </Link>

      <WikiSearch />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Metadata */}
      <div className={`hidden sm:flex items-center gap-3 text-xs font-medium ${dark ? 'text-[#A3A3A3]' : 'text-[#777784]'}`}>
        <span>2026 · MVP</span>
        <span aria-hidden="true" className={dark ? 'text-[#444444]' : 'text-[#D0D0D8]'}>•</span>
        <span title="Ngày cập nhật nội dung gần nhất">Cập nhật 19/08/2026</span>
      </div>
    </header>
  );
}
