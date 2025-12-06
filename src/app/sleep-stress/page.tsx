'use client';

import React, { useMemo } from 'react';
import { useDeviceData } from '@/hooks/use-device-data';
import HistoricalChart from '@/components/historical-chart';
import { computeStressLevel } from '@/lib/metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeSleepPatterns } from '@/ai/flows/analyze-sleep-patterns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function SleepStressPage() {
  const dataPoints = useDeviceData(300); // Fetch more data for historical view
  const [sleepData, setSleepData] = React.useState<Array<{ sleepLevel: number; sleepCase: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  React.useEffect(() => {
    const analyzeAll = async () => {
      if (dataPoints.length > 0 && !isAnalyzing) {
        setIsAnalyzing(true);
        const analyses = await Promise.all(
          dataPoints.map(dp =>
            analyzeSleepPatterns({
              delta: dp.delta,
              theta: dp.theta,
              lowAlpha: dp.lowAlpha,
              highAlpha: dp.highAlpha,
              highBeta: dp.highBeta,
              highGamma: dp.highGamma,
            }).catch(e => ({ sleepLevel: 0, sleepCase: 'Error' }))
          )
        );
        setSleepData(analyses);
        setIsAnalyzing(false);
      }
    };
    analyzeAll();
  }, [dataPoints, isAnalyzing]);

  const { stressChartData, sleepChartData, sleepCaseDistribution, avgStress } = useMemo(() => {
    const stressData = dataPoints.map(dp => ({
      time: new Date(dp.timestamp * 1000).toLocaleTimeString(),
      value: computeStressLevel(dp.heartRate, dp.highBeta, dp.highGamma).level,
    }));

    const sleepDataMapped = dataPoints.map((dp, i) => ({
      time: new Date(dp.timestamp * 1000).toLocaleTimeString(),
      value: sleepData[i]?.sleepLevel ?? 0,
    }));

    const distribution = (sleepData || []).reduce((acc, curr) => {
      acc[curr.sleepCase] = (acc[curr.sleepCase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = sleepData.length;
    const sleepCaseDist = Object.entries(distribution).map(([name, value]) => ({
      name,
      value: (value / total) * 100,
    }));

    const averageStress = stressData.length > 0 ? stressData.reduce((acc, curr) => acc + curr.value, 0) / stressData.length : 0;

    return {
      stressChartData: stressData,
      sleepChartData: sleepDataMapped,
      sleepCaseDistribution: sleepCaseDist,
      avgStress: averageStress,
    };
  }, [dataPoints, sleepData]);

  const heartRateChartData = useMemo(() =>
    dataPoints.map(dp => ({
      time: new Date(dp.timestamp * 1000).toLocaleTimeString(),
      value: dp.heartRate
    })), [dataPoints]);

  if (dataPoints.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Sleep & Stress Analysis</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <HistoricalChart title="Stress Level Over Time" data={stressChartData} dataKey="value" color="#ef4444" yAxisLabel="%" />
        <HistoricalChart title="Sleep Level Over Time" data={sleepChartData} dataKey="value" color="#3b82f6" yAxisLabel="%" />
        <HistoricalChart title="Heart Rate Over Time" data={heartRateChartData} dataKey="value" color="#10b981" yAxisLabel="bpm" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing && sleepCaseDistribution.length === 0 ? <Skeleton className="h-[250px] w-full"/> : 
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sleepCaseDistribution} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Stress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[250px] flex-col">
            <p className="text-6xl font-bold">{avgStress.toFixed(1)}%</p>
            <p className="text-muted-foreground">Session Average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const PageSkeleton = () => (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Skeleton className="h-9 w-72 mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[320px] w-full" />
        <Skeleton className="h-[320px] w-full" />
        <Skeleton className="h-[320px] w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[320px] w-full" />
        <Skeleton className="h-[320px] w-full" />
      </div>
    </div>
)
