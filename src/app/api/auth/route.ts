import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.WIKI_PASSWORD) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (password !== process.env.WIKI_PASSWORD) {
    return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('wiki-auth', process.env.WIKI_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
    path: '/',
  });
  return res;
}
