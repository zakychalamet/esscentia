'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/products';
import { Trash2, Plus, Search, Edit, RefreshCw, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { canManageProducts, canDeleteProducts } from '@/lib/admin-permissions';
import { FRAGRANCE_FAMILIES } from '@/lib/fragrance-families';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const canAdd = canManageProducts(user?.role);
  const canDelete = canDeleteProducts(user?.role);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'male' | 'female' | 'unisex'>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [filterBestseller, setFilterBestseller] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedFamily, filterBestseller]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Format data produk tidak valid');
      }
      setAllProducts(
        data.map((p: Product) => ({
          ...p,
          id: String(p.id),
          inStock: Boolean(p.inStock),
          isBestseller: Boolean(p.isBestseller),
          scent: Array.isArray(p.scent) ? p.scent : [],
          volume_prices: Array.isArray(p.volume_prices) ? p.volume_prices : [],
        }))
      );
    } catch (error) {
      console.error('Gagal mengambil produk:', error);
      alert('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Gagal menghapus produk');
        }

        alert('Produk berhasil dihapus!');
        await fetchProducts();
      } catch (error) {
        console.error('Error:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const filtered = allProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesFamily = selectedFamily === 'all' || p.family === selectedFamily;
    const matchesBestseller = !filterBestseller || p.isBestseller;
    return matchesSearch && matchesCategory && matchesFamily && matchesBestseller;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-white border border-[#E7E5E0] p-6 rounded-lg shadow-xs">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3728] mb-1">Manajemen Koleksi</h1>
          <p className="text-stone-500 text-sm font-light">Kelola katalog parfum mewah dan kapasitas varian Esscentia</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="p-2.5 border border-stone-200 rounded-md hover:bg-stone-50 transition text-stone-500 flex items-center justify-center gap-2 text-xs font-medium"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {canAdd && (
            <Button
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center gap-2 bg-[#4A3728] text-white hover:bg-[#8C7355] text-xs uppercase tracking-wider font-semibold py-2.5 px-4"
            >
              <Plus size={16} /> Tambah Parfum
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Directory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-[#E7E5E0] rounded-lg shadow-xs space-y-1 relative overflow-hidden group hover:border-[#8C7355]/40 transition duration-300">
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.25em] mb-1 font-medium">Total Koleksi</p>
          <p className="text-3xl font-serif font-bold text-[#4A3728]">{allProducts.length}</p>
        </div>
        <div className="bg-white p-6 border border-[#E7E5E0] rounded-lg shadow-xs space-y-1 relative overflow-hidden group hover:border-[#8C7355]/40 transition duration-300">
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.25em] mb-1 font-medium">Parfum Tersedia</p>
          <p className="text-3xl font-serif font-bold text-[#6B8F71]">
            {allProducts.filter((p) => p.inStock).length}
          </p>
        </div>
        <div className="bg-white p-6 border border-[#E7E5E0] rounded-lg shadow-xs space-y-1 relative overflow-hidden group hover:border-[#8C7355]/40 transition duration-300">
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.25em] mb-1 font-medium">Stok Habis</p>
          <p className="text-3xl font-serif font-bold text-[#8D4F38]">
            {allProducts.filter((p) => !p.inStock).length}
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-[#E7E5E0] p-6 rounded-lg shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search bar */}
          <div className="flex-1 max-w-lg">
            <Input
              placeholder="Cari parfum berdasarkan nama atau brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
            />
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex bg-stone-50 p-1 border border-stone-200 rounded-md self-start lg:self-auto gap-1">
            {([
              { id: 'all', label: 'Semua Kategori' },
              { id: 'male', label: 'Pria' },
              { id: 'female', label: 'Wanita' },
              { id: 'unisex', label: 'Unisex' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider transition rounded-sm cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#4A3728] text-white font-bold shadow-xs'
                    : 'text-stone-500 hover:text-[#4A3728]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-stone-100">
          {/* Scent Family Filter */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Keluarga Aroma:</span>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="bg-white border border-[#E7E5E0] text-xs px-3 py-2 rounded-md text-stone-700 font-medium focus:outline-none focus:border-[#8C7355] cursor-pointer"
            >
              <option value="all">Semua Scent Family</option>
              {FRAGRANCE_FAMILIES.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
          </div>

          {/* Bestseller Filter Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={filterBestseller}
              onChange={(e) => setFilterBestseller(e.target.checked)}
              className="w-4 h-4 accent-[#4A3728] cursor-pointer rounded border-[#E7E5E0]"
            />
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 group-hover:text-[#4A3728] transition font-bold">
              Hanya Produk Bestseller
            </span>
          </label>

          {/* Reset Filters Button */}
          {(searchTerm || selectedCategory !== 'all' || selectedFamily !== 'all' || filterBestseller) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedFamily('all');
                setFilterBestseller(false);
              }}
              className="ml-auto text-[10px] uppercase tracking-[0.2em] text-[#8D4F38] hover:text-[#4A3728] transition cursor-pointer font-bold flex items-center gap-1.5"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <div className="py-20 text-center text-stone-500">
          <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Memuat data koleksi…
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xs border border-[#E7E5E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr className="text-stone-500 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="text-left py-4 px-5">Parfum</th>
                  <th className="text-left py-4 px-5">Brand</th>
                  <th className="text-left py-4 px-5">Kapasitas (Varian)</th>
                  <th className="text-left py-4 px-5 whitespace-nowrap">Harga</th>
                  <th className="text-left py-4 px-5">Intensity</th>
                  <th className="text-left py-4 px-5">Stok</th>
                  <th className="text-left py-4 px-5">Status</th>
                  <th className="text-center py-4 px-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => {
                    const priceList = Array.isArray(product.volume_prices) && product.volume_prices.length > 0
                      ? product.volume_prices
                      : [{ volume: product.volume, price: product.price }];
                    const minPrice = Math.min(...priceList.map((v) => v.price));

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-stone-50/50 transition cursor-pointer"
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-11 object-cover rounded bg-[#EDEAE4] border border-stone-200/40 shrink-0"
                            />
                            <div>
                              <span className="font-semibold block text-[#4A3728] line-clamp-1">{product.name}</span>
                              <span className="text-[9px] text-stone-400 font-mono tracking-tight">
                                {product.scent.slice(0, 3).join(' · ') || '—'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-[#4A3728] font-medium">{product.brand}</td>
                        <td className="py-4 px-5">
                          <div className="flex gap-1.5 flex-wrap">
                            {priceList.map((vp, i) => (
                              <span
                                key={i}
                                className="text-[9px] font-bold bg-amber-50 text-[#8C7355] border border-[#8C7355]/20 px-2 py-0.5 rounded-full uppercase tracking-wider"
                              >
                                {vp.volume}ml
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-5 font-mono text-[#8D4F38] font-semibold whitespace-nowrap">
                          {formatPrice(minPrice)}
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-block bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {product.intensity}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-[#4A3728] font-medium font-mono text-xs">
                          {product.stock !== undefined ? `${product.stock} pcs` : '10 pcs'}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                              product.inStock && (product.stock === undefined || product.stock > 0)
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                : 'bg-red-50 text-[#8D4F38] border-red-200/50'
                            }`}
                          >
                            {product.inStock && (product.stock === undefined || product.stock > 0) ? 'Tersedia' : 'Habis'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1.5 justify-center">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-1.5 hover:bg-[#EFEFE9] rounded text-[#8C7355] transition inline-flex items-center"
                              aria-label={canAdd ? "Edit Produk" : "Lihat Rincian"}
                            >
                              {canAdd ? <Edit size={16} /> : <Eye size={16} />}
                            </Link>
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1.5 hover:bg-red-50 rounded text-[#8D4F38] transition cursor-pointer"
                                aria-label="Hapus Produk"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-stone-400 font-light">
                      Belum ada parfum yang sesuai atau terdaftar di katalog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-stone-50/40 px-5 py-4 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500 font-light">
                Menampilkan <span className="font-semibold">{Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}</span> sampai <span className="font-semibold">{Math.min(filtered.length, currentPage * itemsPerPage)}</span> dari <span className="font-semibold">{filtered.length}</span> parfum
              </div>
              <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-w-full">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 transition text-xs font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-white"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border text-xs font-bold rounded transition cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#4A3728] text-white border-[#4A3728]'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-stone-200 rounded text-stone-600 hover:bg-stone-50 transition text-xs font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-white"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
