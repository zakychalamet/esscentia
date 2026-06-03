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
  BookOpen,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const adminNavItems: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/integration', label: 'Data Integration', icon: Database },
  { href: '/admin/analytics', label: 'Analytics Engine', icon: LineChart },
  { href: '/admin/campaigns', label: 'Campaign Manager', icon: Megaphone },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/journal', label: 'Jurnal', icon: BookOpen },
  { href: '/admin/orders', label: 'Pesanan', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const roleAllowedPaths: Record<string, string[]> = {
  admin: [
    '/admin',
    '/admin/integration',
    '/admin/analytics',
    '/admin/campaigns',
    '/admin/customers',
    '/admin/products',
    '/admin/journal',
    '/admin/orders',
    '/admin/settings',
  ],
  marketing: [
    '/admin',
    '/admin/campaigns',
    '/admin/journal',
    '/admin/customers',
    '/admin/products',
  ],
  crm: [
    '/admin',
    '/admin/analytics',
    '/admin/customers',
    '/admin/campaigns',
  ],
  executive: [
    '/admin',
    '/admin/analytics',
    '/admin/orders',
    '/admin/products',
    '/admin/customers',
    '/admin/journal',
  ],
};

export function filterNavForRole(
  items: AdminNavItem[],
  role: string | undefined
): AdminNavItem[] {
  if (!role) return [];
  if (role === 'admin') return items;
  const allowed = roleAllowedPaths[role];
  if (!allowed) return [];
  return items.filter((item) => allowed.includes(item.href));
}

export function isPathAllowedForRole(pathname: string, role: string | undefined): boolean {
  if (!role) return false;
  if (role === 'admin') return true;
  const allowed = roleAllowedPaths[role];
  if (!allowed) return false;
  return allowed.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}
