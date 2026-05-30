'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">Syarat dan Ketentuan</h1>
          <p className="text-gray-600 mb-8">Terakhir diperbarui: Januari 2024</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Penerimaan Syarat</h2>
              <p>
                Dengan menggunakan website Esscentia, Anda menerima dan setuju untuk terikat oleh semua syarat dan ketentuan yang tercantum di sini. Jika Anda tidak setuju dengan syarat-syarat ini, mohon jangan gunakan website kami.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. Lisensi Penggunaan</h2>
              <p>
                Kami memberikan Anda lisensi terbatas untuk mengakses dan menggunakan website ini untuk tujuan pribadi. Anda tidak diizinkan untuk:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Menjual atau mentransfer akses</li>
                <li>Menggunakan untuk keperluan komersial tanpa izin</li>
                <li>Melakukan hacking atau manipulasi website</li>
                <li>Mengumpulkan data skala besar tanpa izin</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Akurasi Produk</h2>
              <p>
                Kami berusaha memberikan deskripsi dan harga produk yang akurat. Namun, kesalahan dapat terjadi. Kami berhak menolak atau membatalkan pesanan jika ada kesalahan harga atau ketersediaan stok.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Kebijakan Pengembalian</h2>
              <p>Produk dapat dikembalikan dalam 30 hari dengan kondisi:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Produk dalam kondisi asli dengan kemasan utuh</li>
                <li>Belum digunakan</li>
                <li>Disertai dengan bukti pembelian</li>
                <li>Pengiriman kembali ditanggung pelanggan</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Tanggung Jawab Pengguna</h2>
              <p>Anda bertanggung jawab untuk:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Menjaga kerahasiaan password akun Anda</li>
                <li>Memberikan informasi yang akurat saat checkout</li>
                <li>Meninjau pesanan sebelum finalisasi</li>
                <li>Tidak melakukan aktivitas ilegal</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Batasan Tanggung Jawab</h2>
              <p>
                Esscentia tidak bertanggung jawab atas kerusakan tidak langsung, kehilangan data, atau kehilangan keuntungan yang timbul dari penggunaan website ini.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Harga dan Pembayaran</h2>
              <p>
                Semua harga dalam Rupiah dan sudah termasuk pajak (jika ada). Kami menerima berbagai metode pembayaran. Pembayaran harus diselesaikan sebelum produk dikirim.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">8. Pengiriman</h2>
              <p>
                Kami bekerja sama dengan mitra kurir untuk pengiriman. Waktu pengiriman adalah perkiraan dan bukan jaminan. Kami tidak bertanggung jawab atas keterlambatan atau kerusakan yang disebabkan oleh kurir.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">9. Konten Pengguna</h2>
              <p>
                Jika Anda mengirimkan ulasan, komentar, atau konten lain ke website kami, Anda memberikan kami hak untuk menggunakan konten tersebut secara bebas.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">10. Perubahan Syarat</h2>
              <p>
                Kami berhak mengubah syarat dan ketentuan kapan saja. Perubahan akan berlaku segera setelah diposting di website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">11. Hukum yang Berlaku</h2>
              <p>
                Syarat dan ketentuan ini diatur oleh hukum Indonesia dan Anda menyetujui yurisdiksi eksklusif pengadilan Indonesia.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">12. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, hubungi kami di support@esscentia.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
