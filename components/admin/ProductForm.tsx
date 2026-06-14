'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/products';
import { Trash2, Plus, Upload, X, ArrowLeft, Save, Sparkles, Info, Image, Layers, Wind, Zap, Coins, Eye } from 'lucide-react';
import { FRAGRANCE_FAMILIES } from '@/lib/fragrance-families';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/lib/auth-context';
import { canManageProducts, adminRoleLabel } from '@/lib/admin-permissions';

interface FormData {
  name: string;
  brand: string;
  category: 'male' | 'female' | 'unisex';
  family: Product['family'];
  intensity: 'EDT' | 'EDP' | 'EXTRAIT';
  image: string;
  description: string;
  noteTop: string;
  noteHeart: string;
  noteBase: string;
  inStock: boolean;
  stock: number;
  isBestseller: boolean;
  volume_prices: { volume: number; price: number }[];
  sillage: string;
  projection: string;
  longevity: string;
}

const emptyForm: FormData = {
  name: '',
  brand: '',
  category: 'unisex',
  family: 'Woody',
  intensity: 'EDP',
  image: '',
  description: '',
  noteTop: '',
  noteHeart: '',
  noteBase: '',
  inStock: true,
  stock: 10,
  isBestseller: false,
  volume_prices: [{ volume: 50, price: 350000 }],
  sillage: '',
  projection: '',
  longevity: '',
};

function PremiumInput({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}: {
  label?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2 font-sans font-bold">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border border-[#E7E5E0] px-4 py-2.5 text-[#4A3728] text-sm focus:outline-none focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355]/20 transition-all rounded-md placeholder:text-stone-400 font-sans shadow-sm"
      />
    </div>
  );
}

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

interface ProductFormProps {
  productId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ productId, onSuccess, onCancel }: ProductFormProps) {
  const { user } = useAuth();
  const isReadOnly = !canManageProducts(user?.role);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    } else {
      setFormData(emptyForm);
      setImagePreview('');
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data produk');
      }
      const product: Product = await response.json();

      // Determine volume_prices fallback if not yet set in database
      const mappedVolumePrices = Array.isArray(product.volume_prices) && product.volume_prices.length > 0
        ? product.volume_prices.map(item => ({ volume: Number(item.volume), price: Number(item.price) }))
        : [{ volume: Number(product.volume || 50), price: Number(product.price || 350000) }];

      setFormData({
        name: product.name,
        brand: product.brand,
        category: product.category,
        family: product.family,
        intensity: product.intensity,
        image: product.image,
        description: product.description,
        noteTop: product.scent[0] ?? '',
        noteHeart: product.scent[1] ?? '',
        noteBase: product.scent[2] ?? '',
        inStock: Boolean(product.inStock),
        stock: product.stock ?? 10,
        isBestseller: Boolean(product.isBestseller),
        volume_prices: mappedVolumePrices,
        sillage: product.sillage ?? '',
        projection: product.projection ?? '',
        longevity: product.longevity ?? '',
      });
      setImagePreview(product.image);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Gagal memuat detail produk');
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleVolumePriceChange = (index: number, field: 'volume' | 'price', value: number) => {
    setFormData((prev) => {
      const nextVolumePrices = [...prev.volume_prices];
      nextVolumePrices[index] = {
        ...nextVolumePrices[index],
        [field]: value === 0 ? '' : value,
      };
      return {
        ...prev,
        volume_prices: nextVolumePrices,
      };
    });
  };

  const handleAddVolumePrice = () => {
    setFormData((prev) => ({
      ...prev,
      volume_prices: [...prev.volume_prices, { volume: 100, price: 650000 }],
    }));
  };

  const handleRemoveVolumePrice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      volume_prices: prev.volume_prices.filter((_, i) => i !== index),
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
    if (!formData.description.trim()) {
      alert('Deskripsi produk harus diisi!');
      return;
    }
    if (!formData.noteTop.trim() || !formData.noteHeart.trim() || !formData.noteBase.trim()) {
      alert('Catatan aroma Top, Heart, dan Base wajib diisi!');
      return;
    }
    if (!productId && !imageFile) {
      alert('Gambar produk wajib diunggah!');
      return;
    }
    if (productId && !imageFile && !formData.image) {
      alert('Gambar produk wajib ada!');
      return;
    }

    // Validate volume prices
    if (formData.volume_prices.length === 0) {
      alert('Minimal harus ada satu kapasitas dan harga!');
      return;
    }

    for (let i = 0; i < formData.volume_prices.length; i++) {
      const item = formData.volume_prices[i];
      if (!item.volume || item.volume <= 0) {
        alert(`Kapasitas pada baris ke-${i + 1} harus diisi dengan benar!`);
        return;
      }
      if (!item.price || item.price <= 0) {
        alert(`Harga pada baris ke-${i + 1} harus diisi dengan benar!`);
        return;
      }
    }

    try {
      setSaving(true);

      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Back-compatibility fields populated from first tier
      const firstTier = formData.volume_prices[0];
      const payload = {
        ...formData,
        price: Number(firstTier.price),
        volume: Number(firstTier.volume),
        stock: Number(formData.stock),
        image: imageUrl,
        scent: [formData.noteTop.trim(), formData.noteHeart.trim(), formData.noteBase.trim()],
      };

      if (productId) {
        const response = await fetch(`/api/products/${productId}`, {
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

      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-stone-500 font-serif text-sm">
        <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Memuat rincian fragrans...
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }} className="space-y-8 max-w-5xl mx-auto font-sans">
      {isReadOnly && (
        <div className="p-4 border border-amber-200/80 bg-amber-50/50 text-stone-700 text-xs flex items-center gap-3 rounded-lg">
          <Info size={16} className="text-amber-600 shrink-0" />
          <span>
            <strong>Mode Lihat Saja (Read Only):</strong> Anda masuk sebagai <span className="font-semibold">{adminRoleLabel(user?.role)}</span>. Anda hanya diizinkan untuk melihat detail koleksi ini dan tidak dapat melakukan perubahan.
          </span>
        </div>
      )}
      <fieldset disabled={isReadOnly} className="contents">
        <div className="bg-white border border-[#E7E5E0] p-6 sm:p-8 rounded-lg shadow-sm space-y-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A3728] pb-3 border-b border-stone-100 flex items-center gap-2">
          <Sparkles size={16} className="text-[#8C7355]" />
          Informasi Detail Fragrans
        </h3>

        {/* 01. Informasi Utama */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2 border-b border-stone-100 pb-2">
            <Info size={14} /> 01. Informasi Utama
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Nama Produk</label>
              <Input
                placeholder="Contoh: Cedar & Silk"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Brand / Merek</label>
              <Input
                placeholder="Contoh: Luxure Parfum"
                name="brand"
                value={formData.brand}
                onChange={handleFormChange}
                required
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Deskripsi Produk
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2.5 border border-[#E7E5E0] bg-white rounded-md shadow-sm font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355]/20 focus:border-[#8C7355] text-stone-700 resize-none"
                placeholder="Deskripsi premium wewangian yang tampil di halaman detail produk"
              />
            </div>
          </div>
        </div>

        {/* 02. Media Visual */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2 border-b border-stone-100 pb-2">
            <Image size={14} /> 02. Media Visual
          </h4>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {imagePreview ? (
              <div className="relative w-40 h-48 rounded-lg overflow-hidden border border-[#E7E5E0] bg-stone-50 shadow-sm shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-red-50 rounded-full text-red-600 transition shadow-xs border-0 cursor-pointer"
                  aria-label="Hapus gambar"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-40 h-48 rounded-lg border-2 border-dashed border-[#E7E5E0] flex flex-col items-center justify-center text-stone-400 text-xs text-center px-4 bg-stone-50 shrink-0 gap-2 font-light">
                <span>Belum ada foto terunggah</span>
                <span className="text-[10px] text-stone-300">Format: JPG, PNG, WEBP</span>
              </div>
            )}
            <div className="space-y-2">
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
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E7E5E0] rounded-md cursor-pointer hover:bg-stone-50 text-xs uppercase tracking-wider font-semibold transition text-stone-600 shadow-sm bg-white"
              >
                <Upload size={14} />
                {imagePreview ? 'Ganti Foto' : 'Unggah Foto'}
              </label>
              <p className="text-[10px] text-stone-400 leading-relaxed font-light max-w-sm">
                Mendukung berkas gambar JPG, PNG, atau WEBP. Direkomendasikan rasio potret agar terlihat proporsional di etalase.
              </p>
            </div>
          </div>
        </div>

        {/* 03. Karakteristik & Klasifikasi */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2 border-b border-stone-100 pb-2">
            <Layers size={14} /> 03. Karakteristik & Klasifikasi
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Intensity</label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-[#E7E5E0] bg-white rounded-md shadow-sm font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355]/20 focus:border-[#8C7355] text-stone-700 font-medium cursor-pointer"
              >
                <option value="EDT">Eau de Toilette (EDT)</option>
                <option value="EDP">Eau de Parfum (EDP)</option>
                <option value="EXTRAIT">Extrait de Parfum</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Keluarga Aroma</label>
              <select
                name="family"
                value={formData.family}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-[#E7E5E0] bg-white rounded-md shadow-sm font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355]/20 focus:border-[#8C7355] text-stone-700 font-medium cursor-pointer"
              >
                {FRAGRANCE_FAMILIES.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Kategori Gender</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-[#E7E5E0] bg-white rounded-md shadow-sm font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355]/20 focus:border-[#8C7355] text-stone-700 font-medium cursor-pointer"
              >
                <option value="male">Pria</option>
                <option value="female">Wanita</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>
        </div>

        {/* 04. Olfactory Architecture */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2 border-b border-stone-100 pb-2">
            <Wind size={14} /> 04. Olfactory Architecture (Catatan Aroma)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Top Note</label>
              <Input
                placeholder="Contoh: Bergamot"
                name="noteTop"
                value={formData.noteTop}
                onChange={handleFormChange}
                required
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Heart Note</label>
              <Input
                placeholder="Contoh: Rose Absolue"
                name="noteHeart"
                value={formData.noteHeart}
                onChange={handleFormChange}
                required
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Base Note</label>
              <Input
                placeholder="Contoh: Sandalwood"
                name="noteBase"
                value={formData.noteBase}
                onChange={handleFormChange}
                required
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
          </div>
        </div>

        {/* 05. SPL */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2 border-b border-stone-100 pb-2">
            <Zap size={14} /> 05. Kekuatan Aroma (SPL)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Sillage</label>
              <Input
                placeholder="Contoh: Light, Moderate, Strong"
                name="sillage"
                value={formData.sillage}
                onChange={handleFormChange}
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Projection</label>
              <Input
                placeholder="Contoh: 1-2 meter"
                name="projection"
                value={formData.projection}
                onChange={handleFormChange}
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Longevity</label>
              <Input
                placeholder="Contoh: 8h+"
                name="longevity"
                value={formData.longevity}
                onChange={handleFormChange}
                className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
              />
            </div>
          </div>
        </div>

        {/* 06. Kapasitas & Varian Harga */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2 border-b border-stone-100 pb-2">
            <Coins size={14} /> 06. Kapasitas & Varian Harga
          </h4>
          <p className="text-[11px] text-stone-400 font-light leading-relaxed">
            Atur dan tambahkan satu atau beberapa variasi kapasitas ukuran wewangian (ml) beserta harganya (IDR).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50/50 p-4 rounded-lg border border-stone-100">
            {formData.volume_prices.map((item, index) => (
              <div key={index} className="bg-white border border-[#E7E5E0] p-5 space-y-4 rounded-lg shadow-xs relative group hover:border-[#8C7355]/30 transition">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7355]">
                    Varian Ukuran #{index + 1}
                  </span>
                  {formData.volume_prices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVolumePrice(index)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer border-0 bg-transparent"
                      title="Hapus Varian"
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Kapasitas (ml)</label>
                    <Input
                      type="number"
                      placeholder="Contoh: 50"
                      name={`volume-${index}`}
                      value={item.volume}
                      onChange={(e) => handleVolumePriceChange(index, 'volume', Number(e.target.value))}
                      className="border border-[#E7E5E0] bg-white rounded-md px-3 py-2 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">Harga Varian (IDR)</label>
                    <Input
                      type="number"
                      placeholder="Contoh: 350000"
                      name={`price-${index}`}
                      value={item.price}
                      onChange={(e) => handleVolumePriceChange(index, 'price', Number(e.target.value))}
                      className="border border-[#E7E5E0] bg-white rounded-md px-3 py-2 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleAddVolumePrice}
            className="inline-flex items-center gap-1.5 bg-[#8C7355] text-white hover:bg-[#766045] text-xs uppercase tracking-wider font-semibold py-2.5 px-5 shadow-sm"
          >
            <Plus size={14} /> Tambah Kapasitas & Harga
          </Button>
        </div>

        {/* 07. Publikasi & Tagging */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2 border-b border-stone-100 pb-2">
            <Eye size={14} /> 07. Publikasi & Tagging
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <PremiumInput
                label="Jumlah Stok"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleFormChange}
                placeholder="Contoh: 10"
              />
            </div>
            <div className="flex items-center gap-8 pb-3 md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleFormChange}
                  className="w-4 h-4 accent-[#4A3728] cursor-pointer"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 group-hover:text-[#4A3728] transition">Tersedia / In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={formData.isBestseller}
                  onChange={handleFormChange}
                  className="w-4 h-4 accent-[#4A3728] cursor-pointer"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 group-hover:text-[#4A3728] transition">Bestseller</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      </fieldset>

      {/* Footer Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-stone-200 text-stone-600 hover:bg-stone-50 text-xs uppercase tracking-wider font-semibold py-2.5 px-6"
        >
          <ArrowLeft size={14} className="mr-1.5 inline" /> {isReadOnly ? 'Kembali' : 'Batal'}
        </Button>
        {!isReadOnly && (
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#4A3728] text-white hover:bg-[#8C7355] text-xs uppercase tracking-wider font-semibold py-2.5 px-8 shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Menyimpan...' : 'Simpan Produk'}
          </Button>
        )}
      </div>
    </form>
  );
}
