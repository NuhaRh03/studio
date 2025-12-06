'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DevicePythonDataPoint } from '@/types';
import { ChartTooltipContent } from './ui/chart';

interface EegChartProps {
  data: DevicePythonDataPoint[];
}

const eegBands = [
  { key: 'delta', color: '#1f77b4' },
  { key: 'theta', color: '#ff7f0e' },
  { key: 'lowAlpha', color: '#2ca02c', name: 'Low Alpha' },
  { key: 'highAlpha', color: '#d62728', name: 'High Alpha' },
  { key: 'highBeta', color: '#9467bd', name: 'High Beta' },
  { key: 'highGamma', color: '#8c564b', name: 'High Gamma' },
];

export default function EegChart({ data }: EegChartProps) {
  const chartData = data.map(d => ({
    ...d,
    name: new Date(d.timestamp * 1000).toLocaleTimeString(),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
        />
        <Legend />
        {eegBands.map(band => (
          <Line
            key={band.key}
            type="monotone"
            dataKey={band.key}
            name={band.name ?? band.key.charAt(0).toUpperCase() + band.key.slice(1)}
            stroke={band.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
