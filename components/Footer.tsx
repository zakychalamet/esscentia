import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#E8E6E1] text-[#4A3728] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif mb-4">Esscentia</h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-xs">
              Platform e-commerce parfum premium terkurasi. Menawarkan koleksi wewangian original desainer dan niche ternama serta decant steril berkualitas tinggi.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">Belanja</h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li><Link href="/products" className="hover:text-[#4A3728] transition">Semua Produk</Link></li>
              <li><Link href="/products" className="hover:text-[#4A3728] transition">Produk Baru</Link></li>
              <li><Link href="/decants" className="hover:text-[#4A3728] transition">Decant</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">Bantuan</h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li><Link href="/contact" className="hover:text-[#4A3728] transition">Hubungi Kami</Link></li>
              <li><Link href="/faq" className="hover:text-[#4A3728] transition">Tanya Jawab (FAQ)</Link></li>
              <li><Link href="/privacy" className="hover:text-[#4A3728] transition">Kebijakan Privasi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-medium text-stone-500">Ikuti Kami</h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li><a href="#" className="hover:text-[#4A3728] transition">Instagram</a></li>
              <li><a href="#" className="hover:text-[#4A3728] transition">Facebook</a></li>
              <li><a href="#" className="hover:text-[#4A3728] transition">Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-stone-500 tracking-wide pt-8 border-t border-stone-300/40">
          © 2026 Esscentia. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
