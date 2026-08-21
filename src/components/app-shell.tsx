'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isInternal = pathname?.startsWith('/wiki-internal');

  return (
    <div className={`flex h-screen flex-col ${isInternal ? 'pt-[7.25rem] md:pt-14' : 'pt-16 md:pt-14'}`}>
      {children}
    </div>
  );
}
