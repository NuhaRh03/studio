'use client';

import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RiskGaugeProps {
  value: number;
  label: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ value, label }) => {
  const endAngle = 360 * (value / 100);
  const color = value > 66 ? 'hsl(var(--destructive))' : value > 33 ? 'hsl(var(--chart-5))' : 'hsl(var(--chart-2))';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height={150}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="90%"
          data={[{ value: value }]}
          startAngle={90}
          endAngle={90 + 360}
          barSize={15}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center mt-[-30px]">
        <p className="text-3xl font-bold">{Math.round(value)}%</p>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
};

export default RiskGauge;
