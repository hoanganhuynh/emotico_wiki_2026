import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyWikiSession } from '@/lib/wiki-auth-store';

export async function requireWikiInternalSession(from: string) {
  const cookieStore = await cookies();
  const valid = await verifyWikiSession(cookieStore.get('wiki-auth')?.value);
  if (!valid) redirect(`/login?from=${encodeURIComponent(from)}`);
}
