'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(console.error);
  }, []);

  const bestsellerProducts = getSuggestedProducts(allProducts, 4);
  const collections = [
    {
      id: 1,
      title: 'Saptians Saga',
      image: 'https://images.unsplash.com/photo-1596081223915-b4dc8b5a0b19?w=500&h=500&fit=crop',
      span: 'col-span-1 row-span-2',
    },
    {
      id: 2,
      title: 'The Botanical Life',
      image: 'https://images.unsplash.com/photo-1610710506818-403649c9b7e7?w=500&h=300&fit=crop',
      span: 'col-span-1',
    },
    {
      id: 3,
      title: 'Herbal Scent',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=300&fit=crop',
      span: 'col-span-1',
    },
    {
      id: 4,
      title: 'Sunset Bliss',
      image: 'https://images.unsplash.com/photo-1574058652419-d8bdf8e6a3ae?w=500&h=300&fit=crop',
      span: 'col-span-1',
    },
    {
      id: 5,
      title: 'Natural Essence',
      image: 'https://images.unsplash.com/photo-1608168895822-f1bd922bb235?w=500&h=300&fit=crop',
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
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop"
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
                <div 
                  key={collection.id} 
                  className={`${collection.span} relative group overflow-hidden rounded-lg`}
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-6">
                    <h3 className="text-white text-lg font-serif">{collection.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-serif text-stone-900 text-center mb-16">Bestsellers</h2>
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
                    <p className="text-sm text-gray-600">⭐ {product.rating}</p>
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
                  src="https://images.unsplash.com/photo-1608168895822-f1bd922bb235?w=600&h=600&fit=crop"
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
        <footer className="bg-stone-900 text-stone-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                <h3 className="text-2xl font-serif mb-4">Esscentia</h3>
                <p className="text-sm text-stone-400">A curation of artisanal fragrances for the modern luxe space.</p>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest mb-4 font-semibold">Shop</h4>
                <ul className="space-y-2 text-sm text-stone-400">
                  <li><Link href="/products" className="hover:text-stone-200">All Products</Link></li>
                  <li><Link href="/products" className="hover:text-stone-200">New Arrivals</Link></li>
                  <li><Link href="/products" className="hover:text-stone-200">Gift Sets</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest mb-4 font-semibold">Assistance</h4>
                <ul className="space-y-2 text-sm text-stone-400">
                  <li><Link href="/contact" className="hover:text-stone-200">Contact Us</Link></li>
                  <li><Link href="/faq" className="hover:text-stone-200">FAQs</Link></li>
                  <li><Link href="/privacy" className="hover:text-stone-200">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm uppercase tracking-widest mb-4 font-semibold">Connect</h4>
                <div className="flex space-x-4 text-sm text-stone-400">
                  <a href="#" className="hover:text-stone-200">Instagram</a>
                  <a href="#" className="hover:text-stone-200">Facebook</a>
                  <a href="#" className="hover:text-stone-200">Twitter</a>
                </div>
              </div>
            </div>
            <div className="border-t border-stone-800 pt-8 text-center text-sm text-stone-400">
              <p>© 2024 Esscentia. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
