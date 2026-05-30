import Link from 'next/link';
import { journalArticles } from '@/lib/journal-articles';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'The Journal — Esscentia',
  description: 'Berita, tips, dan cerita seputar dunia parfum artisanal.',
};

export default function JournalPage() {
  const featured = journalArticles[0];
  const rest = journalArticles.slice(1);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="mb-12 lg:mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-3">
            The Journal
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A3728] mb-4">
            Olfactory Stories
          </h1>
          <p className="text-stone-600 max-w-2xl text-[15px] leading-relaxed">
            Berita, tren, dan wawasan dari dunia parfum — kurasi tim Esscentia untuk membantu Anda
            menemukan aroma yang bermakna.
          </p>
        </div>

        {/* Featured */}
        <Link
          href={`/journal/${featured.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-2 gap-0 mb-14 lg:mb-16 overflow-hidden border border-stone-200/80 bg-white/40"
        >
          <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[360px] overflow-hidden">
            <img
              src={featured.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center">
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {rest.map((article) => (
            <article key={article.slug} className="group flex flex-col">
              <Link href={`/journal/${article.slug}`} className="block overflow-hidden mb-5">
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
              <Link href={`/journal/${article.slug}`}>
                <h3 className="text-xl font-serif text-[#4A3728] mb-3 group-hover:text-[#8D4F38] transition-colors leading-snug">
                  {article.title}
                </h3>
              </Link>
              <p className="text-sm text-stone-600 leading-relaxed flex-1 mb-4">
                {article.excerpt}
              </p>
              <Link
                href={`/journal/${article.slug}`}
                className="text-xs uppercase tracking-[0.15em] text-[#8D4F38] hover:underline underline-offset-4"
              >
                Baca selengkapnya
              </Link>
            </article>
          ))}
        </div>
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
