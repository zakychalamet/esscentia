'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  BarChart2,
  Activity,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  ShieldAlert,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import type { RfmSegmentLabel, ChurnRiskLevel } from '@/lib/customer-rfm';

interface CustomerDetailData {
  id: string;
  name: string;
  email: string;
  initials: string;
  image: string | null;
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
  phone: string | null;
  registeredAt: string;
  churnRisk: ChurnRiskLevel;
  recentOrders: {
    id: string;
    orderNumber: string;
    date: string;
    products: string;
    amount: number;
    status: string;
  }[];
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

const getStatusBadgeStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('completed') || s.includes('selesai') || s.includes('paid') || s.includes('delivered')) {
    return 'bg-[#EFF3ED] text-[#556B2F] border border-[#E0E9DB]/80';
  } else if (s.includes('pending') || s.includes('proses') || s.includes('unpaid') || s.includes('processing')) {
    return 'bg-[#FAF4EB] text-[#9F7A3E] border border-[#F2E6D4]/80';
  } else {
    return 'bg-[#FDF2F0] text-[#8D4F38] border border-[#F9E2DD]/80';
  }
};

const getChurnRiskDetails = (risk: ChurnRiskLevel) => {
  switch (risk) {
    case 'low':
      return {
        text: 'Low Churn Risk',
        bg: 'bg-[#EFF3ED] text-[#556B2F] border-[#E0E9DB]',
        barColor: 'bg-[#556B2F]',
        pct: 'w-[15%]',
        desc: 'Pelanggan aktif dan menunjukkan loyalitas tinggi terhadap brand.'
      };
    case 'medium':
      return {
        text: 'Moderate Churn Risk',
        bg: 'bg-[#FAF4EB] text-[#9F7A3E] border-[#F2E6D4]',
        barColor: 'bg-[#9F7A3E]',
        pct: 'w-[50%]',
        desc: 'Pelanggan mulai melambat. Diperlukan stimulus penawaran interaktif.'
      };
    case 'high':
      return {
        text: 'High Churn Risk',
        bg: 'bg-[#FDF2F0] text-[#8D4F38] border-[#F9E2DD]',
        barColor: 'bg-[#8D4F38]',
        pct: 'w-[85%]',
        desc: 'Pelanggan berisiko tinggi hilang sepenuhnya. Butuh re-engagement darurat.'
      };
    default:
      return {
        text: 'Unclassified Risk',
        bg: 'bg-stone-50 text-stone-500 border-stone-200',
        barColor: 'bg-stone-400',
        pct: 'w-0',
        desc: 'Riwayat data belum mencukupi untuk penilaian risiko churn.'
      };
  }
};

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
    return (
      <div className="py-24 text-center text-stone-500 text-sm">
        <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Memuat profil pelanggan...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="py-24 text-center text-[#4A3728]">
        <AlertTriangle size={40} className="mx-auto text-[#8D4F38] mb-4" />
        <p className="font-serif text-lg mb-2">Pelanggan Tidak Ditemukan</p>
        <p className="text-sm text-stone-500 mb-6">ID pelanggan yang diminta tidak valid atau telah dihapus.</p>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E7E5E0] rounded-lg text-sm text-[#4A3728] hover:bg-[#EDEAE4]/30 transition"
        >
          <ArrowLeft size={16} /> Kembali ke Customer Directory
        </Link>
      </div>
    );
  }

  const risk = getChurnRiskDetails(customer.churnRisk);

  const renderRfmDots = (score: number) => {
    return (
      <div className="flex gap-1.5 mt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? 'bg-[#8C7355]' : 'bg-[#EDEAE4]'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto text-[#4A3728] pb-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-xs text-stone-500 font-medium">
        <Link href="/admin/customers" className="hover:text-[#8C7355] transition-colors flex items-center gap-1">
          <ArrowLeft size={13} /> Customers
        </Link>
        <ChevronRight size={12} className="mx-2 text-stone-400" />
        <span className="font-serif text-[#4A3728]">{customer.name}</span>
      </div>

      {/* Top Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Left Column: Unified Profile & Contact Card */}
        <div className="lg:col-span-1 h-full">
          {/* Unified Customer Profile Info & Contacts */}
          <div className="bg-white rounded-2xl border border-[#E7E5E0] shadow-sm overflow-hidden h-full flex flex-col justify-between">
            <div className="p-6 text-center border-b border-[#E7E5E0]/60 relative bg-[#F9F7F2]/25 flex-1 flex flex-col justify-center min-h-[220px]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#8C7355]/40" />
              {customer.image ? (
                <img
                  src={customer.image}
                  alt={customer.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#8C7355]/15 shadow-sm mx-auto mb-3 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#8C7355]/10 border border-[#8C7355]/15 flex items-center justify-center text-2xl font-serif font-bold text-[#8C7355] shadow-inner mx-auto mb-3">
                  {customer.initials}
                </div>
              )}
              <h1 className="text-xl font-serif font-bold text-[#4A3728] truncate" title={customer.name}>
                {customer.name}
              </h1>
              <p className="text-stone-400 text-xs mt-1 truncate">{customer.email}</p>
              <div className="mt-3.5 flex justify-center">
                <span
                  className={`inline-block px-3 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${getSegmentBadgeStyle(
                    customer.segment
                  )}`}
                >
                  {customer.segment}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-center">
              <h3 className="text-[10px] font-bold text-[#8C7355] uppercase tracking-wider">
                Contact & Activity Logs
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-stone-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-stone-400 uppercase tracking-wide block">Email</span>
                    <span className="text-xs font-medium text-[#4A3728] break-all">{customer.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-stone-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wide block">Phone</span>
                    <span className="text-xs font-medium text-[#4A3728]">
                      {customer.phone || <span className="text-stone-400 italic">No phone cataloged</span>}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={15} className="text-stone-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wide block">Registered At</span>
                    <span className="text-xs font-medium text-[#4A3728] font-serif">{customer.registeredAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity size={15} className="text-stone-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wide block">Login Frequency</span>
                    <span className="text-xs font-medium text-[#4A3728] font-serif">
                      {customer.loginCount}x login
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: RFM Dashboard & Quick Metrics & Churn Risk */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between h-full">
          {/* RFM Score breakdown */}
          <div className="bg-white rounded-2xl border border-[#E7E5E0] shadow-sm p-6 flex-1 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#4A3728]">RFM Value Profiling</h2>
                <p className="text-xs text-stone-400 mt-0.5">Recency, Frequency, and Monetary scores mapped from 1 to 5.</p>
              </div>
              <div className="flex items-center gap-2 text-[#8C7355] bg-[#8C7355]/10 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide border border-[#8C7355]/20 font-serif shrink-0">
                <BarChart2 size={14} />
                <span>RFM SCORE: {customer.rfmScore}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-[#F9F7F2]/45 border border-[#E7E5E0]/60">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Recency</span>
                <div className="text-xl sm:text-2xl font-bold font-serif text-[#4A3728] mt-1">
                  {customer.recencyDays} <span className="text-xs font-medium text-stone-500 font-sans">hari</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-medium text-stone-400">
                    <span>Skor</span>
                    <span className="font-serif text-[#4A3728]">{customer.recencyScore}/5</span>
                  </div>
                  {renderRfmDots(customer.recencyScore)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F9F7F2]/45 border border-[#E7E5E0]/60">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Frequency</span>
                <div className="text-xl sm:text-2xl font-bold font-serif text-[#4A3728] mt-1">
                  {customer.orders} <span className="text-xs font-medium text-stone-500 font-sans">pesanan</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-medium text-stone-400">
                    <span>Skor</span>
                    <span className="font-serif text-[#4A3728]">{customer.frequencyScore}/5</span>
                  </div>
                  {renderRfmDots(customer.frequencyScore)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F9F7F2]/45 border border-[#E7E5E0]/60 min-w-0">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Monetary</span>
                <div className="text-lg sm:text-xl font-bold font-serif text-[#4A3728] mt-1 truncate" title={`Rp ${customer.spendFormatted}`}>
                  Rp {customer.spendFormatted}
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-medium text-stone-400">
                    <span>Skor</span>
                    <span className="font-serif text-[#4A3728]">{customer.monetaryScore}/5</span>
                  </div>
                  {renderRfmDots(customer.monetaryScore)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Churn Risk Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {/* Box A: Last Active Session (top) & Average Order Value (bottom) */}
            <div className="flex flex-col gap-6">
              {/* Last Active Session Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E5E0] shadow-sm flex items-center justify-between flex-1">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Last Active Session</span>
                  <div className="text-base font-semibold text-[#4A3728] mt-2">
                    {customer.lastActive}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#8C7355]/10 flex items-center justify-center text-[#8C7355] border border-[#8C7355]/15 shrink-0">
                  <Activity size={18} />
                </div>
              </div>

              {/* Average Order Value Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E5E0] shadow-sm flex items-center justify-between flex-1">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Average Order Value</span>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-[#4A3728] mt-1">
                    Rp {customer.avgOrderValue.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#8C7355]/10 flex items-center justify-center text-[#8C7355] border border-[#8C7355]/15 shrink-0">
                  <CreditCard size={18} />
                </div>
              </div>
            </div>

            {/* Box B: Churn Risk Assessment */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] shadow-sm p-6 flex flex-col justify-between h-full">
              <h3 className="text-xs font-semibold text-[#8C7355] uppercase tracking-wider border-b border-[#E7E5E0] pb-2 flex items-center gap-2">
                <ShieldAlert size={14} className="text-[#8C7355]" /> Churn Risk Assessment
              </h3>
              <div className="mt-4 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase ${risk.bg}`}>
                    {risk.text}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400">
                    Indicator
                  </span>
                </div>
                <div className="w-full bg-[#EDEAE4] h-1.5 rounded-full overflow-hidden mt-3">
                  <div className={`h-full rounded-full transition-all duration-500 ${risk.barColor} ${risk.pct}`} />
                </div>
                <p className="text-xs text-stone-500 mt-3.5 leading-relaxed">{risk.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Section: Transactions Log */}
      <div className="bg-white rounded-2xl border border-[#E7E5E0] shadow-sm overflow-hidden w-full">
        <div className="px-6 py-5 border-b border-[#E7E5E0] flex items-center gap-2">
          <ShoppingBag size={18} className="text-[#8C7355]" />
          <h2 className="text-base font-serif font-bold text-[#4A3728]">Recent Order Catalog</h2>
        </div>
        {customer.recentOrders.length === 0 ? (
          <div className="p-16 text-center text-stone-500 text-xs">
            Belum ada transaksi. Pesanan checkout akan tercatat di sini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[10px] font-semibold text-[#8C7355] uppercase tracking-wider bg-[#F9F7F2]/65 border-b border-[#E7E5E0]">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Products Catalog</th>
                  <th className="px-6 py-4 text-right font-semibold">Amount</th>
                  <th className="px-6 py-4 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E0]/45">
                {customer.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFCF7] transition">
                    <td className="px-6 py-4.5 text-stone-500">{order.date}</td>
                    <td className="px-6 py-4.5 font-mono text-stone-500">{order.orderNumber}</td>
                    <td className="px-6 py-4.5 font-medium text-[#4A3728] max-sm truncate" title={order.products}>
                      {order.products}
                    </td>
                    <td className="px-6 py-4.5 text-right font-serif font-medium text-[#4A3728]">
                      Rp {order.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(order.status)}`}>
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
  );
}



