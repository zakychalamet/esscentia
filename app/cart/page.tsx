'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getLoginUrl } from '@/lib/auth-guard';
import { Product } from '@/lib/products';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

const intensityLabels: Record<Product['intensity'], string> = {
  EDT: 'Eau de Toilette',
  EDP: 'Eau de Parfum',
  EXTRAIT: 'Extrait de Parfum',
};

const PROMO_CODES: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  'SPECIAL25': { type: 'percent', value: 25 },
  'NEWSCENT10': { type: 'percent', value: 10 },
  'BACK25': { type: 'percent', value: 25 },
  'REACTIVATE30': { type: 'percent', value: 30 },
  'LOVAL200': { type: 'fixed', value: 200000 },
};

function formatPrice(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, total: cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const [checkedKeys, setCheckedKeys] = useState<Record<string, boolean>>({});

  // Sync keys whenever items change
  useEffect(() => {
    if (items.length > 0) {
      setCheckedKeys((prev) => {
        const next = { ...prev };
        let updated = false;
        items.forEach((item) => {
          const key = `${item.product.id}-${item.selectedVolume}-${item.isDecant ? 'decant' : 'bottle'}`;
          if (next[key] === undefined) {
            next[key] = true; // default checked
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }
  }, [items]);

  const checkedItems = useMemo(() => {
    return items.filter((item) => {
      const key = `${item.product.id}-${item.selectedVolume}-${item.isDecant ? 'decant' : 'bottle'}`;
      return !!checkedKeys[key];
    });
  }, [items, checkedKeys]);

  const total = useMemo(() => {
    return checkedItems.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  }, [checkedItems]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    const promo = PROMO_CODES[appliedPromo];
    if (!promo) return 0;

    let calculatedDiscount = 0;
    if (promo.type === 'percent') {
      calculatedDiscount = Math.round((promo.value / 100) * total);
    } else {
      calculatedDiscount = promo.value;
    }

    return calculatedDiscount > total ? total : calculatedDiscount;
  }, [appliedPromo, total]);

  const shippingEstimate = cartTotal > 500000 ? 0 : 50000;
  const finalTotal = Math.max(0, total - discount + shippingEstimate);

  const handlePromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const promo = PROMO_CODES[code];
    if (!promo) {
      alert('Kode promo tidak valid');
      setAppliedPromo(null);
      return;
    }

    setAppliedPromo(code);
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      alert('Silakan pilih minimal satu produk untuk melanjutkan checkout.');
      return;
    }

    // Save only checked items to checkoutItems
    localStorage.setItem('checkoutItems', JSON.stringify(checkedItems));

    if (appliedPromo) {
      localStorage.setItem('cartPromoCode', appliedPromo);
      localStorage.setItem('checkoutSource', 'cart');
    } else {
      localStorage.removeItem('cartPromoCode');
      localStorage.removeItem('checkoutSource');
    }
    if (!user) {
      router.push(getLoginUrl('/checkout'));
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">
              Your Selection
            </p>
            <h1 className="text-4xl md:text-[2.75rem] font-serif text-[#4A3728]">
              Keranjang Belanja
            </h1>
          </div>
          {items.length > 0 && (
            <p className="text-sm text-stone-500 hidden sm:block">
              {items.reduce((n, i) => n + i.quantity, 0)} item
            </p>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Daftar produk */}
            <div className="min-w-0 order-2 lg:order-1 space-y-4">
              {/* Select All Checkbox */}
              <div className="flex items-center gap-3 px-5 py-4 bg-white/30 border border-stone-200/60 text-sm">
                <input
                  type="checkbox"
                  checked={items.length > 0 && items.every((item) => {
                    const key = `${item.product.id}-${item.selectedVolume}-${item.isDecant ? 'decant' : 'bottle'}`;
                    return !!checkedKeys[key];
                  })}
                  onChange={(e) => {
                    const val = e.target.checked;
                    const next: Record<string, boolean> = {};
                    items.forEach((item) => {
                      const key = `${item.product.id}-${item.selectedVolume}-${item.isDecant ? 'decant' : 'bottle'}`;
                      next[key] = val;
                    });
                    setCheckedKeys(next);
                  }}
                  className="w-4 h-4 text-[#8D4F38] border-stone-300 rounded focus:ring-[#8D4F38] accent-[#8D4F38] cursor-pointer"
                  id="select-all-cart"
                />
                <label htmlFor="select-all-cart" className="text-stone-700 cursor-pointer select-none font-medium">
                  Pilih Semua Produk
                </label>
              </div>

              {items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedVolume}-${item.isDecant ? 'decant' : 'bottle'}`;
                return (
                  <article
                    key={itemKey}
                    className="flex gap-4 sm:gap-5 bg-white/50 border border-stone-200/80 p-4 sm:p-5 items-start sm:items-center"
                  >
                    {/* Checkbox */}
                    <div className="flex items-center justify-center shrink-0 pt-1.5 sm:pt-0">
                      <input
                        type="checkbox"
                        checked={!!checkedKeys[itemKey]}
                        onChange={(e) => {
                          setCheckedKeys((prev) => ({
                            ...prev,
                            [itemKey]: e.target.checked,
                          }));
                        }}
                        className="w-4.5 h-4.5 text-[#8D4F38] border-stone-300 rounded focus:ring-[#8D4F38] accent-[#8D4F38] cursor-pointer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-5 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="w-full sm:w-28 h-36 sm:h-28 shrink-0 bg-stone-100 overflow-hidden"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="font-serif text-lg text-[#4A3728] hover:text-[#8D4F38] transition mb-1">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                            {item.product.brand}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-stone-400">
                            {item.isDecant ? 'Decant' : intensityLabels[item.product.intensity]} · {item.selectedVolume}ml
                          </p>
                          <p className="text-sm text-[#8D4F38] mt-2">
                            {formatPrice(item.selectedPrice)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <div className="flex items-center border border-stone-300">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.selectedVolume, item.isDecant)
                              }
                              className="p-2.5 text-stone-600 hover:text-[#4A3728] hover:bg-stone-100 transition"
                              aria-label="Kurangi jumlah"
                            >
                              <Minus size={14} strokeWidth={1.5} />
                            </button>
                            <span className="w-10 text-center text-sm border-x border-stone-300 py-2">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVolume, item.isDecant)}
                              className="p-2.5 text-stone-600 hover:text-[#4A3728] hover:bg-stone-100 transition"
                              aria-label="Tambah jumlah"
                            >
                              <Plus size={14} strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="text-right min-w-[5.5rem]">
                            <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-0.5">
                              Subtotal
                            </p>
                            <p className="font-medium text-[#4A3728] tabular-nums">
                              {formatPrice(item.selectedPrice * item.quantity)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.selectedVolume, item.isDecant)}
                            className="p-2 text-stone-400 hover:text-[#8D4F38] transition"
                            aria-label="Hapus item"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Link
                href="/products"
                className="inline-block mt-4 text-xs uppercase tracking-[0.15em] text-[#8D4F38] hover:underline underline-offset-4"
              >
                ← Lanjut Belanja
              </Link>
            </div>

            {/* Ringkasan */}
            <aside className="order-1 lg:order-2 lg:sticky lg:top-20 bg-[#EFEFE9] border border-stone-200/70 p-6 sm:p-8">
              <h2 className="text-xl font-serif text-[#4A3728] mb-6 pb-4 border-b border-stone-300/50">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-2.5 text-sm mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="text-[#4A3728]">{formatPrice(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#6B8F71]">
                    <span>Diskon</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Pengiriman (est.)</span>
                  <span className="text-[#4A3728]">
                    {shippingEstimate === 0 ? 'Gratis' : formatPrice(shippingEstimate)}
                  </span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-stone-300/50">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3 font-bold">
                  Kode Promo
                </p>
                {appliedPromo ? (
                  <div className="flex justify-between items-center bg-[#6B8F71]/10 border border-[#6B8F71]/30 p-2.5 rounded text-xs text-[#4A3728]">
                    <div>
                      Kupon <span className="font-bold text-[#6B8F71]">{appliedPromo}</span> terpasang
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoCode('');
                      }}
                      className="text-[#8D4F38] hover:underline font-semibold ml-2 uppercase text-[9px] tracking-wider"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan kode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border-0 border-b border-stone-400 py-2 text-sm text-[#4A3728] placeholder:text-stone-400 focus:outline-none focus:border-[#8D4F38]"
                    />
                    <button
                      type="button"
                      onClick={handlePromoCode}
                      className="shrink-0 px-4 py-2 text-[10px] uppercase tracking-wider border border-[#8D4F38] text-[#8D4F38] hover:bg-[#8D4F38] hover:text-[#F9F7F2] transition"
                    >
                      Gunakan
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline gap-4 mb-6">
                <span className="font-serif text-base text-[#4A3728]">Total</span>
                <span className="text-2xl font-serif text-[#8D4F38] tabular-nums">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="block w-full py-3.5 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] text-center hover:bg-[#7a4532] transition mb-4"
              >
                Lanjut ke Checkout
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
                    clearCart();
                    setAppliedPromo(null);
                    setPromoCode('');
                  }
                }}
                className="w-full py-2.5 text-[10px] uppercase tracking-wider text-stone-500 border border-stone-300 hover:border-[#8D4F38] hover:text-[#8D4F38] transition"
              >
                Kosongkan Keranjang
              </button>
            </aside>
          </div>
        ) : (
          <div className="text-center py-16 lg:py-24 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EDEAE4] flex items-center justify-center">
              <ShoppingBag size={28} strokeWidth={1.5} className="text-[#8C7355]" />
            </div>
            <h2 className="text-2xl font-serif text-[#4A3728] mb-3">Keranjang Anda kosong</h2>
            <p className="text-stone-600 text-sm mb-8">
              Tidak ada produk dalam keranjang Anda. Jelajahi koleksi parfum artisanal kami.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.15em] hover:bg-[#7a4532] transition"
            >
              Mulai Belanja
            </Link>
          </div>
        )}
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
