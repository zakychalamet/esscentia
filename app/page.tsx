'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts, Product, getSuggestedProducts } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getLoginUrl } from '@/lib/auth-guard';
import { Button } from '@/components/Button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CatalogNav } from '@/components/CatalogChrome';

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [bestsellerGender, setBestsellerGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(console.error);
  }, []);

  const bestsellerProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.category === bestsellerGender && p.isBestseller)
      .sort((a, b) => Number(a.id) - Number(b.id))
      .slice(0, 4);
  }, [allProducts, bestsellerGender]);
  const collections = [
    {
      id: 1,
      title: 'Creed',
      image: '/images/creed.png',
      span: 'col-span-1 row-span-2',
    },
    {
      id: 2,
      title: 'Louis Vuitton',
      image: '/images/lv.png',
      span: 'col-span-1',
    },
    {
      id: 3,
      title: 'Yves Saint Laurent',
      image: '/images/ysl.png',
      span: 'col-span-1',
    },
    {
      id: 4,
      title: 'Chanel',
      image: '/images/chanel.png',
      span: 'col-span-1',
    },
    {
      id: 5,
      title: 'Jean Paul Gaultier',
      image: '/images/jpg.png',
      span: 'col-span-1',
    },
  ];

  return (
    <>
      <CatalogNav />

      <div className="flex-1 bg-[#F9F7F2]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-stone-50 to-stone-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm text-amber-900 uppercase tracking-widest mb-4">Artisanal Fragrance</p>
                <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-4">
                  Quiet Luxury,
                </h1>
                <h1 className="text-5xl md:text-6xl font-serif text-amber-800 mb-6">
                  Olfactory Poetry.
                </h1>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Discover curated scents that linger in memory. Handcrafted & small-batches using sustainably sourced botanical essences.
                </p>
                <Link href="/products">
                  <button className="px-8 py-3 bg-amber-800 text-white text-sm uppercase tracking-widest hover:bg-amber-900 transition">
                    Discover Your Scent
                  </button>
                </Link>
              </div>
              <div className="relative h-96 md:h-full">
                <img
                  src="/images/hero-perfume.jpg"
                  alt="Premium Perfume"
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-serif text-stone-900">Featured Collections</h2>
              <Link href="/products" className="text-sm text-amber-900 hover:text-amber-800 uppercase tracking-widest flex items-center gap-2">
                View All Collections <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {collections.map((collection) => (
                <Link 
                  href={`/products?q=${encodeURIComponent(collection.title)}`}
                  key={collection.id} 
                  className={`${collection.span} relative group overflow-hidden rounded-lg block`}
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-6">
                    <h3 className="text-white text-lg font-serif">{collection.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-serif text-stone-900 text-center mb-6">Bestsellers</h2>
            
            {/* Gender Switch Tabs */}
            <div className="flex justify-center gap-6 mb-12 border-b border-stone-200 pb-3 max-w-xs mx-auto">
              {([
                { id: 'male', label: 'Parfum Pria' },
                { id: 'female', label: 'Parfum Wanita' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBestsellerGender(tab.id)}
                  className={`text-xs tracking-widest uppercase pb-2 transition cursor-pointer font-serif ${
                    bestsellerGender === tab.id
                      ? 'text-amber-800 font-bold border-b-2 border-amber-800'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestsellerProducts.map((product) => (
                <div key={product.id} className="bg-white p-6 rounded-lg hover:shadow-lg transition">
                  <Link href={`/products/${product.id}`} className="block mb-4 h-48 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </Link>
                  <p className="text-xs text-amber-900 uppercase tracking-widest mb-2">{product.brand}</p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-serif text-stone-900 mb-2 hover:text-amber-800 transition">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-amber-900 font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) {
                        router.push(getLoginUrl('/'));
                        return;
                      }
                      addToCart(product, 1);
                      alert(`${product.name} ditambahkan ke keranjang!`);
                    }}
                    className="w-full mt-4 py-2 border border-amber-900 text-amber-900 text-sm uppercase tracking-widest hover:bg-amber-900 hover:text-white transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Art of Scent */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="h-96">
                <img
                  src="/images/art-of-scent.jpg"
                  alt="The Art of Scent"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-xs text-amber-900 uppercase tracking-widest mb-4">Our Philosophy</p>
                <h2 className="text-4xl font-serif text-stone-900 mb-8">The Art of Scent</h2>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  At Esscentia, we believe a fragrance is more than a product. It is an invisible thread that connects you to your most cherished memories. Our master perfumers blend ancient traditions with modern creativity.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-amber-900 font-semibold mb-2">Sustainably Sourced</h3>
                    <p className="text-sm text-gray-600">Ethically harvested ingredients from global partners</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-amber-900 font-semibold mb-2">Small Batches</h3>
                    <p className="text-sm text-gray-600">Hand crafted in limited quantities</p>
                  </div>
                </div>
                <Link href="/about">
                  <button className="mt-8 px-8 py-3 bg-amber-800 text-white text-sm uppercase tracking-widest hover:bg-amber-900 transition">
                    Read Our Stories
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-stone-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Stay in the Note</h2>
            <p className="text-gray-700 mb-8">
              Join our community to receive early access to new collections, exclusive events and insider offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-amber-900"
              />
              <button className="px-8 py-3 bg-amber-800 text-white text-sm uppercase tracking-widest hover:bg-amber-900 transition">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#E8E6E1] text-[#4A3728] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="border-t border-stone-300/60 pt-8 text-center text-xs text-stone-500 tracking-wide">
              <p>© 2024 Esscentia. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
