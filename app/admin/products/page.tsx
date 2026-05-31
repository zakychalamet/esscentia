'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/products';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Edit, Trash2, Plus, Upload, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { canManageProducts, canDeleteProducts } from '@/lib/admin-permissions';
import { FRAGRANCE_FAMILIES } from '@/lib/fragrance-families';

interface FormData {
  name: string;
  brand: string;
  price: number | '';
  category: 'male' | 'female' | 'unisex';
  family: Product['family'];
  intensity: 'EDT' | 'EDP' | 'EXTRAIT';
  volume: number | '';
  rating: number | '';
  reviews: number | '';
  image: string;
  description: string;
  noteTop: string;
  noteHeart: string;
  noteBase: string;
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
  noteTop: '',
  noteHeart: '',
  noteBase: '',
  inStock: true,
  isBestseller: false,
};

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Gagal mengunggah gambar');
  }

  const data = await response.json();
  return data.url as string;
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const canAdd = canManageProducts(user?.role);
  const canDelete = canDeleteProducts(user?.role);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setAllProducts(
        data.map((p: Product) => ({
          ...p,
          id: String(p.id),
          inStock: Boolean(p.inStock),
          isBestseller: Boolean(p.isBestseller),
          scent: Array.isArray(p.scent) ? p.scent : [],
        }))
      );
    } catch (error) {
      console.error('Gagal mengambil produk:', error);
      alert('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveProduct = async () => {
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
    if (!formData.description.trim()) {
      alert('Deskripsi produk harus diisi!');
      return;
    }
    if (!formData.noteTop.trim() || !formData.noteHeart.trim() || !formData.noteBase.trim()) {
      alert('Catatan aroma Top, Heart, dan Base wajib diisi!');
      return;
    }
    if (!editingId && !imageFile) {
      alert('Gambar produk wajib diunggah!');
      return;
    }
    if (editingId && !imageFile && !formData.image) {
      alert('Gambar produk wajib ada!');
      return;
    }

    try {
      setSaving(true);

      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        ...formData,
        image: imageUrl,
        scent: [formData.noteTop.trim(), formData.noteHeart.trim(), formData.noteBase.trim()],
      };

      if (editingId) {
        const response = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal memperbarui produk');
        }

        alert('Produk berhasil diperbarui!');
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal menambahkan produk');
        }

        alert('Produk berhasil ditambahkan!');
      }

      await fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
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
      noteTop: product.scent[0] ?? '',
      noteHeart: product.scent[1] ?? '',
      noteBase: product.scent[2] ?? '',
      inStock: product.inStock,
      isBestseller: product.isBestseller || false,
    });
    setImageFile(null);
    setImagePreview(product.image);
    setEditingId(product.id);
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">Manajemen Produk</h1>
          <p className="text-slate-500 text-sm">
            Kelola produk sesuai tampilan halaman detail toko
          </p>
        </div>
        {canAdd && (
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) resetForm();
            }}
            className="flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Produk
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-2">
            {editingId ? 'Edit Produk' : 'Produk Baru'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Field di bawah ini sesuai dengan informasi yang ditampilkan di halaman detail produk.
          </p>

          {/* Informasi Utama */}
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Informasi Utama
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Nama Produk"
              placeholder="Contoh: Cedar & Silk"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <Input
              label="Brand / Merek"
              placeholder="Contoh: Luxure Parfum"
              name="brand"
              value={formData.brand}
              onChange={handleFormChange}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Produk
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                placeholder="Deskripsi yang tampil di halaman detail produk"
              />
            </div>
          </div>

          {/* Upload Gambar */}
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Foto Produk
          </h3>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {imagePreview ? (
                <div className="relative w-40 h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-600 hover:bg-white"
                    aria-label="Hapus gambar"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm text-center px-2">
                  Belum ada gambar
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-700"
                >
                  <Upload size={18} />
                  {imagePreview ? 'Ganti Gambar' : 'Unggah Gambar'}
                </label>
                <p className="text-xs text-stone-500 mt-2">
                  JPG, PNG, WEBP, atau GIF — maks. 5 MB
                </p>
              </div>
            </div>
          </div>

          {/* Karakteristik Parfum */}
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Karakteristik Parfum
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="EDT">Eau de Toilette (EDT)</option>
                <option value="EDP">Eau de Parfum (EDP)</option>
                <option value="EXTRAIT">Extrait de Parfum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keluarga Parfum
              </label>
              <select
                name="family"
                value={formData.family}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                {FRAGRANCE_FAMILIES.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </div>
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
            <Input
              label="Kapasitas Default (ml)"
              type="number"
              placeholder="50, 75, 100"
              name="volume"
              value={formData.volume}
              onChange={handleFormChange}
            />
          </div>

          {/* Olfactory Architecture */}
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Olfactory Architecture (Catatan Aroma)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              label="Top Note"
              placeholder="Contoh: Bergamot"
              name="noteTop"
              value={formData.noteTop}
              onChange={handleFormChange}
            />
            <Input
              label="Heart Note"
              placeholder="Contoh: Rose Absolue"
              name="noteHeart"
              value={formData.noteHeart}
              onChange={handleFormChange}
            />
            <Input
              label="Base Note"
              placeholder="Contoh: Sandalwood"
              name="noteBase"
              value={formData.noteBase}
              onChange={handleFormChange}
            />
          </div>

          {/* Harga & Stok */}
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Harga & Stok
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Harga (IDR)"
              type="number"
              placeholder="450000"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
            />
            <div className="flex items-end gap-6 pb-1">
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

          {/* Rating */}
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Rating & Ulasan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Rating (1–5)"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="4.8"
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
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveProduct} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Input
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
        />
      </div>

      {loading ? (
        <div className="text-center text-slate-500">Memuat produk...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Produk</th>
                    <th className="text-left py-3 px-4 font-semibold">Brand</th>
                    <th className="text-left py-3 px-4 font-semibold">Harga</th>
                    <th className="text-left py-3 px-4 font-semibold">Intensity</th>
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
                          <div>
                            <span className="font-medium block">{product.name}</span>
                            <span className="text-xs text-stone-500">
                              {product.scent.slice(0, 3).join(' · ') || '—'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.brand}</td>
                      <td className="py-3 px-4">Rp {product.price.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4">{product.intensity}</td>
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
                              onClick={() => handleEditProduct(product)}
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
