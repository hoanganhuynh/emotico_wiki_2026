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
          className={`h-8 w-auto ${dark ? 'invert' : ''}`}
          priority
        />
      </Link>

      <WikiSearch />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Version badge */}
      <span className={`text-xs font-medium hidden sm:block ${dark ? 'text-[#555555]' : 'text-[#9B9BB0]'}`}>
        2026 · MVP
      </span>
    </header>
  );
}
