'use client';

import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'pengenalan',
      title: '1. Pengenalan',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Esscentia menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda ketika Anda mengunjungi situs kami atau menggunakan layanan kami.
        </p>
      ),
    },
    {
      id: 'informasi',
      title: '2. Informasi Apa yang Kami Kumpulkan',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed font-light">
            Kami dapat mengumpulkan beberapa jenis data dari Anda untuk memastikan pengalaman berbelanja yang terbaik:
          </p>
          <ul className="space-y-3 mt-4 text-stone-600 font-light">
            {[
              'Informasi pribadi (nama lengkap, alamat email, nomor telepon, alamat pengiriman)',
              'Informasi pembayaran (enkripsi detail transaksi transfer bank atau gerbang pembayaran)',
              'Riwayat pembelian, daftar keinginan (wishlist), dan preferensi produk',
              'Data teknis penggunaan website (cookies, alamat IP, tipe browser, log akses)',
              'Catatan komunikasi dan pesan dengan layanan pelanggan kami',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="text-[#8C7355] mt-1.5 shrink-0 text-xs">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'penggunaan',
      title: '3. Bagaimana Kami Menggunakan Informasi',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed font-light">
            Data pribadi Anda dikumpulkan dan diproses secara aman untuk tujuan berikut:
          </p>
          <ul className="space-y-3 mt-4 text-stone-600 font-light">
            {[
              'Memproses transaksi Anda dan mengatur pengiriman parfum ke alamat Anda',
              'Memberikan layanan pelanggan terbaik untuk membalas pertanyaan atau keluhan Anda',
              'Mengirimkan pemberitahuan penting mengenai status pesanan dan pelacakan kurir',
              'Menganalisis penggunaan situs untuk meningkatkan performa dan fitur website kami',
              'Mencegah aktivitas ilegal, transaksi mencurigakan, dan melindungi keamanan akun Anda',
              'Mengirimkan informasi produk baru dan penawaran eksklusif (jika Anda menyetujuinya)',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="text-[#8C7355] mt-1.5 shrink-0 text-xs">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'keamanan',
      title: '4. Keamanan Data',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Keamanan informasi Anda adalah prioritas kami. Kami menggunakan teknologi enkripsi enkripsi SSL (Secure Sockets Layer), penyimpanan data yang aman, dan protokol otorisasi ketat untuk melindungi data pribadi Anda dari akses yang tidak sah. Meskipun demikian, perlu dipahami bahwa metode pengiriman atau penyimpanan data elektronik di internet tidak ada yang 100% aman.
        </p>
      ),
    },
    {
      id: 'pihak-ketiga',
      title: '5. Berbagi Data Pihak Ketiga',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed font-light">
            Kami tidak menjual, menukarkan, atau menyewakan informasi pribadi Anda kepada pihak luar. Kami hanya membagikan data Anda dengan pihak ketiga tepercaya untuk keperluan operasional berikut:
          </p>
          <ul className="space-y-3 mt-4 text-stone-600 font-light">
            {[
              'Perusahaan kurir pihak ketiga untuk melakukan pengiriman produk fisik',
              'Penyedia gerbang pembayaran (payment gateway) untuk memproses pembayaran online Anda secara aman',
              'Otoritas hukum, jika diwajibkan secara resmi oleh undang-undang yang berlaku di Indonesia',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="text-[#8C7355] mt-1.5 shrink-0 text-xs">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'hak-anda',
      title: '6. Hak Anda',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed font-light">
            Sebagai pengguna, Anda memiliki kendali penuh atas informasi pribadi Anda sendiri:
          </p>
          <ul className="space-y-3 mt-4 text-stone-600 font-light">
            {[
              'Mengakses data pribadi Anda yang tersimpan di server kami kapan saja',
              'Meminta perbaikan atau pembaharuan data yang tidak akurat atau kedaluwarsa',
              'Meminta penghapusan akun Anda secara permanen beserta riwayat terkait',
              'Membatalkan langganan buletin promosi kami melalui tautan di bagian bawah email kami',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className="text-[#8C7355] mt-1.5 shrink-0 text-xs">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'cookies',
      title: '7. Cookies',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Website Esscentia menggunakan cookies untuk menganalisis arus pengunjung website, mempersonalisasi preferensi tampilan Anda, serta melacak produk yang Anda tambahkan ke keranjang belanja. Anda dapat memilih untuk menolak cookies melalui pengaturan browser Anda, namun beberapa fungsi website mungkin tidak dapat berjalan secara optimal.
        </p>
      ),
    },
    {
      id: 'hubungi',
      title: '8. Hubungi Kami',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Apabila Anda memiliki pertanyaan, keberatan, atau ingin meminta penghapusan data seputar kebijakan privasi ini, silakan hubungi tim legal kami melalui email resmi di{' '}
          <a href="mailto:privacy@esscentia.com" className="text-[#8D4F38] hover:text-[#4A3728] transition font-medium underline underline-offset-4">
            privacy@esscentia.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <>
      <CatalogNav />
      <div className="flex-1 bg-[#F9F7F2] min-h-screen">
        {/* Header Hero */}
        <div className="bg-[#EDEAE4]/50 border-b border-[#E7E5E0] py-16 md:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7355] font-bold mb-2">Legal & Policy</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3728]">Kebijakan Privasi</h1>
            <div className="h-0.5 w-12 bg-[#8C7355] mx-auto my-6"></div>
            <p className="text-stone-500 text-sm font-light italic">Terakhir diperbarui: Januari 2024</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 space-y-3 border-l border-[#E7E5E0] pl-6 py-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] font-bold mb-5">Navigasi</p>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-[11px] uppercase tracking-wider text-stone-500 hover:text-[#4A3728] transition font-medium hover:translate-x-1 duration-200"
                  >
                    {section.title.split('. ')[1]}
                  </a>
                ))}
              </div>
            </div>

            {/* Main Content Pane */}
            <div className="lg:col-span-3 space-y-14">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-white border border-[#E7E5E0] p-8 md:p-10 rounded-lg shadow-xs transition duration-300 hover:border-[#8C7355]/30 scroll-mt-28"
                >
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4A3728] mb-5 pb-3 border-b border-stone-100">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CatalogFooter />
    </>
  );
}
