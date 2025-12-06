'use client';

import React, { useMemo, useState } from 'react';
import { useDeviceData } from '@/hooks/use-device-data';
import { computeHeadacheRisk, computeMigraineRisk, explainRiskLevels } from '@/lib/metrics';
import RiskGauge from '@/components/risk-gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HistoricalChart from '@/components/historical-chart';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RiskPredictionPage() {
  const dataPoints = useDeviceData(300);
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  const { headacheRiskChartData, migraineRiskChartData, latestRisks } = useMemo(() => {
    if (dataPoints.length === 0) {
      return { headacheRiskChartData: [], migraineRiskChartData: [], latestRisks: null };
    }
    const headacheData = dataPoints.map(dp => ({
      time: new Date(dp.timestamp * 1000).toLocaleTimeString(),
      value: computeHeadacheRisk(dp).risk,
    }));
    const migraineData = dataPoints.map(dp => ({
      time: new Date(dp.timestamp * 1000).toLocaleTimeString(),
      value: computeMigraineRisk(dp).risk,
    }));
    const lastPoint = dataPoints[dataPoints.length - 1];
    return {
      headacheRiskChartData: headacheData,
      migraineRiskChartData: migraineData,
      latestRisks: {
        headache: computeHeadacheRisk(lastPoint),
        migraine: computeMigraineRisk(lastPoint),
      },
    };
  }, [dataPoints]);

  const handleExplainRisk = async () => {
    const latestData = dataPoints[dataPoints.length - 1];
    if (!latestData || !latestRisks) return;
    setIsExplaining(true);
    setExplanation('');
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async
        const result = explainRiskLevels({
            ...latestData,
            headacheRisk: latestRisks.headache.risk,
            migraineRisk: latestRisks.migraine.risk
        });
        setExplanation(result.explanation);
    } catch (error) {
      console.error('Error explaining risk levels:', error);
      setExplanation('Could not generate an explanation at this time.');
    } finally {
      setIsExplaining(false);
    }
  };

  if (dataPoints.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Risk Prediction Analysis</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Risk Levels</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-center font-medium text-muted-foreground">Headache</h3>
              <RiskGauge value={latestRisks?.headache.risk ?? 0} label={latestRisks?.headache.label ?? 'Low'} />
            </div>
            <div>
              <h3 className="text-center font-medium text-muted-foreground">Migraine</h3>
              <RiskGauge value={latestRisks?.migraine.risk ?? 0} label={latestRisks?.migraine.label ?? 'Low'} />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk Explanation</CardTitle>
            <CardDescription>Get an explanation for your current risk levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExplainRisk} disabled={isExplaining}>
              {isExplaining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze & Explain
            </Button>
            {explanation && <p className="mt-4 text-sm bg-muted p-4 rounded-lg">{explanation}</p>}
             {isExplaining && !explanation && <Skeleton className="mt-4 h-24 w-full" />}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <HistoricalChart title="Headache Risk Over Time" data={headacheRiskChartData} dataKey="value" color="#f97316" yAxisLabel="%" />
        <HistoricalChart title="Migraine Risk Over Time" data={migraineRiskChartData} dataKey="value" color="#8b5cf6" yAxisLabel="%" />
      </div>
    </div>
  );
}


const PageSkeleton = () => (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Skeleton className="h-9 w-80 mb-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[320px] w-full" />
        <Skeleton className="h-[320px] w-full lg:col-span-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[320px] w-full" />
        <Skeleton className="h-[320px] w-full" />
      </div>
    </div>
)
