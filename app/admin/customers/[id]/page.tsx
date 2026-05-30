'use client';

import { 
  ChevronRight, 
  Search, 
  Bell, 
  HelpCircle, 
  Calendar, 
  Sparkles, 
  BarChart2, 
  ArrowRight,
  TrendingUp,
  Activity,
  Droplets,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  // In a real app we'd fetch based on params.id
  
  return (
    <div className="max-w-6xl mx-auto text-slate-800 pb-10">
      
      {/* Top Breadcrumb & Navbar emulation */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center text-sm text-slate-500">
          <Link href="/admin/customers" className="hover:text-slate-800">Customers</Link>
          <ChevronRight size={14} className="mx-2" />
          <span>Profile</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="font-semibold text-slate-800">Detail</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
            />
          </div>
          <button className="text-slate-500 hover:text-slate-700">
            <Bell size={18} />
          </button>
          <button className="text-slate-500 hover:text-slate-700">
            <HelpCircle size={18} />
          </button>
          <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden">
             {/* Dummy admin avatar */}
             <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700 border border-slate-200">
                EA
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">Eleanor Astor</h1>
                  <span className="px-2.5 py-0.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 tracking-wider bg-slate-50">
                    CHAMPION
                  </span>
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded flex items-center justify-center bg-slate-100 text-slate-400">@</span>
                  e.astor@example.com
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                Send Manual Email
              </button>
            </div>
          </div>

          {/* RFM & Segment Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">RFM & Segment Summary</h2>
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm font-medium">
                <BarChart2 size={16} />
                <span>RFM Score: 555</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-slate-500 text-xs font-bold tracking-wider mb-1 uppercase">Recency</div>
                <div className="text-3xl font-bold mb-1">12 <span className="text-sm font-medium text-slate-500">days</span></div>
              </div>
              <div className="border-l border-slate-100 pl-8">
                <div className="text-slate-500 text-xs font-bold tracking-wider mb-1 uppercase">Frequency</div>
                <div className="text-3xl font-bold mb-1">45 <span className="text-sm font-medium text-slate-500">orders</span></div>
              </div>
              <div className="border-l border-slate-100 pl-8">
                <div className="text-slate-500 text-xs font-bold tracking-wider mb-1 uppercase">Monetary Value</div>
                <div className="text-3xl font-bold mb-1">125,000,000 <span className="text-sm font-medium text-slate-500">IDR</span></div>
              </div>
            </div>
          </div>

          {/* 2x2 Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Avg Order Value */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-wider mb-3 uppercase">
                <CreditCard size={14} /> Avg. Order Value
              </div>
              <div className="text-2xl font-bold">2,777,777 <span className="text-sm font-medium text-slate-500">IDR</span></div>
            </div>
            
            {/* Preferred Scent */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-wider mb-3 uppercase">
                <Droplets size={14} /> Preferred Scent
              </div>
              <div className="text-xl font-bold">Woody / Floral</div>
            </div>

            {/* Last Activity */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-wider mb-3 uppercase">
                <Activity size={14} /> Last Activity
              </div>
              <div className="text-slate-800 font-medium">Purchased Oud Wood 50ml</div>
            </div>

            {/* Predicted LTV */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-wider mb-3 uppercase">
                <TrendingUp size={14} /> Predicted LTV
              </div>
              <div className="text-2xl font-bold text-emerald-600">250,000,000+ <span className="text-sm font-medium opacity-70">IDR</span></div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Product(s)</th>
                    <th className="px-6 py-4 text-right">Amount (IDR)</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 font-medium">Oct 12,<br/><span className="text-xs font-normal">2023</span></td>
                    <td className="px-6 py-4 text-slate-500">#ORD-9921</td>
                    <td className="px-6 py-4 font-medium">Oud Wood 50ml</td>
                    <td className="px-6 py-4 text-right font-medium">4,200,000</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 font-medium">Sep 05,<br/><span className="text-xs font-normal">2023</span></td>
                    <td className="px-6 py-4 text-slate-500">#ORD-8842</td>
                    <td className="px-6 py-4 font-medium">Santal Blush 100ml,<br/>Rose Prick 50ml</td>
                    <td className="px-6 py-4 text-right font-medium">9,850,000</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 font-medium">Jul 22,<br/><span className="text-xs font-normal">2023</span></td>
                    <td className="px-6 py-4 text-slate-500">#ORD-7610</td>
                    <td className="px-6 py-4 font-medium">Neroli Portofino<br/>50ml</td>
                    <td className="px-6 py-4 text-right font-medium">3,900,000</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider uppercase">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 space-y-6">
          
          {/* Next Best Action Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-amber-100 opacity-50 pointer-events-none">
              <Sparkles size={64} strokeWidth={1} />
            </div>
            
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              Next Best Action <Sparkles size={16} className="text-indigo-500" />
            </h3>
            
            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              High propensity to convert on exclusive limited editions.
            </p>
            
            <div className="space-y-3 relative z-10">
              <button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-between items-center px-4">
                Offer Early Access <ArrowRight size={16} />
              </button>
              <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-between items-center px-4">
                Invite to Private Event <Calendar size={16} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Scent Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Scent Profile</h3>
            
            <div className="mb-2">
              <div className="text-slate-500 text-xs font-bold tracking-wider mb-3 uppercase">Favorite Notes</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-700 text-xs font-medium">Bergamot</span>
                <span className="px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-700 text-xs font-medium">Amber</span>
                <span className="px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-700 text-xs font-medium">Vetiver</span>
                <span className="px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-700 text-xs font-medium">Oud</span>
              </div>
            </div>
          </div>

        </div>
        
      </div>

    </div>
  );
}