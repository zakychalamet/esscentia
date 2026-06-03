'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { ShoppingCart, User, LogOut, Menu, Bell, Inbox, Send } from 'lucide-react';
import { Button } from './Button';
import { useState, useEffect, useMemo, useRef } from 'react';


export function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // Fetch orders count for delivery badge
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data || []);
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e);
      }
    };
    fetchOrders();
    // Poll orders every 30 seconds to keep delivery count updated
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(
      (o) => o && o.status && ['pending', 'processing', 'shipped'].includes(o.status.toLowerCase())
    ).length;
  }, [orders]);

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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4A3728] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Esscentia</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-[#8C7355] transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-[#8C7355] transition">
              Produk
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#8C7355] transition">
              Tentang
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile" className="hidden sm:block text-gray-700 hover:text-[#8C7355] transition" aria-label="Profil">
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

            <Link href="/orders/track" className="relative">
              <Button variant="outline" size="sm" className="flex items-center justify-center p-2 text-gray-700 hover:text-[#8C7355]" aria-label="Lacak Pesanan">
                <Send size={18} />
                {activeOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </Button>
            </Link>


            {/* Notification Bell Icon */}
            <Link href="/notifications">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center justify-center p-2 relative"
                aria-label="Notifikasi"
              >
                <Bell size={18} className={unreadCount > 0 ? "text-[#8C7355] animate-pulse" : "text-gray-700"} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8C7355] text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/profile" className="text-right hover:opacity-80 transition">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  {user.role === 'admin' && (
                    <p className="text-xs text-[#8C7355]">Admin</p>
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
              className="block px-4 py-2 text-gray-700 hover:bg-stone-100 rounded"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-stone-100 rounded"
            >
              Produk
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-stone-100 rounded"
            >
              Tentang
            </Link>
            <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-stone-100 rounded">
              Profil
            </Link>
            {user && (
              <button
                type="button"
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-stone-100 rounded"
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
