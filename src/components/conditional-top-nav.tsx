'use client';

import { usePathname } from 'next/navigation';
import TopNav from '@/components/top-nav';

export default function ConditionalTopNav() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  const dark = pathname?.startsWith('/wiki-internal');
  return <TopNav dark={dark} />;
}
