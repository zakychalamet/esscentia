'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { fetchProductById, Product } from '@/lib/products';
import {
  getReviewsForProduct,
  getRatingBreakdown,
  ProductReview,
} from '@/lib/product-reviews';
import { useCart } from '@/lib/cart-context';
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

const storyByFamily: Record<
  Product['family'],
  { title: string; quote: string; image: string }
> = {
  Floral: {
    title: 'A Journey Through Nightfall',
    quote:
      '"Born from the hush between dusk and dawn — where rose absolue meets the warmth of sandalwood, and every breath feels like a secret kept close."',
    image:
      'https://images.unsplash.com/photo-1518895949257-762f457f584f?w=800&h=800&fit=crop',
  },
  Woody: {
    title: 'A Journey Through the Forest',
    quote:
      '"Crafted for those who find poetry in cedar shadows — deep, resinous, and quietly commanding, like twilight beneath ancient trees."',
    image:
      'https://images.unsplash.com/photo-1602928322639-0a6860196d4b?w=800&h=800&fit=crop',
  },
  Citrus: {
    title: 'A Journey at First Light',
    quote:
      '"Sun-warmed bergamot and bright florals unfold like morning mist — luminous, effortless, and impossibly fresh."',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa298bd6c0?w=800&h=800&fit=crop',
  },
  Gourmand: {
    title: 'A Journey by the Hearth',
    quote:
      '"Amber and vanilla weave through the air like candlelight — comforting, indulgent, and unmistakably intimate."',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop',
  },
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

function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5 text-[#8C7355]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
          className={i <= Math.round(rating) ? '' : 'text-stone-300'}
        />
      ))}
    </div>
  );
}

function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stone-200/80">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm text-[#4A3728] hover:text-[#8C7355] transition"
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

function ReviewsSection({
  product,
  reviews,
}: {
  product: Product;
  reviews: ProductReview[];
}) {
  const breakdown = getRatingBreakdown(reviews);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const average =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : product.rating;

  return (
    <section className="py-20 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif text-[#4A3728] mb-2">Customer Reviews</h2>
        <p className="text-sm text-stone-500 mb-12">
          Honest impressions from our fragrance community
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="flex items-end gap-4 mb-4">
              <span className="text-5xl font-serif text-[#4A3728] leading-none">
                {average.toFixed(1)}
              </span>
              <div>
                <StarRating rating={average} size={18} />
                <p className="text-xs text-stone-500 mt-1">
                  Based on {product.reviews} reviews
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-10">
              {breakdown.map(({ stars, percent }) => (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-8 text-stone-500">{stars} ★</span>
                  <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8C7355] rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-stone-400">{percent}%</span>
                </div>
              ))}
            </div>

            <div className="bg-white/60 border border-stone-200/60 p-6">
              <h3 className="text-sm font-medium text-[#4A3728] mb-4">Write a Review</h3>
              {submitted ? (
                <p className="text-sm text-stone-600">
                  Thank you — your review has been submitted for moderation.
                </p>
              ) : (
                <>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewRating(i)}
                        className="text-[#8C7355] hover:scale-110 transition"
                        aria-label={`Rate ${i} stars`}
                      >
                        <Star
                          size={20}
                          fill={i <= newRating ? 'currentColor' : 'none'}
                          className={i <= newRating ? '' : 'text-stone-300'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this scent..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-stone-200 bg-[#F9F7F2] text-[#4A3728] placeholder:text-stone-400 focus:outline-none focus:border-[#8C7355] resize-none mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newComment.trim()) setSubmitted(true);
                    }}
                    className="w-full py-2.5 text-xs uppercase tracking-[0.15em] border border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728] hover:text-[#F9F7F2] transition"
                  >
                    Submit Review
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Review list */}
          <div className="lg:col-span-8 space-y-8">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="pb-8 border-b border-stone-200/60 last:border-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-medium text-[#4A3728]">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#4A3728]">{review.author}</p>
                      <p className="text-xs text-stone-400">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <h4 className="font-serif text-lg text-[#4A3728] mb-2">{review.title}</h4>
                <p className="text-sm text-stone-600 leading-relaxed">{review.body}</p>
                {review.verified && (
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#8C7355] mt-3">
                    Verified Purchase
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchProductById(productId)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const volumeOptions = product ? getVolumeOptions(product) : [50, 100];
  const [selectedVolume, setSelectedVolume] = useState(volumeOptions[0]);

  useEffect(() => {
    if (product) {
      setSelectedVolume(getVolumeOptions(product)[0]);
    }
  }, [product]);

  const reviews = useMemo(
    () => (product ? getReviewsForProduct(product.id) : []),
    [product]
  );

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

  const performance = performanceByIntensity[product.intensity];
  const story = storyByFamily[product.family];
  const displayPrice = priceForVolume(product.price, product.volume, selectedVolume);
  const notes = {
    top: product.scent[0] || '—',
    heart: product.scent[1] || '—',
    base: product.scent[2] || '—',
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert(`${product.name} (${selectedVolume}ml) ditambahkan ke keranjang!`);
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
                className="w-full h-full object-cover"
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
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border border-stone-300/80 bg-[#F9F7F2]/50">
                    <span className="text-sm font-medium">{performance.longevity}</span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5">
                      Longevity
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border border-stone-300/80 bg-[#F9F7F2]/50">
                    <span className="text-sm font-medium">{performance.sillage}</span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-500 mt-0.5">
                      Sillage
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
                      className={`px-6 py-2 text-xs uppercase tracking-[0.15em] rounded-full border transition ${
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

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-4 bg-[#4A3728] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] hover:bg-[#8C7355] transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                Add to Bag — {formatPrice(displayPrice)}
              </button>

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

        {/* Journey section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-square overflow-hidden bg-stone-200">
              <img
                src={story.image}
                alt="Raw fragrance ingredients"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#4A3728] mb-8">
                {story.title}
              </h2>
              <blockquote className="text-stone-600 leading-relaxed italic mb-12 text-[15px] border-l-2 border-[#8C7355]/40 pl-6">
                {story.quote}
              </blockquote>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-stone-200/80">
                <div>
                  <p className="text-2xl font-serif text-[#4A3728] mb-1">
                    {performance.natural}
                  </p>
                  <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                    Natural sourced
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-serif text-[#4A3728] mb-1">
                    {performance.projection}
                  </p>
                  <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                    Avg. Projection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <ReviewsSection product={product} reviews={reviews} />
      </main>

      <CatalogFooter variant="product" />
    </div>
  );
}
