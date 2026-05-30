import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Database,
  LineChart,
  Megaphone,
  Users,
  Settings,
  Package,
  ShoppingCart,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Hanya super admin (bukan marketing) */
  superOnly?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, superOnly: true },
  { href: '/admin/integration', label: 'Data Integration', icon: Database, superOnly: true },
  { href: '/admin/analytics', label: 'Analytics Engine', icon: LineChart, superOnly: true },
  { href: '/admin/campaigns', label: 'Campaign Manager', icon: Megaphone, superOnly: true },
  { href: '/admin/customers', label: 'Customers', icon: Users, superOnly: true },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/orders', label: 'Pesanan', icon: ShoppingCart, superOnly: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

/** Rute yang boleh diakses marketing admin */
export const marketingAllowedPaths = ['/admin/products', '/admin/settings'];

export function filterNavForRole(
  items: AdminNavItem[],
  role: 'admin' | 'marketing' | 'user' | undefined
): AdminNavItem[] {
  if (role === 'admin') return items;
  if (role === 'marketing') {
    return items.filter((item) => !item.superOnly);
  }
  return [];
}

export function isMarketingPathAllowed(pathname: string): boolean {
  return marketingAllowedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}
