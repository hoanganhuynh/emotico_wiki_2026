import { NextRequest, NextResponse } from 'next/server';
import { verifyWikiSession } from '@/lib/wiki-auth-store';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const valid = await verifyWikiSession(request.cookies.get('wiki-auth')?.value);
  return new NextResponse(null, { status: valid ? 204 : 401, headers: { 'Cache-Control': 'no-store' } });
}
