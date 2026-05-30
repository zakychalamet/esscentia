'use client';

import { useState } from 'react';
import { Settings2, Activity, Network, Download, Play, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AnalyticsPage() {
  const [recencyWeight, setRecencyWeight] = useState(40);
  const [frequencyWeight, setFrequencyWeight] = useState(30);
  const [monetaryWeight, setMonetaryWeight] = useState(30);
  const [maxIterations, setMaxIterations] = useState(300);

  const badgeColors = {
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };

  const tableData = [
    { id: '#C-8829', name: 'Eleanor Vance', recency: 12, frequency: 24, monetary: '$12,450', rfm: '5-5-5', cluster: 'CLUSTER 4 - CHAMPIONS', color: 'purple' },
    { id: '#C-9102', name: 'Julian Blackwood', recency: 45, frequency: 12, monetary: '$4,200', rfm: '4-3-4', cluster: 'CLUSTER 3 - LOYALISTS', color: 'blue' },
    { id: '#C-7731', name: 'Sophia Sterling', recency: 180, frequency: 18, monetary: '$18,900', rfm: '1-4-5', cluster: 'CLUSTER 2 - AT RISK', color: 'orange' },
    { id: '#C-4490', name: 'Arthur Pendelton', recency: 310, frequency: 2, monetary: '$450', rfm: '1-1-1', cluster: 'CLUSTER 1 - HIBERNATING', color: 'red' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-800 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">RFM & K-Means Calculation Engine</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Configure algorithm weights to segment your high-value clientele based on purchasing behavior.
        </p>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: RFM Weights */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">RFM Weights</h3>
            <Settings2 size={18} className="text-indigo-500" />
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Recency</span>
                <span className="text-indigo-600 font-medium">{recencyWeight}%</span>
              </div>
              <input 
                type="range" 
                value={recencyWeight} 
                onChange={(e) => setRecencyWeight(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Frequency</span>
                <span className="text-indigo-600 font-medium">{frequencyWeight}%</span>
              </div>
              <input 
                type="range" 
                value={frequencyWeight} 
                onChange={(e) => setFrequencyWeight(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Monetary</span>
                <span className="text-indigo-600 font-medium">{monetaryWeight}%</span>
              </div>
              <input 
                type="range" 
                value={monetaryWeight} 
                onChange={(e) => setMonetaryWeight(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
              />
            </div>
          </div>
        </div>

        {/* Card 2: Process Analytics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Activity size={24} className="text-indigo-500" />
          </div>
          <h3 className="font-semibold mb-2">Process Analytics</h3>
          <p className="text-xs text-slate-500 mb-6">Execute clustering over 12,450 records.</p>
          <button className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors w-full justify-center">
            <Play size={16} fill="currentColor" /> Run Analytics Engine
          </button>
        </div>

        {/* Card 3: K-Means Parameters */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">K-Means Parameters</h3>
            <Network size={18} className="text-indigo-500" />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-slate-600 mb-2">Number of Clusters (k)</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white">
              <option>4 Clusters (Optimal)</option>
              <option>3 Clusters</option>
              <option>5 Clusters</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Max Iterations</span>
              <span className="text-indigo-600 font-medium">{maxIterations}</span>
            </div>
            <input 
              type="range" 
              min="100" max="1000" step="100"
              value={maxIterations} 
              onChange={(e) => setMaxIterations(Number(e.target.value))} 
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
            />
          </div>
        </div>

      </div>

      {/* Cluster Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold">Cluster Summary (k=4)</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CHAMPIONS */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-indigo-100 text-indigo-700 uppercase">CHAMPIONS</span>
                <span className="text-xl font-bold">2,450</span>
              </div>
              <p className="text-xs text-slate-500">High Spend, Frequent, Recent</p>
            </div>
            
            {/* LOYALISTS */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-blue-100 text-blue-700 uppercase">LOYALISTS</span>
                <span className="text-xl font-bold">4,120</span>
              </div>
              <p className="text-xs text-slate-500">Consistent, Average Spend</p>
            </div>

            {/* AT RISK */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-amber-100 text-amber-700 uppercase">AT RISK</span>
                <span className="text-xl font-bold">3,800</span>
              </div>
              <p className="text-xs text-slate-500">High Value, Low Recency</p>
            </div>

            {/* HIBERNATING */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-red-100 text-red-700 uppercase">HIBERNATING</span>
                <span className="text-xl font-bold">2,080</span>
              </div>
              <p className="text-xs text-slate-500">Low Spend, Infrequent, Old</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-semibold">Customer Segmentation Data</h3>
          <button className="flex items-center gap-2 text-sm border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Customer ID</th>
                <th className="px-6 py-4 border-b border-slate-200">Name</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Recency (Days)</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Frequency</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Monetary</th>
                <th className="px-6 py-4 border-b border-slate-200 text-center">R-F-M</th>
                <th className="px-6 py-4 border-b border-slate-200">Cluster Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500">{row.id}</td>
                  <td className="px-6 py-4 font-medium">{row.name}</td>
                  <td className="px-6 py-4 text-right">{row.recency}</td>
                  <td className="px-6 py-4 text-right">{row.frequency}</td>
                  <td className="px-6 py-4 text-right">{row.monetary}</td>
                  <td className="px-6 py-4 text-center font-medium text-indigo-600">{row.rfm}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase ${badgeColors[row.color as keyof typeof badgeColors]}`}>
                      {row.cluster}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>Showing 1-4 of 12,450</span>
          <div className="flex gap-1">
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-400">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
