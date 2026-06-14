'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import type { RfmSegmentLabel } from '@/lib/customer-rfm';

interface CustomerRow {
  id: string;
  initials: string;
  name: string;
  email: string;
  image: string | null;
  segment: RfmSegmentLabel;
  segmentColor: string;
  orders: number;
  spendFormatted: string;
  lastActive: string;
  loginCount: number;
  rfmScore: string;
}

const getSegmentBadgeStyle = (segment: string) => {
  switch (segment) {
    case 'Champions':
      return 'bg-[#EDE4FF] text-[#5833A2] border border-[#DDD0FA]';
    case 'Loyal Customers':
      return 'bg-[#F7F3EB] text-[#8C7355] border border-[#EBE4D8]';
    case 'Potential Loyalists':
      return 'bg-[#EFF3ED] text-[#556B2F] border border-[#E0E9DB]';
    case 'New Customers':
      return 'bg-[#FAF1EC] text-[#B07050] border border-[#F2E1D8]';
    case 'Promising':
      return 'bg-[#FAF4EB] text-[#9F7A3E] border border-[#F2E6D4]';
    case 'Need Attention':
      return 'bg-[#FDF0E9] text-[#C0603A] border border-[#FAE1D5]';
    case 'About To Sleep':
      return 'bg-[#F9EDEC] text-[#A65B58] border border-[#F2DBDA]';
    case 'At Risk':
      return 'bg-[#FDF2F0] text-[#8D4F38] border border-[#F9E2DD]';
    case 'Cannot Lose Them':
      return 'bg-[#F2EDEA] text-[#4A3728] border border-[#E5DAD4]';
    case 'Hibernating':
      return 'bg-[#F5F4F0] text-[#787265] border border-[#EAE9E2]';
    case 'Lost Customers':
      return 'bg-[#FAF9F5] text-[#A69E8F] border border-[#F0EEE6]';
    default:
      return 'bg-stone-50 text-stone-500 border border-stone-200';
  }
};

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

  const hasActiveFilters = searchTerm !== '' || segmentFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setSegmentFilter('all');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-[#4A3728] pb-10">
      <div className="border-b border-[#E7E5E0] pb-5">
        <h1 className="text-3xl font-serif text-[#4A3728] tracking-tight">Customer Directory</h1>
        <p className="text-stone-500 text-sm mt-1">
          Pelanggan terdaftar dan login — dianalisis dengan metode RFM (Recency, Frequency, Monetary).
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E5E0] shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-[#E7E5E0] flex flex-col sm:flex-row gap-4 bg-[#F9F7F2]/45">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <input
              type="text"
              placeholder="Cari pelanggan berdasarkan nama, email, atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#EDEAE4]/20 border border-[#E7E5E0] rounded-lg text-sm text-[#4A3728] placeholder-stone-400 focus:outline-none focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355]/20 focus:bg-white transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#4A3728]"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2.5">
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-[#EDEAE4]/20 border border-[#E7E5E0] text-[#4A3728] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355]/20 focus:bg-white transition-all duration-200 min-w-[170px]"
            >
              <option value="all">Semua Segmen</option>
              <option value="Champions">Champions</option>
              <option value="Loyal Customers">Loyal Customers</option>
              <option value="Potential Loyalists">Potential Loyalists</option>
              <option value="New Customers">New Customers</option>
              <option value="Promising">Promising</option>
              <option value="Need Attention">Need Attention</option>
              <option value="About To Sleep">About To Sleep</option>
              <option value="At Risk">At Risk</option>
              <option value="Cannot Lose Them">Cannot Lose Them</option>
              <option value="Hibernating">Hibernating</option>
              <option value="Lost Customers">Lost Customers</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 border border-[#E7E5E0] rounded-lg px-3.5 py-2 text-sm text-stone-600 bg-white hover:bg-[#EDEAE4]/30 hover:text-[#4A3728] transition-all duration-200"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-stone-500 text-sm">
            <div className="w-6 h-6 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Memuat data pelanggan...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-stone-500 text-sm">
            {hasActiveFilters ? (
              <>
                <p className="font-medium text-[#4A3728] mb-1">Tidak ada pelanggan yang cocok</p>
                <p className="text-xs">Coba ubah kata kunci pencarian atau segmen filter Anda.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center text-xs text-[#8D4F38] hover:underline font-medium"
                >
                  Reset Filter
                </button>
              </>
            ) : (
              'Belum ada pelanggan terdaftar. User yang mendaftar dan login akan muncul di sini.'
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-[11px] font-semibold text-[#8C7355] uppercase tracking-wider bg-[#F9F7F2]/65 border-b border-[#E7E5E0]">
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Segment (RFM)</th>
                  <th className="px-6 py-4 text-right font-semibold">Total Orders</th>
                  <th className="px-6 py-4 text-right font-semibold">Total Spend</th>
                  <th className="px-6 py-4 font-semibold">Last Active</th>
                  <th className="px-6 py-4 text-center font-semibold">Login</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E0]/45">
                {filtered.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-[#FDFCF7] hover:shadow-[inset_0_0_0_1px_rgba(140,115,85,0.05)] transition-all duration-150 group"
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3.5">
                        {cust.image ? (
                          <img
                            src={cust.image}
                            alt={cust.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#8C7355]/15 shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xs bg-[#8C7355]/10 text-[#8C7355] border border-[#8C7355]/15 shadow-inner shrink-0">
                            {cust.initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-[#4A3728] truncate">{cust.name}</div>
                          <div className="text-stone-400 text-xs truncate mt-0.5">{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${getSegmentBadgeStyle(
                          cust.segment
                        )}`}
                      >
                        {cust.segment}
                      </span>
                      <div className="text-[10px] text-stone-400 mt-1 font-medium tracking-wide">
                        RFM SCORE: {cust.rfmScore}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-right text-stone-600 font-serif">{cust.orders}</td>
                    <td className="px-6 py-4.5 text-right text-[#4A3728] font-serif font-medium">
                      Rp {cust.spendFormatted}
                    </td>
                    <td className="px-6 py-4.5 text-stone-500 text-xs">{cust.lastActive}</td>
                    <td className="px-6 py-4.5 text-center text-stone-600 text-xs font-serif">{cust.loginCount}x</td>
                    <td className="px-6 py-4.5 text-right">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="inline-flex items-center gap-1 text-[#8D4F38] hover:text-[#4A3728] font-medium text-xs transition-colors group/link"
                      >
                        <span>View Details</span>
                        <ArrowRight
                          size={14}
                          className="transform group-hover/link:translate-x-0.5 transition-transform"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info & pagination */}
        <div className="px-6 py-4 border-t border-[#E7E5E0] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-500">
          <span>
            Menampilkan <strong className="font-medium text-[#4A3728]">{filtered.length}</strong> dari{' '}
            <strong className="font-medium text-[#4A3728]">{customers.length}</strong> pelanggan
          </span>
          <div className="flex items-center gap-1.5">
            <button
              className="p-1.5 rounded border border-[#E7E5E0] text-stone-400 hover:bg-[#EDEAE4]/20 disabled:opacity-40 disabled:hover:bg-transparent transition"
              disabled
            >
              <ChevronLeft size={15} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-[#8C7355] text-white font-medium text-xs shadow-sm">
              1
            </button>
            <button
              className="p-1.5 rounded border border-[#E7E5E0] text-stone-400 hover:bg-[#EDEAE4]/20 disabled:opacity-40 disabled:hover:bg-transparent transition"
              disabled
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

