'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Search, Edit, RefreshCw, X, Droplet } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { canManageProducts, canDeleteProducts } from '@/lib/admin-permissions';
import { Product } from '@/lib/products';
import { Decant } from '@/lib/decant-db';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

type DecantWithProduct = Decant & { product: Product };

function formatPrice(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDecantsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const canManage = canManageProducts(user?.role);
  const canDelete = canDeleteProducts(user?.role);

  const [decants, setDecants] = useState<DecantWithProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDecant, setEditingDecant] = useState<DecantWithProduct | null>(null);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [price1ml, setPrice1ml] = useState('0');
  const [price2ml, setPrice2ml] = useState('0');
  const [price5ml, setPrice5ml] = useState('0');
  const [price10ml, setPrice10ml] = useState('0');
  
  const [inStock1ml, setInStock1ml] = useState(true);
  const [inStock2ml, setInStock2ml] = useState(true);
  const [inStock5ml, setInStock5ml] = useState(true);
  const [inStock10ml, setInStock10ml] = useState(true);

  const [stock1ml, setStock1ml] = useState('10');
  const [stock2ml, setStock2ml] = useState('10');
  const [stock5ml, setStock5ml] = useState('10');
  const [stock10ml, setStock10ml] = useState('10');
  
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch decants
      const decantRes = await fetch('/api/decants');
      const decantData = await decantRes.json();
      if (Array.isArray(decantData)) {
        setDecants(decantData);
      }

      // Fetch all products to populate dropdown
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (Array.isArray(prodData)) {
        setProducts(prodData);
      }
    } catch (e) {
      console.error('Failed to load decant data:', e);
      alert('Gagal memuat data decant');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!canDelete) {
      alert('Anda tidak memiliki hak akses untuk menghapus decant');
      return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus decant untuk produk ini?')) {
      try {
        const res = await fetch(`/api/decants/${productId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('Decant berhasil dihapus');
          fetchData();
        } else {
          const errData = await res.json();
          alert(errData.error || 'Gagal menghapus decant');
        }
      } catch (e) {
        console.error('Failed to delete decant:', e);
        alert('Gagal menghapus decant');
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingDecant(null);
    setSelectedProductId('');
    setPrice1ml('10000');
    setPrice2ml('18000');
    setPrice5ml('40000');
    setPrice10ml('75000');
    setInStock1ml(true);
    setInStock2ml(true);
    setInStock5ml(true);
    setInStock10ml(true);
    setStock1ml('10');
    setStock2ml('10');
    setStock5ml('10');
    setStock10ml('10');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (decant: DecantWithProduct) => {
    setEditingDecant(decant);
    setSelectedProductId(decant.productId);
    setPrice1ml(String(decant.price1ml));
    setPrice2ml(String(decant.price2ml));
    setPrice5ml(String(decant.price5ml));
    setPrice10ml(String(decant.price10ml));
    setInStock1ml(decant.inStock1ml);
    setInStock2ml(decant.inStock2ml);
    setInStock5ml(decant.inStock5ml);
    setInStock10ml(decant.inStock10ml);
    setStock1ml(String(decant.stock1ml ?? '10'));
    setStock2ml(String(decant.stock2ml ?? '10'));
    setStock5ml(String(decant.stock5ml ?? '10'));
    setStock10ml(String(decant.stock10ml ?? '10'));
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      alert('Anda tidak memiliki hak akses untuk memodifikasi decant');
      return;
    }

    if (!selectedProductId) {
      setFormError('Harap pilih produk terlebih dahulu');
      return;
    }

    if (Number(price1ml) <= 0 || Number(price2ml) <= 0 || Number(price5ml) <= 0 || Number(price10ml) <= 0) {
      setFormError('Harga decant harus lebih besar dari 0');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const res = await fetch('/api/decants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          price1ml: Number(price1ml),
          price2ml: Number(price2ml),
          price5ml: Number(price5ml),
          price10ml: Number(price10ml),
          inStock1ml,
          inStock2ml,
          inStock5ml,
          inStock10ml,
          stock1ml: Number(stock1ml),
          stock2ml: Number(stock2ml),
          stock5ml: Number(stock5ml),
          stock10ml: Number(stock10ml),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Gagal menyimpan decant');
      }
    } catch (err) {
      console.error('Failed to save decant:', err);
      setFormError('Gagal menghubungi server database');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter products that don't have decant configured yet
  const availableProductsForDecant = products.filter((p) => {
    // If editing, allow the currently edited product
    if (editingDecant && p.id === editingDecant.productId) return true;
    // Otherwise, check if it's not already in the decants array
    return !decants.some((d) => d.productId === p.id);
  });

  const filteredDecants = decants.filter((d) => {
    return (
      d.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-white border border-[#E7E5E0] p-6 rounded-lg shadow-xs">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3728] mb-1">Manajemen Decant</h1>
          <p className="text-stone-500 text-sm font-light">Kelola takaran decant parfum (1ml, 2ml, 5ml, 10ml) dan harga detail untuk pelanggan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 border border-stone-200 rounded-md hover:bg-stone-50 transition text-stone-500 flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          {canManage && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-[#4A3728] text-white hover:bg-[#8C7355] transition text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Decant
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex justify-between items-center bg-white border border-[#E7E5E0] p-4 rounded-lg shadow-xs">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Cari decant parfum..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#8C7355] focus:border-[#8C7355] text-[#4A3728]"
          />
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="bg-white border border-[#E7E5E0] rounded-lg p-12 text-center shadow-xs">
          <div className="w-10 h-10 border-2 border-[#8D4F38] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-500 font-serif text-sm">Memuat data decant...</p>
        </div>
      ) : filteredDecants.length === 0 ? (
        <div className="bg-white border border-[#E7E5E0] rounded-lg p-12 text-center shadow-xs text-stone-500">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Droplet size={24} />
          </div>
          <p className="font-serif text-base mb-1">Belum ada decant terdaftar</p>
          <p className="text-xs text-stone-400">Klik "Tambah Decant" di atas untuk menambahkan pengaturan decant baru.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E7E5E0] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Parfum</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Takaran 1ml</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Takaran 2ml</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Takaran 5ml</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Takaran 10ml</th>
                  {canManage && <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">Aksi</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100 text-sm">
                {filteredDecants.map((decant) => (
                  <tr key={decant.id} className="hover:bg-stone-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={decant.product.image}
                          alt={decant.product.name}
                          className="w-12 h-12 object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-serif font-medium text-[#4A3728]">{decant.product.name}</p>
                          <p className="text-xs text-stone-400 uppercase tracking-wider">{decant.product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-stone-800">{formatPrice(decant.price1ml)}</p>
                      <div className="flex flex-col mt-1">
                        <span className={`inline-block text-[10px] px-1.5 py-0.5 font-medium rounded-full self-start ${
                          decant.inStock1ml ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {decant.inStock1ml ? 'Ready' : 'Habis'}
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5">Stok: {decant.stock1ml ?? 10}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-stone-800">{formatPrice(decant.price2ml)}</p>
                      <div className="flex flex-col mt-1">
                        <span className={`inline-block text-[10px] px-1.5 py-0.5 font-medium rounded-full self-start ${
                          decant.inStock2ml ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {decant.inStock2ml ? 'Ready' : 'Habis'}
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5">Stok: {decant.stock2ml ?? 10}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-stone-800">{formatPrice(decant.price5ml)}</p>
                      <div className="flex flex-col mt-1">
                        <span className={`inline-block text-[10px] px-1.5 py-0.5 font-medium rounded-full self-start ${
                          decant.inStock5ml ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {decant.inStock5ml ? 'Ready' : 'Habis'}
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5">Stok: {decant.stock5ml ?? 10}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-stone-800">{formatPrice(decant.price10ml)}</p>
                      <div className="flex flex-col mt-1">
                        <span className={`inline-block text-[10px] px-1.5 py-0.5 font-medium rounded-full self-start ${
                          decant.inStock10ml ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {decant.inStock10ml ? 'Ready' : 'Habis'}
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5">Stok: {decant.stock10ml ?? 10}</span>
                      </div>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                        <button
                          onClick={() => handleOpenEdit(decant)}
                          className="p-1.5 text-stone-500 hover:text-[#8C7355] transition inline-flex items-center gap-1.5 border border-stone-200 bg-white"
                          title="Edit Decant"
                        >
                          <Edit size={14} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(decant.productId)}
                            className="p-1.5 text-stone-400 hover:text-[#8D4F38] transition inline-flex items-center gap-1.5 border border-stone-200 bg-white"
                            title="Hapus Decant"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Decant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E7E5E0] w-full max-w-lg shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-xl font-serif font-bold text-[#4A3728]">
                {editingDecant ? 'Ubah Rincian Decant' : 'Tambah Decant Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="bg-red-50 text-red-700 text-xs px-4 py-3 border border-red-100 rounded-md">
                  {formError}
                </div>
              )}

              {/* Product selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">Parfum Induk</label>
                <select
                  disabled={!!editingDecant}
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#8C7355] focus:border-[#8C7355] text-[#4A3728] bg-stone-50 disabled:bg-stone-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Pilih Parfum Original --</option>
                  {availableProductsForDecant.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </select>
                {editingDecant && (
                  <p className="text-[10px] text-stone-400 mt-1.5">Parfum induk tidak dapat diubah setelah decant terdaftar.</p>
                )}
              </div>

              {/* 1ml & 2ml Pricing/Stock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1ml size */}
                <div className="border border-stone-100 p-4 bg-stone-50/50 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#8C7355] font-bold">Takaran 1 ml</h4>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Harga (IDR)</label>
                    <input
                      type="number"
                      value={price1ml}
                      onChange={(e) => setPrice1ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Jumlah Stok</label>
                    <input
                      type="number"
                      value={stock1ml}
                      onChange={(e) => setStock1ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                      min="0"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock1ml}
                      onChange={(e) => setInStock1ml(e.target.checked)}
                      className="rounded border-stone-300 text-[#4A3728] focus:ring-0"
                    />
                    Stok Tersedia
                  </label>
                </div>

                {/* 2ml size */}
                <div className="border border-stone-100 p-4 bg-stone-50/50 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#8C7355] font-bold">Takaran 2 ml</h4>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Harga (IDR)</label>
                    <input
                      type="number"
                      value={price2ml}
                      onChange={(e) => setPrice2ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Jumlah Stok</label>
                    <input
                      type="number"
                      value={stock2ml}
                      onChange={(e) => setStock2ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                      min="0"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock2ml}
                      onChange={(e) => setInStock2ml(e.target.checked)}
                      className="rounded border-stone-300 text-[#4A3728] focus:ring-0"
                    />
                    Stok Tersedia
                  </label>
                </div>
              </div>

              {/* 5ml & 10ml Pricing/Stock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 5ml size */}
                <div className="border border-stone-100 p-4 bg-stone-50/50 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#8C7355] font-bold">Takaran 5 ml</h4>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Harga (IDR)</label>
                    <input
                      type="number"
                      value={price5ml}
                      onChange={(e) => setPrice5ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Jumlah Stok</label>
                    <input
                      type="number"
                      value={stock5ml}
                      onChange={(e) => setStock5ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                      min="0"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock5ml}
                      onChange={(e) => setInStock5ml(e.target.checked)}
                      className="rounded border-stone-300 text-[#4A3728] focus:ring-0"
                    />
                    Stok Tersedia
                  </label>
                </div>

                {/* 10ml size */}
                <div className="border border-stone-100 p-4 bg-stone-50/50 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#8C7355] font-bold">Takaran 10 ml</h4>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Harga (IDR)</label>
                    <input
                      type="number"
                      value={price10ml}
                      onChange={(e) => setPrice10ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Jumlah Stok</label>
                    <input
                      type="number"
                      value={stock10ml}
                      onChange={(e) => setStock10ml(e.target.value)}
                      className="w-full px-3 py-1.5 border border-stone-200 text-sm focus:outline-none bg-white"
                      min="0"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock10ml}
                      onChange={(e) => setInStock10ml(e.target.checked)}
                      className="rounded border-stone-300 text-[#4A3728] focus:ring-0"
                    />
                    Stok Tersedia
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-stone-200 text-stone-500 hover:bg-stone-50 transition text-xs uppercase tracking-wider font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#4A3728] hover:bg-[#8C7355] text-white transition text-xs uppercase tracking-wider font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Decant'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
