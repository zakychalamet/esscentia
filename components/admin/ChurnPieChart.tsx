'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { ChurnSlice } from '@/lib/customer-rfm';

interface ChurnPieChartProps {
  data: ChurnSlice[];
  highRiskPct: number;
}

export function ChurnPieChart({ data, highRiskPct }: ChurnPieChartProps) {
  return (
    <div className="relative h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={2}
            dataKey="value"
            stroke="#F9F7F2"
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.level} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value ?? 0}%`, 'Share']}
            contentStyle={{
              background: '#fff',
              border: '1px solid #E7E5E0',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-serif text-[#6B4E9E]">{highRiskPct}%</span>
        <span className="text-[10px] uppercase tracking-widest text-stone-500 mt-0.5">
          High Risk
        </span>
      </div>
    </div>
  );
}
