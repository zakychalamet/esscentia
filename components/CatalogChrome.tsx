'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag,
  User,
  Search,
  Globe,
  Video,
  Camera,
  ArrowRight,
  Bell,
  Inbox,
  Send,
} from 'lucide-react';
import { SearchModal } from '@/components/SearchModal';
import { useAuth } from '@/lib/auth-context';
import { getLoginUrl } from '@/lib/auth-guard';

type NavKey = 'shop' | 'discovery' | 'quiz' | 'journal' | 'story';

const navItems: { key: NavKey; label: string; href: string }[] = [
  { key: 'shop', label: 'Shop', href: '/products' },
  { key: 'discovery', label: 'Discovery Sets', href: '/products' },
  { key: 'quiz', label: 'Fragrance Quiz', href: '/quiz' },
  { key: 'journal', label: 'The Journal', href: '/journal' },
  { key: 'story', label: 'Our Story', href: '/about' },
];

function getActiveNav(pathname: string): NavKey | null {
  if (pathname.startsWith('/quiz')) return 'quiz';
  if (pathname.startsWith('/journal')) return 'journal';
  if (pathname === '/about') return 'story';
  if (
    pathname.startsWith('/products') ||
    pathname === '/cart' ||
    pathname === '/checkout'
  ) {
    return 'shop';
  }
  return null;
}

function navLinkClass(isActive: boolean) {
  return [
    'whitespace-nowrap shrink-0 text-[11px] lg:text-xs xl:text-sm tracking-wide',
    isActive
      ? 'text-[#4A3728] border-b border-[#4A3728] pb-0.5'
      : 'text-stone-600 hover:text-[#4A3728] transition',
  ].join(' ');
}

export function CatalogNav() {
  const pathname = usePathname();
  const active = getActiveNav(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userSegment, setUserSegment] = useState<string>('');
  const [readIds, setReadIds] = useState<number[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    // Load read notifications from localStorage
    try {
      const stored = localStorage.getItem('esscentia_read_notifications');
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load read notifications:', e);
    }

    const fetchNotifications = async () => {
      try {
        const url = user ? `/api/notifications?userId=${user.id}` : `/api/notifications`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUserSegment(data.segment || 'Guest');
        }
      } catch (e) {
        console.error('Failed to fetch notifications:', e);
      }
    };

    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  const handleMarkAsRead = (id: number) => {
    if (readIds.includes(id)) return;
    const nextRead = [...readIds, id];
    setReadIds(nextRead);
    localStorage.setItem('esscentia_read_notifications', JSON.stringify(nextRead));
  };

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem('esscentia_read_notifications', JSON.stringify(allIds));
  };

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    <nav className="bg-[#F9F7F2] border-b border-stone-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-2 md:gap-4">
          {/* Kiri — spacer agar logo+menu tetap di tengah */}
          <div className="hidden md:block" aria-hidden />

          {/* Logo + menu — satu baris */}
          <div className="flex items-center justify-center gap-4 md:gap-5 lg:gap-6 xl:gap-10 min-w-0 col-start-2">
            <Link
              href="/"
              className="text-xl md:text-2xl font-serif text-[#4A3728] tracking-tight shrink-0"
            >
              Esscentia
            </Link>
            <div className="hidden md:flex items-center flex-nowrap gap-3 lg:gap-4 xl:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={navLinkClass(active === item.key)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Icons — kanan */}
          <div className="flex items-center justify-end gap-4 md:gap-5 col-start-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-[#4A3728] hover:text-[#8C7355] transition"
              aria-label="Cari"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link
              href="/cart"
              className={`transition ${
                pathname === '/cart'
                  ? 'text-[#4A3728]'
                  : 'text-[#4A3728] hover:text-[#8C7355]'
              }`}
              aria-label="Keranjang"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </Link>

            <Link
              href="/orders/track"
              className={`transition ${
                pathname === '/orders/track'
                  ? 'text-[#4A3728]'
                  : 'text-[#4A3728] hover:text-[#8C7355]'
              }`}
              aria-label="Lacak Pesanan"
            >
              <Send size={20} strokeWidth={1.5} />
            </Link>


            {/* Notification Bell Icon - Disebelah kiri profil */}
            <Link 
              href="/notifications"
              className="text-[#4A3728] hover:text-[#8C7355] transition relative flex items-center justify-center p-1"
              aria-label="Notifikasi"
            >
              <Bell size={20} strokeWidth={1.5} className={unreadCount > 0 ? "text-[#8C7355] animate-pulse" : "text-[#4A3728]"} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#8C7355] text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="text-[#4A3728] hover:text-[#8C7355] transition"
                aria-label="Profil"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
            ) : (
              <Link
                href={getLoginUrl(pathname)}
                className="text-[11px] uppercase tracking-[0.15em] text-[#4A3728] hover:text-[#8D4F38] transition whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav — scroll horizontal, satu baris */}
        <div className="md:hidden overflow-x-auto pb-3 -mt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-center gap-5 px-4 min-w-max">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={navLinkClass(active === item.key)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

export function CatalogFooter({ variant = 'catalog' }: { variant?: 'catalog' | 'product' }) {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#E8E6E1] text-[#4A3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif mb-4">Esscentia</h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-xs">
              A curation of artisanal fragrances for the modern soul, crafted with intention and
              sustainably sourced botanical essences.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              {variant === 'product' ? (
                <>
                  <li>
                    <Link href="/products" className="hover:text-[#4A3728] transition">
                      Fragrances
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#4A3728] transition">
                      Candles
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#4A3728] transition">
                      Bath &amp; Body
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/about" className="hover:text-[#4A3728] transition">
                      Sustainability
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-[#4A3728] transition">
                      Shipping &amp; Returns
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-[#4A3728] transition">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#4A3728] transition">
                      Store Locator
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">
              {variant === 'product' ? 'Policy' : 'Follow'}
            </h4>
            {variant === 'product' ? (
              <ul className="space-y-2.5 text-sm text-stone-600">
                <li>
                  <Link href="/about" className="hover:text-[#4A3728] transition">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#4A3728] transition">
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#4A3728] transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="flex gap-4 text-stone-600">
                <a href="#" className="hover:text-[#4A3728] transition" aria-label="Website">
                  <Globe size={20} strokeWidth={1.5} />
                </a>
                <a href="#" className="hover:text-[#4A3728] transition" aria-label="Instagram">
                  <Camera size={20} strokeWidth={1.5} />
                </a>
                <a href="#" className="hover:text-[#4A3728] transition" aria-label="YouTube">
                  <Video size={20} strokeWidth={1.5} />
                </a>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">
              Newsletter
            </h4>
            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
              {variant === 'product'
                ? 'Receive notes from the lab — early access and olfactory stories.'
                : 'Join our list for early access to new collections and exclusive offers.'}
            </p>
            <div className="flex border-b border-stone-400/60">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent py-2 text-sm text-[#4A3728] placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="button"
                className="px-2 text-[#4A3728] hover:text-[#8C7355] transition"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-stone-500 tracking-wide">
          © 2024 Esscentia. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
