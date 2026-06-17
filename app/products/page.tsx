'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Minus,
  Plus,
  TreePine,
  Flower2,
  Citrus,
  Wind,
  Flame,
  Cake,
  Leaf,
  Briefcase,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';
import {
  Product,
  fetchProducts,
  searchProductsInList,
} from '@/lib/products';
import {
  FRAGRANCE_FAMILIES,
  getFragranceFamilyTag,
  isFragranceFamily,
  type FragranceFamily,
} from '@/lib/fragrance-families';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

const ITEMS_PER_PAGE = 12;

const familyConfig: Record<
  FragranceFamily,
  { label: string; icon: typeof TreePine; tag: string }
> = {
  Woody: { label: 'Woody', icon: TreePine, tag: 'WOODY & SPICED' },
  Floral: { label: 'Floral', icon: Flower2, tag: 'FLORAL' },
  Citrus: { label: 'Citrus', icon: Citrus, tag: 'CITRUS' },
  Fresh: { label: 'Fresh', icon: Wind, tag: 'FRESH & AQUATIC' },
  Amber: { label: 'Amber', icon: Flame, tag: 'AMBER & WARM' },
  Vanilla: { label: 'Vanilla', icon: Cake, tag: 'VANILLA' },
  Aromatic: { label: 'Aromatic', icon: Leaf, tag: 'AROMATIC & HERBAL' },
  Leather: { label: 'Leather', icon: Briefcase, tag: 'LEATHER & SMOKY' },
};

const intensityLabels: Record<Product['intensity'], string> = {
  EDT: 'Eau de Toilette',
  EDP: 'Eau de Parfum',
  EXTRAIT: 'Extrait de Parfum',
};

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
] as const;

type SortValue = (typeof sortOptions)[number]['value'];

const getAllBrands = (list: Product[]) => {
  const uniqueBrands = Array.from(new Set(list.map((p) => p.brand)));
  return uniqueBrands.sort();
};

function getFamilyTag(product: Product): string {
  return getFragranceFamilyTag(product.family);
}

function CatalogProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-stone-100 mb-5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {product.isBestseller && (
          <span className="absolute top-3 right-3 bg-[#4A3728] text-[#F9F7F2] text-[10px] uppercase tracking-[0.15em] px-2.5 py-1">
            Bestseller
          </span>
        )}
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">
        {getFamilyTag(product)}
      </p>
      <div className="grid grid-cols-[85%_15%] items-center mb-1 gap-2">
        <h3 className="text-xl font-serif text-[#4A3728] group-hover:text-[#8C7355] transition-colors truncate" title={product.name}>
          {product.name}
        </h3>
        <div className="text-right whitespace-nowrap">
          {product.stock !== undefined ? (
            product.stock <= 0 ? (
              <span className="inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border border-[#8D4F38]/20 text-[#8D4F38] bg-[#8D4F38]/5">
                Habis
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border border-amber-500/20 text-amber-600 bg-amber-50/50 animate-pulse">
                Sisa {product.stock}
              </span>
            ) : (
              <span className="inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border border-[#8C7355]/20 text-[#8C7355] bg-stone-50">
                Sisa {product.stock}
              </span>
            )
          ) : (
            <span className="inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border border-[#8C7355]/20 text-[#8C7355] bg-stone-50">
              Sisa 10
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-stone-500">{intensityLabels[product.intensity]}</p>
    </Link>
  );
}

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const familyParam = searchParams.get('family');
  const queryParam = searchParams.get('q') ?? '';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [expandedFamily, setExpandedFamily] = useState<string | null>(
    isFragranceFamily(familyParam) ? familyParam : null
  );
  const [selectedFamily, setSelectedFamily] = useState<string | null>(
    isFragranceFamily(familyParam) ? familyParam : null
  );
  const [selectedIntensity, setSelectedIntensity] = useState<Product['intensity'] | null>(null);
  const [selectedGender, setSelectedGender] = useState<Product['category'] | null>(null);
  const [sortBy, setSortBy] = useState<SortValue>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(queryParam);
    setCurrentPage(1);
  }, [queryParam]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery.trim()) {
      const ids = new Set(searchProductsInList(searchQuery, allProducts).map((p) => p.id));
      result = result.filter((p) => ids.has(p.id));
    }

    if (selectedFamily) {
      result = result.filter((p) => p.family === selectedFamily);
    }
    if (selectedIntensity) {
      result = result.filter((p) => p.intensity === selectedIntensity);
    }
    if (selectedGender) {
      result = result.filter((p) => p.category === selectedGender);
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [allProducts, selectedFamily, selectedIntensity, selectedGender, sortBy, searchQuery, selectedBrand]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safePage]);

  const pageNumbers = buildPageNumbers(safePage, totalPages);

  const toggleFamily = (family: FragranceFamily) => {
    setSelectedFamily((prev) => (prev === family ? null : family));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb & hero */}
        <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-6">
          Collection / All Fragrances
        </p>
        <div className="mb-14 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A3728] mb-5 leading-tight">
            Koleksi Parfum Premium
          </h1>
          <p className="text-stone-600 leading-relaxed text-[15px]">
            {searchQuery.trim()
              ? `Menampilkan hasil pencarian untuk “${searchQuery.trim()}”.`
              : 'Jelajahi pilihan parfum mewah desainer dan niche ternama 100% original. Dapatkan botol penuh atau coba variasi aroma dengan botol decant.'}
          </p>
          {searchQuery.trim() && (
            <Link
              href="/products"
              className="inline-block mt-4 text-xs uppercase tracking-wider text-[#8D4F38] hover:underline"
            >
              Hapus pencarian
            </Link>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Sidebar filters */}
          <aside className="lg:w-56 shrink-0">
            <h2 className="text-sm font-medium text-[#4A3728] mb-0.5">Filters</h2>
            <p className="text-xs text-stone-500 mb-8">Refine your selection</p>

            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">
                Fragrance Families
              </p>
              <ul className="space-y-1">
                {FRAGRANCE_FAMILIES.map((family) => {
                  const { label, icon: Icon } = familyConfig[family];
                  const isExpanded = expandedFamily === family;
                  const isActive = selectedFamily === family;

                  return (
                    <li key={family}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFamily(isExpanded ? null : family)
                          }
                          className="p-1 text-stone-500 hover:text-[#4A3728]"
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <Minus size={14} strokeWidth={1.5} />
                          ) : (
                            <Plus size={14} strokeWidth={1.5} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFamily(family)}
                          className={`flex items-center gap-2 flex-1 py-2 text-sm transition ${
                            isActive
                              ? 'text-[#4A3728] font-medium border-l-2 border-[#4A3728] pl-3 -ml-1'
                              : 'text-stone-600 hover:text-[#4A3728] pl-1'
                          }`}
                        >
                          <Icon size={16} strokeWidth={1.5} className="text-stone-400" />
                          {label}
                        </button>
                      </div>
                      {isExpanded && (
                        <p className="text-xs text-stone-400 pl-8 pb-2 ml-1">
                          {familyConfig[family].tag}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">
                Intensity
              </p>
              <div className="flex flex-wrap gap-2">
                {(['EDT', 'EDP', 'EXTRAIT'] as const).map((intensity) => (
                  <button
                    key={intensity}
                    type="button"
                    onClick={() => {
                      setSelectedIntensity((prev) =>
                        prev === intensity ? null : intensity
                      );
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-full border transition ${
                      selectedIntensity === intensity
                        ? 'bg-[#4A3728] text-[#F9F7F2] border-[#4A3728]'
                        : 'border-stone-300 text-stone-600 hover:border-[#8C7355]'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">
                Gender
              </p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'male', label: 'Pria' },
                  { value: 'female', label: 'Wanita' },
                  { value: 'unisex', label: 'Unisex' },
                ] as const).map((gender) => (
                  <button
                    key={gender.value}
                    type="button"
                    onClick={() => {
                      setSelectedGender((prev) =>
                        prev === gender.value ? null : gender.value
                      );
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-full border transition ${
                      selectedGender === gender.value
                        ? 'bg-[#4A3728] text-[#F9F7F2] border-[#4A3728]'
                        : 'border-stone-300 text-stone-600 hover:border-[#8C7355]'
                    }`}
                  >
                    {gender.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">
                Brand / Merek
              </p>
              <div className="relative mb-3">
                <div className="flex items-center gap-2 border border-stone-300 rounded px-3 py-2 focus-within:border-[#4A3728] transition">
                  <Search size={14} className="text-stone-400" />
                  <input
                    type="text"
                    placeholder="Cari merek..."
                    value={brandSearchQuery}
                    onChange={(e) => setBrandSearchQuery(e.target.value)}
                    className="flex-1 text-xs bg-transparent outline-none text-[#4A3728] placeholder-stone-400"
                  />
                  {brandSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBrandSearchQuery('')}
                      className="text-stone-400 hover:text-[#4A3728] transition"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {getAllBrands(allProducts)
                  .filter((brand) =>
                    brand
                      .toLowerCase()
                      .includes(brandSearchQuery.toLowerCase())
                  )
                  .map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrand === brand}
                        onChange={() => {
                          setSelectedBrand((prev) => (prev === brand ? null : brand));
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 accent-[#4A3728] cursor-pointer"
                      />
                      <span className="text-xs text-stone-600 group-hover:text-[#4A3728] transition">
                        {brand}
                      </span>
                      <span className="text-xs text-stone-400 ml-auto">
                        ({allProducts.filter((p) => p.brand === brand).length})
                      </span>
                    </label>
                  ))}
              </div>
              {selectedBrand && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand(null);
                    setBrandSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="mt-3 text-xs text-[#8D4F38] hover:underline"
                >
                  Hapus filter merek
                </button>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-200/80">
              <p className="text-sm text-stone-600">
                Menampilkan{' '}
                <span className="text-[#4A3728]">{paginatedProducts.length}</span> dari{' '}
                <span className="text-[#4A3728]">{filteredProducts.length}</span> parfum
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-500">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortValue);
                    setCurrentPage(1);
                  }}
                  className="text-sm text-[#4A3728] bg-transparent border-b border-stone-300 pb-1 pr-6 focus:outline-none focus:border-[#4A3728] cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center text-stone-500 text-sm">
                Memuat koleksi parfum…
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="py-24 text-center text-stone-500">
                <p className="font-serif text-xl text-[#4A3728] mb-2">No scents found</p>
                <p className="text-sm">Try adjusting your filters to discover more fragrances.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-14">
                {paginatedProducts.map((product) => (
                  <CatalogProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-6 mt-16 pt-8 text-xs uppercase tracking-[0.15em] text-stone-500"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="hover:text-[#4A3728] disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <div className="flex items-center gap-5">
                  {pageNumbers.map((page, i) =>
                    page === 'ellipsis' ? (
                      <span key={`e-${i}`}>…</span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[1.5rem] transition ${
                          safePage === page
                            ? 'text-[#4A3728] border-b border-[#4A3728] pb-0.5'
                            : 'hover:text-[#4A3728]'
                        }`}
                      >
                        {String(page).padStart(2, '0')}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="flex items-center gap-1 hover:text-[#4A3728] disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Next <ChevronRight size={14} />
                </button>
              </nav>
            )}
          </div>
        </div>
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center text-stone-500 text-sm">
          Memuat koleksi…
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
