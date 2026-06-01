'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import {
  Send,
  CheckCircle,
  Truck,
  Sparkles,
  FileText,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  User,
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  price: number;
  productImage?: string | null;
}

interface OrderRecord {
  id: string;
  userId: string | null;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  shipMethod: string;
  paymentMethod: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  notes: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderTrackingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'shipped' | 'completed'>('pending');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/orders?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getFilteredOrders = () => {
    return orders.filter(
      (order) => order.status.toLowerCase() === activeTab
    );
  };

  const formatPrice = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper for timeline rendering
  const timelineSteps = [
    { key: 'pending', label: 'Pesanan Diterima', desc: 'Pesanan Anda telah kami terima', icon: FileText },
    { key: 'processing', label: 'Proses', desc: 'Pesanan Anda sedang diproses oleh kurator kami', icon: Sparkles },
    { key: 'shipped', label: 'Dalam Pengiriman', desc: 'Paket Anda sedang diantar oleh kurir', icon: Truck },
    { key: 'completed', label: 'Tiba di Tujuan', desc: 'Parfum mewah Anda telah sampai', icon: CheckCircle },
  ];

  const getStatusIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 0;
    if (s === 'processing') return 1;
    if (s === 'shipped') return 2;
    if (s === 'completed') return 3;
    return 0;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-stone-500 text-sm font-light">Memuat detail pelacakan…</span>
          </div>
        </div>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
        <CatalogNav />
        <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-20 text-center flex flex-col justify-center items-center">
          <div className="w-20 h-20 mb-8 rounded-full bg-[#EDEAE4] flex items-center justify-center">
            <Send size={36} strokeWidth={1.2} className="text-[#8C7355]" />
          </div>
          <h1 className="text-3xl font-serif text-[#4A3728] mb-4">Lacak Pesanan</h1>
          <p className="text-stone-600 text-sm leading-relaxed mb-10">
            Masuk ke akun Anda untuk memantau status pesanan parfum Esscentia secara real-time dan melihat detail kurir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link
              href="/login"
              className="px-8 py-3 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.15em] hover:bg-[#8C7355] transition text-center"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 border border-[#4A3728] text-[#4A3728] text-xs uppercase tracking-[0.15em] hover:bg-[#4A3728] hover:text-[#F9F7F2] transition text-center"
            >
              Daftar
            </Link>
          </div>
        </main>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif text-[#4A3728] tracking-tight mb-2">Lacak Pesanan</h1>
            <p className="text-sm text-stone-500 font-light">
              Pantau perjalanan botol wewangian premium Anda dari lab kami hingga ke depan pintu rumah Anda.
            </p>
          </div>
          <div className="bg-[#EDEAE4] text-xs px-3 py-1.5 rounded text-stone-600 uppercase tracking-widest font-medium">
            Customer Panel
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {(['pending', 'processing', 'shipped', 'completed'] as const).map((tab) => {
            const count = orders.filter((o) => o.status.toLowerCase() === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all uppercase tracking-wider flex items-center gap-2 ${
                  isActive
                    ? 'border-[#4A3728] text-[#4A3728] font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab === 'pending' && 'Pending'}
                {tab === 'processing' && 'Processing'}
                {tab === 'shipped' && 'Shipped'}
                {tab === 'completed' && 'Completed'}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#4A3728] text-[#F9F7F2]' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white/40 border border-stone-200/60 p-16 text-center rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EDEAE4] flex items-center justify-center">
              <ShoppingBag size={24} strokeWidth={1.2} className="text-stone-400" />
            </div>
            <h3 className="text-lg font-serif mb-2">Belum ada pesanan</h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto mb-8 font-light">
              Saat ini tidak ada pesanan aktif pada tahap <span className="font-semibold uppercase">{activeTab}</span>.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.15em] hover:bg-[#8C7355] transition"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStepIdx = getStatusIndex(order.status);
              const isThisExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200/80 rounded-lg shadow-sm overflow-hidden hover:border-[#8C7355]/40 transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-50/50 border-b border-stone-100">
                    <div className="flex items-center gap-4">
                      {order.items[0]?.productImage ? (
                        <img
                          src={order.items[0].productImage}
                          alt="Order Preview"
                          className="w-12 h-12 object-cover rounded bg-[#EDEAE4] border border-stone-200/50 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#EDEAE4] border border-stone-200/50 flex items-center justify-center text-[#8C7355] shrink-0">
                          <ShoppingBag size={18} />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold tracking-wider text-[#4A3728]">
                            {order.orderNumber}
                          </span>
                          <span className="inline-block bg-[#8C7355]/15 text-[#8C7355] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-2 font-light">
                          <Calendar size={12} />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-8">
                      <div className="text-right">
                        <p className="text-xs text-stone-500 font-light">Total Pembayaran</p>
                        <p className="text-lg font-serif text-[#4A3728] font-bold">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-2 border border-stone-200 rounded hover:bg-stone-50 transition text-stone-500 flex items-center gap-1 text-xs"
                      >
                        {isThisExpanded ? (
                          <>
                            Sembunyikan <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            Detail <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Timeline Progress Section */}
                  <div className="p-6 md:p-8 border-b border-stone-100 bg-white">
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 md:px-8">
                      {/* Desktop Progress Line background */}
                      <div className="absolute left-[15px] md:left-0 top-[24px] md:top-[19px] bottom-6 md:bottom-auto md:w-full h-full md:h-[2px] bg-stone-200 -z-0">
                        {/* Dynamic Progress Line foreground */}
                        <div
                          className="bg-[#8C7355] h-full md:h-[2px] transition-all duration-500"
                          style={{
                            height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(currentStepIdx / 3) * 100}%` : 'auto',
                            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(currentStepIdx / 3) * 100}%` : '2px',
                          }}
                        />
                      </div>

                      {timelineSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const StepIcon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center relative z-10 group"
                            style={{ flex: 1 }}
                          >
                            {/* Icon Wrapper */}
                            <div className="relative">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                                  isCompleted
                                    ? 'bg-[#4A3728] border-[#4A3728] text-[#F9F7F2] shadow-md'
                                    : 'bg-white border-stone-200 text-stone-400'
                                } ${isCurrent ? 'ring-4 ring-[#8C7355]/20 scale-110' : ''}`}
                              >
                                <StepIcon size={18} />
                              </div>

                              {/* Flying paper plane for current stage */}
                              {isCurrent && (
                                <div className="absolute -top-3 -right-3 bg-[#8C7355] text-white p-1 rounded-full animate-bounce shadow-sm">
                                  <Send size={10} className="transform rotate-45" />
                                </div>
                              )}
                            </div>

                            {/* Label & Description */}
                            <div className="space-y-0.5">
                              <h4
                                className={`text-sm font-serif font-semibold transition-colors ${
                                  isCompleted ? 'text-[#4A3728]' : 'text-stone-400'
                                }`}
                              >
                                {step.label}
                              </h4>
                              <p className="text-[11px] text-stone-500 max-w-[160px] md:mx-auto font-light leading-relaxed hidden md:block">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isThisExpanded && (
                    <div className="p-6 md:p-8 bg-stone-50/30 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      {/* Left: Product List */}
                      <div className="space-y-4">
                        <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400">
                          Item Pesanan
                        </h4>
                        <div className="space-y-3 bg-white border border-stone-200/60 p-4 rounded shadow-xs">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center gap-4 pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                            >
                              <div>
                                <p className="font-serif text-[#4A3728] font-medium text-sm">
                                  {item.productName}
                                </p>
                                <p className="text-[11px] text-stone-500 font-light mt-0.5">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-mono text-[#4A3728] font-semibold text-xs shrink-0">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary Calculations */}
                        <div className="space-y-2 px-1 text-xs">
                          <div className="flex justify-between text-stone-500">
                            <span>Subtotal</span>
                            <span className="font-mono">{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-stone-500">
                            <span>Biaya Pengiriman ({order.shipMethod.toUpperCase()})</span>
                            <span className="font-mono">{formatPrice(order.shippingCost)}</span>
                          </div>
                          <div className="flex justify-between text-[#4A3728] font-semibold text-sm pt-2 border-t border-stone-200">
                            <span>Total Keseluruhan</span>
                            <span className="font-mono">{formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Shipping & Payment Address */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400">
                            Informasi Pengiriman
                          </h4>
                          <div className="bg-white border border-stone-200/60 p-4 rounded shadow-xs space-y-3 text-xs leading-relaxed">
                            <div className="flex items-start gap-3">
                              <MapPin size={16} strokeWidth={1.5} className="text-[#8C7355] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-[#4A3728]">{order.shippingName}</p>
                                <p className="text-stone-500">{order.shippingPhone}</p>
                                <p className="text-stone-600 mt-1">
                                  {order.shippingAddress}, {order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400">
                            Metode Pembayaran
                          </h4>
                          <div className="bg-white border border-stone-200/60 p-4 rounded shadow-xs space-y-2 text-xs flex items-center gap-3">
                            <CreditCard size={16} strokeWidth={1.5} className="text-[#8C7355] shrink-0" />
                            <div>
                              <p className="font-medium text-[#4A3728] capitalize">
                                {order.paymentMethod === 'transfer' ? 'Transfer Bank Mandiri/BCA' : order.paymentMethod}
                              </p>
                              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-medium">
                                LUNAS / TERVERIFIKASI
                              </p>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="space-y-2">
                            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400">
                              Catatan
                            </h4>
                            <p className="text-xs text-stone-600 italic bg-amber-50/40 p-3 border border-amber-100 rounded">
                              "{order.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
