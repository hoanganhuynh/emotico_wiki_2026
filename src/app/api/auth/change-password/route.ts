import { NextRequest, NextResponse } from 'next/server';
import { changeWikiPassword, clearRateLimit, hasWikiDatabase, isRateLimited, recordRateLimitFailure, verifyWikiSession } from '@/lib/wiki-auth-store';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    if (!hasWikiDatabase()) {
      return NextResponse.json({ error: 'Thiếu DATABASE_URL trong môi trường chạy wiki. Hãy thêm biến này vào .env.local hoặc Vercel rồi khởi động/redeploy lại.' }, { status: 503 });
    }
    if (!await verifyWikiSession(request.cookies.get('wiki-auth')?.value)) {
      return NextResponse.json({ error: 'Phiên đăng nhập đã hết hạn.' }, { status: 401 });
    }
    const rateKey = `change:${request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'}`;
    if (await isRateLimited(rateKey)) {
      return NextResponse.json({ error: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' }, { status: 429, headers: { 'Retry-After': '900' } });
    }

    const { currentPassword, newPassword } = await request.json();
    if (typeof newPassword !== 'string' || newPassword.length < 12) {
      return NextResponse.json({ error: 'Mật khẩu mới cần ít nhất 12 ký tự.' }, { status: 400 });
    }
    if (newPassword === currentPassword) {
      return NextResponse.json({ error: 'Mật khẩu mới phải khác mật khẩu hiện tại.' }, { status: 400 });
    }

    const changed = await changeWikiPassword(
      String(currentPassword || ''),
      newPassword,
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
      request.headers.get('user-agent') || undefined,
    );
    if (!changed) {
      const blocked = await recordRateLimitFailure(rateKey);
      return NextResponse.json({ error: blocked ? 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' : 'Mật khẩu hiện tại không đúng.' }, { status: blocked ? 429 : 401, headers: blocked ? { 'Retry-After': '900' } : undefined });
    }
    await clearRateLimit(rateKey);

    const response = NextResponse.json({ ok: true });
    response.cookies.delete('wiki-auth');
    return response;
  } catch (error) {
    console.error('Wiki password change failed:', error instanceof Error ? error.message : 'unknown error');
    return NextResponse.json({ error: 'Neon không thể kết nối hoặc không thể cập nhật lúc này. Kiểm tra DATABASE_URL và Neon project.' }, { status: 503 });
  }
}
