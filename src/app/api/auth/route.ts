import { NextRequest, NextResponse } from 'next/server';
import { getWikiPassword } from '@/lib/wiki-auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== getWikiPassword()) {
    return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('wiki-auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
    path: '/',
  });
  return res;
}
