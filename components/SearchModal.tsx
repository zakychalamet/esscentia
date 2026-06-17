'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp } from 'lucide-react';
import { Product, fetchProducts, searchProductsInList, getSuggestedProducts } from '@/lib/products';

const trendingSearches = [
  { label: 'fresh office scent', query: 'citrus fresh' },
  { label: 'winter evening musk', query: 'musk woody amber' },
  { label: 'discovery set for gifts', query: 'gift floral' },
];

const exploreFamilies: { label: string; family: Product['family'] | 'all' }[] = [
  { label: 'Woody', family: 'Woody' },
  { label: 'Floral', family: 'Floral' },
  { label: 'Citrus', family: 'Citrus' },
  { label: 'Fresh', family: 'Fresh' },
  { label: 'Amber', family: 'Amber' },
  { label: 'Vanilla', family: 'Vanilla' },
  { label: 'Aromatic', family: 'Aromatic' },
  { label: 'Leather', family: 'Leather' },
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function scentLine(product: Product) {
  return product.scent.slice(0, 3).join(' · ');
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!open || allProducts.length) return;
    fetchProducts()
      .then(setAllProducts)
      .catch(console.error);
  }, [open, allProducts.length]);

  const results = useMemo(
    () => searchProductsInList(query, allProducts),
    [query, allProducts]
  );
  const suggested = useMemo(() => getSuggestedProducts(allProducts, 4), [allProducts]);
  const displayProducts = query.trim() ? results.slice(0, 6) : suggested.slice(0, 4);

  const close = useCallback(() => {
    setQuery('');
    setHighlightIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Enter' && displayProducts.length > 0) {
        e.preventDefault();
        const product = displayProducts[highlightIndex] ?? displayProducts[0];
        if (product) {
          close();
          router.push(`/products/${product.id}`);
        }
        return;
      }
      if (e.key === 'ArrowDown' && displayProducts.length > 0) {
        e.preventDefault();
        setHighlightIndex((i) => (i + 1) % displayProducts.length);
      }
      if (e.key === 'ArrowUp' && displayProducts.length > 0) {
        e.preventDefault();
        setHighlightIndex((i) => (i - 1 + displayProducts.length) % displayProducts.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close, displayProducts, highlightIndex, router]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  if (!open) return null;

  const advancedHref = query.trim()
    ? `/products?q=${encodeURIComponent(query.trim())}`
    : '/products';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-24">
      <button
        type="button"
        className="absolute inset-0 bg-[#4A3728]/40 backdrop-blur-sm"
        onClick={close}
        aria-label="Tutup pencarian"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian"
        className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden max-h-[min(85vh,720px)] flex flex-col"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-stone-200 shrink-0">
          <Search size={20} strokeWidth={1.5} className="text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a scent, note, or occasion..."
            className="flex-1 min-w-0 text-[#4A3728] text-sm sm:text-base placeholder:text-stone-400 focus:outline-none bg-transparent"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={close}
            className="p-1.5 text-stone-500 hover:text-[#4A3728] transition shrink-0"
            aria-label="Tutup"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Kiri */}
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500 mb-4">
                  Trending Searches
                </h3>
                <ul className="space-y-3">
                  {trendingSearches.map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => setQuery(item.query)}
                        className="flex items-center gap-3 text-sm text-[#4A3728] hover:text-[#8D4F38] transition text-left w-full group"
                      >
                        <TrendingUp
                          size={14}
                          strokeWidth={1.5}
                          className="text-stone-400 group-hover:text-[#8C7355] shrink-0"
                        />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500 mb-4">
                  Explore Families
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exploreFamilies.map((f) => (
                    <Link
                      key={f.label}
                      href={
                        f.family === 'all'
                          ? '/products'
                          : `/products?family=${encodeURIComponent(f.family)}`
                      }
                      onClick={close}
                      className="px-4 py-1.5 text-[10px] uppercase tracking-wider bg-[#D4DFD0] text-[#4A3728] hover:bg-[#c5d4c1] transition rounded-full"
                    >
                      {f.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="flex flex-col">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500 mb-4">
                {query.trim()
                  ? results.length > 0
                    ? `Results (${results.length})`
                    : 'No Results'
                  : 'Suggested For You'}
              </h3>

              {query.trim() && results.length === 0 ? (
                <p className="text-sm text-stone-500 mb-6">
                  Tidak ada parfum yang cocok. Coba kata kunci lain atau jelajahi koleksi
                  lengkap.
                </p>
              ) : (
                <ul className="space-y-4 mb-6">
                  {displayProducts.map((product, index) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.id}`}
                        onClick={close}
                        className={`flex gap-4 p-2 -mx-2 rounded transition ${
                          index === highlightIndex
                            ? 'bg-[#F9F7F2] ring-1 ring-stone-200'
                            : 'hover:bg-[#F9F7F2]/80'
                        }`}
                      >
                        <div className="w-16 h-16 shrink-0 bg-stone-100 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <p className="font-serif text-[#4A3728] mb-1">{product.name}</p>
                          <p className="text-xs text-stone-500 mb-1">{scentLine(product)}</p>
                          <p className="text-sm text-[#8D4F38]">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={advancedHref}
                onClick={close}
                className="mt-auto block w-full py-3.5 text-center text-xs uppercase tracking-[0.15em] bg-[#EDEAE4] text-[#4A3728] hover:bg-[#E0DCD4] transition"
              >
                Lihat Semua Koleksi
              </Link>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3 border-t border-stone-200 bg-[#FAFAF8] text-[10px] uppercase tracking-wider text-stone-500 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[9px] font-sans">
                esc
              </kbd>
              to close
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[9px] font-sans">
                ↵
              </kbd>
              to select
            </span>
          </div>
          <Link
            href={advancedHref}
            onClick={close}
            className="text-[#8D4F38] hover:underline underline-offset-2"
          >
            Advanced Search
          </Link>
        </div>
      </div>
    </div>
  );
}
