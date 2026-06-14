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
import { canManageCampaigns, adminRoleLabel } from '@/lib/admin-permissions';
import type { RfmAnalyticsResult, RfmSegmentLabel } from '@/lib/customer-rfm';

interface CampaignHistoryItem {
  id: number;
  title: string;
  message: string;
  segment: string;
  promoType: string;
  durationDays?: number;
  createdAt: string;
}

const SEGMENT_METADATA: Record<RfmSegmentLabel, { 
  label: string;
  characteristics: string;
  crmStrategy: string;
  desc: string; 
  icon: any; 
  color: string; 
  bgColor: string; 
  iconColor: string;
  defaultPromoType: 'Private Collection Access' | 'Discount Code' | 'Event Invitation';
  defaultMessages: Record<'Private Collection Access' | 'Discount Code' | 'Event Invitation', string>;
}> = {
  'Champions': {
    label: 'Champions',
    characteristics: 'Baru bertransaksi, sering membeli, dan nilai transaksi tinggi',
    crmStrategy: 'Berikan early access produk baru, program VIP, hadiah eksklusif, referral program, dan bonus sample parfum premium',
    desc: 'Pelanggan utama yang sangat loyal, sering berbelanja, dengan total pengeluaran tertinggi.',
    icon: Star,
    color: '#6B4E9E',
    bgColor: 'bg-purple-50 border-t-purple-500',
    iconColor: 'bg-purple-100 text-purple-600',
    defaultPromoType: 'Private Collection Access',
    defaultMessages: {
      'Private Collection Access': 'Sebagai pelanggan VIP Champions kami, nikmati early access VIP untuk perilisan produk terbaru kami, bonus sampel parfum premium di setiap transaksi, dan hadiah eksklusif. Terima kasih atas loyalitas Anda.',
      'Discount Code': 'Sebagai penghargaan khusus untuk pelanggan Champions teraktif kami, gunakan kode kupon SPECIAL25 untuk mendapatkan potongan 25% pada seluruh koleksi parfum premium Esscentia. Terima kasih telah menjadi bagian dari kisah kami.',
      'Event Invitation': 'Anda diundang secara eksklusif to acara tertutup "Esscentia Masterclass & Dinner VIP" di Kemang. Bergabunglah bersama para pecinta parfum elit lainnya untuk sesi peracikan wewangian pribadi bersama Master Perfumer kami.'
    }
  },
  'Loyal Customers': {
    label: 'Loyal Customers',
    characteristics: 'Sering membeli tetapi nilai transaksi tidak selalu tertinggi',
    crmStrategy: 'Membership tier, point rewards, bundling parfum, cross-selling produk body care atau deodorant',
    desc: 'Berbelanja rutin dan merespons positif promosi produk baru.',
    icon: Heart,
    color: '#3B82F6',
    bgColor: 'bg-blue-50 border-t-blue-500',
    iconColor: 'bg-blue-100 text-blue-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Terima kasih atas kebersamaan Anda bersama Esscentia. Kami mengundang Anda untuk merasakan pengalaman pertama koleksi premium terbaru kami sebelum diluncurkan ke publik. Silakan lakukan pre-order eksklusif.',
      'Discount Code': 'Terima kasih telah sering berbelanja wewangian di Esscentia. Kumpulkan point rewards Anda, dapatkan penawaran bundling parfum, dan tukarkan voucher poin spesial pada kategori body care menggunakan kode kupon SPECIAL25.',
      'Event Invitation': 'Sebagai ungkapan terima kasih kepada pelanggan setia kami, kami mengundang Anda menghadiri "Esscentia VIP Scent Soirée". Nikmati konsultasi wewangian gratis dan penawaran spesial selama acara berlangsung.'
    }
  },
  'Potential Loyalists': {
    label: 'Potential Loyalists',
    characteristics: 'Baru mulai sering berbelanja dan menunjukkan potensi loyal',
    crmStrategy: 'Welcome journey, diskon pembelian kedua, edukasi parfum, rekomendasi produk personal',
    desc: 'Frekuensi belanja terus meningkat dengan nilai keranjang yang stabil.',
    icon: Sparkles,
    color: '#10B981',
    bgColor: 'bg-emerald-50 border-t-emerald-500',
    iconColor: 'bg-emerald-100 text-emerald-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Aroma favorit Anda menunjukkan selera yang luar biasa. Dapatkan akses awal khusus untuk melihat dan memiliki koleksi edisi terbatas terbaru kami sebelum kehabisan.',
      'Discount Code': 'Selamat atas langkah Anda mengeksplorasi wewangian Esscentia! Nikmati voucher diskon 10% untuk transaksi kedua Anda menggunakan kode kupon NEWSCENT10, serta kurasi rekomendasi parfum personal dari pakar kami.',
      'Event Invitation': 'Mari temukan karakter aroma sejati Anda! Kami mengundang Anda menghadiri "Scent Customization Workshop" akhir pekan ini di butik utama Esscentia. Konfirmasi kehadiran Anda hari ini.'
    }
  },
  'New Customers': {
    label: 'New Customers',
    characteristics: 'Baru pertama kali membeli',
    crmStrategy: 'Onboarding email, panduan penggunaan parfum, voucher pembelian berikutnya dalam 7-14 hari',
    desc: 'Pelanggan baru yang baru saja menyelesaikan transaksi pertamanya.',
    icon: Zap,
    color: '#06B6D4',
    bgColor: 'bg-cyan-50 border-t-cyan-500',
    iconColor: 'bg-cyan-100 text-cyan-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Baru saja bergabung dengan keluarga Esscentia? Nikmati keuntungan istimewa berupa prioritas pre-order koleksi eksklusif kami yang akan datang secara gratis.',
      'Discount Code': 'Terima kasih atas pembelian pertama Anda di Esscentia! Temukan panduan eksklusif merawat botol dan cara menyemprotkan parfum agar wanginya tahan lama. Dapatkan potongan 10% untuk pesanan berikutnya dalam 14 hari dengan kupon NEWSCENT10.',
      'Event Invitation': 'Selamat datang di komunitas wewangian kami! Kami mengundang Anda untuk menghadiri sesi pengenalan "Aroma 101" secara eksklusif di butik kami untuk belajar mengidentifikasi wewangian yang cocok untuk Anda.'
    }
  },
  'Promising': {
    label: 'Promising',
    characteristics: 'Belum sering membeli tetapi menunjukkan minat',
    crmStrategy: 'Remarketing ads, email rekomendasi parfum sesuai preferensi, promo ringan',
    desc: 'Pembeli baru-baru ini yang menunjukkan minat aktif.',
    icon: TrendingUp,
    color: '#84CC16',
    bgColor: 'bg-lime-50 border-t-lime-500',
    iconColor: 'bg-lime-100 text-lime-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Apresiasi kami atas ketertarikan Anda pada koleksi parfum kami. Dapatkan kesempatan emas menjadi yang pertama memesan parfum premium varian terbaru kami sebelum dirilis secara global.',
      'Discount Code': 'Pilihan wewangian Anda menunjukkan karakter yang elegan. Nikmati rekomendasi parfum premium yang disesuaikan khusus untuk Anda dan dapatkan promo bebas ongkir hari ini menggunakan kupon NEWSCENT10.',
      'Event Invitation': 'Anda diundang ke pameran aroma eksklusif "Esscentia Autumn Collection Reveal". Saksikan peluncuran wewangian baru dan dapatkan sampel gratis saat menghadiri acara.'
    }
  },
  'Need Attention': {
    label: 'Need Attention',
    characteristics: 'Frekuensi dan recency mulai menurun',
    crmStrategy: 'Reminder personal, promo khusus, rekomendasi produk baru berdasarkan riwayat pembelian',
    desc: 'Laju transaksi menurun, membutuhkan re-engagement.',
    icon: AlertCircle,
    color: '#F59E0B',
    bgColor: 'bg-amber-50 border-t-amber-500',
    iconColor: 'bg-amber-100 text-amber-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Kami merindukan kunjungan Anda. Jadilah yang pertama melihat perilisan koleksi aroma terbatas kami yang dirancang khusus untuk memikat kembali indra penciuman Anda.',
      'Discount Code': 'Kami menyadari Anda sudah lama tidak mengunjungi galeri wewangian kami. Dapatkan penawaran khusus diskon 25% menggunakan kode kupon BACK25 untuk produk-produk terlaris yang sesuai dengan riwayat belanja Anda.',
      'Event Invitation': 'Sudah lama tidak berjumpa! Kami mengundang Anda ke acara temu pelanggan eksklusif "Esscentia Re-engagement High Tea" untuk mencoba rilisan aroma terbaru kami secara langsung.'
    }
  },
  'About To Sleep': {
    label: 'About To Sleep',
    characteristics: 'Sudah lama tidak membeli dan mulai pasif',
    crmStrategy: 'Flash sale terbatas, notifikasi stok baru, kampanye "Kami Merindukan Anda"',
    desc: 'Kecenderungan tidak aktif tinggi jika tidak segera dihubungi.',
    icon: Activity,
    color: '#EC4899',
    bgColor: 'bg-pink-50 border-t-pink-500',
    iconColor: 'bg-pink-100 text-pink-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Kami merindukan kehadiran Anda di galeri kami. Sebagai sambutan selamat datang kembali, nikmati hak istimewa memesan lebih awal koleksi edisi terbatas kami sebelum dibuka untuk umum.',
      'Discount Code': 'Kami merindukan kebersamaan Anda! Nikmati flash sale khusus hari ini dengan potongan diskon 30% menggunakan kode kupon REACTIVATE30. Stok terbatas untuk koleksi wewangian terlaris kami.',
      'Event Invitation': 'Kami ingin menyambut Anda kembali dengan hangat. Hadiri acara ramah tamah "Esscentia Scent Pairing Night" dan dapatkan hadiah penyambutan eksklusif berupa travel-size parfum.'
    }
  },
  'At Risk': {
    label: 'At Risk',
    characteristics: 'Dulu pelanggan aktif tetapi sudah lama tidak bertransaksi',
    crmStrategy: 'Penawaran eksklusif, diskon lebih besar, survei kepuasan untuk mengetahui penyebab berhenti membeli',
    desc: 'Pelanggan bernilai tinggi di masa lalu yang sudah tidak bertransaksi.',
    icon: AlertTriangle,
    color: '#EF4444',
    bgColor: 'bg-red-50 border-t-red-500',
    iconColor: 'bg-red-100 text-red-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Sebagai mantan pelanggan aktif kami, kami ingin menghidupkan kembali minat Anda. Dapatkan akses pre-order eksklusif untuk koleksi parfum premium kami dengan keuntungan sampel gratis.',
      'Discount Code': 'Kami ingin mendengar kabar dari Anda kembali di Esscentia. Dapatkan diskon apresiasi sebesar 25% menggunakan kode kupon BACK25 dan bantu kami mengisi survei singkat kepuasan pelanggan agar kami bisa meningkatkan kualitas pelayanan.',
      'Event Invitation': 'Kembalilah mengeksplorasi seni wewangian bersama kami. Hadiri acara workshop "Scent & Soul Therapy" secara gratis khusus untuk pelanggan berharga seperti Anda.'
    }
  },
  'Cannot Lose Them': {
    label: 'Cannot Lose Them',
    characteristics: 'Pelanggan bernilai tinggi yang hampir churn',
    crmStrategy: 'Personal account manager, hadiah spesial, telemarketing personal, voucher premium',
    desc: 'Pelanggan VIP lama yang hampir hilang.',
    icon: ShieldAlert,
    color: '#9333EA',
    bgColor: 'bg-indigo-50 border-t-indigo-500',
    iconColor: 'bg-indigo-100 text-indigo-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Status VIP Anda sangat penting bagi kami. Kami memberikan jalur VIP khusus untuk memesan koleksi "Midnight Amber" edisi terbatas sebelum pendaftaran pre-order publik dibuka.',
      'Discount Code': 'Anda adalah pelanggan VIP utama yang sangat bernilai bagi kami. Nikmati voucher belanja premium senilai Rp200.000 menggunakan kupon LOVAL200 dan nikmati hadiah spesial khusus yang dikirimkan oleh Personal Account Manager Anda.',
      'Event Invitation': 'Kami mengundang Anda ke acara makan malam privat eksklusif "Esscentia Founder\'s Dinner" di Kemang. Dapatkan wewangian kustom gratis yang diracik khusus untuk Anda selama acara.'
    }
  },
  'Hibernating': {
    label: 'Hibernating',
    characteristics: 'Sangat lama tidak bertransaksi dan frekuensi rendah',
    crmStrategy: 'Kampanye reaktivasi massal, diskon besar, iklan retargeting',
    desc: 'Pelanggan pasif yang membutuhkan diskon besar untuk aktif kembali.',
    icon: Moon,
    color: '#64748B',
    bgColor: 'bg-slate-50 border-t-slate-500',
    iconColor: 'bg-slate-100 text-slate-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Kembalilah ke dunia wewangian mewah. Kami memberikan akses prioritas pertama untuk mencoba koleksi parfum terlangka kami yang baru saja tiba di galeri.',
      'Discount Code': 'Ayo hidupkan kembali aroma kemewahan wewangian Anda! Dapatkan diskon reaktivasi massal sebesar 30% menggunakan kupon khusus REACTIVATE30 untuk seluruh pilihan produk Esscentia hari ini.',
      'Event Invitation': 'Kami menyelenggarakan acara reaktivasi khusus "Esscentia Scent Revival Gatherings". Hadiri acara ini secara gratis dan nikmati diskon khusus langsung di lokasi.'
    }
  },
  'Lost Customers': {
    label: 'Lost Customers',
    characteristics: 'Praktis sudah meninggalkan brand',
    crmStrategy: 'Win-back campaign, penawaran sangat menarik, survei alasan berhenti, jika tidak respons hentikan biaya pemasaran',
    desc: 'Pelanggan yang sudah tidak aktif sama sekali dalam waktu yang sangat lama.',
    icon: UserX,
    color: '#94A3B8',
    bgColor: 'bg-stone-50 border-t-stone-400',
    iconColor: 'bg-stone-100 text-stone-600',
    defaultPromoType: 'Discount Code',
    defaultMessages: {
      'Private Collection Access': 'Kami ingin mengajak Anda menjelajahi kembali keindahan wewangian Esscentia. Nikmati kesempatan memesan terlebih dahulu koleksi parfum premium terbaru kami dengan bonus khusus.',
      'Discount Code': 'Kami ingin menyapa Anda kembali dengan penawaran win-back istimewa diskon 30% menggunakan kode kupon REACTIVATE30. Kami juga sangat berterima kasih apabila Anda berkenan membagikan alasan mengapa Anda berpaling dari koleksi parfum kami.',
      'Event Invitation': 'Sebagai undangan spesial terakhir kami, hadiri pameran "Esscentia Open House Soirée". Rasakan sensasi aroma-aroma baru kami dan temukan alasan untuk jatuh cinta kembali pada Esscentia.'
    }
  },
};


const DEFAULT_MESSAGES: Record<string, string> = {
  'Private Collection Access': "Sebagai pelanggan berharga dalam lingkaran utama kami, kami mengundang Anda untuk merasakan pengalaman pertama koleksi premium 'Midnight Amber' sebelum dirilis ke publik. Dapatkan alokasi eksklusif Anda hari ini.",
  'Discount Code': "Terima kasih atas kebersamaan Anda bersama Esscentia. Gunakan kode promo khusus 'SPECIAL25' untuk menikmati diskon 25% pada seluruh produk premium kami tanpa minimum transaksi. Valid hingga akhir bulan ini!",
  'Event Invitation': "Anda secara eksklusif diundang menghadiri 'Esscentia VIP Scent Soirée' di Kemang Raya. Rasakan pengalaman meracik parfum eksklusif dipandu oleh Master Perfumer kami. Konfirmasi kehadiran Anda sekarang."
};

export default function CampaignManagerPage() {
  const { user } = useAuth();
  const canManage = canManageCampaigns(user?.role);
  const [analytics, setAnalytics] = useState<RfmAnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<CampaignHistoryItem[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<RfmSegmentLabel | 'all'>('all');
  
  // Form States
  const [campaignTitle, setCampaignTitle] = useState('');
  const [promoType, setPromoType] = useState('Private Collection Access');
  const [durationDays, setDurationDays] = useState(7);
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

  // Initialize fields with a default
  useEffect(() => {
    if (campaignTitle === '') {
      setCampaignTitle('Kampanye Broadcast Database');
    }
  }, []);

  // Group and count customers by segment
  const segmentCounts = useMemo(() => {
    const counts: Record<RfmSegmentLabel, number> = {
      'Champions': 0,
      'Loyal Customers': 0,
      'Potential Loyalists': 0,
      'New Customers': 0,
      'Promising': 0,
      'Need Attention': 0,
      'About To Sleep': 0,
      'At Risk': 0,
      'Cannot Lose Them': 0,
      'Hibernating': 0,
      'Lost Customers': 0,
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

  // Handle Segment Change and Populate Form
  const handleSegmentChange = (segment: RfmSegmentLabel | 'all') => {
    setSelectedSegment(segment);
    if (segment === 'all') {
      setCampaignTitle('Kampanye Broadcast Database');
      setPromoType('Private Collection Access');
      setMessageCopy("Sebagai pelanggan setia Esscentia, dapatkan penawaran koleksi terbaru aroma premium untuk melengkapi jiwa modern Anda.");
    } else {
      const meta = SEGMENT_METADATA[segment];
      setCampaignTitle(`Kampanye Khusus - ${meta.label}`);
      setPromoType(meta.defaultPromoType);
      setMessageCopy(meta.defaultMessages[meta.defaultPromoType]);
    }
  };

  // Handle Promotion Type Change and Autofill Template if unmodified
  const handlePromoTypeChange = (newPromoType: string) => {
    const oldPromoType = promoType;
    setPromoType(newPromoType);
    
    // Check if the current message is a default message
    const currentDefault = selectedSegment === 'all'
      ? "Sebagai pelanggan setia Esscentia, dapatkan penawaran koleksi terbaru aroma premium untuk melengkapi jiwa modern Anda."
      : SEGMENT_METADATA[selectedSegment].defaultMessages[oldPromoType as 'Private Collection Access' | 'Discount Code' | 'Event Invitation'];
      
    // Collect all possible default messages
    const allDefaults = [
      currentDefault,
      ...Object.values(DEFAULT_MESSAGES),
      ...Object.values(SEGMENT_METADATA).flatMap(meta => Object.values(meta.defaultMessages))
    ];

    const isMessageDefault = !messageCopy.trim() || allDefaults.includes(messageCopy);

    if (isMessageDefault) {
      if (selectedSegment !== 'all') {
        setMessageCopy(SEGMENT_METADATA[selectedSegment].defaultMessages[newPromoType as 'Private Collection Access' | 'Discount Code' | 'Event Invitation']);
      } else {
        setMessageCopy(DEFAULT_MESSAGES[newPromoType] || '');
      }
    }
  };

  // Cancel/Revoke Campaign
  const handleCancelCampaign = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan kampanye ini? Notifikasi akan langsung hilang dari sisi pengguna.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/campaigns?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (response.ok) {
        setNotification({ type: 'success', message: 'Kampanye promosi berhasil dibatalkan dan notifikasi telah dihapus.' });
        fetchData(); // Refresh history log
      } else {
        setNotification({ type: 'error', message: data.error || 'Gagal membatalkan kampanye' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Terjadi kesalahan saat menghubungi server' });
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
          promoType: promoType,
          durationDays: durationDays
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotification({ type: 'success', message: `Kampanye promosi target segmen "${selectedSegment}" sukses diluncurkan!` });
        setCampaignTitle('');
        setSelectedSegment('all');
        setDurationDays(7);
        
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

  const getDropdownLabel = (seg: RfmSegmentLabel) => {
    return SEGMENT_METADATA[seg]?.label || seg;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-slate-800 pb-16">
      
      {/* Header matching mockup */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#8C7355]/10 rounded-xl text-[#8C7355] shrink-0 mt-1">
          <Megaphone size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#4A3728]">
            Campaign Designer
          </h1>
          <p className="text-stone-500 text-xs mt-1">
            Konfigurasikan strategi penawaran promo atau peluncuran berita ke segmentasi terpilih.
          </p>
        </div>
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

      {/* Campaign Designer Section */}
      <section id="campaign-designer" className="scroll-mt-6">
        {canManage ? (
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
                    onChange={(e) => handleSegmentChange(e.target.value as RfmSegmentLabel | 'all')}
                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355] focus:border-[#8C7355] bg-white text-slate-700 font-medium"
                  >
                    <option value="all">Semua Segmen Pelanggan (Database Keseluruhan)</option>
                    {(Object.keys(SEGMENT_METADATA) as RfmSegmentLabel[]).map((seg) => (
                      <option key={seg} value={seg}>
                        {getDropdownLabel(seg)} ({segmentCounts[seg]} Profil Aktif)
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
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355] focus:border-[#8C7355] bg-white"
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
                    onChange={(e) => handlePromoTypeChange(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355] focus:border-[#8C7355] bg-white text-slate-700 font-medium"
                  >
                    <option value="Private Collection Access">Private Collection Access (Akses Awal Produk)</option>
                    <option value="Discount Code">Discount Code (Kode Kupon Diskon)</option>
                    <option value="Event Invitation">Event Invitation (Undangan Event VIP)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Promo Duration (Days) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                  Durasi Promo Aktif (Hari)
                </label>
                <input 
                  type="number" 
                  min={1} 
                  value={durationDays}
                  onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  placeholder="Masukkan jumlah hari, contoh: 5" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355] focus:border-[#8C7355] bg-white text-slate-700 font-medium"
                  required
                />
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
                    className="flex items-center gap-1 text-[10px] font-semibold text-[#8C7355] bg-[#8C7355]/10 hover:bg-[#8C7355]/20 px-2 py-1 rounded transition-colors"
                  >
                    <Sparkles size={10} /> AI Assistent Refine
                  </button>
                </div>
                <textarea 
                  value={messageCopy}
                  onChange={(e) => setMessageCopy(e.target.value)}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7355] focus:border-[#8C7355] bg-white leading-relaxed text-slate-700"
                  placeholder="Ketik konten promo yang eksklusif..."
                  required
                />
              </div>

              {/* Action Button */}
              <div className="flex gap-4 pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#4A3728] hover:bg-[#8C7355] text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 w-full justify-center shadow-md shadow-stone-100 disabled:opacity-50"
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
                        ? 'border-[#8D4F38] bg-[#8D4F38]/5 text-[#8D4F38]' 
                        : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300'
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
                        ? 'border-[#8D4F38] bg-[#8D4F38]/5 text-[#8D4F38]' 
                        : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300'
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
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8D4F38]"></div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-[#8D4F38] bg-[#8D4F38]/10 px-1.5 py-0.5 rounded border border-[#8D4F38]/20">
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
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-500 max-w-2xl mx-auto flex flex-col items-center">
            <div className="p-3 bg-[#EDEAE4]/50 rounded-full w-fit mb-3">
              <ShieldAlert className="text-[#8C7355]" size={24} />
            </div>
            <p className="font-serif font-bold text-sm text-[#4A3728]">Mode Lihat Saja (Read Only)</p>
            <p className="text-xs text-stone-500 mt-1 max-w-md leading-relaxed">
              Anda masuk sebagai <span className="font-semibold">{adminRoleLabel(user?.role)}</span>. Anda hanya diizinkan untuk melihat segmentasi dan riwayat campaign, tidak dapat meluncurkan campaign baru.
            </p>
          </div>
        )}
      </section>

      {/* Campaign History Log */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-[#fafafa] flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="text-[#8C7355]" size={18} />
            Campaign Launch History
          </h2>
          <span className="text-xs font-semibold bg-[#8C7355]/10 text-[#8C7355] px-2.5 py-1 rounded-full border border-[#8C7355]/20">
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
                  <th className="px-6 py-4 text-center">Status & Aksi</th>
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
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {h.segment === 'all' ? 'Semua Pelanggan' : (SEGMENT_METADATA[h.segment as RfmSegmentLabel]?.label || h.segment)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border">
                          {h.promoType}
                        </span>
                        {h.durationDays && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Aktif: {h.durationDays} hari
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-1.5 rounded-lg">
                          <CheckCircle2 size={10} /> Active
                        </span>
                        {canManage && (
                          <button
                            onClick={() => handleCancelCampaign(h.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-red-700 bg-red-100 border border-red-200 px-2 py-1.5 rounded-lg hover:bg-red-200 transition"
                          >
                            Batal
                          </button>
                        )}
                      </div>
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
