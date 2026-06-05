'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Truck, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getLoginUrl } from '@/lib/auth-guard';
import { CatalogNav } from '@/components/CatalogChrome';

function formatPrice(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function UnderlineField({
  label,
  name,
  value,
  onChange,
  required,
  type = 'text',
  className = '',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent border-0 border-b border-stone-300 py-2.5 text-[#4A3728] text-sm focus:outline-none focus:border-[#8D4F38] transition-colors"
      />
    </div>
  );
}

function SectionHeader({
  number,
  title,
  active = true,
}: {
  number: string;
  title: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium shrink-0 ${
          active ? 'bg-[#6B8F71] text-white' : 'bg-stone-200 text-stone-400'
        }`}
      >
        {number}
      </span>
      <h2
        className={`text-xl font-serif ${active ? 'text-[#4A3728]' : 'text-stone-400'}`}
      >
        {title}
      </h2>
    </div>
  );
}

function CheckoutFooter() {
  return (
    <footer className="bg-[#E8E6E1] text-[#4A3728] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif mb-4">Esscentia</h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-xs">
              A curation of artisanal fragrances for the modern soul, crafted with intention and sustainably sourced botanical essences.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">Shop</h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li><Link href="/products" className="hover:text-[#4A3728] transition">All Products</Link></li>
              <li><Link href="/products" className="hover:text-[#4A3728] transition">New Arrivals</Link></li>
              <li><Link href="/products" className="hover:text-[#4A3728] transition">Gift Sets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">Assistance</h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li><Link href="/contact" className="hover:text-[#4A3728] transition">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#4A3728] transition">FAQs</Link></li>
              <li><Link href="/privacy" className="hover:text-[#4A3728] transition">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">Connect</h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li><a href="#" className="hover:text-[#4A3728] transition">Instagram</a></li>
              <li><a href="#" className="hover:text-[#4A3728] transition">Facebook</a></li>
              <li><a href="#" className="hover:text-[#4A3728] transition">Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-stone-500 tracking-wide pt-8 border-t border-stone-300/40">
          © 2024 Esscentia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(getLoginUrl('/checkout'));
    }
  }, [user, isLoading, router]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  });

  const [shipMethod, setShipMethod] = useState('regular');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  const PROMO_CODES: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
    'SPECIAL25': { type: 'percent', value: 25 },
    'NEWSCENT10': { type: 'percent', value: 10 },
    'BACK25': { type: 'percent', value: 25 },
    'REACTIVATE30': { type: 'percent', value: 30 },
    'LOVAL200': { type: 'fixed', value: 200000 },
  };

  // Load saved promo from localStorage if we came from cart checkout flow
  useEffect(() => {
    const source = localStorage.getItem('checkoutSource');
    if (source === 'cart') {
      const savedPromo = localStorage.getItem('cartPromoCode');
      if (savedPromo) {
        const promo = PROMO_CODES[savedPromo];
        if (promo) {
          let discount = 0;
          if (promo.type === 'percent') {
            discount = Math.round((promo.value / 100) * total);
          } else {
            discount = promo.value;
          }
          if (discount > total) {
            discount = total;
          }
          setPromoDiscount(discount);
          setAppliedPromo(savedPromo);
        }
      }
    } else {
      // Bypassed cart, clear any residual/stored promo code in localStorage
      localStorage.removeItem('cartPromoCode');
    }
  }, [total]);

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const promo = PROMO_CODES[code];
    if (!promo) {
      setPromoError('Kode promo tidak valid');
      setPromoDiscount(0);
      setAppliedPromo(null);
      return;
    }

    let discount = 0;
    if (promo.type === 'percent') {
      discount = Math.round((promo.value / 100) * total);
    } else {
      discount = promo.value;
    }

    if (discount > total) {
      discount = total;
    }

    setPromoDiscount(discount);
    setAppliedPromo(code);
    setPromoCode('');

    // Save to localStorage so reload doesn't lose it
    localStorage.setItem('cartPromoCode', code);
    localStorage.setItem('checkoutSource', 'cart');
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode('');
    setPromoError(null);
    localStorage.removeItem('cartPromoCode');
    localStorage.removeItem('checkoutSource');
  };

  const baseShipping = total > 500000 ? 0 : 50000;
  const shippingCost =
    shipMethod === 'express'
      ? baseShipping + 50000
      : shipMethod === 'same-day'
        ? baseShipping + 100000
        : baseShipping;
  const finalTotal = Math.max(0, total + shippingCost - promoDiscount);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      alert('Mohon lengkapi semua field yang diperlukan');
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id ?? null,
          subtotal: total,
          shippingCost,
          totalAmount: finalTotal,
          shipMethod,
          paymentMethod,
          shippingName: formData.name,
          shippingEmail: formData.email,
          shippingPhone: formData.phone,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingProvince: formData.province,
          shippingPostalCode: formData.postalCode,
          notes: formData.notes,
          items: items.map((item) => ({
            productId: item.product.id,
            productName: `${item.product.name} (${item.selectedVolume}ml)`,
            quantity: item.quantity,
            price: item.selectedPrice,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat pesanan');
      }

      alert(`Pesanan berhasil dibuat! Nomor pesanan: ${data.orderNumber}`);
      clearCart();
      localStorage.removeItem('cartPromoCode');
      localStorage.removeItem('checkoutSource');
      router.push('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal membuat pesanan');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-serif text-[#4A3728] mb-4">Keranjang Kosong</h1>
            <p className="text-stone-600 mb-8 text-sm">
              Tidak ada produk untuk di-checkout
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 border border-[#8D4F38] text-[#8D4F38] text-xs uppercase tracking-[0.15em] font-serif hover:bg-[#8D4F38] hover:text-[#F9F7F2] transition"
            >
              Kembali Belanja
            </Link>
          </div>
        </div>
        <CheckoutFooter />
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center text-stone-500 text-sm">
          Memuat checkout…
        </div>
        <CheckoutFooter />
      </div>
    );
  }

  const shipOptions = [
    { id: 'regular', name: 'Reguler (3-5 hari)', price: baseShipping },
    { id: 'express', name: 'Express (1-2 hari)', price: baseShipping + 50000 },
    { id: 'same-day', name: 'Same Day (Hari Sama)', price: baseShipping + 100000 },
  ];

  const paymentOptions = [
    { id: 'transfer', name: 'Transfer Bank', icon: '🏦' },
    { id: 'ewallet', name: 'E-Wallet (GoPay, OVO)', icon: '📱' },
    { id: 'cod', name: 'Bayar di Tempat (COD)', icon: '🚚' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <form onSubmit={handleSubmit} className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <h1 className="text-4xl md:text-[2.75rem] font-serif text-[#4A3728] mb-8 lg:mb-10">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Kiri — Form checkout */}
            <div className="min-w-0 order-2 lg:order-1">
              <section className="mb-10">
                <SectionHeader number="01" title="Informasi Pengiriman" />
                <div className="space-y-6">
                  <UnderlineField
                    label="Nama Lengkap"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <UnderlineField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <UnderlineField
                      label="Nomor Telepon"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <UnderlineField
                    label="Alamat Lengkap"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <UnderlineField
                      label="Kota"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <UnderlineField
                      label="Provinsi"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                    />
                  </div>
                  <UnderlineField
                    label="Kode Pos"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2"
                    >
                      Catatan (Opsional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Tambahkan catatan khusus untuk pesanan Anda"
                      className="w-full bg-transparent border-0 border-b border-stone-300 py-2.5 text-[#4A3728] text-sm focus:outline-none focus:border-[#8D4F38] transition-colors resize-none placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <SectionHeader number="02" title="Metode Pengiriman" />
                <div className="space-y-2.5">
                  {shipOptions.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 py-3.5 px-4 border cursor-pointer transition ${
                        shipMethod === method.id
                          ? 'border-[#8D4F38] bg-white/60'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipMethod"
                        value={method.id}
                        checked={shipMethod === method.id}
                        onChange={(e) => setShipMethod(e.target.value)}
                        className="accent-[#8D4F38] shrink-0"
                      />
                      <span className="flex-1 text-sm text-[#4A3728]">{method.name}</span>
                      <span className="text-sm text-[#4A3728] shrink-0">
                        + {formatPrice(method.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <SectionHeader number="03" title="Metode Pembayaran" />
                <div className="space-y-2.5">
                  {paymentOptions.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 py-3.5 px-4 border cursor-pointer transition ${
                        paymentMethod === method.id
                          ? 'border-[#8D4F38] bg-white/60'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#8D4F38] shrink-0"
                      />
                      <span className="text-lg leading-none">{method.icon}</span>
                      <span className="text-sm text-[#4A3728]">{method.name}</span>
                    </label>
                  ))}
                </div>
              </section>

              <button
                type="submit"
                disabled={isProcessing}
                className="lg:hidden w-full py-4 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition disabled:opacity-60 mb-8"
              >
                {isProcessing ? 'Memproses...' : 'Selesaikan Pembayaran'}
              </button>

              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-stone-200/80">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-stone-500">
                  <Shield size={14} strokeWidth={1.5} />
                  Enkripsi SSL Aman
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-stone-500">
                  <Truck size={14} strokeWidth={1.5} />
                  Pengiriman Aman
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-stone-500">
                  <Heart size={14} strokeWidth={1.5} />
                  Produk Asli 100%
                </div>
              </div>
            </div>

            {/* Kanan — Ringkasan Pesanan */}
            <aside className="order-1 lg:order-2 lg:sticky lg:top-20 bg-[#EFEFE9] border border-stone-200/70 p-6 sm:p-8">
              <h2 className="text-xl font-serif text-[#4A3728] mb-6 pb-4 border-b border-stone-300/50">
                Ringkasan Pesanan
              </h2>

              <ul className="space-y-5 mb-6 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={`${item.product.id}-${item.selectedVolume}`} className="flex gap-3">
                    <div className="w-14 h-14 shrink-0 bg-stone-200 overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-[#4A3728] truncate">
                          {item.product.name} ({item.selectedVolume}ml)
                        </p>
                        <p className="text-stone-500 text-xs mt-0.5">x{item.quantity}</p>
                      </div>
                      <p className="font-medium text-[#4A3728] shrink-0 text-right">
                        {formatPrice(item.selectedPrice * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo Code Panel */}
              <div className="border-t border-stone-300/60 pt-5 pb-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-2 font-bold">
                  Punya Kode Promo?
                </p>
                {appliedPromo ? (
                  <div className="flex justify-between items-center bg-[#6B8F71]/10 border border-[#6B8F71]/30 p-2.5 rounded text-xs text-[#4A3728]">
                    <div>
                      Kupon <span className="font-bold text-[#6B8F71]">{appliedPromo}</span> terpasang
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[#8D4F38] hover:underline font-semibold ml-2 uppercase text-[9px] tracking-wider"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-white border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-[#8D4F38] rounded-xs"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="bg-[#4A3728] text-[#F9F7F2] hover:bg-[#8C7355] text-[10px] uppercase tracking-wider font-bold px-4 py-2 transition shrink-0"
                      >
                        Pasang
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[10px] text-red-600 font-medium">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-sm border-t border-stone-300/60 pt-5 mb-5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="text-[#4A3728]">{formatPrice(total)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#6B8F71] font-semibold">
                    <span>Diskon ({appliedPromo})</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Pengiriman</span>
                  <span className="text-[#4A3728]">
                    {shippingCost > 0 ? formatPrice(shippingCost) : 'Gratis'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline gap-4 mb-6 pt-1">
                <span className="font-serif text-base text-[#4A3728]">Total</span>
                <span className="text-2xl font-serif text-[#8D4F38] tabular-nums">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="hidden lg:block w-full py-3.5 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition disabled:opacity-60 disabled:cursor-not-allowed mb-4"
              >
                {isProcessing ? 'Memproses...' : 'Selesaikan Pembayaran'}
              </button>

              <Link
                href="/cart"
                className="block text-center text-[10px] uppercase tracking-wider text-stone-500 hover:text-[#8D4F38] transition"
              >
                ← Kembali ke Keranjang
              </Link>
            </aside>
          </div>
        </div>
      </form>

      <CheckoutFooter />
    </div>
  );
}
