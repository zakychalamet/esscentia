'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { JournalArticle, fetchJournalArticles } from '@/lib/journal-articles';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { ArrowRight } from 'lucide-react';

export default function JournalPage() {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournalArticles()
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="mb-10 lg:mb-14 text-center sm:text-left max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-3">
            Esscentia Journal
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A3728] mb-4 leading-tight">
            Esscentia Journal
          </h1>
          <p className="text-stone-600 text-[15px] leading-relaxed">
            Jelajahi artikel, tren, dan insight terkini dari dunia parfum. Pelajari karakter aroma, tips penggunaan, hingga perkembangan industri wewangian yang terus berkembang.
          </p>
        </header>

        {loading ? (
          <div className="py-24 text-center text-stone-500 text-sm">Memuat artikel...</div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center text-stone-500 text-sm">
            Belum ada artikel jurnal tersedia.
          </div>
        ) : (
          <>
            {featured && (
              <Link
                href={'/journal/' + featured.slug}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-0 mb-12 lg:mb-14 overflow-hidden border border-stone-200/80 bg-white/50 rounded-sm"
              >
                <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[320px] overflow-hidden">
                  <img
                    src={featured.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] mb-3">
                    {featured.category} · {featured.date}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif text-[#4A3728] mb-4 group-hover:text-[#8D4F38] transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#8D4F38]">
                    Baca artikel <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-y-12">
              {rest.map((article) => (
                <article key={article.slug} className="group flex flex-col">
                  <Link href={'/journal/' + article.slug} className="block overflow-hidden mb-5">
                    <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                      <img
                        src={article.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">
                    {article.category} · {article.readTime}
                  </span>
                  <Link href={'/journal/' + article.slug}>
                    <h3 className="text-xl font-serif text-[#4A3728] mb-3 group-hover:text-[#8D4F38] transition-colors leading-snug">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-stone-600 leading-relaxed flex-1 mb-4">
                    {article.excerpt}
                  </p>
                  <Link
                    href={'/journal/' + article.slug}
                    className="text-xs uppercase tracking-[0.15em] text-[#8D4F38] hover:underline underline-offset-4"
                  >
                    Baca selengkapnya
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
