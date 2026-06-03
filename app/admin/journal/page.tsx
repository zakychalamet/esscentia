'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JournalArticle } from '@/lib/journal-articles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Edit, Trash2, Plus, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { canManageJournal, canDeleteJournal } from '@/lib/admin-permissions';
import Link from 'next/link';

export default function AdminJournalPage() {
  const { user } = useAuth();
  const router = useRouter();
  const canAdd = canManageJournal(user?.role);
  const canDelete = canDeleteJournal(user?.role);
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Gagal mengambil artikel:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-8 max-w-7xl mx-auto px-1 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-white border border-[#E7E5E0] p-6 rounded-lg shadow-xs">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3728] mb-1">Manajemen Jurnal</h1>
          <p className="text-stone-500 text-sm font-light">
            Tulis dan kelola artikel wawasan The Journal yang tampil di halaman /journal
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchArticles}
            className="p-2.5 border border-stone-200 rounded-md hover:bg-stone-50 transition text-stone-500 flex items-center justify-center gap-2 text-xs font-medium"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {canAdd && (
            <Button
              onClick={() => router.push('/admin/journal/new')}
              className="flex items-center gap-2 bg-[#4A3728] text-white hover:bg-[#8C7355] text-xs uppercase tracking-wider font-semibold py-2.5 px-4"
            >
              <Plus size={16} /> Tambah Artikel
            </Button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E7E5E0] p-4 rounded-lg shadow-xs">
        <Input
          placeholder="Cari berdasarkan judul, kategori, atau nama penulis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="border border-[#E7E5E0] bg-white rounded-md px-4 py-2 shadow-sm font-sans text-sm focus:ring-[#8C7355]/20 focus:border-[#8C7355]"
        />
      </div>

      {/* Articles Table */}
      {loading ? (
        <div className="py-20 text-center text-stone-500">
          <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Memuat artikel jurnal…
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xs border border-[#E7E5E0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr className="text-stone-500 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="text-left py-4 px-5">Artikel</th>
                  <th className="text-left py-4 px-5">Kategori</th>
                  <th className="text-left py-4 px-5">Penulis</th>
                  <th className="text-left py-4 px-5">Tanggal Terbit</th>
                  <th className="text-center py-4 px-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.length > 0 ? (
                  filtered.map((article) => (
                    <tr key={article.slug} className="hover:bg-stone-50/50 transition cursor-pointer" onClick={() => router.push(`/admin/journal/${article.slug}/edit`)}>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={article.image}
                            alt=""
                            className="w-16 h-11 object-cover rounded bg-[#EDEAE4] border border-stone-200/40 shrink-0"
                          />
                          <div>
                            <span className="font-semibold block text-[#4A3728] line-clamp-1">{article.title}</span>
                            <span className="text-[10px] text-stone-400 font-mono">/{article.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-block bg-stone-100 text-stone-700 text-xs px-2.5 py-0.5 rounded font-medium">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[#4A3728] font-medium">{article.author}</td>
                      <td className="py-4 px-5 text-stone-500 font-light text-xs">{article.date}</td>
                      <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-center">
                          <Link
                            href={'/journal/' + article.slug}
                            target="_blank"
                            className="p-1.5 hover:bg-stone-100 rounded text-[#8C7355] transition"
                            aria-label="Lihat Artikel"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            onClick={() => router.push(`/admin/journal/${article.slug}/edit`)}
                            className="p-1.5 hover:bg-[#EFEFE9] rounded text-[#8C7355] transition"
                            aria-label={canAdd ? "Edit Artikel" : "Lihat Rincian Artikel"}
                          >
                            {canAdd ? <Edit size={16} /> : <Eye size={16} />}
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(article.slug)}
                              className="p-1.5 hover:bg-red-50 rounded text-[#8D4F38] transition"
                              aria-label="Hapus Artikel"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-stone-400 font-light">
                      Belum ada artikel yang sesuai atau terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
