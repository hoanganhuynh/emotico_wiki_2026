import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API — no redirect loop
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Validate session cookie against server-side env var
  const token = request.cookies.get('wiki-auth')?.value;
  if (token && token === process.env.WIKI_PASSWORD) {
    return NextResponse.next();
  }

  // Not authenticated — redirect to login, preserve intended destination
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Protect all routes except: Next.js internals, Flutter web assets, static icons
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|icons|ds|manifest\\.json).*)',
  ],
};
