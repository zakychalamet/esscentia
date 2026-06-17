'use client';

import { useEffect, useMemo, useState } from 'react';
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
  ShieldAlert,
  PackageOpen,
} from 'lucide-react';
import type { RfmAnalyticsResult } from '@/lib/customer-rfm';
import { SEGMENT_COLORS } from '@/lib/customer-rfm';
import { RfmClusterChart } from '@/components/admin/RfmClusterChart';
import { ChurnPieChart } from '@/components/admin/ChurnPieChart';
import { SalesTrendChart } from '@/components/admin/SalesTrendChart';
import { useAuth } from '@/lib/auth-context';
import { canViewAnalytics } from '@/lib/admin-permissions';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<RfmAnalyticsResult | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    if (!canViewAnalytics(user?.role)) return;
    
    setLoading(true);
    setDbLoading(true);

    fetch('/api/admin/rfm')
      .then((res) => res.json())
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then(setDashboardData)
      .catch(console.error)
      .finally(() => setDbLoading(false));
  }, [user?.role]);

  const activeSegments = useMemo(() => {
    const customersList = analytics?.customers;
    if (!customersList) return [];
    const set = new Set(customersList.map((c) => c.segment));
    return Array.from(set).sort();
  }, [analytics?.customers]);

  if (!canViewAnalytics(user?.role)) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 font-sans">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] mb-3 font-bold">
          Marketing Access
        </p>
        <h1 className="text-3xl font-serif font-bold text-[#4A3728] mb-4">Selamat datang</h1>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed font-light">
          Akun Anda memiliki akses untuk mengelola katalog produk. Gunakan menu Produk
          untuk menambah atau memperbarui item.
        </p>
        <Link
          href="/admin/products"
          className="inline-block px-8 py-3 bg-[#4A3728] hover:bg-[#8C7355] text-white text-xs uppercase tracking-widest transition"
        >
          Kelola Produk
        </Link>
      </div>
    );
  }

  if (loading || dbLoading || !analytics || !dashboardData) {
    return (
      <div className="py-24 text-center text-stone-500 font-serif text-sm">
        <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Memuat data intelijen bisnis...
      </div>
    );
  }

  const { kpi, customers, churnPie, segmentShifts } = analytics;
  const highRiskPct = churnPie.find((s) => s.level === 'high')?.value ?? 0;



  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const revenueCards = [
    {
      label: 'Pendapatan Hari Ini',
      value: formatPrice(dashboardData.revenue.daily),
      trend: 'Penjualan real-time hari ini',
      trendUp: true,
    },
    {
      label: 'Pendapatan Mingguan (7 Hari)',
      value: formatPrice(dashboardData.revenue.weekly),
      trend: 'Penjualan dalam 7 hari terakhir',
      trendUp: true,
    },
    {
      label: 'Pendapatan Bulanan (30 Hari)',
      value: formatPrice(dashboardData.revenue.monthly),
      trend: 'Penjualan dalam 30 hari terakhir',
      trendUp: true,
    },
    {
      label: 'Total Pendapatan',
      value: formatPrice(dashboardData.revenue.total),
      trend: 'Total semua penjualan',
      trendUp: true,
    },
  ];

  const kpiCards = [
    {
      label: 'Jumlah Pelanggan',
      value: kpi.totalCliente.toLocaleString('id-ID'),
      trend: `+${kpi.clienteleGrowthPct}% vs kuartal terakhir`,
      trendUp: true,
      icon: Users,
    },
    {
      label: 'Rata-rata Risiko Churn',
      value: `${kpi.avgChurnRiskPct}%`,
      trend: `${kpi.churnTrendPct}% vs kuartal terakhir`,
      trendUp: kpi.churnTrendPct < 0,
      icon: AlertTriangle,
    },
    {
      label: 'Segmen Teratas',
      value: kpi.topSegment,
      trend: `${kpi.topSegmentRevenuePct}% of Total Pendapatan`,
      trendUp: true,
      icon: Star,
      isSegment: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] font-sans text-[#4A3728]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3728]">
            Dashboard
          </h1>
          <p className="text-stone-500 text-sm mt-1 max-w-xl font-light">
            Metrik real-time, analisis pendapatan, pelacakan persediaan, dan portofolio segmentasi RFM klien.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-stone-200 bg-white hover:bg-stone-50 transition text-stone-600 rounded-sm"
          >
            <Calendar size={14} />
            Last 30 Days
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#4A3728] text-white hover:bg-[#8C7355] transition rounded-sm"
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* Row 1: Revenue Metrics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8C7355] mb-4">
          Laporan Keuangan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {revenueCards.map((card) => {
            return (
              <div
                key={card.label}
                className="bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs relative overflow-hidden group hover:border-[#8C7355]/40 transition duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">
                    {card.label}
                  </p>
                </div>
                <p className="font-serif font-bold text-2xl text-[#4A3728] mb-2 truncate">
                  {card.value}
                </p>
                <p className="text-xs text-stone-400 font-light">
                  {card.trend}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Clientele Metrics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8C7355] mb-4">
          Clientele Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs relative overflow-hidden group hover:border-[#8C7355]/40 transition duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">
                    {card.label}
                  </p>
                  <div className="p-2 rounded-md bg-stone-100 text-stone-500">
                    <Icon size={18} />
                  </div>
                </div>
                <p
                  className={`font-serif font-bold text-[#4A3728] mb-2 ${
                    card.isSegment ? 'text-xl' : 'text-2xl'
                  }`}
                >
                  {card.value}
                </p>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    card.trendUp ? 'text-emerald-700' : 'text-[#8D4F38]'
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
      </div>

      {/* Row 3: Sales Trend & Churn */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="xl:col-span-2 bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg font-serif font-bold text-[#4A3728]">Kinerja Penjualan</h2>
            <p className="text-xs text-stone-500 mt-1 font-light">
              Tren pendapatan harian dan volume transaksi selama 30 hari terakhir.
            </p>
          </div>
          <SalesTrendChart data={dashboardData.timeSeries} />
        </div>

        {/* Churn Exposure */}
        <div className="bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#4A3728] mb-1">Risiko Churn</h2>
            <p className="text-xs text-stone-500 mb-4 font-light">Distribusi berdasarkan risiko churn yang diprediksi</p>
            <ChurnPieChart data={churnPie} highRiskPct={highRiskPct} />
          </div>
          <ul className="mt-4 space-y-2 border-t border-stone-100 pt-4">
            {churnPie.map((slice) => (
              <li
                key={slice.level}
                className="flex items-center justify-between text-xs text-stone-600"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: slice.color }}
                  />
                  {slice.name}
                </span>
                <span className="font-semibold">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 4: RFM Clustering & Segment Shifts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs">
          <div className="mb-4">
            <h2 className="text-lg font-serif font-bold text-[#4A3728]">Analisis Klaster RFM</h2>
            <p className="text-xs text-stone-500 mt-1 font-light">
              Segmentasi K-Means berdasarkan skor Recency, Frequency, dan Monetary. Ukuran bubble = nilai moneter.
            </p>
          </div>
          <RfmClusterChart customers={customers} />
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-stone-200">
            {activeSegments.map((seg) => (
              <span key={seg} className="flex items-center gap-2 text-xs text-stone-600">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: SEGMENT_COLORS[seg] }}
                />
                {seg}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs">
          <h2 className="text-lg font-serif font-bold text-[#4A3728] mb-4">Perubahan Segmentasi</h2>
          <ul className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {segmentShifts.map((shift) => (
              <li key={shift.id} className="flex gap-3 text-sm border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                <span
                  className={`shrink-0 mt-0.5 ${
                    shift.direction === 'up' ? 'text-[#8C7355]' : 'text-[#8D4F38]'
                  }`}
                >
                  {shift.direction === 'up' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                </span>
                <div>
                  <p className="text-stone-700 text-xs">
                    Client ID {shift.customerId}{' '}
                    <span className="text-stone-500 font-light">{shift.message}</span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1 font-light">{shift.timeAgo}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 5: Top Selling & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#4A3728] mb-1">Produk Terlaris</h2>
            <p className="text-xs text-stone-500 mb-6 font-light">Parfum dan varian decant dengan volume penjualan tertinggi.</p>
            
            {dashboardData.topSelling.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs font-light">
                Belum ada data penjualan tercatat.
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.topSelling.map((item: any, idx: number) => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                    <span className="font-serif font-bold text-stone-400 text-lg w-6 shrink-0 text-center">
                      #{idx + 1}
                    </span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded bg-[#EDEAE4] border border-stone-200/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#4A3728] truncate">{item.name}</p>
                      <p className="text-xs text-stone-400 font-light">{item.qty} pcs terjual</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-semibold text-[#8D4F38]">
                        {formatPrice(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#E7E5E0] rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#4A3728] mb-1">Peringatan Stok Tipis</h2>
            <p className="text-xs text-stone-500 mb-6 font-light">Parfum dan takaran decant yang memiliki sisa stok kritis (≤ 5).</p>

            {dashboardData.alerts.perfumes.length === 0 && dashboardData.alerts.decants.length === 0 ? (
              <div className="py-12 text-center text-emerald-600 text-xs font-semibold flex flex-col items-center gap-2">
                <ShieldAlert size={24} className="text-emerald-500" />
                Stok aman. Tidak ada peringatan inventaris saat ini.
              </div>
            ) : (
              <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1">
                {/* Perfumes alerts */}
                {dashboardData.alerts.perfumes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold">Produk Parfum (Botol)</p>
                    {dashboardData.alerts.perfumes.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded bg-[#EDEAE4] border border-stone-200/40 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#4A3728] truncate">{item.name}</p>
                          <p className="text-[10px] text-stone-400 font-light">{item.brand}</p>
                        </div>
                        <span className={`inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border ${
                          item.stock === 0
                            ? 'border-[#8D4F38]/20 text-[#8D4F38] bg-[#8D4F38]/5'
                            : 'border-amber-500/20 text-amber-600 bg-amber-50/50'
                        }`}>
                          {item.stock === 0 ? 'Habis' : `Sisa ${item.stock}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Decants alerts */}
                {dashboardData.alerts.decants.length > 0 && (
                  <div className="space-y-3 border-t border-stone-100 pt-4">
                    <p className="text-[10px] uppercase tracking-widest text-[#8C7355] font-bold font-sans">Takaran Decant (Vial)</p>
                    {dashboardData.alerts.decants.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded bg-[#EDEAE4] border border-stone-200/40 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#4A3728] truncate">{item.name}</p>
                          <p className="text-[10px] text-stone-400 font-light">{item.brand}</p>
                        </div>
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-sm border border-amber-500/20 text-amber-600 bg-amber-50/50">
                          {item.lowSizes}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
