import fs from 'node:fs/promises';
import path from 'node:path';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getWikiPassword } from '@/lib/wiki-auth';
import { decryptPrivateContent } from '@/lib/private-content';
import { clearRateLimit, isRateLimited, recordRateLimitFailure, verifyWikiPassword, verifyWikiSession } from '@/lib/wiki-auth-store';

const PRIVATE_FILES: Record<string, string> = { 'wellness-details': 'wellness.enc' };
const SESSION_COOKIE = 'wiki-private-session';
const SESSION_TTL_SECONDS = 15 * 60;
function clientKey(request: NextRequest) {
  return `private:${request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'}`;
}

function signature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function validSession(request: NextRequest, section: string, secret: string) {
  const raw = request.cookies.get(SESSION_COOKIE)?.value || '';
  const [payload, received] = raw.split('.');
  const [sessionSection, expiresAt] = payload?.split(':') || [];
  if (!payload || !received || sessionSection !== section || Number(expiresAt) < Date.now()) return false;
  const expected = signature(payload, secret);
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { section, password } = await request.json();
    const fileName = PRIVATE_FILES[section];
    if (!fileName) return NextResponse.json({ error: 'Không tìm thấy tài liệu.' }, { status: 404 });

    const sessionValid = await verifyWikiSession(request.cookies.get('wiki-auth')?.value);
    const contentSecret = getWikiPassword();
    const key = clientKey(request);
    const now = Date.now();
    if (await isRateLimited(key)) {
      return NextResponse.json({ error: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' }, { status: 429, headers: { 'Retry-After': '900' } });
    }

    const passwordMatches = await verifyWikiPassword(String(password || ''));
    if (!sessionValid && !passwordMatches && !validSession(request, section, contentSecret)) {
      const blocked = await recordRateLimitFailure(key);
      return NextResponse.json({ error: blocked ? 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' : 'Mật khẩu không đúng.' }, { status: blocked ? 429 : 401, headers: blocked ? { 'Retry-After': '900' } : undefined });
    }

    await clearRateLimit(key);
    const encrypted = await fs.readFile(path.join(process.cwd(), 'content', 'private', fileName), 'utf8');
    const content = decryptPrivateContent(encrypted, contentSecret);
    const payload = `${section}:${now + SESSION_TTL_SECONDS * 1000}`;
    const response = NextResponse.json({ content }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(SESSION_COOKIE, `${payload}.${signature(payload, contentSecret)}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_TTL_SECONDS,
      path: '/api/wiki/private',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Không thể mở tài liệu lúc này.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
