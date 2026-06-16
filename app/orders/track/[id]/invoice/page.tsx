'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  price: number;
  productImage?: string | null;
}

interface OrderRecord {
  id: string;
  userId: string | null;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  shipMethod: string;
  paymentMethod: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  notes: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data invoice');
        return res.json();
      })
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center py-24 text-[#4A3728] font-sans">
        <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-light">Memuat invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center py-24 text-center px-4 font-sans">
        <p className="text-[#8D4F38] text-sm font-semibold mb-3">Error</p>
        <h1 className="text-2xl font-serif font-bold text-[#4A3728] mb-4">Invoice Tidak Ditemukan</h1>
        <p className="text-stone-500 text-sm mb-8 max-w-md">{error || 'Data pesanan gagal dimuat.'}</p>
        <Link
          href="/orders/track"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4A3728] hover:bg-[#8C7355] text-white text-xs uppercase tracking-wider transition rounded-sm font-semibold"
        >
          <ArrowLeft size={14} /> Kembali ke Lacak Pesanan
        </Link>
      </div>
    );
  }

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-stone-50/50 print:bg-white text-[#4A3728]">
      {/* Dynamic styles to ensure perfect print outcome */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Top action bar (hidden during print) */}
      <div className="bg-white border-b border-stone-200/60 py-3.5 px-6 sm:px-8 flex items-center justify-between no-print shadow-xs font-sans">
        <div className="flex items-center gap-3">
          <Link
            href="/orders/track"
            className="flex items-center gap-2 text-stone-600 hover:text-[#4A3728] text-xs font-semibold uppercase tracking-wider transition"
          >
            <ArrowLeft size={14} /> Kembali
          </Link>
          <span className="text-stone-300">|</span>
          <p className="text-xs text-stone-500 font-light">
            Invoice: <span className="font-mono font-semibold">{order.orderNumber}</span>
          </p>
        </div>
      </div>

      {/* Main Invoice Card Wrapper Spacer */}
      <div className="my-8 no-print"></div>

      {/* Printable Invoice Page */}
      <div className="print-container bg-white max-w-3xl mx-auto p-8 sm:p-12 border border-[#E7E5E0] rounded-lg shadow-xs print:shadow-none print:border-none print:my-0 print:p-0 font-serif">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-stone-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-[#4A3728] font-serif uppercase">ESSCENTIA</h1>
            <p className="text-stone-500 text-xs italic tracking-wide font-sans mt-1">Artisanal Botanical Fragrances</p>
            <div className="text-stone-400 text-[10px] mt-4 space-y-0.5 font-sans not-italic leading-relaxed">
              <p>Jakarta, Indonesia</p>
              <p>Email: concierge@esscentia.com</p>
              <p>Web: www.esscentia.com</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold tracking-widest text-[#8C7355] font-serif uppercase mb-2">INVOICE</h2>
            <div className="text-xs space-y-1 font-sans text-stone-600">
              <p>No. Pesanan: <span className="font-mono font-semibold text-[#4A3728]">{order.orderNumber}</span></p>
              <p>Tanggal: <span>{invoiceDate}</span></p>
              <p>Metode Bayar: <span className="uppercase">{order.paymentMethod}</span></p>
              <p className="mt-1">
                Status: <span className={`inline-block px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wide border ${
                  order.status === 'completed'
                    ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50'
                    : order.status === 'pending'
                    ? 'border-amber-200 text-amber-700 bg-amber-50/50'
                    : 'border-stone-200 text-stone-600 bg-stone-50'
                }`}>{order.status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-stone-100 font-sans">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold mb-3">Tujuan Pengiriman</h3>
            <div className="text-xs space-y-1 text-stone-600 leading-relaxed">
              <p className="font-semibold text-[#4A3728] text-sm">{order.shippingName}</p>
              <p>Email: {order.shippingEmail}</p>
              <p>Telp: {order.shippingPhone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold mb-3">Alamat Pengiriman</h3>
            <div className="text-xs space-y-1 text-stone-600 leading-relaxed">
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}</p>
              <p className="text-stone-400 italic text-[10px] mt-1">Kurir: <span className="uppercase font-semibold">{order.shipMethod}</span></p>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse text-left font-sans">
            <thead>
              <tr className="border-b border-stone-200 text-[10px] uppercase tracking-widest text-[#8C7355] font-bold">
                <th className="py-3 font-semibold">Nama Item</th>
                <th className="py-3 text-right font-semibold">Harga Satuan</th>
                <th className="py-3 text-center font-semibold">Jumlah</th>
                <th className="py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-stone-100 text-stone-700">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/20">
                  <td className="py-4 font-serif font-semibold text-[#4A3728] pr-4">
                    {item.productName}
                  </td>
                  <td className="py-4 text-right font-mono">{formatPrice(item.price)}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right font-mono font-semibold text-[#4A3728]">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="font-sans text-xs">
            {order.notes && (
              <>
                <h4 className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold mb-2">Catatan Tambahan</h4>
                <p className="text-stone-500 bg-stone-50/50 border border-[#E7E5E0]/60 p-3 rounded-sm leading-relaxed italic">
                  &ldquo;{order.notes}&rdquo;
                </p>
              </>
            )}
          </div>
          <div>
            <div className="border-t-2 border-stone-200 pt-4 space-y-3 font-sans text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Biaya Pengiriman</span>
                <span className="font-mono">{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-[#4A3728] font-bold text-sm border-t border-stone-100 pt-3">
                <span className="font-serif">Total Transaksi</span>
                <span className="font-mono text-[#8D4F38]">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="border-t border-stone-200 mt-16 pt-8 text-center text-stone-400 text-[10px] uppercase tracking-widest font-sans leading-relaxed">
          <p className="font-serif text-stone-500 italic lowercase tracking-wide mb-2 normal-case">
            Terima kasih atas pembelian Anda di Esscentia. Wewangian Anda diramu dengan penuh dedikasi.
          </p>
          <p>&copy; 2026 Esscentia. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
