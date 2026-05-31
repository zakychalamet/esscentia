'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  JournalArticle,
  fetchJournalArticleBySlug,
  fetchJournalArticles,
} from '@/lib/journal-articles';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1541643600912-78b084683601?w=1200&h=600&fit=crop';

export default function JournalArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<JournalArticle | null>(null);
  const [related, setRelated] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setImageError(false);
    Promise.all([fetchJournalArticleBySlug(slug), fetchJournalArticles()])
      .then(([found, all]) => {
        setArticle(found);
        setRelated(all.filter((a) => a.slug !== slug).slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 flex items-center justify-center text-stone-500 text-sm">
          Memuat artikel...
        </div>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
        <CatalogNav />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-24 text-center w-full">
          <h1 className="text-3xl font-serif text-[#4A3728] mb-4">Artikel tidak ditemukan</h1>
          <Link href="/journal" className="text-[#8D4F38] text-sm hover:underline">
            ← Kembali ke The Journal
          </Link>
        </div>
        <CatalogFooter variant="catalog" />
      </div>
    );
  }

  const coverSrc = imageError || !article.image ? FALLBACK_IMAGE : article.image;

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 w-full">
        <article>
          <div className="relative w-full overflow-hidden bg-stone-200 aspect-[21/9] sm:aspect-[2.5/1] min-h-[220px] max-h-[52vh]">
            <img
              src={coverSrc}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F2] via-[#F9F7F2]/40 to-transparent" />
          </div>

          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16 relative z-10 pb-12 lg:pb-16">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#8D4F38] hover:text-[#4A3728] transition mb-6 sm:mb-8"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Kembali ke The Journal
            </Link>

            <div className="bg-[#F9F7F2] pt-2 sm:pt-4">
              <header className="mb-8 lg:mb-10 pb-8 border-b border-stone-200/80">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] mb-4">
                  {article.category} · {article.date} · {article.readTime}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif text-[#4A3728] leading-tight mb-5">
                  {article.title}
                </h1>
                <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
                  {article.excerpt}
                </p>
              </header>

              <div className="space-y-5 sm:space-y-6 text-stone-600 text-[15px] sm:text-base leading-[1.85]">
                {article.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <footer className="mt-10 pt-8 border-t border-stone-200/80 text-sm text-stone-500">
                Ditulis oleh{' '}
                <span className="text-[#4A3728] font-medium">{article.author}</span>
              </footer>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-stone-200/80 bg-[#EDEAE4]/40 py-12 lg:py-16">
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-serif text-[#4A3728] mb-8 lg:mb-10 text-center sm:text-left">
                Artikel Lainnya
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={'/journal/' + item.slug}
                    className="group block"
                  >
                    <div className="aspect-[16/10] overflow-hidden mb-4 bg-stone-200 rounded-sm">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">
                      {item.category}
                    </p>
                    <h3 className="font-serif text-lg text-[#4A3728] leading-snug group-hover:text-[#8D4F38] transition">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
