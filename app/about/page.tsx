import Link from 'next/link';
import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

const values = [
  {
    title: 'Sustainably Sourced',
    description:
      'Bahan diekstrak secara etis dari mitra global yang mematuhi praktik perkebunan berkelanjutan.',
  },
  {
    title: 'Small Batches',
    description:
      'Setiap batch diproduksi dalam jumlah terbatas untuk menjaga konsistensi dan kualitas aroma.',
  },
  {
    title: 'Produk Asli 100%',
    description:
      'Semua fragrans dijamin autentik, disimpan dan dikirim sesuai standar penyimpanan premium.',
  },
  {
    title: 'Artisanal Craft',
    description:
      'Diformulasikan oleh perfumer yang memadukan tradisi Timur dan Barat dalam setiap komposisi.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A3728] flex flex-col">
      <CatalogNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[420px] flex items-end overflow-hidden">
          <img
            src="/images/esscentia_16.png"
            alt="Esscentia artisanal fragrance"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/90 via-[#4A3728]/40 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14 pt-32">
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-300 mb-4">
              Tentang Esscentia
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-[#F9F7F2] max-w-2xl leading-tight">
              Discover Your <br></br>
              Signature Scent
            </h1>
          </div>
        </section>
 
        {/* Intro */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-serif italic">
            &ldquo;Di Esscentia, kami percaya bahwa belanja parfum secara online haruslah menjadi pengalaman yang aman, transparan, dan menyenangkan. Kami menghubungkan Anda dengan wewangian original terbaik dunia.&rdquo;
          </p>
        </section>
 
        {/* Story two-column */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] overflow-hidden bg-stone-200">
              <img
                src="/images/craftsmanship.png"
                alt="Perfume craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">
                Layanan Kami
              </p>
              <h2 className="text-3xl font-serif text-[#4A3728] mb-6">Butik Digital Parfum Autentik</h2>
              <div className="space-y-5 text-stone-600 text-[15px] leading-relaxed">
                <p>
                  Esscentia didirikan sebagai platform e-commerce parfum terkurasi untuk memudahkan pencinta wewangian di seluruh Indonesia mendapatkan produk 100% original. Kami bermitra langsung dengan distributor resmi dan kurator wewangian independen untuk memastikan setiap produk yang Anda beli terjamin keasliannya.
                </p>
                <p>
                  Kami memahami bahwa memilih parfum secara online bisa menjadi tantangan tersendiri. Oleh karena itu, Esscentia memelopori layanan pembelian parfum dalam ukuran <em>decant</em> (1ml, 2ml, 5ml, 10ml) yang dikemas secara steril, serta menghadirkan fitur <em>Fragrance Quiz</em> pintar untuk membantu menemukan aroma yang paling sesuai dengan kepribadian Anda.
                </p>
                <p>
                  Dari parfum desainer ternama hingga wewangian niche yang langka, misi kami adalah menghadirkan butik parfum mewah langsung ke layar perangkat Anda dengan jaminan pengemasan premium dan pengiriman aman ke seluruh Nusantara.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[#EDEAE4]/50 border-y border-stone-200/60 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 text-center mb-3">
              Our Philosophy
            </p>
            <h2 className="text-3xl font-serif text-[#4A3728] text-center mb-12">
              Mengapa Esscentia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((item) => (
                <div key={item.title} className="text-center lg:text-left">
                  <h3 className="text-sm uppercase tracking-[0.15em] text-[#8D4F38] font-medium mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">Visi</p>
              <h2 className="text-2xl font-serif text-[#4A3728] mb-4">
                Menjadi kurator fragrans terpercaya di Indonesia
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Kami ingin setiap pelanggan menemukan aroma yang menjadi bagian dari identitas
                mereka — dengan layanan yang setara dengan pengalaman butik parfum internasional.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-4">Misi</p>
              <ul className="space-y-3 text-sm text-stone-600 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-[#8C7355] shrink-0">—</span>
                  Menyediakan koleksi parfum artisanal berkualitas tinggi
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8C7355] shrink-0">—</span>
                  Menjaga keaslian dan standar penyimpanan setiap produk
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8C7355] shrink-0">—</span>
                  Memberikan edukasi aroma melalui The Journal
                </li>
                <li className="flex gap-3">
                  <span className="text-[#8C7355] shrink-0">—</span>
                  Berkomitmen pada sourcing berkelanjutan dan kemasan ramah lingkungan
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-[#4A3728] text-[#F9F7F2] px-8 py-12 md:px-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-2xl font-serif mb-3">Hubungi Kami</h2>
              <p className="text-stone-300 text-sm leading-relaxed max-w-md">
                Jl. Kebenaran
                <br />
                support@esscentia.com · +62 812-3456-7890
                
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/contact"
                className="px-8 py-3 border border-[#F9F7F2]/40 text-center text-xs uppercase tracking-[0.15em] hover:bg-[#F9F7F2] hover:text-[#4A3728] transition"
              >
                Kontak
              </Link>
              <Link
                href="/products"
                className="px-8 py-3 bg-[#F9F7F2] text-[#4A3728] text-center text-xs uppercase tracking-[0.15em] hover:bg-[#EDEAE4] transition"
              >
                Jelajahi Koleksi
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CatalogFooter variant="catalog" />
    </div>
  );
}
