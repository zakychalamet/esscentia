'use client';

import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';

export default function TermsPage() {
  const sections = [
    {
      id: 'penerimaan',
      title: '1. Penerimaan Syarat',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Dengan mengakses dan menggunakan website Esscentia, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan yang tercantum di halaman ini. Apabila Anda tidak menyetujui bagian mana pun dari syarat ini, Anda disarankan untuk tidak melanjutkan penggunaan website kami.
        </p>
      ),
    },
    {
      id: 'lisensi',
      title: '2. Lisensi Penggunaan',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed font-light">
            Kami memberikan hak lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan kepada Anda untuk mengakses website ini demi tujuan berbelanja pribadi. Anda secara tegas dilarang untuk:
          </p>
          <ul className="space-y-3 mt-4 text-stone-600 font-light">
            {[
              'Menyalin, memodifikasi, mendistribusikan, atau mengeksploitasi konten website untuk tujuan komersial tanpa izin tertulis dari Esscentia',
              'Melakukan rekayasa balik (reverse engineering) atau mencoba meretas sistem keamanan server kami',
              'Menggunakan alat otomatis (spider, scraper, robot) untuk mengumpulkan data dari website kami',
              'Mengirimkan konten atau materi promosi tanpa izin (spamming) melalui fitur kontak kami',
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
      id: 'akurasi',
      title: '3. Akurasi Informasi & Produk',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Kami berkomitmen untuk memberikan deskripsi produk wewangian, harga, dan ketersediaan stok seakurat mungkin. Namun, kesalahan ketik atau teknis dapat terjadi. Kami berhak untuk mengoreksi kesalahan tersebut dan membatalkan pesanan terkait apabila informasi yang disajikan terbukti tidak akurat.
        </p>
      ),
    },
    {
      id: 'pengembalian',
      title: '4. Kebijakan Pengembalian',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed font-light">
            Kami menghargai kepuasan Anda. Pengembalian produk dapat dilakukan dalam jangka waktu maksimal 30 hari sejak tanggal penerimaan dengan mematuhi ketentuan berikut:
          </p>
          <ul className="space-y-3 mt-4 text-stone-600 font-light">
            {[
              'Segel botol parfum harus dalam keadaan utuh dan belum pernah digunakan',
              'Produk dikembalikan dalam kemasan kotak aslinya tanpa kerusakan fisik',
              'Menyertakan bukti pembayaran atau invoice transaksi resmi dari Esscentia',
              'Biaya pengiriman untuk pengembalian barang sepenuhnya ditanggung oleh pelanggan, kecuali jika kesalahan pengiriman terjadi dari pihak kami',
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
      id: 'tanggung-jawab',
      title: '5. Tanggung Jawab Pengguna',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed font-light">
            Sebagai pengguna website, Anda berkewajiban untuk menjaga keamanan akun Anda sendiri dengan:
          </p>
          <ul className="space-y-3 mt-4 text-stone-600 font-light">
            {[
              'Menjaga kerahasiaan kata sandi (password) akun Anda dari pihak mana pun',
              'Memberikan detail informasi pengiriman yang lengkap, benar, dan terbaru saat melakukan pembelian',
              'Melakukan pembayaran tepat waktu sesuai tagihan yang telah disepakati',
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
      id: 'batasan',
      title: '6. Batasan Tanggung Jawab',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Esscentia beserta mitra kerja tidak bertanggung jawab atas kerugian, kerusakan, atau cedera tidak langsung yang timbul dari penyalahgunaan produk wewangian kami, keterlambatan pengiriman pihak logistik, atau ketidakmampuan Anda untuk mengakses situs kami karena kendala jaringan internet.
        </p>
      ),
    },
    {
      id: 'harga',
      title: '7. Harga & Pembayaran',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Semua nominal harga yang tertera di website adalah dalam mata uang Rupiah (IDR). Kami menerima transaksi pembayaran melalui Transfer Bank otomatis (Virtual Account), Kartu Kredit, dan metode pembayaran digital lainnya. Pesanan Anda baru akan diproses setelah transaksi pembayaran berhasil diverifikasi oleh sistem kami.
        </p>
      ),
    },
    {
      id: 'pengiriman',
      title: '8. Pengiriman Barang',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Kami menyerahkan proses pengiriman pesanan Anda kepada pihak jasa logistik tepercaya. Estimasi waktu sampai di tujuan adalah perkiraan yang diberikan oleh kurir dan bukan merupakan jaminan mutlak. Risiko kehilangan atau kerusakan selama pengiriman akan diselesaikan sesuai dengan kebijakan perlindungan kurir yang berlaku.
        </p>
      ),
    },
    {
      id: 'konten',
      title: '9. Konten Pengguna',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Setiap ulasan, testimonial, komentar, atau foto yang Anda kirimkan ke website kami akan dianggap sebagai konten non-rahasia. Dengan mengirimkannya, Anda memberikan hak tidak eksklusif dan bebas royalti kepada Esscentia untuk menggunakan, mereproduksi, dan mempublikasikan materi tersebut demi kepentingan promosi brand kami.
        </p>
      ),
    },
    {
      id: 'perubahan',
      title: '10. Perubahan Ketentuan',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Kami berhak untuk mengubah, menambah, atau menghapus sebagian syarat dan ketentuan ini kapan saja tanpa pemberitahuan tertulis sebelumnya. Anda diharapkan untuk meninjau halaman ini secara berkala untuk mengetahui pembaruan terbaru.
        </p>
      ),
    },
    {
      id: 'hukum',
      title: '11. Hukum yang Berlaku',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul dari atau terkait dengan penggunaan situs web ini akan diselesaikan secara musyawarah, atau melalui yurisdiksi pengadilan yang berwenang di Indonesia.
        </p>
      ),
    },
    {
      id: 'hubungi',
      title: '12. Hubungi Kami',
      content: (
        <p className="text-stone-600 leading-relaxed font-light">
          Apabila Anda memiliki pertanyaan, klarifikasi, atau keluhan seputar syarat dan ketentuan ini, silakan hubungi customer relation kami melalui email resmi di{' '}
          <a href="mailto:support@esscentia.com" className="text-[#8D4F38] hover:text-[#4A3728] transition font-medium underline underline-offset-4">
            support@esscentia.com
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
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7355] font-bold mb-2">Terms of Service</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3728]">Syarat &amp; Ketentuan</h1>
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
