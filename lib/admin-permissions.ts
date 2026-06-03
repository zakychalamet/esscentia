import type { UserRole } from '@/lib/auth-context';

export function canAccessAdmin(role?: UserRole): boolean {
  return role === 'admin' || role === 'marketing' || role === 'crm' || role === 'executive';
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
  return role === 'admin'; // Only Super Admin can CRUD products
}

export function canDeleteProducts(role?: UserRole): boolean {
  return role === 'admin';
}

export function canManageJournal(role?: UserRole): boolean {
  return role === 'admin' || role === 'marketing'; // Super Admin and Marketing can edit journal
}

export function canDeleteJournal(role?: UserRole): boolean {
  return role === 'admin';
}

export function canManageOrders(role?: UserRole): boolean {
  return role === 'admin'; // Executive can view orders, only admin can manage/process
}

export function canViewAnalytics(role?: UserRole): boolean {
  return role === 'admin' || role === 'crm' || role === 'executive' || role === 'marketing';
}

export function canManageCampaigns(role?: UserRole): boolean {
  return role === 'admin' || role === 'marketing'; // CRM can only view campaigns
}

export function adminRoleLabel(role?: UserRole): string {
  if (role === 'admin') return 'Super Admin';
  if (role === 'marketing') return 'Marketing Desk';
  if (role === 'crm') return 'CRM Manager / Analyst';
  if (role === 'executive') return 'Executive / Decision Maker';
  return 'User';
}
