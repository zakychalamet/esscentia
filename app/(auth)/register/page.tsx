'use client';

import { useState } from 'react';
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

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get('redirect'));
  const loginHref = redirectTo === '/profile'
    ? '/login'
    : `/login?redirect=${encodeURIComponent(redirectTo)}`;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    try {
      await register(name, email, password);
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Pendaftaran gagal');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <AuthHeader badge="Join Esscentia" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <AuthImagePanel
          image="https://images.unsplash.com/photo-1608168895822-f1bd922bb235?w=900&h=1200&fit=crop"
          quote="Discover curated scents crafted for the extraordinary."
        />

        <div className="flex items-center justify-center px-4 sm:px-8 lg:px-16 py-12 lg:py-20 order-first lg:order-none">
          <div className="w-full max-w-md">
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-4">
              Create Account
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#4A3728] mb-3">Daftar</h1>
            <p className="text-stone-600 text-sm leading-relaxed mb-10">
              Buat akun baru dan bergabung dengan komunitas pecinta parfum artisanal.
            </p>

            {error && (
              <div className="mb-8 px-4 py-3 border border-red-200/80 bg-red-50/50 text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              <AuthUnderlineField
                label="Nama Lengkap"
                id="name"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <AuthUnderlineField
                label="Konfirmasi Password"
                id="confirmPassword"
                type="password"
                placeholder="Masukkan ulang password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Daftar'}
              </button>
            </form>

            <p className="text-center text-sm text-stone-600 mt-8">
              Sudah punya akun?{' '}
              <Link
                href={loginHref}
                className="text-[#8D4F38] font-medium hover:underline underline-offset-4"
              >
                Masuk
              </Link>
            </p>

            <Link
              href="/profile"
              className="block text-center mt-4 text-xs uppercase tracking-wider text-stone-500 hover:text-[#8D4F38] transition"
            >
              ← Kembali ke Profil
            </Link>

            <p className="mt-10 text-xs text-stone-500 leading-relaxed border-t border-stone-200/80 pt-6">
              Dengan mendaftar, Anda menerima{' '}
              <Link href="/terms" className="text-[#8D4F38] hover:underline">
                Syarat &amp; Ketentuan
              </Link>{' '}
              dan{' '}
              <Link href="/privacy" className="text-[#8D4F38] hover:underline">
                Kebijakan Privasi
              </Link>{' '}
              kami.
            </p>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
