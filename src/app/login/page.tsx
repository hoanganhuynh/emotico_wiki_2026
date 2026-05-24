'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/wiki';

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
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#FFB223] flex items-center justify-center mb-4 shadow-sm">
            <span className="text-white text-2xl select-none">♥</span>
          </div>
          <h1 className="text-xl font-bold text-[#1C1917] tracking-tight">emotico</h1>
          <p className="text-sm text-[#57534E] mt-1">Internal Wiki</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E7E5E4] p-8 shadow-sm">
          <h2 className="text-base font-semibold text-[#1C1917] mb-1">Nhập mật khẩu</h2>
          <p className="text-sm text-[#57534E] mb-6">
            Tài liệu này dành cho nội bộ. Liên hệ team nếu chưa có mật khẩu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                autoFocus
                required
                className={[
                  'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors',
                  'text-[#1C1917] placeholder-[#A8A29E]',
                  error
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-[#E7E5E4] bg-[#FAFAF9] focus:border-[#FFB223] focus:bg-white',
                ].join(' ')}
              />
              {error && (
                <p className="mt-2 text-xs text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className={[
                'w-full py-3 rounded-xl text-sm font-semibold transition-all',
                loading || !password
                  ? 'bg-[#FFB223]/40 text-white cursor-not-allowed'
                  : 'bg-[#FFB223] text-[#1C1917] hover:bg-[#FFA800] active:scale-[0.98]',
              ].join(' ')}
            >
              {loading ? 'Đang xác thực...' : 'Vào wiki'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#A8A29E] mt-6">
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
