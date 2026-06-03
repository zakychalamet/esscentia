'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { JournalForm } from '@/components/admin/JournalForm';
import { ChevronLeft } from 'lucide-react';
import { JournalArticle } from '@/lib/journal-articles';
import { useAuth } from '@/lib/auth-context';
import { canManageJournal } from '@/lib/admin-permissions';

export default function EditJournalArticlePage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [loading, setLoading] = useState(true);

  const canEdit = canManageJournal(user?.role);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/journal/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else {
        alert('Artikel tidak ditemukan');
        router.push('/admin/journal');
      }
    } catch (e) {
      console.error('Error fetching article:', e);
      alert('Gagal mengambil data artikel');
      router.push('/admin/journal');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/journal');
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#4A3728]">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-[#E7E5E0]">
        <button
          onClick={handleBack}
          className="self-start flex items-center gap-1.5 text-[10px] font-serif uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#4A3728] transition bg-transparent border-0 cursor-pointer p-0"
        >
          <ChevronLeft size={14} /> Kembali ke Manajemen Jurnal
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#4A3728] tracking-tight font-semibold">
            {canEdit ? 'Edit Artikel Jurnal' : 'Detail Artikel Jurnal (Read Only)'}
          </h1>
          <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">
            {canEdit
              ? 'Perbarui konten wawasan, kategori, sampul, atau detail artikel di The Journal'
              : 'Lihat konten wawasan, kategori, sampul, atau detail artikel di The Journal'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-500">
          <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Memuat draf artikel…
        </div>
      ) : (
        <div className="w-full">
          <JournalForm initialData={article} onSuccess={handleBack} onCancel={handleBack} />
        </div>
      )}
    </div>
  );
}
