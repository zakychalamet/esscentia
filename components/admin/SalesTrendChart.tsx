'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface SalesTrendChartProps {
  data: {
    date: string;
    formattedDate: string;
    revenue: number;
    count: number;
  }[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} jt`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)} rb`;
    }
    return String(value);
  };

  const formatTooltipPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8C7355" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8C7355" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E0" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 10, fill: '#78716C' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#78716C' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const p = payload[0].payload;
              return (
                <div className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs shadow-sm">
                  <p className="font-semibold text-stone-500 mb-1">{p.date}</p>
                  <p className="text-[#8D4F38] font-bold">
                    Pendapatan: {formatTooltipPrice(p.revenue)}
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Transaksi: {p.count} order
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8C7355"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
