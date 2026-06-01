import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#4A3728] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="font-bold text-lg">Esscentia</span>
            </div>
            <p className="text-gray-400 text-sm">
              Toko parfum online terlengkap dengan koleksi eksklusif dari brand ternama dunia.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Produk</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Semua Produk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: support@esscentia.com</li>
              <li>Telepon: +62 8XX XXXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-center text-gray-400">&copy; 2024 Esscentia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
