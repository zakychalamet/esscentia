import type { DbUser } from './user-db';
import { getCustomerUsers } from './user-db';
import { getOrdersByUserId, getUserOrderStats } from './order-db';
import {
  buildRfmAnalytics,
  type CustomerTransaction,
  type RfmAnalyticsResult,
  type RfmCustomerPoint,
  type RfmSegmentLabel,
  type ChurnRiskLevel,
} from './customer-rfm';

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  initials: string;
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
  Champions: 'bg-emerald-100 text-emerald-700',
  'Loyal/Steady': 'bg-indigo-100 text-indigo-700',
  'At Risk': 'bg-red-100 text-red-700',
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

export async function getAdminRfmAnalytics(): Promise<RfmAnalyticsResult> {
  const [users, stats] = await Promise.all([getCustomerUsers(), getUserOrderStats()]);
  const transactions = users.map((user) => buildTransaction(user, stats));
  const analytics = buildRfmAnalytics(transactions);

  return {
    ...analytics,
    kpi: {
      ...analytics.kpi,
      totalCliente: users.length,
      clienteleGrowthPct: users.length > 0 ? Math.min(users.length, 15) : 0,
    },
  };
}

export { SEGMENT_BADGE };
