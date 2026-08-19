import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionResponse = await fetch(new URL('/api/auth/session', request.url), {
    headers: { cookie: request.headers.get('cookie') || '' },
    cache: 'no-store',
  }).catch(() => null);
  const isAuthenticated = sessionResponse?.ok === true;

  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/wiki-internal/:path*'],
};
