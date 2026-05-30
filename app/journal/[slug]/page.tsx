import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journalArticles, getArticleBySlug } from '@/lib/journal-articles';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Artikel tidak ditemukan' };
  return {
    title: `${article.title} — The Journal`,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = journalArticles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1">
        <article>
          <div className="relative h-[45vh] min-h-[280px] max-h-[480px] overflow-hidden">
            <img
              src={article.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/80 to-transparent" />
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-16">
            <Link
              href="/journal"
              className="inline-block text-xs uppercase tracking-[0.15em] text-stone-500 hover:text-[#8D4F38] mb-8"
            >
              ← Kembali ke The Journal
            </Link>

            <div className="bg-[#F9F7F2] pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355]">
                {article.category} · {article.date} · {article.readTime}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#4A3728] mt-4 mb-6 leading-tight">
                {article.title}
              </h1>
              <p className="text-stone-600 text-lg leading-relaxed border-b border-stone-200/80 pb-8 mb-10">
                {article.excerpt}
              </p>

              <div className="space-y-6 text-stone-600 text-[15px] leading-[1.85]">
                {article.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-12 pt-8 border-t border-stone-200/80 text-sm text-stone-500">
                Ditulis oleh <span className="text-[#4A3728]">{article.author}</span>
              </p>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-stone-200/80 bg-[#EDEAE4]/30 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-serif text-[#4A3728] mb-8">Artikel Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/journal/${item.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[16/10] overflow-hidden mb-4 bg-stone-200">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg text-[#4A3728] mt-1 group-hover:text-[#8D4F38] transition">
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
