'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { DevicePythonDataPoint } from '@/types';
import { ChartTooltipContent, ChartContainer, type ChartConfig } from './ui/chart';

interface EegChartProps {
  data: DevicePythonDataPoint[];
}

const eegBands = [
  { key: 'delta', color: '#1f77b4', label: 'Delta' },
  { key: 'theta', color: '#ff7f0e', label: 'Theta' },
  { key: 'lowAlpha', color: '#2ca02c', label: 'Low Alpha' },
  { key: 'highAlpha', color: '#d62728', label: 'High Alpha' },
  { key: 'highBeta', color: '#9467bd', label: 'High Beta' },
  { key: 'highGamma', color: '#8c564b', label: 'High Gamma' },
];

const chartConfig = eegBands.reduce((acc, band) => {
  acc[band.key] = {
    label: band.label,
    color: band.color,
  };
  return acc;
}, {} as ChartConfig);


export default function EegChart({ data }: EegChartProps) {
  const chartData = data.map(d => ({
    ...d,
    name: new Date(d.timestamp * 1000).toLocaleTimeString(),
  }));

  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px]">
      <LineChart data={chartData} accessibilityLayer>
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
            name={band.label}
            stroke={band.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
