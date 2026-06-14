'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Settings2,
  Activity,
  Network,
  Download,
  Play,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import type { RfmAnalyticsResult, RfmSegmentLabel } from '@/lib/customer-rfm';
import { SEGMENT_COLORS } from '@/lib/customer-rfm';

const SEGMENT_BADGE: Record<RfmSegmentLabel, string> = {
  'Champions': 'bg-purple-100 text-purple-700 border border-purple-200',
  'Loyal Customers': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Potential Loyalists': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'New Customers': 'bg-cyan-100 text-cyan-700 border border-cyan-200',
  'Promising': 'bg-lime-100 text-lime-700 border border-lime-200',
  'Need Attention': 'bg-amber-100 text-amber-700 border border-amber-200',
  'About To Sleep': 'bg-pink-100 text-pink-700 border border-pink-200',
  'At Risk': 'bg-red-100 text-red-700 border border-red-200',
  'Cannot Lose Them': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  'Hibernating': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Lost Customers': 'bg-stone-100 text-stone-600 border border-stone-200',
};

export default function AnalyticsPage() {
  const [recencyWeight, setRecencyWeight] = useState(40);
  const [frequencyWeight, setFrequencyWeight] = useState(30);
  const [monetaryWeight, setMonetaryWeight] = useState(30);
  const [k, setK] = useState(4);
  const [maxIterations, setMaxIterations] = useState(300);

  const [analytics, setAnalytics] = useState<RfmAnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Balancing sliders so sum is always exactly 100%
  const handleRecencyChange = (val: number) => {
    setRecencyWeight(val);
    const remaining = 100 - val;
    if (remaining <= 0) {
      setFrequencyWeight(0);
      setMonetaryWeight(0);
      return;
    }
    const sumOthers = frequencyWeight + monetaryWeight;
    if (sumOthers === 0) {
      setFrequencyWeight(Math.round(remaining / 2));
      setMonetaryWeight(remaining - Math.round(remaining / 2));
    } else {
      const fRatio = frequencyWeight / sumOthers;
      const newF = Math.round(fRatio * remaining);
      setFrequencyWeight(newF);
      setMonetaryWeight(remaining - newF);
    }
  };

  const handleFrequencyChange = (val: number) => {
    setFrequencyWeight(val);
    const remaining = 100 - val;
    if (remaining <= 0) {
      setRecencyWeight(0);
      setMonetaryWeight(0);
      return;
    }
    const sumOthers = recencyWeight + monetaryWeight;
    if (sumOthers === 0) {
      setRecencyWeight(Math.round(remaining / 2));
      setMonetaryWeight(remaining - Math.round(remaining / 2));
    } else {
      const rRatio = recencyWeight / sumOthers;
      const newR = Math.round(rRatio * remaining);
      setRecencyWeight(newR);
      setMonetaryWeight(remaining - newR);
    }
  };

  const handleMonetaryChange = (val: number) => {
    setMonetaryWeight(val);
    const remaining = 100 - val;
    if (remaining <= 0) {
      setRecencyWeight(0);
      setFrequencyWeight(0);
      return;
    }
    const sumOthers = recencyWeight + frequencyWeight;
    if (sumOthers === 0) {
      setRecencyWeight(Math.round(remaining / 2));
      setFrequencyWeight(remaining - Math.round(remaining / 2));
    } else {
      const rRatio = recencyWeight / sumOthers;
      const newR = Math.round(rRatio * remaining);
      setRecencyWeight(newR);
      setFrequencyWeight(remaining - newR);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/rfm?rWeight=${recencyWeight}&fWeight=${frequencyWeight}&mWeight=${monetaryWeight}&k=${k}&maxIter=${maxIterations}`
      );
      if (!res.ok) throw new Error('Query API RFM gagal');
      const data = await res.json();
      setAnalytics(data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!analytics?.customerTable) return [];
    return analytics.customerTable.filter((cust) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cust.customerName.toLowerCase().includes(q) ||
        cust.customerId.toLowerCase().includes(q);
      const matchesSegment =
        segmentFilter === 'all' || cust.segmentLabel === segmentFilter;
      return matchesSearch && matchesSegment;
    });
  }, [analytics?.customerTable, searchTerm, segmentFilter]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

  const handleExportCSV = () => {
    if (!analytics?.customerTable) return;
    const headers = [
      'Customer ID',
      'Name',
      'Recency (Days)',
      'Frequency',
      'Monetary (IDR)',
      'RFM Score',
      'Cluster ID',
      'Segment Label',
    ];
    const rows = analytics.customerTable.map((c) => [
      c.customerId,
      c.customerName,
      c.recency,
      c.frequency,
      c.monetary,
      c.rfmScore,
      `Cluster ${c.cluster + 1}`,
      c.segmentLabel,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [
        headers.join(','),
        ...rows.map((r) => r.map((val) => `"${val}"`).join(',')),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `esscentia_rfm_segments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 text-slate-800 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">RFM & K-Means Analytics Engine</h1>
          <p className="text-stone-500 text-sm mt-1 max-w-xl">
            Sistem pengelompokan pelanggan otomatis berdasarkan kebaruan transaksi (Recency),
            frekuensi belanja (Frequency), dan nilai moneter (Monetary) untuk mengoptimalkan kampanye CRM.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            disabled={loading || !analytics || !analytics.customerTable || analytics.customerTable.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-sm border border-stone-300 rounded-lg bg-white hover:bg-stone-50 transition text-stone-700 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: RFM Parameter Weighting */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-semibold text-[#4A3728]">RFM Weights Configuration</h3>
              <Settings2 size={18} className="text-[#8C7355]" />
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-stone-600 font-medium">Recency Weight (Kebaruan)</span>
                  <span className="text-[#8C7355] font-bold">{recencyWeight}%</span>
                </div>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={recencyWeight} 
                  onChange={(e) => handleRecencyChange(Number(e.target.value))} 
                  className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#8C7355]" 
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-stone-600 font-medium">Frequency Weight (Frekuensi)</span>
                  <span className="text-[#8C7355] font-bold">{frequencyWeight}%</span>
                </div>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={frequencyWeight} 
                  onChange={(e) => handleFrequencyChange(Number(e.target.value))} 
                  className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#8C7355]" 
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-stone-600 font-medium">Monetary Weight (Nilai Uang)</span>
                  <span className="text-[#8C7355] font-bold">{monetaryWeight}%</span>
                </div>
                <input 
                  type="range" 
                  min="0"
                  max="100"
                  value={monetaryWeight} 
                  onChange={(e) => handleMonetaryChange(Number(e.target.value))} 
                  className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#8C7355]" 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400 flex justify-between">
            <span>Total Komulatif:</span>
            <span className="font-bold text-[#8C7355]">{(recencyWeight + frequencyWeight + monetaryWeight)}%</span>
          </div>
        </div>

        {/* Card 2: K-Means Algorithm Parameters */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-semibold text-[#4A3728]">K-Means Parameters</h3>
              <Network size={18} className="text-[#8C7355]" />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1.5">Number of Clusters (k)</label>
                <select 
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355] appearance-none bg-white font-medium"
                >
                  <option value={3}>3 Clusters</option>
                  <option value={4}>4 Clusters (Recomended)</option>
                  <option value={5}>5 Clusters</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-stone-600 font-medium">Max Iterations</span>
                  <span className="text-[#8C7355] font-bold">{maxIterations}</span>
                </div>
                <input 
                  type="range" 
                  min="100" max="1000" step="100"
                  value={maxIterations} 
                  onChange={(e) => setMaxIterations(Number(e.target.value))} 
                  className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#8C7355]" 
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            K-Means Seed: <span className="font-semibold text-stone-600">Random State 42</span> (Deterministik)
          </div>
        </div>

        {/* Card 3: Execution Trigger */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center mb-4 border border-stone-200/60 shadow-inner">
            <Activity size={26} className="text-[#8C7355]" />
          </div>
          <h3 className="font-serif font-semibold text-[#4A3728] mb-1">Process Data & Update Segments</h3>
          <p className="text-xs text-stone-500 mb-6 max-w-[240px]">
            Jalankan ulang mesin analitik untuk menghitung profil pengeluaran dan klasterisasi pelanggan.
          </p>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 bg-[#8D4F38] hover:bg-[#76412e] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer w-full justify-center disabled:opacity-60 shadow-sm active:scale-[0.98]"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Play size={14} fill="currentColor" />
            )}
            Run Analytics Engine
          </button>
        </div>

      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 border-4 border-[#8C7355] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-stone-500 text-sm font-medium">Sedang menjalankan clustering K-Means dan memproses data...</p>
        </div>
      ) : !analytics ? (
        <div className="py-12 text-center text-stone-500 bg-white rounded-xl border border-stone-200 shadow-sm">
          Gagal memuat data analitik. Klik "Run Analytics Engine" untuk mencoba kembali.
        </div>
      ) : (
        <>
          {/* Step 9A: Cluster Centroids Summary */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200/60 bg-stone-50">
              <h3 className="font-serif font-semibold text-[#4A3728]">Calculated Cluster Centroids (k={k})</h3>
              <p className="text-stone-500 text-xs mt-0.5">
                Rata-rata karakteristik transaksi pelanggan terdaftar per klaster K-Means dan segmen padanannya yang terdekat.
              </p>
            </div>
            
            {(!analytics.clusterSummary || analytics.clusterSummary.length === 0) ? (
              <div className="py-12 text-center text-stone-500 text-sm bg-white">
                Belum ada data klaster yang dihitung karena tidak ada data pelanggan yang terdaftar.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50/50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                    <tr>
                      <th className="px-6 py-3.5">Cluster ID</th>
                      <th className="px-6 py-3.5">Segment Assignment</th>
                      <th className="px-6 py-3.5 text-right">Customer Count</th>
                      <th className="px-6 py-3.5 text-right">Database Share</th>
                      <th className="px-6 py-3.5 text-right">Avg Recency (Days)</th>
                      <th className="px-6 py-3.5 text-right">Avg Frequency</th>
                      <th className="px-6 py-3.5 text-right">Avg Spend</th>
                      <th className="px-6 py-3.5 text-center">Avg RFM Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {analytics.clusterSummary.map((cluster) => (
                      <tr key={cluster.clusterId} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-stone-500">Cluster {cluster.clusterId + 1}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-semibold ${SEGMENT_BADGE[cluster.segmentName]}`}>
                            {cluster.segmentName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-stone-700">{cluster.customerCount}</td>
                        <td className="px-6 py-4 text-right font-medium text-stone-600">{cluster.percentage}%</td>
                        <td className="px-6 py-4 text-right text-stone-600">{cluster.avgRecency} hari</td>
                        <td className="px-6 py-4 text-right text-stone-600">{cluster.avgFrequency}x</td>
                        <td className="px-6 py-4 text-right font-medium text-stone-800">
                          Rp {cluster.avgMonetary.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-stone-700">{cluster.avgRfmScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Step 9B: Customer Segmentation Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200/60 bg-stone-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-serif font-semibold text-[#4A3728]">Customer Segmentation Table</h3>
                <p className="text-stone-500 text-xs mt-0.5">
                  Rincian skor RFM dan hasil klasterisasi dari seluruh pelanggan terdaftar yang telah mendaftar dan login.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by ID or Name..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8C7355] bg-white min-w-[200px]"
                  />
                </div>
                {/* Segment Filter */}
                <div className="relative">
                  <select
                    value={segmentFilter}
                    onChange={(e) => {
                      setSegmentFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-stone-300 rounded-lg pl-3 pr-8 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8C7355] bg-white font-medium appearance-none"
                  >
                    <option value="all">Semua Segmen</option>
                    {(Object.keys(SEGMENT_COLORS) as RfmSegmentLabel[]).map((seg) => (
                      <option key={seg} value={seg}>{seg}</option>
                    ))}
                  </select>
                  <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {(!analytics.customerTable || analytics.customerTable.length === 0) ? (
              <div className="py-16 text-center text-stone-500 text-sm">
                Belum ada data pelanggan yang terdaftar dan login di sistem.
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="py-16 text-center text-stone-500 text-sm">
                Tidak ada pelanggan yang cocok dengan pencarian atau filter segmen.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50/50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                      <tr>
                        <th className="px-6 py-3.5">Customer ID</th>
                        <th className="px-6 py-3.5">Customer Name</th>
                        <th className="px-6 py-3.5 text-right">Recency (Days)</th>
                        <th className="px-6 py-3.5 text-right">Frequency</th>
                        <th className="px-6 py-3.5 text-right">Monetary Spend</th>
                        <th className="px-6 py-3.5 text-center">Quantile R-F-M</th>
                        <th className="px-6 py-3.5">Cluster ID</th>
                        <th className="px-6 py-3.5">Segment Assignment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {paginatedCustomers.map((row) => (
                        <tr key={row.customerId} className="hover:bg-stone-50/30 transition-colors">
                          <td className="px-6 py-3.5 font-mono text-stone-500 font-medium">{row.customerId}</td>
                          <td className="px-6 py-3.5 font-medium text-stone-900">{row.customerName}</td>
                          <td className="px-6 py-3.5 text-right text-stone-600">{row.recency} hari</td>
                          <td className="px-6 py-3.5 text-right text-stone-600">{row.frequency} order</td>
                          <td className="px-6 py-3.5 text-right font-medium text-stone-700">
                            Rp {row.monetary.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-3.5 text-center font-semibold text-[#8C7355]">{row.rfmScore}</td>
                          <td className="px-6 py-3.5 text-stone-500 font-mono text-xs">Cluster {row.cluster + 1}</td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${SEGMENT_BADGE[row.segmentLabel]}`}>
                              {row.segmentLabel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination bar */}
                <div className="px-6 py-4 border-t border-stone-150 flex justify-between items-center text-xs text-stone-500 bg-stone-50/30">
                  <span>
                    Menampilkan <strong className="font-semibold text-stone-700">{Math.min(filteredCustomers.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredCustomers.length, currentPage * itemsPerPage)}</strong> dari <strong className="font-semibold text-stone-700">{filteredCustomers.length}</strong> pelanggan
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-stone-300 rounded hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="px-3 font-medium text-stone-700">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border border-stone-300 rounded hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

    </div>
  );
}
