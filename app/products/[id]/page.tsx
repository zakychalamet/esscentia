'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchProductById, Product } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getLoginUrl } from '@/lib/auth-guard';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

const intensityLabels: Record<Product['intensity'], string> = {
  EDT: 'Eau de Toilette',
  EDP: 'Eau de Parfum',
  EXTRAIT: 'Extrait de Parfum',
};

const performanceByIntensity: Record<
  Product['intensity'],
  { longevity: string; sillage: string; projection: string; natural: string }
> = {
  EDT: { longevity: '6h+', sillage: 'Light', projection: '6h', natural: '88%' },
  EDP: { longevity: '8h+', sillage: 'Med', projection: '10h', natural: '92%' },
  EXTRAIT: { longevity: '12h+', sillage: 'Strong', projection: '12h', natural: '94%' },
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getVolumeOptions(product: Product): number[] {
  if (product.volume >= 100) return [50, 100];
  if (product.volume >= 75) return [50, 75];
  return [50, product.volume];
}

function priceForVolume(basePrice: number, baseVolume: number, selected: number) {
  return Math.round(basePrice * (selected / baseVolume));
}

function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stone-200/80">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm text-[#4A3728] hover:text-[#8C7355] transition text-left"
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-4 text-sm text-stone-600 leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetchProductById(productId)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const getProductVolumeOptions = (prod: Product | null): number[] => {
    if (!prod) return [50, 100];
    if (prod.volume_prices && prod.volume_prices.length > 0) {
      return prod.volume_prices.map((vp) => vp.volume);
    }
    return getVolumeOptions(prod);
  };

  const volumeOptions = product ? getProductVolumeOptions(product) : [50, 100];
  const [selectedVolume, setSelectedVolume] = useState(volumeOptions[0]);

  useEffect(() => {
    if (product) {
      const opts = getProductVolumeOptions(product);
      setSelectedVolume(opts[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center text-stone-500 text-sm">
          Memuat produk…
        </div>
        <CatalogFooter variant="product" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-serif text-[#4A3728] mb-4">Produk tidak ditemukan</h1>
          <p className="text-stone-600 mb-8">Maaf, fragrans yang Anda cari tidak tersedia.</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.15em] hover:bg-[#8C7355] transition"
          >
            Kembali ke Shop
          </Link>
        </div>
        <CatalogFooter variant="product" />
      </div>
    );
  }

  const getProductDisplayPrice = (prod: Product, selectedVol: number): number => {
    if (prod.volume_prices && prod.volume_prices.length > 0) {
      const found = prod.volume_prices.find((vp) => vp.volume === selectedVol);
      if (found) return found.price;
    }
    return priceForVolume(prod.price, prod.volume, selectedVol);
  };

  const sillageValue = product.sillage || performanceByIntensity[product.intensity].sillage;
  const projectionValue = product.projection || performanceByIntensity[product.intensity].projection;
  const longevityValue = product.longevity || performanceByIntensity[product.intensity].longevity;
  const displayPrice = getProductDisplayPrice(product, selectedVolume);
  const notes = {
    top: product.scent[0] || '—',
    heart: product.scent[1] || '—',
    base: product.scent[2] || '—',
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push(getLoginUrl(`/products/${productId}`));
      return;
    }
    addToCart(product, 1, selectedVolume, displayPrice);
    alert(`${product.name} (${selectedVolume}ml) ditambahkan ke keranjang!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push(getLoginUrl(`/products/${productId}`));
      return;
    }
    localStorage.removeItem('cartPromoCode');
    localStorage.removeItem('checkoutSource');

    // Store only this specific item for checkout
    const tempCheckoutItem = {
      product,
      selectedVolume,
      selectedPrice: displayPrice,
      quantity: 1,
      isDecant: false
    };
    localStorage.setItem('checkoutItems', JSON.stringify([tempCheckoutItem]));

    addToCart(product, 1, selectedVolume, displayPrice);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1">
        {/* Primary product */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[640px] bg-stone-900 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in"
              />
              {product.isBestseller && (
                <span className="absolute top-4 left-4 bg-[#F9F7F2]/90 text-[#4A3728] text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                  Bestseller
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center lg:py-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1">
                {product.brand}
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-3">
                {intensityLabels[product.intensity]}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-[#4A3728] mb-5 leading-tight">
                {product.name}
              </h1>
              <p className="text-stone-600 leading-relaxed mb-8 max-w-md text-[15px]">
                {product.description}
              </p>

              {/* Olfactory architecture */}
              <div className="bg-[#EDEAE4] rounded-sm p-6 mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-5">
                  Olfactory Architecture
                </p>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex gap-6">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 w-12">
                      Top
                    </span>
                    <span className="text-[#4A3728]">{notes.top}</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 w-12">
                      Heart
                    </span>
                    <span className="text-[#4A3728] italic">{notes.heart}</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 w-12">
                      Base
                    </span>
                    <span className="text-[#4A3728]">{notes.base}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  {/* Sillage */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border border-stone-300/80 bg-[#F9F7F2]/50 text-center px-1">
                    <span className="text-[11px] font-semibold leading-tight truncate w-full" title={sillageValue}>{sillageValue}</span>
                    <span className="text-[8px] uppercase tracking-wider text-stone-500 mt-0.5">
                      Sillage
                    </span>
                  </div>
                  {/* Projection */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border border-stone-300/80 bg-[#F9F7F2]/50 text-center px-1">
                    <span className="text-[11px] font-semibold leading-tight truncate w-full" title={projectionValue}>{projectionValue}</span>
                    <span className="text-[8px] uppercase tracking-wider text-stone-500 mt-0.5">
                      Projection
                    </span>
                  </div>
                  {/* Longevity */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border border-stone-300/80 bg-[#F9F7F2]/50 text-center px-1">
                    <span className="text-[11px] font-semibold leading-tight truncate w-full" title={longevityValue}>{longevityValue}</span>
                    <span className="text-[8px] uppercase tracking-wider text-stone-500 mt-0.5">
                      Longevity
                    </span>
                  </div>
                </div>
              </div>

              {/* Volume */}
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3">
                  Select Volume
                </p>
                <div className="flex gap-3">
                  {volumeOptions.map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setSelectedVolume(vol)}
                      className={`px-6 py-2 text-xs uppercase tracking-[0.15em] rounded-full border transition cursor-pointer ${
                        selectedVolume === vol
                          ? 'border-[#4A3728] text-[#4A3728] bg-transparent'
                          : 'border-stone-300 text-stone-500 hover:border-[#8C7355]'
                      }`}
                    >
                      {vol}ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Sisa Stok Indicator */}
              <div className="mb-6 flex items-center gap-2 bg-[#EDEAE4]/30 px-4 py-2.5 rounded-sm self-start border border-[#E7E5E0]/60">
                <span className={`w-2 h-2 rounded-full ${
                  !product.inStock || (product.stock !== undefined && product.stock <= 0)
                    ? 'bg-[#8D4F38]'
                    : (product.stock !== undefined && product.stock <= 5)
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-emerald-600'
                }`} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-600">
                  {!product.inStock || (product.stock !== undefined && product.stock <= 0)
                    ? 'Habis Terjual'
                    : (product.stock !== undefined && product.stock <= 5)
                      ? `Stok Terbatas: Sisa ${product.stock} botol`
                      : `Sisa Stok: ${product.stock ?? 10} botol`
                  }
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || (product.stock !== undefined && product.stock <= 0)}
                  className="flex-1 py-4 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#8C7355] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
                >
                  Add to Bag
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.inStock || (product.stock !== undefined && product.stock <= 0)}
                  className="flex-1 py-4 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#7a4532] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold"
                >
                  Buy Now — {formatPrice(displayPrice)}
                </button>
              </div>

              {/* Accordions */}
              <div>
                <AccordionItem title="Ingredient Transparency">
                  {product.name} features {product.scent.join(', ') || 'carefully selected notes'}{' '}
                  — ethically sourced and free from phthalates and parabens.
                </AccordionItem>
                <AccordionItem title="Sustainable Packaging">
                  Bottles are refillable and housed in FSC-certified paper. We offset carbon for
                  every shipment and use recyclable protective materials.
                </AccordionItem>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CatalogFooter variant="product" />
    </div>
  );
}
