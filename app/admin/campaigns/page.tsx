'use client';

import { 
  Star, 
  Heart, 
  Moon, 
  AlertTriangle, 
  Megaphone,
  Lock,
  Mail,
  MessageCircle,
  Bell,
  Sparkles,
  Send,
  Calendar,
  ChevronDown
} from 'lucide-react';

export default function CampaignManagerPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 text-slate-800 pb-10">
      
      {/* Activate Segments Section */}
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Activate Segments</h1>
          <p className="text-slate-500 text-sm max-w-3xl">
            Select a predictive K-Means segment to initiate targeted outreach. Our algorithms have 
            categorized your clientele based on recent purchasing behavior and lifetime value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Champions Card */}
          <div className="bg-white rounded-xl border-t-4 border-t-[#8b5cf6] border-x border-b border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Champions
                <span className="bg-indigo-100 text-indigo-500 p-1 rounded">
                  <Star size={14} fill="currentColor" />
                </span>
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold">1,240</span>
              <span className="text-[10px] font-bold text-indigo-500 tracking-wider">15% OF DB</span>
            </div>
            <p className="text-xs text-slate-500 flex-1 mb-5">
              Bought recently, buys frequently, and spends heavily. Your most valuable assets.
            </p>
            <button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
              <Megaphone size={16} /> Create Campaign
            </button>
          </div>

          {/* Loyal Card */}
          <div className="bg-white rounded-xl border-t-4 border-t-[#c4b5fd] border-x border-b border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Loyal
                <span className="bg-indigo-50 text-indigo-400 p-1 rounded">
                  <Heart size={14} fill="currentColor" />
                </span>
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold">3,850</span>
              <span className="text-[10px] font-bold text-indigo-400 tracking-wider">32% OF DB</span>
            </div>
            <p className="text-xs text-slate-500 flex-1 mb-5">
              Consistently purchase on a regular basis. Highly responsive to new collection drops.
            </p>
            <button className="w-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
              <Megaphone size={16} /> Create Campaign
            </button>
          </div>

          {/* Hibernating Card */}
          <div className="bg-white rounded-xl border-t-4 border-t-slate-300 border-x border-b border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Hibernating
                <span className="bg-slate-100 text-slate-500 p-1 rounded">
                  <Moon size={14} fill="currentColor" />
                </span>
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold">2,100</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">25% OF DB</span>
            </div>
            <p className="text-xs text-slate-500 flex-1 mb-5">
              Past buyers whose frequency has dropped significantly. Require re-engagement.
            </p>
            <button className="w-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
              <Megaphone size={16} /> Create Campaign
            </button>
          </div>

          {/* About to Sleep Card */}
          <div className="bg-white rounded-xl border-t-4 border-t-red-400 border-x border-b border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                About to<br/>Sleep
                <span className="bg-red-50 text-red-500 p-1 rounded">
                  <AlertTriangle size={14} fill="currentColor" />
                </span>
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold">1,890</span>
              <span className="text-[10px] font-bold text-red-400 tracking-wider">28% OF DB</span>
            </div>
            <p className="text-xs text-slate-500 flex-1 mb-5">
              Below average recency and frequency. Will be lost without intervention.
            </p>
            <button className="w-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2">
              <Megaphone size={16} /> Create Campaign
            </button>
          </div>
        </div>
      </section>

      {/* Campaign Designer Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Campaign Designer</h2>
          <p className="text-slate-500 text-sm">
            Configure your outreach strategy and preview the message format.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h3 className="font-bold text-lg mb-6">Configuration</h3>

          <div className="space-y-6">
            
            {/* Target Audience */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                Target Audience
              </label>
              <div className="relative">
                <select className="w-full appearance-none border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-700 pointer-events-none" disabled>
                  <option>Champions (1,240 Profiles)</option>
                </select>
                <ChevronDown className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 italic">Audience locked to selected segment.</p>
            </div>

            {/* Campaign Internal Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                Campaign Internal Name
              </label>
              <input 
                type="text" 
                placeholder="e.g., Q3 VIP Exclusive Drop" 
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Delivery Channel */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                Delivery Channel
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 py-4 border-2 border-indigo-200 bg-indigo-50 rounded-lg text-indigo-700">
                  <Mail size={20} />
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 py-4 border border-slate-200 bg-slate-50 rounded-lg text-slate-400 relative">
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">WhatsApp</span>
                  <span className="absolute top-2 right-2 border border-slate-200 text-[9px] uppercase font-bold px-1 rounded text-slate-400 bg-white">PRO</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 py-4 border border-slate-200 bg-slate-50 rounded-lg text-slate-400 relative">
                  <Bell size={20} />
                  <span className="text-sm font-medium">Push</span>
                  <span className="absolute top-2 right-2 border border-slate-200 text-[9px] uppercase font-bold px-1 rounded text-slate-400 bg-white">PRO</span>
                </button>
              </div>
            </div>

            {/* Promotion Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                Promotion Type
              </label>
              <div className="relative">
                <select className="w-full appearance-none border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option>Private Collection Access</option>
                  <option>Discount Code</option>
                  <option>Event Invitation</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            {/* Message Copy [AI Assisted] */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                Message Copy [AI Assisted]
              </label>
              <div className="border border-slate-200 rounded-lg p-4 bg-white relative">
                <p className="text-sm text-slate-700 leading-relaxed mb-8 pr-4">
                  As a valued member of our inner circle, we invite you to experience the new 'Midnight Amber' collection before it is available to the public. Secure your allocation today.
                </p>
                <button className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded border border-indigo-100 transition-colors">
                  <Sparkles size={14} /> Refine
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-3.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-64 justify-center shadow-sm">
            <Send size={18} /> Launch Segment Campaign Now
          </button>
          <button className="bg-white border border-[#e2e8f0] hover:bg-slate-50 text-[#8b5cf6] px-8 py-3.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-64 justify-center shadow-sm">
            <Calendar size={18} /> Schedule for Later
          </button>
        </div>

      </section>

    </div>
  );
}
