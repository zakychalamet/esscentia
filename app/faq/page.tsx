'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Apakah semua produk dijamin asli?',
      answer:
        'Ya, semua produk yang kami jual dijamin 100% asli dan original dari distributor resmi. Kami bekerja sama langsung dengan brand ternama untuk memastikan keaslian produk.',
    },
    {
      question: 'Berapa lama waktu pengiriman?',
      answer:
        'Waktu pengiriman tergantung pada metode yang dipilih. Reguler 3-5 hari, Express 1-2 hari, dan Same Day tersedia untuk area tertentu.',
    },
    {
      question: 'Apa kebijakan pengembalian barang?',
      answer:
        'Kami menawarkan garansi uang kembali 100% dalam 30 hari jika Anda tidak puas dengan produk. Prosesnya mudah dan tidak perlu pertanyaan berbelit.',
    },
    {
      question: 'Apakah ada biaya pengiriman?',
      answer:
        'Pengiriman gratis untuk pembelian di atas Rp 500.000. Untuk pembelian di bawah jumlah tersebut, biaya pengiriman adalah Rp 50.000.',
    },
    {
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer:
        'Kami menerima transfer bank, e-wallet (GCash, Jeepney), dan bayar di tempat (COD) untuk area tertentu.',
    },
    {
      question: 'Bagaimana cara melacak pesanan saya?',
      answer:
        'Setelah pesanan dikonfirmasi, Anda akan menerima nomor tracking melalui email. Gunakan nomor tersebut untuk melacak paket Anda secara real-time.',
    },
    {
      question: 'Apakah Anda melayani pesanan korporat?',
      answer:
        'Ya, kami melayani pesanan korporat dengan harga spesial. Hubungi tim sales kami di admin@esscentia.com untuk informasi lebih lanjut.',
    },
    {
      question: 'Bagaimana jika produk yang diterima rusak?',
      answer:
        'Jika produk rusak saat pengiriman, segera hubungi customer service kami dengan foto bukti. Kami akan mengganti produk tersebut tanpa biaya tambahan.',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">Pertanyaan Umum</h1>
          <p className="text-gray-600 mb-12">
            Temukan jawaban untuk pertanyaan umum tentang Esscentia
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 hover:bg-purple-50 transition"
                >
                  <h3 className="font-bold text-lg text-left">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-bold text-lg mb-2">Tidak menemukan jawaban?</h3>
            <p className="text-gray-700 mb-4">
              Hubungi tim customer service kami untuk bantuan lebih lanjut.
            </p>
            <a
              href="/contact"
              className="text-purple-600 font-semibold hover:underline"
            >
              Hubungi Kami →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
