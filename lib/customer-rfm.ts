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
  | 'Potential Loyalist'
  | 'Recent Customers'
  | 'Promising'
  | 'Need Attention'
  | 'About to Sleep'
  | 'At Risk'
  | "Can't Lose Them"
  | 'Hibernating'
  | 'Lost';

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
}

const CHURN_COLORS = {
  low: '#8C7355',
  medium: '#4A3728',
  high: '#B85C4A',
};

const SEGMENT_COLORS: Record<RfmSegmentLabel, string> = {
  'Champions': '#6B4E9E',
  'Loyal Customers': '#3B82F6',
  'Potential Loyalist': '#10B981',
  'Recent Customers': '#06B6D4',
  'Promising': '#84CC16',
  'Need Attention': '#F59E0B',
  'About to Sleep': '#EC4899',
  'At Risk': '#EF4444',
  "Can't Lose Them": '#9333EA',
  'Hibernating': '#64748B',
  'Lost': '#94A3B8',
};

export { SEGMENT_COLORS, CHURN_COLORS };

/** Data transaksi mock — ~100 pelanggan premium */
function generateMockTransactions(): CustomerTransaction[] {
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
      customerId: `#${800 + i}`,
      lastOrderDaysAgo,
      orderCount,
      totalSpend,
    });
  }
  return rows;
}

function scoreQuantile(value: number, sorted: number[]): number {
  const idx = sorted.findIndex((v) => v >= value);
  const rank = idx === -1 ? sorted.length : idx + 1;
  const pct = rank / sorted.length;
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

type Vec3 = [number, number, number];

function dist(a: Vec3, b: Vec3): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/** K-Means (k=3) pada skor RFM 1–5 */
function kMeans(features: Vec3[], k = 3, maxIter = 50): number[] {
  const n = features.length;
  if (n < k) return features.map((_, i) => i % k);

  const indices = new Set<number>();
  while (indices.size < k) {
    indices.add(Math.floor(Math.random() * n));
  }
  let centroids: Vec3[] = [...indices].map((i) => [...features[i]] as Vec3);
  let assignments = new Array(n).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    const next = features.map((f) => {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = dist(f, centroids[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      return best;
    });

    const unchanged = next.every((a, i) => a === assignments[i]);
    assignments = next;
    if (unchanged) break;

    centroids = Array.from({ length: k }, (_, c) => {
      const members = features.filter((_, i) => assignments[i] === c);
      if (members.length === 0) return centroids[c];
      const sum: Vec3 = [0, 0, 0];
      members.forEach((m) => {
        sum[0] += m[0];
        sum[1] += m[1];
        sum[2] += m[2];
      });
      return [
        sum[0] / members.length,
        sum[1] / members.length,
        sum[2] / members.length,
      ] as Vec3;
    });
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
    return 'Potential Loyalist';
  }
  if (r >= 4 && f === 1) {
    return 'Recent Customers';
  }
  if (r === 3 && f === 1) {
    return 'Promising';
  }
  if (r === 3 && f === 2) {
    return 'Need Attention';
  }
  if (r === 2 && f <= 2) {
    return 'About to Sleep';
  }
  if (r <= 2 && f >= 4) {
    return "Can't Lose Them";
  }
  if (r <= 2 && f >= 2) {
    return 'At Risk';
  }
  if (r <= 2 && f === 1 && m > 1) {
    return 'Hibernating';
  }
  return 'Lost';
}

function churnFromScores(r: number, f: number, m: number): ChurnRiskLevel {
  const composite = r * 0.45 + f * 0.35 + m * 0.2;
  if (composite >= 3.8) return 'low';
  if (composite >= 2.5) return 'medium';
  return 'high';
}

let cached: RfmAnalyticsResult | null = null;

/** Hitung RFM + K-Means dari data transaksi nyata */
export function buildRfmAnalytics(transactions: CustomerTransaction[]): RfmAnalyticsResult {
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
    };
  }

  const days = transactions.map((t) => t.lastOrderDaysAgo);
  const freqs = transactions.map((t) => t.orderCount);
  const spends = transactions.map((t) => t.totalSpend);

  const features: Vec3[] = transactions.map((t) => [
    recencyScore(t.lastOrderDaysAgo, days),
    frequencyScore(t.orderCount, freqs),
    monetaryScore(t.totalSpend, spends),
  ]);

  const assignments = kMeans(features, 3);

  const customers: RfmCustomerPoint[] = transactions.map((t, i) => {
    const r = features[i][0];
    const f = features[i][1];
    const m = features[i][2];
    const cluster = assignments[i];
    return {
      customerId: t.customerId,
      recencyScore: r,
      frequencyScore: f,
      monetaryScore: m,
      recencyRaw: t.lastOrderDaysAgo,
      frequencyRaw: t.orderCount,
      monetaryRaw: t.totalSpend,
      cluster,
      segment: calculateRfmSegment(r, f, m),
      churnRisk: churnFromScores(r, f, m),
      monetaryValue: t.totalSpend,
    };
  });

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
  customers.forEach((c) => {
    segmentRevenue[c.segment] += c.monetaryValue;
  });
  const totalRevenue = Object.values(segmentRevenue).reduce((a, b) => a + b, 0);
  const topSegment = (Object.entries(segmentRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    'Champions') as RfmSegmentLabel;
  const topSegmentRevenuePct =
    totalRevenue > 0
      ? Math.round((segmentRevenue[topSegment] / totalRevenue) * 100)
      : 0;

  const centroids = [0, 1, 2].map((c) => {
    const members = customers.filter((x) => x.cluster === c);
    const avg = (key: keyof RfmCustomerPoint) =>
      members.reduce((s, m) => s + (m[key] as number), 0) / (members.length || 1);
    
    // Hitung segmen mayoritas di cluster
    const segmentCounts: Record<string, number> = {};
    members.forEach((m) => {
      segmentCounts[m.segment] = (segmentCounts[m.segment] || 0) + 1;
    });
    const topCentroidSegment = (Object.entries(segmentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Loyal Customers') as RfmSegmentLabel;

    return {
      recency: avg('recencyScore'),
      frequency: avg('frequencyScore'),
      monetary: avg('monetaryScore'),
      segment: topCentroidSegment,
    };
  });

  return {
    customers,
    kpi: {
      totalCliente: transactions.length,
      avgChurnRiskPct: highPct,
      topSegment,
      topSegmentRevenuePct,
      clienteleGrowthPct: 0,
      churnTrendPct: 0,
    },
    churnPie,
    segmentShifts: [],
    clusterCentroids: centroids,
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
      customerId: '#892',
      message: "dropped from 'Loyal Customers' to 'Hibernating'",
      direction: 'down',
      timeAgo: '2h ago',
    },
    {
      id: '2',
      customerId: '#441',
      message: 'upgraded to Champions tier',
      direction: 'up',
      timeAgo: '5h ago',
    },
  ];
  return cached;
}
