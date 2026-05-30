'use client';

import { AdminPlaceholder } from '@/components/admin/AdminPlaceholder';
import { useAuth } from '@/lib/auth-context';
import { adminRoleLabel } from '@/lib/admin-permissions';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-2xl">
      <AdminPlaceholder
        title="Settings"
        description="Preferensi panel admin, notifikasi, dan integrasi akun."
      />
      {user && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Akun aktif</p>
          <p className="text-sm font-medium text-slate-800">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <p className="text-sm text-[#6B4E9E] mt-2">{adminRoleLabel(user.role)}</p>
        </div>
      )}
    </div>
  );
}
