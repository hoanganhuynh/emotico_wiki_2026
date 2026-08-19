'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeSlash } from 'iconsax-react';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/wiki-internal';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError('Sai mật khẩu. Vui lòng thử lại.');
        setLoading(false);
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-10 text-[#F5F5F5] selection:bg-[#FFB223] selection:text-[#111111]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="Emotico"
            width={168}
            height={56}
            className="h-12 w-auto brightness-0 invert mb-4"
            priority
          />
          <p className="text-sm text-[#A3A3A3] mt-1">Internal Wiki</p>
        </div>

        {/* Card */}
        <div className="bg-[#171717] rounded-2xl border border-[#2B2B2B] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <h2 className="text-base font-semibold text-[#F5F5F5] mb-1">Nhập mật khẩu</h2>
          <p className="text-sm text-[#A3A3A3] mb-6">
            Tài liệu này dành cho nội bộ. Liên hệ team nếu chưa có mật khẩu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={visible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  autoFocus
                  required
                  className={[
                    'w-full px-4 py-3 pr-12 rounded-xl border text-sm outline-none transition-colors',
                  'text-[#F5F5F5] placeholder-[#737373] caret-[#FFB223]',
                  error
                    ? 'border-red-500/80 bg-red-950/30 focus:border-red-400'
                    : 'border-[#3A3A3A] bg-[#101010] focus:border-[#FFB223] focus:bg-[#141414]',
                  ].join(' ')}
                />
                <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className="absolute inset-y-0 right-3 flex items-center text-[#737373] hover:text-[#F5F5F5]">
                  {visible ? <EyeSlash size={19} color="currentColor" /> : <Eye size={19} color="currentColor" />}
                </button>
              </div>
              {error && (
                <p role="alert" className="mt-2 text-xs text-red-400">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className={[
                'w-full py-3 rounded-xl text-sm font-semibold transition-all',
                loading || !password
                  ? 'bg-[#FFB223]/35 text-[#6B5A3A] cursor-not-allowed'
                  : 'bg-[#FFB223] text-[#111111] hover:bg-[#FFC14A] active:scale-[0.98]',
              ].join(' ')}
            >
              {loading ? 'Đang xác thực...' : 'Vào wiki'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#666666] mt-6">
          emotico · 2026
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
