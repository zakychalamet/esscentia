'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  RefreshCw,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { canAccessAdmin, adminRoleLabel } from '@/lib/admin-permissions';
import {
  adminNavItems,
  filterNavForRole,
  isMarketingPathAllowed,
} from '@/lib/admin-nav';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !canAccessAdmin(user?.role)) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user?.role === 'marketing' && !isMarketingPathAllowed(pathname)) {
      router.replace('/admin/products');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F1F3F7] text-slate-700">
        <p className="font-medium">Loading...</p>
      </div>
    );
  }

  if (!user || !canAccessAdmin(user.role)) {
    return null;
  }

  const navItems = filterNavForRole(adminNavItems, user.role);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="flex h-screen">
      {/* Sidebar — tema Home (cream / terracotta) */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#F9F7F2] border-r border-[#E7E5E0] flex flex-col shrink-0 transition-all duration-300 text-[#4A3728]`}
      >
        <div className="p-6 border-b border-[#E7E5E0]">
          <Link href="/" className="block">
            <h1
              className={`font-serif text-[#4A3728] ${
                sidebarOpen ? 'text-2xl' : 'text-xl text-center'
              }`}
            >
              {sidebarOpen ? 'Esscentia' : 'E'}
            </h1>
            {sidebarOpen && (
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#8C7355] mt-1">
                Luxury Intelligence
              </p>
            )}
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition relative ${
                    active
                      ? 'bg-[#EFEFE9] text-[#4A3728] font-medium'
                      : 'text-stone-600 hover:bg-[#EFEFE9]/80 hover:text-[#4A3728]'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#8D4F38] rounded-r" />
                  )}
                  <Icon size={18} strokeWidth={1.5} className="shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E7E5E0] space-y-1 shrink-0">
          {sidebarOpen && (
            <>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-500 hover:text-[#4A3728]"
              >
                <HelpCircle size={16} />
                Help Center
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-500 hover:text-[#4A3728] mb-2"
              >
                <FileText size={16} />
                Documentation
              </button>
            </>
          )}
          <div className={`px-4 py-2 ${!sidebarOpen && 'px-2'}`}>
            {sidebarOpen && (
              <>
                <p className="text-xs text-stone-500 truncate">{user.email}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#8C7355] mt-0.5">
                  {adminRoleLabel(user.role)}
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#8D4F38] hover:bg-red-50/50 transition"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Area konten — tema dashboard mockup (abu terang + ungu) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F1F3F7] text-slate-800">
        <header className="bg-white border-b border-slate-200/80 px-4 md:px-6 py-4 flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                placeholder="Search insights, segments, or clients..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#6B4E9E]/50 focus:ring-1 focus:ring-[#6B4E9E]/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto shrink-0">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-700 hidden sm:block"
              aria-label="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-700 relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#6B4E9E]/15 flex items-center justify-center text-sm font-medium text-[#6B4E9E]">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-tight text-slate-800">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {user.role === 'marketing' ? 'Marketing Desk' : 'Concierge Desk'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
