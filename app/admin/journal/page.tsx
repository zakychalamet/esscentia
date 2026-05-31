'use client';

import { useState, useEffect, useRef } from 'react';
import { JournalArticle } from '@/lib/journal-articles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Edit, Trash2, Plus, Upload, X, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { canManageJournal, canDeleteJournal } from '@/lib/admin-permissions';
import Link from 'next/link';

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  contentBody: string;
  category: string;
  date: string;
  readTime: string;
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
  readTime: '5 menit',
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

export default function AdminJournalPage() {
  const { user } = useAuth();
  const canAdd = canManageJournal(user?.role);
  const canDelete = canDeleteJournal(user?.role);
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/journal');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Gagal mengambil artikel:', error);
      alert('Gagal mengambil data jurnal');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setEditingSlug(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      if (name === 'title' && !editingSlug) {
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

  const handleSave = async () => {
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
    if (!editingSlug && !imageFile) {
      alert('Gambar artikel wajib diunggah!');
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

      if (editingSlug) {
        const response = await fetch('/api/journal/' + editingSlug, {
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

      await fetchArticles();
      setShowForm(false);
      resetForm();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (article: JournalArticle) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      contentBody: article.content.join('\n\n'),
      category: article.category,
      date: article.date,
      readTime: article.readTime,
      image: article.image,
      author: article.author,
      isFeatured: false,
    });
    setImageFile(null);
    setImagePreview(article.image);
    setEditingSlug(article.slug);
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const response = await fetch('/api/journal/' + slug, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus');
      alert('Artikel berhasil dihapus!');
      await fetchArticles();
    } catch {
      alert('Gagal menghapus artikel');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">Manajemen Jurnal</h1>
          <p className="text-slate-500 text-sm">
            Kelola artikel The Journal — tampil di halaman /journal
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
            <Plus size={20} /> Tambah Artikel
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">
            {editingSlug ? 'Edit Artikel' : 'Artikel Baru'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Judul Artikel"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Contoh: Memahami Not Parfum"
            />
            <Input
              label="Slug URL"
              name="slug"
              value={formData.slug}
              onChange={handleFormChange}
              placeholder="memahami-not-parfum"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Penulis"
              name="author"
              value={formData.author}
              onChange={handleFormChange}
            />
            <Input
              label="Tanggal Terbit"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              placeholder="12 Mei 2024"
            />
            <Input
              label="Waktu Baca"
              name="readTime"
              value={formData.readTime}
              onChange={handleFormChange}
              placeholder="5 menit"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ringkasan (Excerpt)</label>
            <textarea
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              placeholder="Ringkasan singkat yang tampil di daftar artikel"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isi Artikel
            </label>
            <textarea
              name="contentBody"
              rows={10}
              value={formData.contentBody}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 font-mono text-sm"
              placeholder="Tulis paragraf artikel. Pisahkan paragraf dengan baris kosong."
            />
            <p className="text-xs text-stone-500 mt-1">
              Setiap paragraf dipisahkan dengan satu baris kosong — sama seperti tampilan di halaman detail.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Cover</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {imagePreview ? (
                <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-48 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
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
                  id="journal-image"
                />
                <label
                  htmlFor="journal-image"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium"
                >
                  <Upload size={18} />
                  {imagePreview ? 'Ganti Gambar' : 'Unggah Gambar'}
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Artikel'}
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

      <Input
        placeholder="Cari artikel..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
      />

      {loading ? (
        <div className="text-center text-slate-500">Memuat artikel...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Artikel</th>
                  <th className="text-left py-3 px-4 font-semibold">Kategori</th>
                  <th className="text-left py-3 px-4 font-semibold">Penulis</th>
                  <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((article) => (
                  <tr key={article.slug} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.image}
                          alt=""
                          className="w-14 h-10 object-cover rounded"
                        />
                        <div>
                          <span className="font-medium block line-clamp-1">{article.title}</span>
                          <span className="text-xs text-stone-500">/{article.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{article.category}</td>
                    <td className="py-3 px-4">{article.author}</td>
                    <td className="py-3 px-4 text-sm text-stone-600">{article.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link
                          href={'/journal/' + article.slug}
                          target="_blank"
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                          aria-label="Lihat"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        {canAdd && (
                          <>
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 hover:bg-[#EFEFE9] rounded-lg text-[#8C7355]"
                            >
                              <Edit size={18} />
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(article.slug)}
                                className="p-2 hover:bg-red-50 rounded-lg text-[#8D4F38]"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-slate-500 text-sm">
              Belum ada artikel. Tambahkan artikel pertama atau jalankan npm run db:seed-journal
            </p>
          )}
        </div>
      )}
    </div>
  );
}
