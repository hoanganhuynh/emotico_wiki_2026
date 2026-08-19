import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set('wiki-auth', '', { httpOnly: true, maxAge: 0, sameSite: 'strict', path: '/' });
  response.cookies.set('wiki-private-session', '', { httpOnly: true, maxAge: 0, sameSite: 'strict', path: '/api/wiki/private' });
  return response;
}
