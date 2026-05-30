'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">Kebijakan Privasi</h1>
          <p className="text-gray-600 mb-8">Terakhir diperbarui: Januari 2024</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Pengenalan</h2>
              <p>
                Esscentia menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. Informasi Apa yang Kami Kumpulkan</h2>
              <p>Kami dapat mengumpulkan informasi berikut:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Informasi pribadi (nama, email, nomor telepon, alamat)</li>
                <li>Informasi pembayaran (kartu kredit, detail transfer bank)</li>
                <li>Riwayat pembelian dan preferensi produk</li>
                <li>Data penggunaan website (cookies, log IP)</li>
                <li>Pesan dan komunikasi dengan customer service</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Bagaimana Kami Menggunakan Informasi</h2>
              <p>Informasi Anda digunakan untuk:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Memproses pesanan dan pengiriman</li>
                <li>Memberikan layanan pelanggan yang baik</li>
                <li>Mengirimkan update tentang pesanan Anda</li>
                <li>Meningkatkan website dan layanan kami</li>
                <li>Mencegah penipuan dan keamanan</li>
                <li>Mengirimkan newsletter (dengan persetujuan Anda)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Keamanan Data</h2>
              <p>
                Kami menggunakan enkripsi SSL dan protokol keamanan lainnya untuk melindungi informasi pribadi Anda. Namun, tidak ada sistem yang 100% aman. Kami akan segera memberitahu jika ada pelanggaran data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Berbagi Data Pihak Ketiga</h2>
              <p>
                Kami tidak menjual atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Kepada mitra kurir untuk pengiriman</li>
                <li>Kepada penyedia layanan pembayaran</li>
                <li>Jika diwajibkan oleh hukum</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Hak Anda</h2>
              <p>Anda memiliki hak untuk:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Mengakses data pribadi Anda</li>
                <li>Meminta koreksi data yang tidak akurat</li>
                <li>Menghapus akun Anda</li>
                <li>Membatalkan langganan newsletter</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
              <p>
                Website kami menggunakan cookies untuk meningkatkan pengalaman pengguna. Anda dapat menonaktifkan cookies melalui pengaturan browser Anda.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">8. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, hubungi kami di privacy@esscentia.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
