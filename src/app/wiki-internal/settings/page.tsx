'use client';

import { FormEvent, useState } from 'react';
import { Setting2, Lock1 } from 'iconsax-react';

export default function InternalSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const responseText = await response.text();
      let payload: { error?: string } = {};
      try {
        payload = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(`Máy chủ không phản hồi đúng định dạng (HTTP ${response.status}). Vui lòng redeploy và kiểm tra DATABASE_URL trên Vercel.`);
      }
      if (!response.ok) throw new Error(payload.error || `Không thể đổi mật khẩu (HTTP ${response.status}).`);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Đã đổi mật khẩu. Tất cả phiên đăng nhập cũ đã bị thu hồi. Hãy đăng nhập lại.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể đổi mật khẩu.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="flex-1 overflow-y-auto px-6 py-10 md:px-12 lg:px-20 text-[#202020]">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Setting2 size={24} color="currentColor" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#777777]">Wiki internal</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Cài đặt bảo mật</h1>
        <p className="mt-4 text-[#666666] leading-7">
          Đổi mật khẩu truy cập wiki-internal. Mật khẩu được lưu dưới dạng hash trong Neon, không lưu plaintext.
        </p>

        <form onSubmit={submit} className="mt-10 rounded-2xl border border-[#E4E4E4] bg-[#FAFAFA] p-6 md:p-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Mật khẩu hiện tại</span>
            <input required type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-xl border border-[#D5D5D5] bg-white px-4 py-3 outline-none focus:border-[#111111]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Mật khẩu mới</span>
            <input required minLength={12} type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-[#D5D5D5] bg-white px-4 py-3 outline-none focus:border-[#111111]" />
            <span className="mt-2 block text-xs text-[#777777]">Ít nhất 12 ký tự.</span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Xác nhận mật khẩu mới</span>
            <input required minLength={12} type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-[#D5D5D5] bg-white px-4 py-3 outline-none focus:border-[#111111]" />
          </label>

          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}

          <button disabled={busy} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50">
            <Lock1 size={17} color="currentColor" />
            {busy ? 'Đang cập nhật…' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </article>
  );
}
