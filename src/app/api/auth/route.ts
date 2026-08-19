import { NextRequest, NextResponse } from 'next/server';
import { clearRateLimit, getWikiSessionSecret, isRateLimited, recordRateLimitFailure, sessionExpiry, signWikiSession, verifyWikiPassword } from '@/lib/wiki-auth-store';

export const runtime = 'nodejs';

function clientKey(req: NextRequest) {
  return `auth:${req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'}`;
}

export async function POST(req: NextRequest) {
  try {
    const key = clientKey(req);
    if (await isRateLimited(key)) {
      return NextResponse.json({ error: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' }, { status: 429, headers: { 'Retry-After': '900' } });
    }
    const { password } = await req.json();
    if (typeof password !== 'string' || password.length > 256) {
      return NextResponse.json({ error: 'Mật khẩu không hợp lệ.' }, { status: 400 });
    }

    if (!await verifyWikiPassword(password)) {
      const blocked = await recordRateLimitFailure(key);
      return NextResponse.json({ error: blocked ? 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' : 'Sai mật khẩu' }, { status: blocked ? 429 : 401, headers: blocked ? { 'Retry-After': '900' } : undefined });
    }
    await clearRateLimit(key);

    const res = NextResponse.json({ ok: true });
    const payload = `auth:${sessionExpiry()}`;
    res.cookies.set('wiki-auth', `${payload}.${signWikiSession(payload, await getWikiSessionSecret())}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    return res;
  } catch (error) {
    console.error('Wiki login failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'Không thể xác thực lúc này.' }, { status: 503 });
  }
}
