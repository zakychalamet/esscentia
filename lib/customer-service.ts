import type { DbUser } from './user-db';
import { getCustomerUsers } from './user-db';
import { getOrdersByUserId, getUserOrderStats } from './order-db';
import pool from './db';
import {
  buildRfmAnalytics,
  type CustomerTransaction,
  type RfmAnalyticsResult,
  type RfmCustomerPoint,
  type RfmSegmentLabel,
  type ChurnRiskLevel,
  type SegmentShift,
  generateMockTransactions,
} from './customer-rfm';

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  image: string | null;
  segment: RfmSegmentLabel;
  segmentColor: string;
  orders: number;
  spend: number;
  spendFormatted: string;
  lastActive: string;
  loginCount: number;
  registeredAt: string;
  rfmScore: string;
  churnRisk: ChurnRiskLevel;
  recencyDays: number;
}

export interface CustomerDetail extends CustomerListItem {
  phone: string | null;
  lastLoginAt: string | null;
  recencyScore: number;
  frequencyScore: number;
  monetaryScore: number;
  avgOrderValue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    date: string;
    products: string;
    amount: number;
    status: string;
  }[];
}

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

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function daysBetween(from: Date, to = new Date()): number {
  const diff = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function formatLastActive(date: Date | null): string {
  if (!date) return 'Belum pernah login';
  const days = daysBetween(date);
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Kemarin';
  if (days < 7) return days + ' hari yang lalu';
  if (days < 30) return Math.floor(days / 7) + ' minggu yang lalu';
  if (days < 365) return Math.floor(days / 30) + ' bulan yang lalu';
  return Math.floor(days / 365) + ' tahun yang lalu';
}

function buildTransaction(
  user: DbUser,
  stats: Awaited<ReturnType<typeof getUserOrderStats>>
): CustomerTransaction {
  const orderStats = stats.get(user.id);
  const referenceDate = orderStats?.lastOrderAt ?? user.lastLoginAt ?? user.createdAt;
  const lastOrderDaysAgo = daysBetween(new Date(referenceDate));

  return {
    customerId: user.id,
    lastOrderDaysAgo,
    orderCount: orderStats?.orderCount ?? 0,
    totalSpend: orderStats?.totalSpend ?? 0,
  };
}

function mapRfmPoint(
  user: DbUser,
  point: RfmCustomerPoint,
  stats: Awaited<ReturnType<typeof getUserOrderStats>>
): CustomerListItem {
  const orderStats = stats.get(user.id);
  const lastRef = orderStats?.lastOrderAt ?? user.lastLoginAt ?? user.createdAt;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: getInitials(user.name),
    image: user.image,
    segment: point.segment,
    segmentColor: SEGMENT_BADGE[point.segment],
    orders: orderStats?.orderCount ?? 0,
    spend: orderStats?.totalSpend ?? 0,
    spendFormatted: (orderStats?.totalSpend ?? 0).toLocaleString('id-ID'),
    lastActive: formatLastActive(lastRef ? new Date(lastRef) : null),
    loginCount: user.loginCount,
    registeredAt: new Date(user.createdAt).toLocaleDateString('id-ID'),
    rfmScore: [point.recencyScore, point.frequencyScore, point.monetaryScore].join('-'),
    churnRisk: point.churnRisk,
    recencyDays: point.recencyRaw,
  };
}

export async function getCustomerDirectory(): Promise<CustomerListItem[]> {
  const [users, stats] = await Promise.all([getCustomerUsers(), getUserOrderStats()]);
  const transactions = users.map((user) => buildTransaction(user, stats));
  const analytics = buildRfmAnalytics(transactions);
  const pointMap = new Map(analytics.customers.map((p) => [p.customerId, p]));

  return users.map((user) => {
    const point = pointMap.get(user.id);
    if (!point) {
      return mapRfmPoint(
        user,
        {
          customerId: user.id,
          recencyScore: 1,
          frequencyScore: 1,
          monetaryScore: 1,
          recencyRaw: 999,
          frequencyRaw: 0,
          monetaryRaw: 0,
          cluster: 2,
          segment: 'At Risk',
          churnRisk: 'high',
          monetaryValue: 0,
        },
        stats
      );
    }
    return mapRfmPoint(user, point, stats);
  });
}

export async function getCustomerDetail(id: string): Promise<CustomerDetail | null> {
  const [users, stats] = await Promise.all([getCustomerUsers(), getUserOrderStats()]);
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  const transactions = users.map((u) => buildTransaction(u, stats));
  const analytics = buildRfmAnalytics(transactions);
  const point = analytics.customers.find((p) => p.customerId === id);
  const base = mapRfmPoint(
    user,
    point ?? {
      customerId: id,
      recencyScore: 1,
      frequencyScore: 1,
      monetaryScore: 1,
      recencyRaw: 999,
      frequencyRaw: 0,
      monetaryRaw: 0,
      cluster: 2,
      segment: 'At Risk',
      churnRisk: 'high',
      monetaryValue: 0,
    },
    stats
  );

  const orders = await getOrdersByUserId(id);
  const orderStats = stats.get(id);
  const avgOrderValue =
    orderStats && orderStats.orderCount > 0
      ? Math.round(orderStats.totalSpend / orderStats.orderCount)
      : 0;

  return {
    ...base,
    phone: user.phone,
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    recencyScore: point?.recencyScore ?? 1,
    frequencyScore: point?.frequencyScore ?? 1,
    monetaryScore: point?.monetaryScore ?? 1,
    avgOrderValue,
    recentOrders: orders.slice(0, 10).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: new Date(order.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      products: order.items.map((i) => i.productName + ' x' + i.quantity).join(', '),
      amount: order.totalAmount,
      status: order.status,
    })),
  };
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 0) return 'just now';
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval}y ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval}mo ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}m ago`;
  return 'just now';
}

export async function getAdminRfmAnalytics(
  recencyWeight = 40,
  frequencyWeight = 30,
  monetaryWeight = 30,
  k = 4,
  maxIterations = 300
): Promise<RfmAnalyticsResult> {
  const [users, stats, [orderRows]] = await Promise.all([
    getCustomerUsers(),
    getUserOrderStats(),
    pool.query<any[]>(
      `SELECT user_id, total_amount, created_at
       FROM orders
       WHERE user_id IS NOT NULL AND status = 'completed'
       ORDER BY created_at ASC`
    )
  ]);

  const userOrdersMap = new Map<string, { totalAmount: number; createdAt: Date }[]>();
  for (const row of orderRows) {
    const uId = String(row.user_id);
    const list = userOrdersMap.get(uId) ?? [];
    list.push({
      totalAmount: Number(row.total_amount),
      createdAt: new Date(row.created_at),
    });
    userOrdersMap.set(uId, list);
  }

  const transactions = users.map((user) => buildTransaction(user, stats));

  const pastTransactions = users.map((user) => {
    const orders = userOrdersMap.get(user.id) ?? [];
    if (orders.length <= 1) {
      const referenceDate = user.lastLoginAt ?? user.createdAt;
      const lastOrderDaysAgo = daysBetween(new Date(referenceDate));
      return {
        customerId: user.id,
        lastOrderDaysAgo,
        orderCount: 0,
        totalSpend: 0,
      };
    } else {
      const pastOrders = orders.slice(0, -1);
      const lastOrder = pastOrders[pastOrders.length - 1];
      const referenceDate = lastOrder?.createdAt ?? user.lastLoginAt ?? user.createdAt;
      const lastOrderDaysAgo = daysBetween(new Date(referenceDate));
      const totalSpend = pastOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        customerId: user.id,
        lastOrderDaysAgo,
        orderCount: pastOrders.length,
        totalSpend,
      };
    }
  });

  const currentAnalytics = buildRfmAnalytics(
    transactions,
    recencyWeight,
    frequencyWeight,
    monetaryWeight,
    k,
    maxIterations
  );

  const pastAnalytics = buildRfmAnalytics(
    pastTransactions,
    recencyWeight,
    frequencyWeight,
    monetaryWeight,
    k,
    maxIterations
  );

  const pastSegmentMap = new Map(pastAnalytics.customers.map((c) => [c.customerId, c.segment]));
  const currentSegmentMap = new Map(currentAnalytics.customers.map((c) => [c.customerId, c.segment]));

  const segmentShifts: SegmentShift[] = [];
  const SEGMENT_RANK: Record<string, number> = {
    'Champions': 11,
    'Loyal Customers': 10,
    'Potential Loyalists': 9,
    'New Customers': 8,
    'Promising': 7,
    'Need Attention': 6,
    'About To Sleep': 5,
    'At Risk': 4,
    'Cannot Lose Them': 3,
    'Hibernating': 2,
    'Lost Customers': 1,
  };

  let shiftIdCounter = 1;
  for (const user of users) {
    const currentSeg = currentSegmentMap.get(user.id);
    const pastSeg = pastSegmentMap.get(user.id);

    if (currentSeg && pastSeg && currentSeg !== pastSeg) {
      const orders = userOrdersMap.get(user.id) ?? [];
      const latestOrder = orders[orders.length - 1];
      const timeAgo = latestOrder ? formatTimeAgo(latestOrder.createdAt) : 'just now';

      const currentRank = SEGMENT_RANK[currentSeg] ?? 6;
      const pastRank = SEGMENT_RANK[pastSeg] ?? 6;
      const direction = currentRank > pastRank ? 'up' : 'down';

      const message = direction === 'up'
        ? `upgraded from '${pastSeg}' to '${currentSeg}'`
        : `dropped from '${pastSeg}' to '${currentSeg}'`;

      segmentShifts.push({
        id: String(shiftIdCounter++),
        customerId: user.id,
        message,
        direction,
        timeAgo,
      });
    }
  }

  const userMap = new Map(users.map((u) => [u.id, u.name]));
  const customerTable = currentAnalytics.customerTable?.map((row) => ({
    ...row,
    customerName: userMap.get(row.customerId) ?? row.customerName,
  }));

  // Sort shifts to show most recent first
  segmentShifts.sort((a, b) => {
    const parseTime = (str: string) => {
      const m = str.match(/^(\d+)([a-z]+)/);
      if (!m) return 0;
      const val = parseInt(m[1], 10);
      const unit = m[2];
      if (unit.startsWith('m')) return val; // minutes
      if (unit.startsWith('h')) return val * 60; // hours
      if (unit.startsWith('d')) return val * 1440; // days
      if (unit.startsWith('mo')) return val * 43200; // months
      return val * 525600; // years
    };
    return parseTime(a.timeAgo) - parseTime(b.timeAgo);
  });

  return {
    ...currentAnalytics,
    customerTable,
    segmentShifts,
    kpi: {
      ...currentAnalytics.kpi,
      totalCliente: users.length,
      clienteleGrowthPct: users.length > 0 ? Math.min(users.length, 15) : 0,
    },
  };
}

export async function getUserSegment(userId: string): Promise<RfmSegmentLabel> {
  const customers = await getCustomerDirectory();
  const customer = customers.find((c) => c.id === userId);
  return customer ? customer.segment : 'New Customers';
}

export { SEGMENT_BADGE };
