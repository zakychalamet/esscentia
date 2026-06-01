'use client';

import { useRouter, useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { ChevronLeft } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const handleBack = () => {
    router.push('/admin/products');
  };

  if (!id) {
    return (
      <div className="py-20 text-center text-stone-500 font-serif text-sm">
        Mempersiapkan penyuntingan wewangian...
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#4A3728]">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-[#E7E5E0]">
        <button
          onClick={handleBack}
          className="self-start flex items-center gap-1.5 text-[10px] font-serif uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#4A3728] transition bg-transparent border-0 cursor-pointer p-0"
        >
          <ChevronLeft size={14} /> Kembali ke Koleksi
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#4A3728] tracking-tight font-semibold">
            Edit Rincian Fragrans
          </h1>
          <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">
            Perbarui karakteristik, varian harga, atau media visual produk terpilih
          </p>
        </div>
      </div>

      {/* Reusable Form in Edit Mode */}
      <div className="w-full">
        <ProductForm productId={id} onSuccess={handleBack} onCancel={handleBack} />
      </div>
    </div>
  );
}
