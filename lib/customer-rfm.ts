/** Transaksi pelanggan untuk RFM + K-Means */

export interface CustomerTransaction {
  customerId: string;
  lastOrderDaysAgo: number;
  orderCount: number;
  totalSpend: number;
}

export type RfmSegmentLabel =
  | 'Champions'
  | 'Loyal Customers'
  | 'Potential Loyalists'
  | 'New Customers'
  | 'Promising'
  | 'Need Attention'
  | 'About To Sleep'
  | 'At Risk'
  | 'Cannot Lose Them'
  | 'Hibernating'
  | 'Lost Customers';

export type ChurnRiskLevel = 'low' | 'medium' | 'high';

export interface RfmCustomerPoint {
  customerId: string;
  recencyScore: number;
  frequencyScore: number;
  monetaryScore: number;
  recencyRaw: number;
  frequencyRaw: number;
  monetaryRaw: number;
  cluster: number;
  segment: RfmSegmentLabel;
  churnRisk: ChurnRiskLevel;
  monetaryValue: number;
}

export interface ChurnSlice {
  name: string;
  value: number;
  level: ChurnRiskLevel;
  color: string;
}

export interface SegmentShift {
  id: string;
  customerId: string;
  message: string;
  direction: 'up' | 'down';
  timeAgo: string;
}

export interface ClusterCentroidSummary {
  clusterId: number;
  segmentName: RfmSegmentLabel;
  customerCount: number;
  percentage: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
  avgRfmScore: number;
}

export interface CustomerSegmentRow {
  customerId: string;
  customerName: string;
  recency: number;
  frequency: number;
  monetary: number;
  rfmScore: string;
  cluster: number;
  segmentLabel: RfmSegmentLabel;
}

export interface ExecutiveSummary {
  totalCustomers: number;
  numSegments: number;
  largestSegment: string;
  mostValuableSegment: string;
  highestChurnRiskSegment: string;
  recommendedActions: string[];
}

export interface SegmentInsight {
  label: RfmSegmentLabel;
  characteristics: string;
  riskLevel: ChurnRiskLevel;
  recommendedAction: string;
  campaignStrategy: string;
  customerCount?: number;
  percentage?: number;
  avgSpending?: number;
  avgFrequency?: number;
  avgRecency?: number;
}

export interface RfmAnalyticsResult {
  customers: RfmCustomerPoint[];
  kpi: {
    totalCliente: number;
    avgChurnRiskPct: number;
    topSegment: string;
    topSegmentRevenuePct: number;
    clienteleGrowthPct: number;
    churnTrendPct: number;
  };
  churnPie: ChurnSlice[];
  segmentShifts: SegmentShift[];
  clusterCentroids: { recency: number; frequency: number; monetary: number; segment: RfmSegmentLabel }[];
  clusterSummary?: ClusterCentroidSummary[];
  customerTable?: CustomerSegmentRow[];
  executiveSummary?: ExecutiveSummary;
  businessInsights?: SegmentInsight[];
}

const CHURN_COLORS = {
  low: '#8C7355',
  medium: '#4A3728',
  high: '#B85C4A',
};

const SEGMENT_COLORS: Record<RfmSegmentLabel, string> = {
  'Champions': '#6B4E9E',
  'Loyal Customers': '#3B82F6',
  'Potential Loyalists': '#10B981',
  'New Customers': '#06B6D4',
  'Promising': '#84CC16',
  'Need Attention': '#F59E0B',
  'About To Sleep': '#EC4899',
  'At Risk': '#EF4444',
  'Cannot Lose Them': '#9333EA',
  'Hibernating': '#64748B',
  'Lost Customers': '#94A3B8',
};

const SEGMENT_INSIGHTS: Record<RfmSegmentLabel, Omit<SegmentInsight, 'label'>> = {
  'Champions': {
    characteristics: 'Membeli sangat baru-baru ini, sangat sering, dan dengan nilai belanja sangat tinggi.',
    riskLevel: 'low',
    recommendedAction: 'Berikan akses awal ke koleksi eksklusif, apresiasi personal, dan program loyalitas VIP.',
    campaignStrategy: 'VIP Preview & Reward Spesial',
  },
  'Loyal Customers': {
    characteristics: 'Membeli secara berkala dengan nilai transaksi yang baik dan konsisten.',
    riskLevel: 'low',
    recommendedAction: 'Tawarkan produk pelengkap (cross-selling) dan mintalah ulasan atau rekomendasi.',
    campaignStrategy: 'Program Loyalitas & Rekomendasi Personal',
  },
  'Potential Loyalists': {
    characteristics: 'Pelanggan baru dengan frekuensi pembelian yang terus meningkat.',
    riskLevel: 'low',
    recommendedAction: 'Tawarkan program poin loyalitas dan rekomendasikan produk populer.',
    campaignStrategy: 'Welcome Back Offer & Point Boosters',
  },
  'New Customers': {
    characteristics: 'Baru saja melakukan transaksi pertama mereka.',
    riskLevel: 'low',
    recommendedAction: 'Kirimkan email sambutan, panduan produk, dan kupon diskon untuk pembelian kedua.',
    campaignStrategy: 'Welcome Discount & Brand Introduction',
  },
  'Promising': {
    characteristics: 'Baru bertransaksi tetapi frekuensi dan nilai belanja masih rendah.',
    riskLevel: 'medium',
    recommendedAction: 'Tingkatkan engagement dengan kurasi aroma personal dan penawaran terbatas.',
    campaignStrategy: 'Curated Discovery & Trial Offers',
  },
  'Need Attention': {
    characteristics: 'Recency dan frekuensi belanja berada di tingkat menengah; aktivitas mulai menunjukkan tren penurunan.',
    riskLevel: 'medium',
    recommendedAction: 'Tawarkan promo terbatas waktu dan tanyakan feedback mereka tentang layanan.',
    campaignStrategy: 'Limited-Time Special Discount & Feedback Survey',
  },
  'About To Sleep': {
    characteristics: 'Lama tidak aktif dan frekuensi belanja serta pengeluaran di bawah rata-rata.',
    riskLevel: 'medium',
    recommendedAction: 'Kirimkan penawaran khusus \'Kami Rindu Anda\' dengan diskon menarik.',
    campaignStrategy: 'Re-engagement Campaigns & Nostalgia Discount',
  },
  'At Risk': {
    characteristics: 'Dulu sering berbelanja dengan nilai tinggi, tetapi sudah lama tidak melakukan transaksi.',
    riskLevel: 'high',
    recommendedAction: 'Kirimkan email personalisasi tingkat tinggi dengan penawaran produk baru terfavorit.',
    campaignStrategy: 'Exclusive Re-activation Discount & Personalized Recommendations',
  },
  'Cannot Lose Them': {
    characteristics: 'Pelanggan bernilai sangat tinggi di masa lalu yang kini tidak aktif dalam waktu lama.',
    riskLevel: 'high',
    recommendedAction: 'Lakukan pendekatan personal via saluran khusus, tawarkan keuntungan luar biasa.',
    campaignStrategy: 'VIP One-on-One Outreach & Maximum Incentive Discount',
  },
  'Hibernating': {
    characteristics: 'Transaksi jarang, nominal kecil, dan sudah sangat lama tidak aktif.',
    riskLevel: 'high',
    recommendedAction: 'Tawarkan produk murah atau diskon pembersihan stok untuk melihat minat tersisa.',
    campaignStrategy: 'Standard Re-engagement Offer',
  },
  'Lost Customers': {
    characteristics: 'Transaksi terakhir sangat lama dengan interaksi minimal.',
    riskLevel: 'high',
    recommendedAction: 'Kirimkan kampanye re-aktivasi akhir secara otomatis; jika tidak merespons, hapus dari target aktif.',
    campaignStrategy: 'Last-Chance Winback Campaign',
  },
};

export { SEGMENT_COLORS, CHURN_COLORS, SEGMENT_INSIGHTS };

const MOCK_NAMES = [
  'Eleanor Vance', 'Julian Blackwood', 'Sophia Sterling', 'Arthur Pendelton', 'Elena Rahman',
  'Priya Santoso', 'Daniel Wijaya', 'Amara Kusuma', 'Tim Esscentia', 'Elena Vance',
  'Michael Chen', 'Sarah Jenkins', 'David Miller', 'Emma Watson', 'James Smith',
  'Olivia Johnson', 'Robert Brown', 'Sophia Davis', 'William Garcia', 'Isabella Martinez',
  'Oliver Jones', 'Mia Rodriguez', 'Lucas Wilson', 'Charlotte Thomas', 'Alexander Taylor',
  'Amelia Moore', 'Ethan Anderson', 'Harper Jackson', 'Mason Martin', 'Evelyn Lee',
  'Logan Thompson', 'Abigail White', 'Jacob Harris', 'Emily Sanchez', 'Liam Clark',
  'Elizabeth Ramirez', 'Constance Adams', 'Thomas Wayne', 'Bruce Kent', 'Clark Diana',
  'Peter Parker', 'Mary Watson', 'Harry Osborn', 'Tony Stark', 'Steve Rogers',
  'Natasha Romanoff', 'Bruce Banner', 'Thor Odinson', 'Clint Barton', 'Wanda Maximoff',
  'Vision Jarvis', 'Sam Wilson', 'James Barnes', 'Loki Laufeyson', 'Stephen Strange',
  'Carol Danvers', 'Peter Quill', 'Gamora Zen', 'Drax Destroyer', 'Rocket Raccoon',
  'Groot Tree', 'Mantis Green', 'Nebula Blue', 'T\'Challa Panther', 'Shuri Panther',
  'Scott Lang', 'Hope Pym', 'Hank Pym', 'Janet Dyne', 'Arthur Curry',
  'Barry Allen', 'Iris West', 'Hal Jordan', 'John Stewart', 'Oliver Queen',
  'Felicity Smoak', 'John Diggle', 'Sara Lance', 'Ray Palmer', 'Mick Rory',
  'Leonard Snart', 'Jax Jefferson', 'Martin Stein', 'Kendra Saunders', 'Carter Hall',
  'Kara Danvers', 'Alex Danvers', 'J\'onn J\'onzz', 'Winn Schott', 'James Olsen'
];

export function getMockCustomerName(id: string): string {
  const numStr = id.replace(/[^0-9]/g, '');
  const idx = numStr ? parseInt(numStr, 10) : 0;
  return MOCK_NAMES[idx % MOCK_NAMES.length];
}

/** Data transaksi mock — ~100 pelanggan premium */
export function generateMockMockTransactions(): CustomerTransaction[] {
  const rows: CustomerTransaction[] = [];
  const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;

  for (let i = 1; i <= 98; i++) {
    const r = seed(i);
    const tier = r < 0.22 ? 'champion' : r < 0.58 ? 'loyal' : 'risk';
    let lastOrderDaysAgo: number;
    let orderCount: number;
    let totalSpend: number;

    if (tier === 'champion') {
      lastOrderDaysAgo = Math.floor(3 + seed(i + 7) * 25);
      orderCount = Math.floor(8 + seed(i + 13) * 14);
      totalSpend = Math.floor(12_000_000 + seed(i + 19) * 28_000_000);
    } else if (tier === 'loyal') {
      lastOrderDaysAgo = Math.floor(20 + seed(i + 7) * 55);
      orderCount = Math.floor(3 + seed(i + 13) * 6);
      totalSpend = Math.floor(4_000_000 + seed(i + 19) * 10_000_000);
    } else {
      lastOrderDaysAgo = Math.floor(70 + seed(i + 7) * 120);
      orderCount = Math.floor(1 + seed(i + 13) * 2);
      totalSpend = Math.floor(800_000 + seed(i + 19) * 3_500_000);
    }

    rows.push({
      customerId: `#C-${8000 + i}`,
      lastOrderDaysAgo,
      orderCount,
      totalSpend,
    });
  }
  return rows;
}

export function generateMockTransactions(): CustomerTransaction[] {
  return generateMockMockTransactions();
}

function scoreQuantile(value: number, sorted: number[]): number {
  if (sorted.length === 0) return 3;
  const count = sorted.filter((v) => v <= value).length;
  const pct = count / sorted.length;
  if (pct <= 0.2) return 1;
  if (pct <= 0.4) return 2;
  if (pct <= 0.6) return 3;
  if (pct <= 0.8) return 4;
  return 5;
}

/** R: lebih baru = skor lebih tinggi (5 = baru) */
function recencyScore(daysAgo: number, allDays: number[]): number {
  const inverted = allDays.map((d) => Math.max(...allDays) - d + 1);
  const val = Math.max(...allDays) - daysAgo + 1;
  const sorted = [...inverted].sort((a, b) => a - b);
  return scoreQuantile(val, sorted);
}

function frequencyScore(count: number, all: number[]): number {
  const sorted = [...all].sort((a, b) => a - b);
  return scoreQuantile(count, sorted);
}

function monetaryScore(spend: number, all: number[]): number {
  const sorted = [...all].sort((a, b) => a - b);
  return scoreQuantile(spend, sorted);
}

type Vec4 = [number, number, number, number];

function dist4d(a: Vec4, b: Vec4): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2 +
    (a[3] - b[3]) ** 2
  );
}

function lcg(seed: number) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** K-Means (k) pada [Weighted_R, Weighted_F, Weighted_M, RFM_Score] */
function kMeans(features: Vec4[], k = 4, maxIter = 300): number[] {
  const n = features.length;
  if (n <= k) return features.map((_, i) => i % k);

  const rand = lcg(42);
  const centroids: Vec4[] = [];
  const chosenIndices = new Set<number>();

  while (centroids.length < k) {
    const idx = Math.floor(rand() * n);
    if (!chosenIndices.has(idx)) {
      chosenIndices.add(idx);
      centroids.push([...features[idx]] as Vec4);
    }
  }

  let assignments = new Array(n).fill(-1);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    const nextAssignments = features.map((f, i) => {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = dist4d(f, centroids[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (best !== assignments[i]) changed = true;
      return best;
    });

    assignments = nextAssignments;
    if (!changed) break;

    // Update centroids
    for (let c = 0; c < k; c++) {
      const members = features.filter((_, i) => assignments[i] === c);
      if (members.length > 0) {
        const sum: Vec4 = [0, 0, 0, 0];
        members.forEach((m) => {
          sum[0] += m[0];
          sum[1] += m[1];
          sum[2] += m[2];
          sum[3] += m[3];
        });
        centroids[c] = [
          sum[0] / members.length,
          sum[1] / members.length,
          sum[2] / members.length,
          sum[3] / members.length,
        ];
      }
    }
  }

  return assignments;
}

export function calculateRfmSegment(r: number, f: number, m: number): RfmSegmentLabel {
  if (r >= 4 && f >= 4 && m >= 4) {
    return 'Champions';
  }
  if (r >= 3 && f >= 3 && m >= 3) {
    return 'Loyal Customers';
  }
  if (r >= 3 && f >= 2) {
    return 'Potential Loyalists';
  }
  if (r >= 4 && f === 1) {
    return 'New Customers';
  }
  if (r === 3 && f === 1) {
    return 'Promising';
  }
  if (r === 3 && f === 2) {
    return 'Need Attention';
  }
  if (r === 2 && f <= 2) {
    return 'About To Sleep';
  }
  if (r <= 2 && f >= 4) {
    return 'Cannot Lose Them';
  }
  if (r <= 2 && f >= 2) {
    return 'At Risk';
  }
  if (r <= 2 && f === 1 && m > 1) {
    return 'Hibernating';
  }
  return 'Lost Customers';
}

function churnFromScores(r: number, f: number, m: number): ChurnRiskLevel {
  const composite = r * 0.45 + f * 0.35 + m * 0.2;
  if (composite >= 3.8) return 'low';
  if (composite >= 2.5) return 'medium';
  return 'high';
}

interface Archetype {
  label: RfmSegmentLabel;
  r: number;
  f: number;
  m: number;
}

const ARCHETYPES: Archetype[] = [
  { label: 'Champions', r: 0.95, f: 0.95, m: 0.95 },
  { label: 'Loyal Customers', r: 0.70, f: 0.85, m: 0.80 },
  { label: 'Potential Loyalists', r: 0.85, f: 0.50, m: 0.45 },
  { label: 'New Customers', r: 0.95, f: 0.10, m: 0.15 },
  { label: 'Promising', r: 0.75, f: 0.20, m: 0.20 },
  { label: 'Need Attention', r: 0.50, f: 0.50, m: 0.50 },
  { label: 'About To Sleep', r: 0.35, f: 0.25, m: 0.30 },
  { label: 'At Risk', r: 0.20, f: 0.70, m: 0.70 },
  { label: 'Cannot Lose Them', r: 0.10, f: 0.90, m: 0.90 },
  { label: 'Hibernating', r: 0.15, f: 0.20, m: 0.20 },
  { label: 'Lost Customers', r: 0.02, f: 0.05, m: 0.05 },
];

export function mapClustersToSegments(
  centroids: Vec4[], // [Weighted_R, Weighted_F, Weighted_M, RFM_Score]
  recencyWeight: number,
  frequencyWeight: number,
  monetaryWeight: number
): Record<number, RfmSegmentLabel> {
  const k = centroids.length;

  // Pair each cluster index with its centroid's RFM Score (centroids[c][3])
  const clusterScores = centroids.map((cent, c) => ({
    clusterIdx: c,
    score: cent[3],
  }));

  // Sort clusters by RFM Score descending (best customer cluster first)
  clusterScores.sort((a, b) => b.score - a.score);

  const mapping: Record<number, RfmSegmentLabel> = {};

  if (k === 3) {
    // 1st (Best) -> Champions
    // 2nd -> Loyal Customers
    // 3rd (Worst) -> Lost Customers
    mapping[clusterScores[0].clusterIdx] = 'Champions';
    mapping[clusterScores[1].clusterIdx] = 'Loyal Customers';
    mapping[clusterScores[2].clusterIdx] = 'Lost Customers';
  } else if (k === 5) {
    // 1st (Best) -> Champions
    // 2nd -> Loyal Customers
    // 3rd -> Potential Loyalists
    // 4th -> About To Sleep
    // 5th (Worst) -> Lost Customers
    mapping[clusterScores[0].clusterIdx] = 'Champions';
    mapping[clusterScores[1].clusterIdx] = 'Loyal Customers';
    mapping[clusterScores[2].clusterIdx] = 'Potential Loyalists';
    mapping[clusterScores[3].clusterIdx] = 'About To Sleep';
    mapping[clusterScores[4].clusterIdx] = 'Lost Customers';
  } else {
    // Default to k = 4 or other values
    // 1st (Best) -> Champions
    // 2nd -> Loyal Customers
    // 3rd -> Potential Loyalists
    // 4th (Worst) -> Lost Customers
    mapping[clusterScores[0].clusterIdx] = 'Champions';
    mapping[clusterScores[1].clusterIdx] = 'Loyal Customers';
    if (k > 2) {
      mapping[clusterScores[2].clusterIdx] = 'Potential Loyalists';
    }
    if (k > 3) {
      mapping[clusterScores[3].clusterIdx] = 'Lost Customers';
    }
    // Fallback for remaining (if k is large)
    for (let i = 4; i < k; i++) {
      mapping[clusterScores[i].clusterIdx] = 'Lost Customers';
    }
  }

  return mapping;
}

let cached: RfmAnalyticsResult | null = null;

/** Hitung RFM + K-Means dari data transaksi nyata dengan parameter */
export function buildRfmAnalytics(
  transactions: CustomerTransaction[],
  recencyWeight = 40,
  frequencyWeight = 30,
  monetaryWeight = 30,
  k = 4,
  maxIterations = 300
): RfmAnalyticsResult {
  if (transactions.length === 0) {
    return {
      customers: [],
      kpi: {
        totalCliente: 0,
        avgChurnRiskPct: 0,
        topSegment: 'Loyal Customers',
        topSegmentRevenuePct: 0,
        clienteleGrowthPct: 0,
        churnTrendPct: 0,
      },
      churnPie: [
        { name: 'Low Risk', level: 'low', value: 0, color: CHURN_COLORS.low },
        { name: 'Medium Risk', level: 'medium', value: 0, color: CHURN_COLORS.medium },
        { name: 'High Risk', level: 'high', value: 0, color: CHURN_COLORS.high },
      ],
      segmentShifts: [],
      clusterCentroids: [],
      clusterSummary: [],
      customerTable: [],
      executiveSummary: {
        totalCustomers: 0,
        numSegments: 0,
        largestSegment: 'None',
        mostValuableSegment: 'None',
        highestChurnRiskSegment: 'None',
        recommendedActions: [],
      },
      businessInsights: [],
    };
  }

  // STEP 1: CALCULATE RFM METRICS (done, fields exist on transactions)
  const recencies = transactions.map((t) => t.lastOrderDaysAgo);
  const frequencies = transactions.map((t) => t.orderCount);
  const monetaries = transactions.map((t) => t.totalSpend);

  const minR = Math.min(...recencies);
  const maxR = Math.max(...recencies);
  const minF = Math.min(...frequencies);
  const maxF = Math.max(...frequencies);
  const minM = Math.min(...monetaries);
  const maxM = Math.max(...monetaries);

  const wR = recencyWeight / 100;
  const wF = frequencyWeight / 100;
  const wM = monetaryWeight / 100;

  // STEP 2 & 3: NORMALIZE & APPLY WEIGHTS
  const features: Vec4[] = transactions.map((t) => {
    // Smaller Recency is better -> (maxR - R) / (maxR - minR)
    const normR = maxR === minR ? 1.0 : (maxR - t.lastOrderDaysAgo) / (maxR - minR);
    const normF = maxF === minF ? 1.0 : (t.orderCount - minF) / (maxF - minF);
    const normM = maxM === minM ? 1.0 : (t.totalSpend - minM) / (maxM - minM);

    const weightedR = normR * wR;
    const weightedF = normF * wF;
    const weightedM = normM * wM;
    const rfmScore = weightedR + weightedF + weightedM; // STEP 4: GENERATE RFM SCORE

    return [weightedR, weightedF, weightedM, rfmScore] as Vec4;
  });

  // STEP 5: PERFORM K-MEANS CLUSTERING
  const assignments = kMeans(features, k, maxIterations);

  // Calculate centroids
  const centroids: Vec4[] = Array.from({ length: k }, (_, c) => {
    const members = features.filter((_, i) => assignments[i] === c);
    if (members.length === 0) return [0, 0, 0, 0] as Vec4;
    const sum: Vec4 = [0, 0, 0, 0];
    members.forEach((m) => {
      sum[0] += m[0];
      sum[1] += m[1];
      sum[2] += m[2];
      sum[3] += m[3];
    });
    return [
      sum[0] / members.length,
      sum[1] / members.length,
      sum[2] / members.length,
      sum[3] / members.length,
    ] as Vec4;
  });

  // STEP 7: MAP CLUSTERS TO RFM SEGMENTS (centroid-based distance mapping)
  const clusterLabelMapping = mapClustersToSegments(centroids, recencyWeight, frequencyWeight, monetaryWeight);

  const customers: RfmCustomerPoint[] = transactions.map((t, i) => {
    // Generate scores for R-F-M quintiles 1-5 for backwards compatibility directory display
    const r = recencyScore(t.lastOrderDaysAgo, recencies);
    const f = frequencyScore(t.orderCount, frequencies);
    const m = monetaryScore(t.totalSpend, monetaries);
    
    const cluster = assignments[i];
    const segment = clusterLabelMapping[cluster] ?? 'Need Attention';

    return {
      customerId: t.customerId,
      recencyScore: r,
      frequencyScore: f,
      monetaryScore: m,
      recencyRaw: t.lastOrderDaysAgo,
      frequencyRaw: t.orderCount,
      monetaryRaw: t.totalSpend,
      cluster,
      segment,
      churnRisk: churnFromScores(r, f, m),
      monetaryValue: t.totalSpend,
    };
  });

  // KPI Calculations
  const churnCounts = { low: 0, medium: 0, high: 0 };
  customers.forEach((c) => churnCounts[c.churnRisk]++);
  const total = customers.length;
  const churnPie: ChurnSlice[] = [
    {
      name: 'Low Risk',
      level: 'low',
      value: Math.round((churnCounts.low / total) * 100),
      color: CHURN_COLORS.low,
    },
    {
      name: 'Medium Risk',
      level: 'medium',
      value: Math.round((churnCounts.medium / total) * 100),
      color: CHURN_COLORS.medium,
    },
    {
      name: 'High Risk',
      level: 'high',
      value: Math.round((churnCounts.high / total) * 100),
      color: CHURN_COLORS.high,
    },
  ];

  const highPct = churnPie.find((s) => s.level === 'high')?.value ?? 0;
  const segmentRevenue: Record<RfmSegmentLabel, number> = {
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
  const segmentCounts: Record<RfmSegmentLabel, number> = {
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

  customers.forEach((c) => {
    segmentRevenue[c.segment] += c.monetaryValue;
    segmentCounts[c.segment]++;
  });

  const totalRevenue = Object.values(segmentRevenue).reduce((a, b) => a + b, 0);
  const activeSegments = (Object.keys(segmentCounts) as RfmSegmentLabel[]).filter((k) => segmentCounts[k] > 0);
  const topSegment = (Object.entries(segmentRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Champions') as RfmSegmentLabel;
  const topSegmentRevenuePct = totalRevenue > 0 ? Math.round((segmentRevenue[topSegment] / totalRevenue) * 100) : 0;

  // STEP 6: ANALYZE CLUSTER CENTROIDS
  const clusterCentroids = centroids.map((cent, c) => {
    const members = customers.filter((x) => x.cluster === c);
    const avg = (key: 'recencyRaw' | 'frequencyRaw' | 'monetaryRaw') =>
      members.reduce((s, m) => s + m[key], 0) / (members.length || 1);

    return {
      recency: avg('recencyRaw'),
      frequency: avg('frequencyRaw'),
      monetary: avg('monetaryRaw'),
      segment: clusterLabelMapping[c] ?? 'Need Attention',
    };
  });

  // STEP 9A: CLUSTER SUMMARY
  const clusterSummary: ClusterCentroidSummary[] = centroids.map((cent, c) => {
    const members = customers.filter((x) => x.cluster === c);
    const avgScore = members.reduce((s, m) => {
      const idx = transactions.findIndex((t) => t.customerId === m.customerId);
      return s + (features[idx]?.[3] ?? 0);
    }, 0) / (members.length || 1);

    const avgRawRecency = members.reduce((s, m) => s + m.recencyRaw, 0) / (members.length || 1);
    const avgRawFrequency = members.reduce((s, m) => s + m.frequencyRaw, 0) / (members.length || 1);
    const avgRawMonetary = members.reduce((s, m) => s + m.monetaryRaw, 0) / (members.length || 1);

    return {
      clusterId: c,
      segmentName: clusterLabelMapping[c] ?? 'Need Attention',
      customerCount: members.length,
      percentage: Math.round((members.length / total) * 100),
      avgRecency: Math.round(avgRawRecency * 10) / 10,
      avgFrequency: Math.round(avgRawFrequency * 10) / 10,
      avgMonetary: Math.round(avgRawMonetary),
      avgRfmScore: Math.round(avgScore * 100) / 100,
    };
  });

  // STEP 9B: CUSTOMER SEGMENTATION TABLE
  const customerTable: CustomerSegmentRow[] = customers.map((c) => {
    return {
      customerId: c.customerId,
      customerName: getMockCustomerName(c.customerId),
      recency: c.recencyRaw,
      frequency: c.frequencyRaw,
      monetary: c.monetaryRaw,
      rfmScore: `${c.recencyScore}-${c.frequencyScore}-${c.monetaryScore}`,
      cluster: c.cluster,
      segmentLabel: c.segment,
    };
  });

  // STEP 8: GENERATE BUSINESS INSIGHTS
  const businessInsights: SegmentInsight[] = activeSegments.map((seg) => {
    const count = segmentCounts[seg];
    const spendList = customers.filter((c) => c.segment === seg).map((c) => c.monetaryValue);
    const freqList = customers.filter((c) => c.segment === seg).map((c) => c.frequencyRaw);
    const recList = customers.filter((c) => c.segment === seg).map((c) => c.recencyRaw);

    const avgSpend = spendList.reduce((a, b) => a + b, 0) / (spendList.length || 1);
    const avgFreq = freqList.reduce((a, b) => a + b, 0) / (freqList.length || 1);
    const avgRec = recList.reduce((a, b) => a + b, 0) / (recList.length || 1);

    const baseInsight = SEGMENT_INSIGHTS[seg];

    return {
      label: seg,
      characteristics: baseInsight.characteristics,
      riskLevel: baseInsight.riskLevel,
      recommendedAction: baseInsight.recommendedAction,
      campaignStrategy: baseInsight.campaignStrategy,
      customerCount: count,
      percentage: Math.round((count / total) * 100),
      avgSpending: Math.round(avgSpend),
      avgFrequency: Math.round(avgFreq * 10) / 10,
      avgRecency: Math.round(avgRec * 10) / 10,
    };
  });

  // STEP 9C: EXECUTIVE SUMMARY
  const sortedCounts = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]);
  const largestSegment = sortedCounts[0]?.[0] as RfmSegmentLabel;
  const mostValuableSegment = Object.entries(segmentRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] as RfmSegmentLabel;

  // Highest churn risk segment = segment among active ones with highest riskLevel = high
  const riskPriorities = ['Champions', 'Loyal Customers', 'Potential Loyalists', 'New Customers', 'Promising', 'Need Attention', 'About To Sleep', 'At Risk', 'Cannot Lose Them', 'Hibernating', 'Lost Customers'];
  const activeRiskSegments = activeSegments.filter((s) => SEGMENT_INSIGHTS[s].riskLevel === 'high');
  let highestChurnRiskSegment: RfmSegmentLabel = 'Lost Customers';
  if (activeRiskSegments.length > 0) {
    highestChurnRiskSegment = activeRiskSegments.sort((a, b) => riskPriorities.indexOf(b) - riskPriorities.indexOf(a))[0];
  }

  const executiveSummary: ExecutiveSummary = {
    totalCustomers: total,
    numSegments: activeSegments.length,
    largestSegment,
    mostValuableSegment,
    highestChurnRiskSegment,
    recommendedActions: [
      `Fokus kampanye reaktivasi untuk segmen '${highestChurnRiskSegment}' menggunakan promosi yang disesuaikan.`,
      `Pertahankan loyalitas segmen '${mostValuableSegment}' dengan program VIP khusus.`,
      `Dorong loyalitas baru pada segmen '${largestSegment}' dengan welcome offer dan loyalty program.`,
    ],
  };

  return {
    customers,
    kpi: {
      totalCliente: total,
      avgChurnRiskPct: highPct,
      topSegment,
      topSegmentRevenuePct,
      clienteleGrowthPct: 0,
      churnTrendPct: 0,
    },
    churnPie,
    segmentShifts: [],
    clusterCentroids,
    clusterSummary,
    customerTable,
    executiveSummary,
    businessInsights,
  };
}

/** @deprecated Gunakan buildRfmAnalytics dengan data nyata */
export function computeRfmAnalytics(): RfmAnalyticsResult {
  if (cached) return cached;
  cached = buildRfmAnalytics(generateMockTransactions());
  cached.kpi.totalCliente = 12458;
  cached.kpi.clienteleGrowthPct = 4.2;
  cached.kpi.churnTrendPct = -1.1;
  cached.segmentShifts = [
    {
      id: '1',
      customerId: '#C-8092',
      message: 'dropped from \'Loyal Customers\' to \'Hibernating\'',
      direction: 'down',
      timeAgo: '2h ago',
    },
    {
      id: '2',
      customerId: '#C-8041',
      message: 'upgraded to Champions tier',
      direction: 'up',
      timeAgo: '5h ago',
    },
  ];
  return cached;
}
