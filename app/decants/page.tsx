'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getLoginUrl } from '@/lib/auth-guard';
import { Product } from '@/lib/products';
import { Decant } from '@/lib/decant-db';
import { FRAGRANCE_FAMILIES } from '@/lib/fragrance-families';

type DecantWithProduct = Decant & { product: Product };

function formatPrice(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DecantsPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [decants, setDecants] = useState<DecantWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  
  // Selection states per decant ID
  // key: decantId, value: selected size (1 | 2 | 5 | 10)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  // Success states for add to cart feedback per decant ID
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/decants')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDecants(data);
          
          // Set default selected sizes (usually 2ml or 5ml as default)
          const defaults: Record<string, number> = {};
          data.forEach((d) => {
            defaults[d.id] = 5; // default to 5ml
          });
          setSelectedSizes(defaults);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectSize = (decantId: string, size: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [decantId]: size,
    }));
  };

  const handleAddToCart = (decant: DecantWithProduct) => {
    if (!user) {
      router.push(getLoginUrl('/decants'));
      return;
    }
    const size = selectedSizes[decant.id] || 5;
    let price = decant.price5ml;
    if (size === 1) price = decant.price1ml;
    else if (size === 2) price = decant.price2ml;
    else if (size === 10) price = decant.price10ml;

    addToCart(decant.product, 1, size, price, true);

    // Show visual feedback
    setAddedFeedback((prev) => ({ ...prev, [decant.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [decant.id]: false }));
    }, 1500);
  };

  const handleBuyNow = (decant: DecantWithProduct) => {
    if (!user) {
      router.push(getLoginUrl('/decants'));
      return;
    }
    const size = selectedSizes[decant.id] || 5;
    let price = decant.price5ml;
    if (size === 1) price = decant.price1ml;
    else if (size === 2) price = decant.price2ml;
    else if (size === 10) price = decant.price10ml;

    localStorage.removeItem('cartPromoCode');
    localStorage.removeItem('checkoutSource');

    // Store only this specific item for checkout
    const tempCheckoutItem = {
      product: decant.product,
      selectedVolume: size,
      selectedPrice: price,
      quantity: 1,
      isDecant: true
    };
    localStorage.setItem('checkoutItems', JSON.stringify([tempCheckoutItem]));

    addToCart(decant.product, 1, size, price, true);
    router.push('/checkout');
  };

  const filteredDecants = useMemo(() => {
    return decants.filter((d) => {
      const matchesSearch =
        d.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFamily =
        selectedFamily === 'All' || d.product.family === selectedFamily;

      return matchesSearch && matchesFamily;
    });
  }, [decants, searchQuery, selectedFamily]);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      {/* Hero Banner */}
      <section className="bg-[#EDEAE4] py-16 lg:py-20 text-center border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7355] font-semibold mb-3">
            Discovery Decants
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A3728] mb-6">
            Eksplorasi Aroma Sebelum Memiliki
          </h1>
          <p className="text-stone-600 text-sm md:text-[15px] max-w-xl mx-auto leading-relaxed">
            Temukan signature scent Anda melalui decant premium ukuran 1ml, 2ml, 5ml, hingga 10ml yang dipindahkan langsung dari botol asli original.
          </p>
        </div>
      </section>

      {/* Filter & List Controls */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 pb-6 border-b border-stone-200/60">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search size={16} strokeWidth={1.5} />
            </span>
            <input
              type="text"
              placeholder="Cari decant parfum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#8C7355] focus:border-[#8C7355] placeholder-stone-400 text-[#4A3728]"
            />
          </div>

          {/* Scent family filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedFamily('All')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition ${
                selectedFamily === 'All'
                  ? 'bg-[#4A3728] text-white'
                  : 'bg-white border border-stone-200 hover:border-stone-400'
              }`}
            >
              Semua
            </button>
            {FRAGRANCE_FAMILIES.map((family) => (
              <button
                key={family}
                onClick={() => setSelectedFamily(family)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition ${
                  selectedFamily === family
                    ? 'bg-[#4A3728] text-white'
                    : 'bg-white border border-stone-200 hover:border-stone-400'
                }`}
              >
                {family}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#8D4F38] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-500 text-sm font-serif">Memuat data decant...</p>
          </div>
        ) : filteredDecants.length === 0 ? (
          <div className="py-20 text-center bg-white/40 border border-stone-200/80 rounded p-8">
            <p className="text-stone-500 text-sm font-serif mb-2">Tidak ditemukan decant yang cocok</p>
            <p className="text-xs text-stone-400">Cobalah kata kunci lain atau pilih kelompok aroma yang berbeda.</p>
          </div>
        ) : (
          /* Product grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredDecants.map((decant) => {
              const activeSize = selectedSizes[decant.id] || 5;
              
              // Get price and stock status for active size
              let displayPrice = decant.price5ml;
              let isStocked = decant.inStock5ml;
              if (activeSize === 1) {
                displayPrice = decant.price1ml;
                isStocked = decant.inStock1ml;
              } else if (activeSize === 2) {
                displayPrice = decant.price2ml;
                isStocked = decant.inStock2ml;
              } else if (activeSize === 10) {
                displayPrice = decant.price10ml;
                isStocked = decant.inStock10ml;
              }

              const sizeOptions = [
                { val: 1, label: '1ml', stocked: decant.inStock1ml },
                { val: 2, label: '2ml', stocked: decant.inStock2ml },
                { val: 5, label: '5ml', stocked: decant.inStock5ml },
                { val: 10, label: '10ml', stocked: decant.inStock10ml },
              ];

              const isAdded = addedFeedback[decant.id];

              return (
                <div
                  key={decant.id}
                  className="bg-white border border-stone-200/80 flex flex-col group hover:shadow-md hover:border-stone-300 transition duration-300 overflow-hidden"
                >
                  {/* Image wrapper */}
                  <div className="aspect-square bg-stone-100 overflow-hidden relative">
                    <img
                      src={decant.product.image}
                      alt={decant.product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#8C7355] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium">
                      {decant.product.family}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                        {decant.product.brand}
                      </p>
                      <h3 className="font-serif text-[#4A3728] text-base group-hover:text-[#8D4F38] transition mb-2">
                        {decant.product.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
                        {decant.product.description}
                      </p>
                    </div>

                    <div>
                      {/* Size Selector */}
                      <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-2 font-medium">
                        Pilih Ukuran Decant:
                      </p>
                      <div className="grid grid-cols-4 gap-1.5 mb-4">
                        {sizeOptions.map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => handleSelectSize(decant.id, opt.val)}
                            className={`py-1.5 text-xs font-medium border text-center transition ${
                              !opt.stocked
                                ? 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed line-through'
                                : activeSize === opt.val
                                ? 'border-[#4A3728] bg-[#4A3728] text-white'
                                : 'border-stone-200 hover:border-stone-400 bg-white text-stone-600'
                            }`}
                            disabled={!opt.stocked}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* Pricing & Add to Cart button */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">
                            Harga Decant
                          </p>
                          <p className="font-serif text-[#8D4F38] text-[15px] font-medium truncate">
                            {formatPrice(displayPrice)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Tambah ke Keranjang (Add to Cart) */}
                          <button
                            type="button"
                            onClick={() => handleAddToCart(decant)}
                            disabled={!isStocked}
                            title="Tambah ke Keranjang"
                            className={`p-2.5 text-xs transition flex items-center justify-center ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : !isStocked
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                : 'bg-[#4A3728] hover:bg-[#8C7355] text-white'
                            }`}
                          >
                            {isAdded ? (
                              <Check size={14} strokeWidth={2.5} />
                            ) : (
                              <ShoppingBag size={14} strokeWidth={1.8} />
                            )}
                          </button>

                          {/* Beli Sekarang / Langsung Checkout (Buy Now) */}
                          <button
                            type="button"
                            onClick={() => handleBuyNow(decant)}
                            disabled={!isStocked}
                            className={`px-3 py-2.5 text-[10px] uppercase tracking-widest font-semibold transition flex items-center justify-center ${
                              !isStocked
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                : 'bg-[#8D4F38] hover:bg-[#7a4532] text-white'
                            }`}
                          >
                            {!isStocked ? 'Habis' : 'Beli'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
