'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TopNav() {
  return (
    <header id="top-nav" className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[#E0E0E6] flex items-center px-4 sm:px-6">
      {/* Logo */}
      <Link href="/wiki" className="flex items-center no-underline shrink-0">
        <Image src="/logo.png" alt="Emotico" width={96} height={32} className="h-8 w-auto" priority />
      </Link>

      {/* Spacer — pushes right-side content to edge */}
      <div className="flex-1" />

      {/* Version badge — desktop only; portal injects mobile controls here */}
      <span className="text-xs text-[#9B9BB0] font-medium hidden sm:block">
        2026 · MVP
      </span>
    </header>
  );
}
