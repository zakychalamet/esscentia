'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { Button } from './Button';
import { useState } from 'react';

export function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Esscentia</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-purple-600 transition">
              Produk
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 transition">
              Tentang
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/profile" className="hidden sm:block text-gray-700 hover:text-purple-600 transition" aria-label="Profil">
              <User size={20} />
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/profile" className="text-right hover:opacity-80 transition">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  {user.role === 'admin' && (
                    <p className="text-xs text-purple-600">Admin</p>
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="primary" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button variant="secondary" size="sm" onClick={logout} className="flex items-center gap-1">
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/profile" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  Profil
                </Button>
              </Link>
            )}

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
            >
              Produk
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
            >
              Tentang
            </Link>
            <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded">
              Profil
            </Link>
            {user && (
              <button
                type="button"
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
