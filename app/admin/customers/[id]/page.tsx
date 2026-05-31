'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  BarChart2,
  TrendingUp,
  Activity,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import type { RfmSegmentLabel } from '@/lib/customer-rfm';

interface CustomerDetailData {
  id: string;
  name: string;
  email: string;
  initials: string;
  segment: RfmSegmentLabel;
  segmentColor: string;
  rfmScore: string;
  recencyDays: number;
  orders: number;
  spend: number;
  spendFormatted: string;
  lastActive: string;
  loginCount: number;
  recencyScore: number;
  frequencyScore: number;
  monetaryScore: number;
  avgOrderValue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    date: string;
    products: string;
    amount: number;
    status: string;
  }[];
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<CustomerDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setCustomer)
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return <div className="py-16 text-center text-slate-500 text-sm">Memuat profil pelanggan...</div>;
  }

  if (!customer) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600 mb-4">Pelanggan tidak ditemukan</p>
        <Link href="/admin/customers" className="text-indigo-600 text-sm hover:underline">
          ← Kembali ke Customer Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-slate-800 pb-10">
      <div className="flex items-center text-sm text-slate-500 mb-8">
        <Link href="/admin/customers" className="hover:text-slate-800">
          Customers
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="font-semibold text-slate-800">{customer.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700 border border-purple-200">
                {customer.initials}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-2xl font-bold">{customer.name}</h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider ${customer.segmentColor}`}
                  >
                    {customer.segment.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-500 text-sm">{customer.email}</div>
                <div className="text-slate-400 text-xs mt-1">
                  Login {customer.loginCount}x · Terakhir aktif {customer.lastActive}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">RFM & Segment Summary</h2>
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm font-medium">
                <BarChart2 size={16} />
                <span>RFM Score: {customer.rfmScore}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="text-slate-500 text-xs font-bold tracking-wider mb-1 uppercase">
                  Recency
                </div>
                <div className="text-3xl font-bold mb-1">
                  {customer.recencyDays}{' '}
                  <span className="text-sm font-medium text-slate-500">hari</span>
                </div>
                <div className="text-xs text-slate-400">Skor: {customer.recencyScore}/5</div>
              </div>
              <div className="sm:border-l sm:border-slate-100 sm:pl-8">
                <div className="text-slate-500 text-xs font-bold tracking-wider mb-1 uppercase">
                  Frequency
                </div>
                <div className="text-3xl font-bold mb-1">
                  {customer.orders}{' '}
                  <span className="text-sm font-medium text-slate-500">pesanan</span>
                </div>
                <div className="text-xs text-slate-400">Skor: {customer.frequencyScore}/5</div>
              </div>
              <div className="sm:border-l sm:border-slate-100 sm:pl-8">
                <div className="text-slate-500 text-xs font-bold tracking-wider mb-1 uppercase">
                  Monetary Value
                </div>
                <div className="text-3xl font-bold mb-1">
                  {customer.spendFormatted}{' '}
                  <span className="text-sm font-medium text-slate-500">IDR</span>
                </div>
                <div className="text-xs text-slate-400">Skor: {customer.monetaryScore}/5</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-wider mb-3 uppercase">
                <CreditCard size={14} /> Avg. Order Value
              </div>
              <div className="text-2xl font-bold">
                {customer.avgOrderValue.toLocaleString('id-ID')}{' '}
                <span className="text-sm font-medium text-slate-500">IDR</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-wider mb-3 uppercase">
                <Activity size={14} /> Last Activity
              </div>
              <div className="text-slate-800 font-medium">{customer.lastActive}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold">Recent Transactions</h2>
            </div>
            {customer.recentOrders.length === 0 ? (
              <p className="p-8 text-center text-slate-500 text-sm">
                Belum ada transaksi. Pesanan checkout akan tercatat di sini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Product(s)</th>
                      <th className="px-6 py-4 text-right">Amount (IDR)</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customer.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-500">{order.date}</td>
                        <td className="px-6 py-4 text-slate-500">{order.orderNumber}</td>
                        <td className="px-6 py-4 font-medium">{order.products}</td>
                        <td className="px-6 py-4 text-right font-medium">
                          {order.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-80">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" />
              Insight RFM
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pelanggan ini masuk segmen <strong>{customer.segment}</strong> berdasarkan
              perilaku login dan pembelian. Gunakan data ini untuk kampanye retensi atau
              penawaran eksklusif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
