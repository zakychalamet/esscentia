import type { UserRole } from '@/lib/auth-context';

export function canAccessAdmin(role?: UserRole): boolean {
  return role === 'admin' || role === 'marketing';
}

/** Super admin — full panel */
export function isSuperAdmin(role?: UserRole): boolean {
  return role === 'admin';
}

/** Marketing admin — catalog only */
export function isMarketingAdmin(role?: UserRole): boolean {
  return role === 'marketing';
}

export function canManageProducts(role?: UserRole): boolean {
  return role === 'admin' || role === 'marketing';
}

export function canDeleteProducts(role?: UserRole): boolean {
  return role === 'admin';
}

export function canManageJournal(role?: UserRole): boolean {
  return role === 'admin' || role === 'marketing';
}

export function canDeleteJournal(role?: UserRole): boolean {
  return role === 'admin';
}

export function canManageOrders(role?: UserRole): boolean {
  return role === 'admin';
}

export function canViewAnalytics(role?: UserRole): boolean {
  return role === 'admin';
}

export function adminRoleLabel(role?: UserRole): string {
  if (role === 'admin') return 'Super Admin';
  if (role === 'marketing') return 'Marketing Admin';
  return 'User';
}
