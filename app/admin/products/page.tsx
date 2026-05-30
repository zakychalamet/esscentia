'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/products';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { canManageProducts, canDeleteProducts } from '@/lib/admin-permissions';

interface FormData {
  name: string;
  brand: string;
  price: number | '';
  category: 'male' | 'female' | 'unisex';
  family: 'Woody' | 'Floral' | 'Citrus' | 'Gourmand';
  intensity: 'EDT' | 'EDP' | 'EXTRAIT';
  volume: number | '';
  rating: number | '';
  reviews: number | '';
  image: string;
  description: string;
  inStock: boolean;
  isBestseller: boolean;
}

const emptyForm: FormData = {
  name: '',
  brand: '',
  price: '',
  category: 'unisex',
  family: 'Woody',
  intensity: 'EDP',
  volume: '',
  rating: '',
  reviews: '',
  image: '',
  description: '',
  inStock: true,
  isBestseller: false,
};

export default function AdminProductsPage() {
  const { user } = useAuth();
  const canAdd = canManageProducts(user?.role);
  const canDelete = canDeleteProducts(user?.role);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setAllProducts(
        data.map((p: any) => ({
          ...p,
          id: String(p.id),
          inStock: Boolean(p.inStock),
          isBestseller: Boolean(p.isBestseller),
        }))
      );
    } catch (error) {
      console.error('Gagal mengambil produk:', error);
      alert('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : ['price', 'volume', 'rating', 'reviews'].includes(name)
        ? value === ''
          ? ''
          : Number(value)
        : value,
    }));
  };

  const handleSaveProduct = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Nama produk harus diisi!');
      return;
    }
    if (!formData.brand.trim()) {
      alert('Brand harus diisi!');
      return;
    }
    if (formData.price === '' || formData.price < 0) {
      alert('Harga harus diisi dengan benar!');
      return;
    }
    if (formData.volume === '' || formData.volume < 0) {
      alert('Volume harus diisi dengan benar!');
      return;
    }

    try {
      if (editingId) {
        // Update existing product
        const response = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal memperbarui produk');
        }

        alert('Produk berhasil diperbarui!');
      } else {
        // Add new product
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal menambahkan produk');
        }

        alert('Produk berhasil ditambahkan!');
      }

      await fetchProducts();
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      family: product.family,
      intensity: product.intensity,
      volume: product.volume,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      description: product.description,
      inStock: product.inStock,
      isBestseller: product.isBestseller || false,
    });
    setEditingId(product.id);
    setShowForm(true);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">Manajemen Produk</h1>
          <p className="text-slate-500 text-sm">Kelola inventaris produk toko Anda</p>
        </div>
        {canAdd && (
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setFormData(emptyForm);
                setEditingId(null);
              }
            }}
            className="flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Produk
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'Edit Produk' : 'Produk Baru'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Nama Produk"
              placeholder="Masukkan nama produk"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <Input
              label="Brand"
              placeholder="Masukkan brand"
              name="brand"
              value={formData.brand}
              onChange={handleFormChange}
            />
            <Input
              label="Harga"
              type="number"
              placeholder="Masukkan harga"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="male">Pria</option>
                <option value="female">Wanita</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keluarga Parfum</label>
              <select
                name="family"
                value={formData.family}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="Woody">Woody</option>
                <option value="Floral">Floral</option>
                <option value="Citrus">Citrus</option>
                <option value="Gourmand">Gourmand</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="EDT">Eau de Toilette</option>
                <option value="EDP">Eau de Parfum</option>
                <option value="EXTRAIT">Extrait de Parfum</option>
              </select>
            </div>
            <Input
              label="Kapasitas (ml)"
              type="number"
              placeholder="50, 100, 200"
              name="volume"
              value={formData.volume}
              onChange={handleFormChange}
            />
            <Input
              label="Rating"
              type="number"
              step="0.1"
              placeholder="1-5"
              name="rating"
              value={formData.rating}
              onChange={handleFormChange}
            />
            <Input
              label="Jumlah Review"
              type="number"
              placeholder="0"
              name="reviews"
              value={formData.reviews}
              onChange={handleFormChange}
            />
            <Input
              label="Foto URL"
              placeholder="https://..."
              name="image"
              value={formData.image}
              onChange={handleFormChange}
            />
            <div className="flex items-center gap-4 md:col-span-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleFormChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Tersedia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={formData.isBestseller}
                  onChange={handleFormChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Bestseller</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Produk
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              placeholder="Masukkan deskripsi lengkap produk"
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSaveProduct}>Simpan Produk</Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData(emptyForm);
              }}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-slate-500">Memuat produk...</div>
      ) : (
        <>
          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Produk</th>
                    <th className="text-left py-3 px-4 font-semibold">Brand</th>
                    <th className="text-left py-3 px-4 font-semibold">Harga</th>
                    <th className="text-left py-3 px-4 font-semibold">Kategori</th>
                    <th className="text-left py-3 px-4 font-semibold">Stok</th>
                    <th className="text-left py-3 px-4 font-semibold">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.brand}</td>
                      <td className="py-3 px-4">Rp {product.price.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.inStock ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>
                      <td className="py-3 px-4">⭐ {product.rating}</td>
                      <td className="py-3 px-4">
                        {canAdd && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                handleEditProduct(product);
                              }}
                              className="p-2 hover:bg-[#EFEFE9] rounded-lg text-[#8C7355]"
                              aria-label="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 hover:bg-red-50 rounded-lg text-[#8D4F38]"
                                aria-label="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Total Produk</p>
              <p className="text-3xl font-bold">{allProducts.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Produk Tersedia</p>
              <p className="text-3xl font-bold">
                {allProducts.filter((p) => p.inStock).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Nilai Inventaris</p>
              <p className="text-3xl font-bold">
                Rp {allProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
