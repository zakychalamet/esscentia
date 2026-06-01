'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  AlertTriangle,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
} from 'lucide-react';
import type { RfmAnalyticsResult } from '@/lib/customer-rfm';
import { SEGMENT_COLORS } from '@/lib/customer-rfm';
import { RfmClusterChart } from '@/components/admin/RfmClusterChart';
import { ChurnPieChart } from '@/components/admin/ChurnPieChart';
import { useAuth } from '@/lib/auth-context';
import { canViewAnalytics } from '@/lib/admin-permissions';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<RfmAnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canViewAnalytics(user?.role)) return;
    fetch('/api/admin/rfm')
      .then((res) => res.json())
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (!canViewAnalytics(user?.role)) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B4E9E] mb-3">
          Marketing Admin
        </p>
        <h1 className="text-3xl font-semibold text-slate-800 mb-4">Selamat datang</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Akun Anda memiliki akses untuk mengelola katalog produk. Gunakan menu Produk
          untuk menambah atau memperbarui item.
        </p>
        <Link
          href="/admin/products"
          className="inline-block px-8 py-3 bg-[#6B4E9E] text-white text-xs uppercase tracking-widest hover:bg-[#5a4088] transition rounded-lg"
        >
          Kelola Produk
        </Link>
      </div>
    );
  }

  if (loading || !analytics) {
    return (
      <div className="py-16 text-center text-slate-500 text-sm">Memuat analitik RFM...</div>
    );
  }

  const { kpi, customers, churnPie, segmentShifts } = analytics;
  const highRiskPct = churnPie.find((s) => s.level === 'high')?.value ?? 0;

  const kpiCards = [
    {
      label: 'Total Clientele',
      value: kpi.totalCliente.toLocaleString('id-ID'),
      trend: `+${kpi.clienteleGrowthPct}% vs last quarter`,
      trendUp: true,
      icon: Users,
    },
    {
      label: 'Avg Churn Risk',
      value: `${kpi.avgChurnRiskPct}%`,
      trend: `${kpi.churnTrendPct}% vs last quarter`,
      trendUp: kpi.churnTrendPct < 0,
      icon: AlertTriangle,
    },
    {
      label: 'Top Segment',
      value: kpi.topSegment,
      trend: `${kpi.topSegmentRevenuePct}% of Total Revenue`,
      trendUp: true,
      icon: Star,
      isSegment: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
            Intelligence Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Real-time metrics and clustering for premium client portfolios — powered by
            RFM scoring and K-Means (k=3).
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition text-slate-700"
          >
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#6B4E9E] text-white rounded-lg hover:bg-[#5a4088] transition"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">
                  {card.label}
                </p>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
                  <Icon size={18} />
                </div>
              </div>
              <p
                className={`font-semibold text-slate-800 mb-2 ${
                  card.isSegment ? 'text-2xl' : 'text-3xl'
                }`}
              >
                {card.value}
              </p>
              <p
                className={`text-xs flex items-center gap-1 ${
                  card.trendUp ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {card.trendUp ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {card.trend}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">RFM Cluster Analysis</h2>
            <p className="text-xs text-slate-500 mt-1">
              K-Means segmentation on Recency, Frequency, and Monetary scores. Bubble size
              = monetary value.
            </p>
          </div>
          <RfmClusterChart customers={customers} />
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-200">
            {([
              'Champions',
              'Loyal Customers',
              'Potential Loyalist',
              'Recent Customers',
              'Promising',
              'Need Attention',
              'About to Sleep',
              'At Risk',
              "Can't Lose Them",
              'Hibernating',
              'Lost',
            ] as const).map((seg) => (
              <span key={seg} className="flex items-center gap-2 text-xs text-slate-600">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: SEGMENT_COLORS[seg] }}
                />
                {seg}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E7E5E0] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Churn Exposure</h2>
            <p className="text-xs text-slate-500 mb-4">Distribution by predicted churn risk</p>
            <ChurnPieChart data={churnPie} highRiskPct={highRiskPct} />
            <ul className="mt-4 space-y-2">
              {churnPie.map((slice) => (
                <li
                  key={slice.level}
                  className="flex items-center justify-between text-xs text-slate-600"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: slice.color }}
                    />
                    {slice.name}
                  </span>
                  <span className="font-medium">{slice.value}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#E7E5E0] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Segment Shifts</h2>
            <ul className="space-y-4">
              {segmentShifts.map((shift) => (
                <li key={shift.id} className="flex gap-3 text-sm">
                  <span
                    className={`shrink-0 mt-0.5 ${
                      shift.direction === 'up' ? 'text-[#6B4E9E]' : 'text-red-500'
                    }`}
                  >
                    {shift.direction === 'up' ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                  </span>
                  <div>
                    <p className="text-slate-800">
                      Client ID {shift.customerId}{' '}
                      <span className="text-slate-500">{shift.message}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{shift.timeAgo}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
