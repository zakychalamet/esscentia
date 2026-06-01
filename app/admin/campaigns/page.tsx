'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Star, 
  Heart, 
  Moon, 
  AlertTriangle, 
  Megaphone,
  Mail,
  MessageCircle,
  Bell,
  Sparkles,
  Send,
  Calendar,
  ChevronDown,
  Sparkle,
  Zap,
  TrendingUp,
  AlertCircle,
  Activity,
  ShieldAlert,
  UserX,
  History,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import type { RfmAnalyticsResult, RfmSegmentLabel } from '@/lib/customer-rfm';

interface CampaignHistoryItem {
  id: number;
  title: string;
  message: string;
  segment: string;
  promoType: string;
  createdAt: string;
}

const SEGMENT_METADATA: Record<RfmSegmentLabel, { 
  desc: string; 
  icon: any; 
  color: string; 
  bgColor: string; 
  iconColor: string;
}> = {
  'Champions': {
    desc: 'Beli baru-baru ini, sangat sering, dan belanja banyak. Aset terbaik Anda.',
    icon: Star,
    color: '#6B4E9E',
    bgColor: 'bg-purple-50 border-t-purple-500',
    iconColor: 'bg-purple-100 text-purple-600',
  },
  'Loyal Customers': {
    desc: 'Belanja secara rutin. Sangat responsif terhadap rilis koleksi baru.',
    icon: Heart,
    color: '#3B82F6',
    bgColor: 'bg-blue-50 border-t-blue-500',
    iconColor: 'bg-blue-100 text-blue-600',
  },
  'Potential Loyalist': {
    desc: 'Pembeli baru-baru ini dengan frekuensi dan nilai belanja yang terus meningkat.',
    icon: Sparkles,
    color: '#10B981',
    bgColor: 'bg-emerald-50 border-t-emerald-500',
    iconColor: 'bg-emerald-100 text-emerald-600',
  },
  'Recent Customers': {
    desc: 'Pembeli yang baru melakukan transaksi pertamanya baru-baru ini.',
    icon: Zap,
    color: '#06B6D4',
    bgColor: 'bg-cyan-50 border-t-cyan-500',
    iconColor: 'bg-cyan-100 text-cyan-600',
  },
  'Promising': {
    desc: 'Transaksi baru-baru ini tetapi belum sering. Butuh sedikit dorongan.',
    icon: TrendingUp,
    color: '#84CC16',
    bgColor: 'bg-lime-50 border-t-lime-500',
    iconColor: 'bg-lime-100 text-lime-600',
  },
  'Need Attention': {
    desc: 'Nilai keaktifan dan frekuensi belanja rata-rata. Perlu dipantau.',
    icon: AlertCircle,
    color: '#F59E0B',
    bgColor: 'bg-amber-50 border-t-amber-500',
    iconColor: 'bg-amber-100 text-amber-600',
  },
  'About to Sleep': {
    desc: 'Aktivitas belanja di bawah rata-rata. Akan hilang jika tidak diintervensi.',
    icon: Activity,
    color: '#EC4899',
    bgColor: 'bg-pink-50 border-t-pink-500',
    iconColor: 'bg-pink-100 text-pink-600',
  },
  'At Risk': {
    desc: 'Belanja bernilai tinggi di masa lalu, tapi sudah lama tidak transaksi.',
    icon: AlertTriangle,
    color: '#EF4444',
    bgColor: 'bg-red-50 border-t-red-500',
    iconColor: 'bg-red-100 text-red-600',
  },
  "Can't Lose Them": {
    desc: 'Pernah menjadi pelanggan andalan, namun sekarang tidak aktif sama sekali.',
    icon: ShieldAlert,
    color: '#9333EA',
    bgColor: 'bg-indigo-50 border-t-indigo-500',
    iconColor: 'bg-indigo-100 text-indigo-600',
  },
  'Hibernating': {
    desc: 'Transaksi jarang, bernilai rendah, dan sudah lama tidak aktif.',
    icon: Moon,
    color: '#64748B',
    bgColor: 'bg-slate-50 border-t-slate-500',
    iconColor: 'bg-slate-100 text-slate-600',
  },
  'Lost': {
    desc: 'Nilai keaktifan dan frekuensi belanja terendah. Sangat sulit diaktifkan kembali.',
    icon: UserX,
    color: '#94A3B8',
    bgColor: 'bg-stone-50 border-t-stone-400',
    iconColor: 'bg-stone-100 text-stone-600',
  },
};

const DEFAULT_MESSAGES: Record<string, string> = {
  'Private Collection Access': "Sebagai pelanggan berharga dalam lingkaran utama kami, kami mengundang Anda untuk merasakan pengalaman pertama koleksi premium 'Midnight Amber' sebelum dirilis ke publik. Dapatkan alokasi eksklusif Anda hari ini.",
  'Discount Code': "Terima kasih atas kebersamaan Anda bersama Esscentia. Gunakan kode promo khusus 'SPECIAL25' untuk menikmati diskon 25% pada seluruh produk premium kami tanpa minimum transaksi. Valid hingga akhir bulan ini!",
  'Event Invitation': "Anda secara eksklusif diundang menghadiri 'Esscentia VIP Scent Soirée' di Kemang Raya. Rasakan pengalaman meracik parfum eksklusif dipandu oleh Master Perfumer kami. Konfirmasi kehadiran Anda sekarang."
};

export default function CampaignManagerPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<RfmAnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<CampaignHistoryItem[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<RfmSegmentLabel | 'all'>('all');
  
  // Form States
  const [campaignTitle, setCampaignTitle] = useState('');
  const [promoType, setPromoType] = useState('Private Collection Access');
  const [deliveryChannel, setDeliveryChannel] = useState<'email' | 'push'>('email');
  const [messageCopy, setMessageCopy] = useState(DEFAULT_MESSAGES['Private Collection Access']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Fetch RFM and Campaign History
  const fetchData = async () => {
    try {
      const rfmRes = await fetch('/api/admin/rfm');
      if (rfmRes.ok) {
        const rfmData = await rfmRes.json();
        setAnalytics(rfmData);
      }

      const historyRes = await fetch('/api/admin/campaigns');
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Message Copy on Promo Type change
  useEffect(() => {
    if (DEFAULT_MESSAGES[promoType]) {
      setMessageCopy(DEFAULT_MESSAGES[promoType]);
    }
  }, [promoType]);

  // Group and count customers by segment
  const segmentCounts = useMemo(() => {
    const counts: Record<RfmSegmentLabel, number> = {
      'Champions': 0,
      'Loyal Customers': 0,
      'Potential Loyalist': 0,
      'Recent Customers': 0,
      'Promising': 0,
      'Need Attention': 0,
      'About to Sleep': 0,
      'At Risk': 0,
      "Can't Lose Them": 0,
      'Hibernating': 0,
      'Lost': 0,
    };
    if (analytics?.customers) {
      analytics.customers.forEach((c) => {
        if (counts[c.segment] !== undefined) {
          counts[c.segment]++;
        }
      });
    }
    return counts;
  }, [analytics]);

  const totalDb = analytics?.customers?.length || 1;

  // Handle Quick Create Campaign
  const handleQuickCreate = (segment: RfmSegmentLabel) => {
    setSelectedSegment(segment);
    setCampaignTitle(`Kampanye Khusus ${segment}`);
    const designerSection = document.getElementById('campaign-designer');
    if (designerSection) {
      designerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Launch Campaign
  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) {
      setNotification({ type: 'error', message: 'Nama Kampanye Internal wajib diisi!' });
      return;
    }
    if (!messageCopy.trim()) {
      setNotification({ type: 'error', message: 'Konten Pesan Promosi wajib diisi!' });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaignTitle,
          message: messageCopy,
          segment: selectedSegment,
          promoType: promoType
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotification({ type: 'success', message: `Kampanye promosi target segmen "${selectedSegment}" sukses diluncurkan!` });
        setCampaignTitle('');
        setSelectedSegment('all');
        
        // Refresh campaign history
        fetchData();
      } else {
        setNotification({ type: 'error', message: data.error || 'Gagal meluncurkan kampanye' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Terjadi kesalahan saat menghubungi server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Assisted message refinement simulation
  const handleRefineMessage = () => {
    setMessageCopy((prev) => {
      return prev + " Dapatkan sentuhan kemewahan personal khas Esscentia. Hubungi penasihat parfum kami sekarang.";
    });
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 text-sm">
        Memuat data Campaign Manager...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 text-slate-800 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">Campaign Manager</h1>
        <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">
          Kirimkan pesan promo, kode diskon, atau undangan acara eksklusif yang ditargetkan secara presisi berdasarkan 11 segmentasi RFM (Recency, Frequency, Monetary).
        </p>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="shrink-0 text-emerald-600" size={20} /> : <AlertTriangle className="shrink-0 text-red-600" size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Activate Segments Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkle className="text-[#8b5cf6]" size={20} />
            RFM Segments Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Segmentasi presisi real-time dihitung dari seluruh riwayat pembelanjaan pelanggan Esscentia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(Object.keys(SEGMENT_METADATA) as RfmSegmentLabel[]).map((seg) => {
            const meta = SEGMENT_METADATA[seg];
            const Icon = meta.icon;
            const count = segmentCounts[seg];
            const pct = Math.round((count / totalDb) * 100);

            return (
              <div 
                key={seg} 
                className={`bg-white rounded-xl border-t-4 ${meta.bgColor} border-x border-b border-slate-200 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[15px] flex items-center gap-2 text-slate-800">
                      {seg}
                      <span className={`p-1 rounded ${meta.iconColor}`}>
                        <Icon size={12} fill="currentColor" />
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-slate-900">{count}</span>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                      {pct}% OF DB
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal mb-4">
                    {meta.desc}
                  </p>
                </div>
                <button 
                  onClick={() => handleQuickCreate(seg)}
                  className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex justify-center items-center gap-1.5"
                >
                  <Megaphone size={12} /> Buat Kampanye
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Campaign Designer Section */}
      <section id="campaign-designer" className="scroll-mt-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="text-[#8b5cf6]" size={20} />
            Campaign Designer
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Konfigurasikan strategi penawaran promo atau peluncuran berita ke segmentasi terpilih.
          </p>
        </div>

        <form onSubmit={handleLaunchCampaign} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Target Audience Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Target Audience (RFM Segment)
              </label>
              <div className="relative">
                <select 
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value as RfmSegmentLabel | 'all')}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-700 font-medium"
                >
                  <option value="all">Semua Segmen Pelanggan (Database Keseluruhan)</option>
                  {(Object.keys(SEGMENT_METADATA) as RfmSegmentLabel[]).map((seg) => (
                    <option key={seg} value={seg}>
                      {seg} ({segmentCounts[seg]} Profil Aktif)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Campaign Internal Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Campaign Internal Name
              </label>
              <input 
                type="text" 
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="Contoh: Q3 VIP Exclusive Midnight Amber Promo" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                required
              />
            </div>

            {/* Promotion Type */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                Promotion Type
              </label>
              <div className="relative">
                <select 
                  value={promoType}
                  onChange={(e) => setPromoType(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-700 font-medium"
                >
                  <option value="Private Collection Access">Private Collection Access (Akses Awal Produk)</option>
                  <option value="Discount Code">Discount Code (Kode Kupon Diskon)</option>
                  <option value="Event Invitation">Event Invitation (Undangan Event VIP)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Message Copy */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Message Copy (Akan muncul di notifikasi aplikasi pengguna)
                </label>
                <button 
                  type="button"
                  onClick={handleRefineMessage}
                  className="flex items-center gap-1 text-[10px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
                >
                  <Sparkles size={10} /> AI Assistent Refine
                </button>
              </div>
              <textarea 
                value={messageCopy}
                onChange={(e) => setMessageCopy(e.target.value)}
                rows={4}
                className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white leading-relaxed text-slate-700"
                placeholder="Ketik konten promo yang eksklusif..."
                required
              />
            </div>

            {/* Action Button */}
            <div className="flex gap-4 pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 w-full justify-center shadow-md shadow-purple-200 disabled:opacity-50"
              >
                <Send size={16} /> {isSubmitting ? 'Meluncurkan...' : 'Launch Segment Campaign Now'}
              </button>
            </div>

          </div>

          {/* Configuration Preview Sidebar */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b pb-2">Outreach Channel</h3>
              
              {/* Delivery Channel */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setDeliveryChannel('email')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 border-2 rounded-xl transition-all duration-300 ${
                    deliveryChannel === 'email' 
                      ? 'border-purple-300 bg-purple-50 text-purple-700' 
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <Mail size={18} />
                  <span className="text-[11px] font-bold">Email Channel</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setDeliveryChannel('push')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 border-2 rounded-xl transition-all duration-300 ${
                    deliveryChannel === 'push' 
                      ? 'border-purple-300 bg-purple-50 text-purple-700' 
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <Bell size={18} />
                  <span className="text-[11px] font-bold">In-App Push</span>
                </button>
              </div>

              {/* Live Preview Display */}
              <div className="pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">In-App Live Preview</h3>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                      {promoType}
                    </span>
                    <span className="text-[9px] text-slate-400">Baru saja</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mb-1 leading-snug">{campaignTitle || 'Nama Promo Di Sini'}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">{messageCopy || 'Konten promo akan terupdate di sini...'}</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic pt-4 leading-normal text-center">
              Seluruh target user di segmen ini akan mendapatkan notifikasi in-app promo real-time saat mereka login.
            </div>
          </div>
        </form>
      </section>

      {/* Campaign History Log */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-[#fafafa] flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="text-[#8b5cf6]" size={18} />
            Campaign Launch History
          </h2>
          <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
            Total {history.length} Terkirim
          </span>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Belum ada kampanye promosi yang diluncurkan. Buat kampanye di atas untuk memulainya.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-6 py-4">Waktu Peluncuran</th>
                  <th className="px-6 py-4">Internal Name & Content</th>
                  <th className="px-6 py-4">Target Segment</th>
                  <th className="px-6 py-4">Promo Type</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs">
                      {new Date(h.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-slate-800 text-xs mb-0.5">{h.title}</div>
                      <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{h.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {h.segment === 'all' ? 'Semua Pelanggan' : h.segment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border">
                        {h.promoType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={10} /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
