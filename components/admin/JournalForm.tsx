'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Upload, X, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { JournalArticle } from '@/lib/journal-articles';

interface JournalFormProps {
  initialData?: JournalArticle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  contentBody: string;
  category: string;
  date: string;
  image: string;
  author: string;
  isFeatured: boolean;
}

const CATEGORIES = ['Edukasi', 'Tren', 'Tips', 'Sustainability', 'Gaya'];

const emptyForm: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  contentBody: '',
  category: 'Edukasi',
  date: '',
  image: '',
  author: 'Tim Esscentia',
  isFeatured: false,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Gagal mengunggah gambar');
  }
  const data = await response.json();
  return data.url as string;
}

export function JournalForm({ initialData, onSuccess, onCancel }: JournalFormProps) {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt,
        contentBody: initialData.content.join('\n\n'),
        category: initialData.category,
        date: initialData.date,
        image: initialData.image,
        author: initialData.author,
        isFeatured: false, // Default false or we can leave it
      });
      setImagePreview(initialData.image);
    } else {
      setFormData(emptyForm);
      setImagePreview('');
    }
  }, [initialData]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      };
      if (name === 'title' && !initialData) {
        next.slug = slugify(value);
      }
      return next;
    });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul artikel wajib diisi!');
      return;
    }
    if (!formData.excerpt.trim()) {
      alert('Ringkasan artikel wajib diisi!');
      return;
    }
    if (!formData.contentBody.trim()) {
      alert('Isi artikel wajib diisi!');
      return;
    }
    if (!initialData && !imageFile) {
      alert('Gambar cover artikel wajib diunggah!');
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
        slug: formData.slug || slugify(formData.title),
        image: imageUrl,
        content: formData.contentBody
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
        date:
          formData.date ||
          new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
      };

      if (initialData) {
        const response = await fetch('/api/journal/' + initialData.slug, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal memperbarui artikel');
        }
        alert('Artikel berhasil diperbarui!');
      } else {
        const response = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal menambahkan artikel');
        }
        alert('Artikel berhasil ditambahkan!');
      }

      onSuccess();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto font-sans">
      <div className="bg-white border border-[#E7E5E0] p-6 sm:p-8 rounded-lg shadow-sm space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A3728] pb-3 border-b border-stone-100 flex items-center gap-2">
          <Sparkles size={16} className="text-[#8C7355]" />
          Informasi Artikel Jurnal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Judul Artikel</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Contoh: Memahami Lapisan Aroma Scent"
              required
              className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Slug URL (URL Unik)</label>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleFormChange}
              placeholder="memahami-lapisan-aroma-scent"
              className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Kategori Jurnal</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-[#E7E5E0] bg-white rounded-md shadow-sm font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355]/20 focus:border-[#8C7355] text-stone-700 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Penulis / Kontributor</label>
            <Input
              name="author"
              value={formData.author}
              onChange={handleFormChange}
              className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Tanggal Terbit (Opsional)</label>
            <Input
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              placeholder="Contoh: 1 Juni 2026 (Kosongkan untuk otomatis hari ini)"
              className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2.5 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Ringkasan Ringkas (Excerpt)</label>
          <textarea
            name="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2.5 border border-[#E7E5E0] bg-white rounded-md shadow-sm font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355]/20 focus:border-[#8C7355] text-stone-700"
            placeholder="Tulis ringkasan singkat artikel (tampil di halaman daftar katalog jurnal)."
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Isi Artikel Utama</label>
            <span className="text-[10px] text-stone-400">Pisahkan setiap paragraf dengan menekan ENTER 2 kali (baris kosong)</span>
          </div>
          <textarea
            name="contentBody"
            rows={12}
            value={formData.contentBody}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-2.5 border border-[#E7E5E0] bg-white rounded-md shadow-sm font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355]/20 focus:border-[#8C7355] text-stone-700"
            placeholder="Tulis seluruh isi artikel di sini secara detail..."
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Gambar Cover Jurnal</label>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {imagePreview ? (
              <div className="relative w-64 h-40 rounded-lg overflow-hidden border border-[#E7E5E0] shadow-sm shrink-0 bg-stone-50">
                <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-red-50 rounded-full text-red-600 transition shadow-xs"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-64 h-40 rounded-lg border-2 border-dashed border-[#E7E5E0] flex flex-col items-center justify-center text-stone-400 text-xs font-light gap-2 shrink-0 bg-stone-50">
                <span>Belum ada gambar terpilih</span>
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
                id="journal-image-file"
              />
              <label
                htmlFor="journal-image-file"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E7E5E0] rounded-md cursor-pointer hover:bg-stone-50 text-xs uppercase tracking-wider font-semibold transition text-stone-600 shadow-sm"
              >
                <Upload size={14} />
                {imagePreview ? 'Ganti Cover' : 'Unggah Cover'}
              </label>
              <p className="text-[10px] text-stone-400 leading-relaxed font-light max-w-sm">
                Gunakan gambar berasio 8:5 atau lanskap dengan resolusi tajam agar sampul artikel terlihat memukau di halaman Jurnal.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-stone-200 text-stone-600 hover:bg-stone-50 text-xs uppercase tracking-wider font-semibold py-2.5 px-6"
        >
          <ArrowLeft size={14} className="mr-1.5 inline" /> Batal
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="bg-[#4A3728] text-white hover:bg-[#8C7355] text-xs uppercase tracking-wider font-semibold py-2.5 px-8 shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Menyimpan...' : 'Simpan Artikel'}
        </Button>
      </div>
    </form>
  );
}
