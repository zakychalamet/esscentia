'use client';

import { Search, Filter, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const customers = [
    { id: '1', initials: 'EH', name: 'Eleanor Hughes', email: 'eleanor.h@example.com', segment: 'Champion', segmentColor: 'bg-emerald-100 text-emerald-700', orders: 42, spend: '124,500,000', lastActive: '2 hours ago', avatarColor: 'bg-purple-100 text-purple-700' },
    { id: '2', initials: 'MW', name: 'Marcus Webb', email: 'm.webb@example.com', segment: 'At Risk', segmentColor: 'bg-red-100 text-red-700', orders: 18, spend: '45,200,000', lastActive: '4 months ago', avatarColor: 'bg-slate-100 text-slate-700' },
    { id: '3', initials: 'SC', name: 'Sophia Chen', email: 'schen.design@example.com', segment: 'Loyal', segmentColor: 'bg-indigo-100 text-indigo-700', orders: 27, spend: '89,900,000', lastActive: 'Yesterday', avatarImage: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-800 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Customer Directory</h1>
        <p className="text-slate-500 text-sm">
          Manage and segment your high-value clientele.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-[#fafafa]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[140px]">
              <option>All Segments</option>
              <option>Champion</option>
              <option>Loyal</option>
              <option>At Risk</option>
            </select>
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm bg-white hover:bg-slate-50 transition-colors">
              <Filter size={16} /> More Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Segment</th>
                <th className="px-6 py-4 text-right">Total Orders</th>
                <th className="px-6 py-4 text-right">Total Spend (IDR)</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {cust.avatarImage ? (
                      <img src={cust.avatarImage} alt={cust.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${cust.avatarColor}`}>
                        {cust.initials}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-slate-800">{cust.name}</div>
                      <div className="text-slate-500 text-xs">{cust.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${cust.segmentColor}`}>
                      {cust.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">{cust.orders}</td>
                  <td className="px-6 py-4 text-right text-slate-700 font-medium">{cust.spend}</td>
                  <td className="px-6 py-4 text-slate-500">{cust.lastActive}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/customers/${cust.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                      View Details <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>Showing <strong className="font-medium text-slate-700">1</strong> to <strong className="font-medium text-slate-700">3</strong> of <strong className="font-medium text-slate-700">1,204</strong> results</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-indigo-100 text-indigo-700 font-medium text-sm">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 font-medium text-sm">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 font-medium text-sm">3</button>
            <span className="px-1 text-slate-400">...</span>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
