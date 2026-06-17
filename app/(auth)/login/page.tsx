'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSafeRedirect } from '@/lib/auth-guard';
import {
  AuthHeader,
  AuthFooter,
  AuthUnderlineField,
  AuthImagePanel,
} from '@/components/AuthChrome';

function LoginContent() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));
  const registerHref = redirectTo === '/profile'
    ? '/register'
    : `/register?redirect=${encodeURIComponent(redirectTo)}`;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      await login(email, password);
      
      // Redirect administrative users directly to admin panel dashboard
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          if (userObj.role && ['admin', 'marketing', 'crm', 'executive'].includes(userObj.role)) {
            router.push('/admin');
            return;
          }
        } catch (e) {
          console.error('Failed to parse user for redirect:', e);
        }
      }
      
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <AuthHeader badge="Member Access" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
          <div className="w-full max-w-md">
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-4">
              Welcome Back
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#4A3728] mb-3">Masuk</h1>
            <p className="text-stone-600 text-sm leading-relaxed mb-10">
              Masuk ke akun Anda untuk melanjutkan perjalanan wewangian Anda.
            </p>

            {error && (
              <div className="mb-8 px-4 py-3 border border-red-200/80 bg-red-50/50 text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <AuthUnderlineField
                label="Email"
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <AuthUnderlineField
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="text-center text-sm text-stone-600 mt-8">
              Belum punya akun?{' '}
              <Link
                href={registerHref}
                className="text-[#8D4F38] font-medium hover:underline underline-offset-4"
              >
                Daftar
              </Link>
            </p>

            <Link
              href="/profile"
              className="block text-center mt-4 text-xs uppercase tracking-wider text-stone-500 hover:text-[#8D4F38] transition"
            >
              ← Kembali ke Profil
            </Link>

            <div className="mt-10 p-5 bg-[#EDEAE4]/60 border border-stone-200/80 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-1 font-bold">
                  Demo Account (Super Admin)
                </p>
                <p className="text-sm text-[#4A3728]">admin@esscentia.com <span className="text-xs text-stone-500">(PW: admin123)</span></p>
              </div>
              <div className="border-t border-stone-300/40 pt-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-1 font-bold">
                  Demo Account (Marketing Desk)
                </p>
                <p className="text-sm text-[#4A3728]">marketing@esscentia.com <span className="text-xs text-stone-500">(PW: marketing123)</span></p>
              </div>
              <div className="border-t border-stone-300/40 pt-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-1 font-bold">
                  Demo Account (CRM Manager / Analyst)
                </p>
                <p className="text-sm text-[#4A3728]">crm@esscentia.com <span className="text-xs text-stone-500">(PW: crm123)</span></p>
              </div>
              <div className="border-t border-stone-300/40 pt-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-1 font-bold">
                  Demo Account (Executive / C-Level)
                </p>
                <p className="text-sm text-[#4A3728]">executive@esscentia.com <span className="text-xs text-stone-500">(PW: executive123)</span></p>
              </div>
            </div>
          </div>
        </div>

        <AuthImagePanel
          image="/images/login.jpeg"
          quote="Authentic luxury, in every drop."
        />
      </div>

      <AuthFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center text-stone-500 text-sm">
          Memuat halaman masuk…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
