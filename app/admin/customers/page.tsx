'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { RfmSegmentLabel } from '@/lib/customer-rfm';

interface CustomerRow {
  id: string;
  initials: string;
  name: string;
  email: string;
  segment: RfmSegmentLabel;
  segmentColor: string;
  orders: number;
  spendFormatted: string;
  lastActive: string;
  loginCount: number;
  rfmScore: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.id.includes(q);
      const matchesSegment = segmentFilter === 'all' || cust.segment === segmentFilter;
      return matchesSearch && matchesSegment;
    });
  }, [customers, searchTerm, segmentFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-800 pb-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Customer Directory</h1>
        <p className="text-slate-500 text-sm">
          Pelanggan terdaftar dan login — dianalisis dengan metode RFM (Recency, Frequency, Monetary).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-[#fafafa]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari pelanggan berdasarkan nama, email, atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[140px]"
            >
              <option value="all">Semua Segmen</option>
              <option value="Champions">Champions</option>
              <option value="Loyal/Steady">Loyal/Steady</option>
              <option value="At Risk">At Risk</option>
            </select>
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm bg-white hover:bg-slate-50 transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Memuat data pelanggan...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Belum ada pelanggan terdaftar. User yang mendaftar dan login akan muncul di sini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Segment (RFM)</th>
                  <th className="px-6 py-4 text-right">Total Orders</th>
                  <th className="px-6 py-4 text-right">Total Spend (IDR)</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-center">Login</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-purple-100 text-purple-700">
                          {cust.initials}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{cust.name}</div>
                          <div className="text-slate-500 text-xs">{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-medium ${cust.segmentColor}`}>
                        {cust.segment}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">RFM {cust.rfmScore}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-700">{cust.orders}</td>
                    <td className="px-6 py-4 text-right text-slate-700 font-medium">{cust.spendFormatted}</td>
                    <td className="px-6 py-4 text-slate-500">{cust.lastActive}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{cust.loginCount}x</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>
            Menampilkan <strong className="font-medium text-slate-700">{filtered.length}</strong> dari{' '}
            <strong className="font-medium text-slate-700">{customers.length}</strong> pelanggan
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-indigo-100 text-indigo-700 font-medium text-sm">
              1
            </button>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
