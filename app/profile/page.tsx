'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Shield,
  LogOut,
  ShoppingBag,
  Package,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { canAccessAdmin, adminRoleLabel } from '@/lib/admin-permissions';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const hasAdminAccess = canAccessAdmin(user?.role);
  const { itemCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center text-stone-500 text-sm">
          Memuat profil…
        </div>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
        <CatalogNav />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#EDEAE4] flex items-center justify-center">
            <User size={36} strokeWidth={1.5} className="text-[#8C7355]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#4A3728] mb-4">Profil Saya</h1>
          <p className="text-stone-600 text-sm leading-relaxed mb-10">
            Masuk atau daftar untuk mengelola akun, melihat riwayat pesanan, dan menyimpan
            preferensi wewangian Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.15em] hover:bg-[#8C7355] transition"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 border border-[#4A3728] text-[#4A3728] text-xs uppercase tracking-[0.15em] hover:bg-[#4A3728] hover:text-[#F9F7F2] transition"
            >
              Daftar
            </Link>
          </div>
        </main>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-4xl font-serif text-[#4A3728] mb-10">Profil Saya</h1>

        {/* Kartu profil */}
        <div className="bg-white/60 border border-stone-200/80 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-20 h-20 rounded-full object-cover border border-stone-200 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#4A3728] text-[#F9F7F2] flex items-center justify-center text-2xl font-serif shrink-0 font-medium">
                {initials}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-[#4A3728] mb-1">{user.name}</h2>
              <p className="text-sm text-stone-500 flex items-center gap-2 mb-2">
                <Mail size={14} strokeWidth={1.5} />
                {user.email}
              </p>
              <span
                className={`inline-block text-[10px] uppercase tracking-[0.15em] px-3 py-1 ${
                  hasAdminAccess
                    ? 'bg-[#8C7355]/15 text-[#8C7355]'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {user.role === 'user' ? 'Member' : adminRoleLabel(user.role)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-[#8D4F38] transition shrink-0"
            >
              <LogOut size={18} strokeWidth={1.5} />
              Keluar
            </button>
          </div>
        </div>

        {/* Menu akun */}
        <div className="space-y-3 mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">
            Akun Saya
          </p>

          <Link
            href="/cart"
            className="flex items-center gap-4 p-5 bg-white/40 border border-stone-200/60 hover:border-[#8C7355]/40 transition group"
          >
            <ShoppingBag
              size={22}
              strokeWidth={1.5}
              className="text-[#8C7355] group-hover:text-[#4A3728]"
            />
            <div className="flex-1">
              <p className="font-medium text-[#4A3728]">Keranjang</p>
              <p className="text-xs text-stone-500">
                {itemCount > 0 ? `${itemCount} item di keranjang` : 'Keranjang kosong'}
              </p>
            </div>
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-4 p-5 bg-white/40 border border-stone-200/60 hover:border-[#8C7355]/40 transition group"
          >
            <Package
              size={22}
              strokeWidth={1.5}
              className="text-[#8C7355] group-hover:text-[#4A3728]"
            />
            <div className="flex-1">
              <p className="font-medium text-[#4A3728]">Belanja Parfum</p>
              <p className="text-xs text-stone-500">Jelajahi koleksi kami</p>
            </div>
          </Link>

          {hasAdminAccess && (
            <Link
              href="/admin"
              className="flex items-center gap-4 p-5 bg-white/40 border border-stone-200/60 hover:border-[#8C7355]/40 transition group"
            >
              <Shield
                size={22}
                strokeWidth={1.5}
                className="text-[#8C7355] group-hover:text-[#4A3728]"
              />
              <div className="flex-1">
                <p className="font-medium text-[#4A3728]">Admin Panel</p>
                <p className="text-xs text-stone-500">
                  Akses panel manajemen intelijen Esscentia
                </p>
              </div>
            </Link>
          )}

          {user.role === 'user' && (
            <Link
              href="/settings"
              className="flex items-center gap-4 p-5 bg-white/40 border border-stone-200/60 hover:border-[#8C7355]/40 transition group"
            >
              <Settings
                size={22}
                strokeWidth={1.5}
                className="text-[#8C7355] group-hover:text-[#4A3728]"
              />
              <div className="flex-1">
                <p className="font-medium text-[#4A3728]">Pengaturan Akun</p>
                <p className="text-xs text-stone-500">Ubah nama dan foto profil Anda</p>
              </div>
            </Link>
          )}
        </div>

        {/* Info akun */}
        <div className="border-t border-stone-200/80 pt-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">
            Detail Akun
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <dt className="text-stone-500 mb-1">ID Pengguna</dt>
              <dd className="text-[#4A3728] font-mono text-xs">{user.id}</dd>
            </div>
            <div>
              <dt className="text-stone-500 mb-1">Peran</dt>
              <dd className="text-[#4A3728] capitalize">{user.role}</dd>
            </div>
          </dl>
        </div>
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
