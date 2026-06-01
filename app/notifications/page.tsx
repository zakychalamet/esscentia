'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { useAuth } from '@/lib/auth-context';
import { Bell, Inbox, Gift, Sparkles, Calendar, Check, Copy, ArrowRight } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userSegment, setUserSegment] = useState<string>('');
  const [readIds, setReadIds] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load read notifications
    try {
      const stored = localStorage.getItem('esscentia_read_notifications');
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
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
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem('esscentia_read_notifications', JSON.stringify(allIds));
  };

  // Mark single as read
  const handleMarkAsRead = (id: number) => {
    if (readIds.includes(id)) return;
    const nextRead = [...readIds, id];
    setReadIds(nextRead);
    localStorage.setItem('esscentia_read_notifications', JSON.stringify(nextRead));
  };

  // Copy Promo Code simulation
  const handleCopyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    handleMarkAsRead(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Extracted voucher code pattern matcher
  const getPromoCode = (text: string) => {
    const match = text.match(/'([A-Z0-9_-]{5,})'/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#4A3728]">Notifikasi & Promo</h1>
            <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
              Daftar penawaran eksklusif, peluncuran produk baru, dan acara VIP khusus dirancang untuk Anda.
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-semibold text-[#8C7355] bg-amber-50/55 hover:bg-amber-50 border border-[#8C7355]/25 px-4 py-2 rounded-xl transition self-start md:self-auto cursor-pointer"
            >
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* Personalized Segment Greeting Banner */}
        {user ? (
          <div className="bg-gradient-to-r from-[#4A3728] to-[#2E2015] text-white rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                EXCLUSIVE PRIVILEGES
              </span>
              <h2 className="text-xl md:text-2xl font-serif">Selamat Datang, {user.name}</h2>
              <p className="text-xs text-stone-300 max-w-xl">
                Terima kasih atas apresiasi berkelanjutan Anda pada Esscentia. Berikut adalah daftar penawaran khusus untuk kategori loyalty Anda.
              </p>
            </div>
            <div className="shrink-0 relative z-10">
              <div className="text-[9px] font-bold text-amber-300 uppercase mb-1 tracking-wider text-left md:text-right">
                Status RFM Anda:
              </div>
              <div className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm">
                👑 {userSegment}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6 text-center mb-8">
            <h2 className="font-serif text-lg mb-1">Masuk untuk melihat promo khusus segmen Anda</h2>
            <p className="text-stone-500 text-xs mb-4">Silakan login untuk memvalidasi tier segmen RFM Anda dan mengklaim potongan harga.</p>
            <Link href="/login" className="inline-block bg-[#4A3728] hover:bg-[#8C7355] text-white text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg transition font-semibold">
              Login Akun
            </Link>
          </div>
        )}

        {/* Notifications Listing */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              Memuat penawaran khusus Anda...
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center border text-[#4A3728]">
                <Inbox size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-slate-800">Belum ada promo untuk Anda</h3>
                <p className="text-stone-500 text-xs mt-1.5 max-w-sm mx-auto leading-normal">
                  Saat ini belum ada notifikasi promosi aktif untuk segmen Anda. Terus eksplorasi koleksi parfum kami untuk meningkatkan status loyalty Anda!
                </p>
              </div>
              <Link href="/products" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8D4F38] hover:text-[#4A3728] transition">
                Jelajahi Parfum Terbaik <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            notifications.map((n) => {
              const isRead = readIds.includes(n.id);
              const promoCode = getPromoCode(n.message);
              
              // Icon mapping
              let PromoIcon = Gift;
              if (n.promoType === 'Private Collection Access') PromoIcon = Sparkles;
              if (n.promoType === 'Event Invitation') PromoIcon = Calendar;

              return (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 p-6 ${
                    isRead ? 'border-stone-200/80' : 'border-[#8C7355]/30'
                  }`}
                >
                  {/* Left accent bar for unread notifications */}
                  {!isRead && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8C7355]"></div>
                  )}

                  {/* Notification Content */}
                  <div className="flex gap-4 items-start flex-1 min-w-0">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      isRead ? 'bg-stone-50 border border-stone-200 text-stone-500' : 'bg-amber-50 border border-[#8C7355]/20 text-[#8C7355]'
                    }`}>
                      <PromoIcon size={22} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-[#8C7355] border border-[#8C7355]/20 px-2 py-0.5 rounded-md">
                          {n.promoType}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Diterima:{' '}
                          {new Date(n.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {!isRead && (
                          <span className="bg-[#8C7355] text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md tracking-wider">
                            Baru
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg text-slate-900 leading-snug">{n.title}</h3>
                      <p className="text-stone-600 text-sm leading-relaxed pr-4">{n.message}</p>
                    </div>
                  </div>

                  {/* Actions (Copy Code & Go shop) */}
                  <div className="shrink-0 flex flex-col gap-3 justify-center md:items-end border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                    {promoCode && (
                      <div className="flex items-center gap-1 border-2 border-dashed border-[#8C7355]/20 rounded-xl bg-amber-50/20 p-2 text-center">
                        <span className="font-mono text-xs font-bold text-[#4A3728] uppercase tracking-widest px-2">
                          {promoCode}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCode(n.id, promoCode);
                          }}
                          className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-[#8C7355] hover:border-[#8C7355]/30 transition cursor-pointer"
                          title="Salin Kode Voucher"
                        >
                          {copiedId === n.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}
                    
                    <Link
                      href="/products"
                      className="px-6 py-2.5 bg-[#4A3728] hover:bg-[#8C7355] text-white text-center text-xs uppercase tracking-[0.15em] font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      Beli Parfum Sekarang <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
