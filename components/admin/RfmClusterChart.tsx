'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { RfmCustomerPoint, RfmSegmentLabel } from '@/lib/customer-rfm';
import { SEGMENT_COLORS } from '@/lib/customer-rfm';

interface RfmClusterChartProps {
  customers: RfmCustomerPoint[];
}

const SEGMENTS: RfmSegmentLabel[] = [
  'Champions',
  'Loyal Customers',
  'Potential Loyalist',
  'Recent Customers',
  'Promising',
  'Need Attention',
  'About to Sleep',
  'At Risk',
  "Can't Lose Them",
  'Hibernating',
  'Lost',
];

export function RfmClusterChart({ customers }: RfmClusterChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E0" />
          <XAxis
            type="number"
            dataKey="recencyScore"
            name="Recency"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#78716C' }}
            label={{
              value: 'RECENCY SCORE',
              position: 'insideBottom',
              offset: -12,
              style: { fontSize: 10, letterSpacing: '0.15em', fill: '#78716C' },
            }}
          />
          <YAxis
            type="number"
            dataKey="frequencyScore"
            name="Frequency"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#78716C' }}
            label={{
              value: 'FREQUENCY SCORE',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 10, letterSpacing: '0.15em', fill: '#78716C' },
            }}
          />
          <ZAxis type="number" dataKey="monetaryValue" range={[40, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const p = payload[0].payload as RfmCustomerPoint;
              return (
                <div className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs shadow-sm">
                  <p className="font-semibold text-[#4A3728]">{p.customerId}</p>
                  <p className="text-stone-600">{p.segment}</p>
                  <p className="text-stone-500 mt-1">
                    R{p.recencyScore} · F{p.frequencyScore} · M{p.monetaryScore}
                  </p>
                  <p className="text-stone-500">
                    Rp {p.monetaryValue.toLocaleString('id-ID')}
                  </p>
                </div>
              );
            }}
          />
          {SEGMENTS.map((seg) => (
            <Scatter
              key={seg}
              name={seg}
              data={customers.filter((c) => c.segment === seg)}
              fill={SEGMENT_COLORS[seg]}
              fillOpacity={0.75}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
