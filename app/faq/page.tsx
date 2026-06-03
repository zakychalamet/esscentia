'use client';

import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

type CategoryType = 'all' | 'product' | 'delivery' | 'policy';

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<CategoryType>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'Semua Pertanyaan' },
    { id: 'product', label: 'Produk & Keaslian' },
    { id: 'delivery', label: 'Pengiriman & Transaksi' },
    { id: 'policy', label: 'Kebijakan & Lainnya' },
  ] as const;

  const faqs = [
    {
      category: 'product',
      question: 'Apakah semua produk dijamin asli?',
      answer:
        'Ya, semua wewangian yang tersedia di Esscentia dijamin 100% asli dan bersumber langsung dari produsen atau distributor resmi kami. Setiap botol dikirimkan dalam kemasan segel asli untuk menjaga integritas aroma.',
    },
    {
      category: 'product',
      question: 'Bagaimana jika produk yang saya terima rusak?',
      answer:
        'Jika botol parfum pecah atau rusak selama proses pengiriman, mohon segera hubungi kami dalam 2x24 jam dengan melampirkan video unboxing. Kami akan mengirimkan unit pengganti yang baru secara gratis tanpa biaya pengiriman tambahan.',
    },
    {
      category: 'delivery',
      question: 'Berapa lama waktu pengiriman?',
      answer:
        'Waktu pengiriman bervariasi tergantung lokasi Anda. Untuk wilayah Jabodetabek, pengiriman reguler membutuhkan waktu 1-3 hari kerja. Untuk wilayah luar Jawa, estimasi pengiriman adalah 3-7 hari kerja.',
    },
    {
      category: 'delivery',
      question: 'Apakah ada biaya pengiriman?',
      answer:
        'Kami menyediakan layanan gratis ongkos kirim ke seluruh wilayah Indonesia untuk setiap transaksi dengan nilai minimal Rp 750.000. Untuk transaksi di bawah jumlah tersebut, biaya pengiriman flat ditentukan saat checkout sesuai lokasi kurir.',
    },
    {
      category: 'delivery',
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer:
        'Kami mendukung berbagai gerbang pembayaran aman termasuk Transfer Bank otomatis (Virtual Account), Kartu Kredit, QRIS, serta layanan dompet digital terkemuka.',
    },
    {
      category: 'delivery',
      question: 'Bagaimana cara melacak status pesanan saya?',
      answer:
        'Setelah paket Anda dikirimkan oleh tim logistik kami, nomor resi pengiriman akan dikirimkan otomatis ke alamat email yang terdaftar. Anda juga dapat memantau status pesanan secara langsung melalui halaman pelacakan di website kami.',
    },
    {
      category: 'policy',
      question: 'Apa kebijakan pengembalian barang?',
      answer:
        'Demi menjaga standar kebersihan dan kualitas wewangian, produk yang telah dibuka segelnya tidak dapat dikembalikan kecuali terjadi cacat produk atau kesalahan pengiriman dari pihak kami.',
    },
    {
      category: 'policy',
      question: 'Apakah Esscentia menerima pesanan korporat atau suvenir acara?',
      answer:
        'Ya, kami menyediakan layanan kustomisasi botol dan paket bingkisan wewangian premium untuk kebutuhan korporasi, pernikahan, dan acara spesial. Hubungi kami melalui surel di admin@esscentia.com untuk konsultasi desain.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) => activeTab === 'all' || faq.category === activeTab
  );

  return (
    <>
      <CatalogNav />
      <div className="flex-1 bg-[#F9F7F2] min-h-screen">
        {/* Header Hero */}
        <div className="bg-[#EDEAE4]/50 border-b border-[#E7E5E0] py-16 md:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7355] font-bold mb-2">FAQ & Help</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3728]">Pertanyaan Umum</h1>
            <div className="h-0.5 w-12 bg-[#8C7355] mx-auto my-6"></div>
            <p className="text-stone-500 text-sm font-light max-w-md mx-auto leading-relaxed">
              Temukan jawaban untuk berbagai pertanyaan umum seputar koleksi, pengiriman, dan layanan eksklusif Esscentia.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10 pb-4 border-b border-stone-200/50">
            {categories.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setOpenIndex(null); // Reset open accordion index
                }}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider transition rounded-full cursor-pointer font-semibold border ${
                  activeTab === tab.id
                    ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-xs'
                    : 'bg-white text-stone-500 border-[#E7E5E0] hover:text-[#4A3728] hover:border-stone-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#E7E5E0] rounded-lg overflow-hidden transition duration-300 hover:border-[#8C7355]/30 shadow-2xs"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 hover:bg-[#EDEAE4]/10 transition text-left cursor-pointer"
                  >
                    <h3 className="font-serif font-semibold text-[#4A3728] text-base pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      size={16}
                      className={`text-[#8C7355] flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openIndex === index && (
                    <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-[#F9F7F2]/40 text-stone-500 font-light text-xs sm:text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-stone-400 font-light text-sm">
                Tidak ada pertanyaan dalam kategori ini.
              </div>
            )}
          </div>

          {/* Call To Action Box */}
          <div className="mt-16 p-8 bg-white border border-[#E7E5E0] rounded-lg text-center max-w-xl mx-auto shadow-xs hover:border-[#8C7355]/30 transition duration-300">
            <div className="p-3 bg-[#EDEAE4]/30 rounded-full w-fit mx-auto mb-4">
              <HelpCircle className="text-[#8C7355]" size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A3728] mb-2">Masih Memiliki Pertanyaan?</h3>
            <p className="text-stone-500 text-sm font-light mb-6">
              Tim pelayanan pelanggan kami siap mendampingi Anda memilih wewangian yang sesuai dengan karakter Anda.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-[#8D4F38] text-[#F9F7F2] text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#7a4532] transition hover:shadow-xs active:scale-[0.99] rounded-xs"
            >
              Hubungi Penasihat Kami
            </a>
          </div>
        </div>
      </div>
      <CatalogFooter />
    </>
  );
}
