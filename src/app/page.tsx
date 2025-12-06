'use client';

import React, { useMemo } from 'react';
import { useDeviceData } from '@/hooks/use-device-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MetricCard from '@/components/metric-card';
import EegChart from '@/components/eeg-chart';
import RiskGauge from '@/components/risk-gauge';
import { computeHeadacheRisk, computeMigraineRisk, computeStressLevel, getHeartHealthState, getTempState, analyzeSleepPatterns } from '@/lib/metrics';
import { HeartPulse, Thermometer, BrainCircuit, Smile, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const dataPoints = useDeviceData(120);

  const latestData = useMemo(() => (dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : null), [dataPoints]);

  const { headacheRisk, migraineRisk, stressLevel, heartState, tempState, sentiment, sleepInfo } = useMemo(() => {
    if (!latestData) {
      return {
        headacheRisk: { risk: 0, label: 'Low' },
        migraineRisk: { risk: 0, label: 'Low' },
        stressLevel: { level: 0, label: 'Calm' },
        heartState: { label: 'Normal', color: 'text-green-500' },
        tempState: { label: 'Normal', color: 'text-green-500' },
        sentiment: { level: 50, label: 'Neutral' },
        sleepInfo: { level: 0, case: 'Awake' },
      };
    }
    return {
      headacheRisk: computeHeadacheRisk(latestData),
      migraineRisk: computeMigraineRisk(latestData),
      stressLevel: computeStressLevel(latestData.heartRate, latestData.highBeta, latestData.highGamma),
      heartState: getHeartHealthState(latestData.heartRate),
      tempState: getTempState(latestData.temperature),
      sentiment: { level: 50, label: 'Neutral' }, // Placeholder for sentiment
      sleepInfo: analyzeSleepPatterns(latestData),
    };
  }, [latestData]);

  if (dataPoints.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Heart Rate"
          value={`${latestData?.heartRate ?? 'N/A'} bpm`}
          status={heartState.label}
          statusColor={heartState.color}
          icon={<HeartPulse className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Body Temperature"
          value={`${latestData?.temperature ?? 'N/A'} °C`}
          status={tempState.label}
          statusColor={tempState.color}
          icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Stress Level"
          value={`${stressLevel.level.toFixed(0)}%`}
          status={stressLevel.label}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Sleep Level"
          value={sleepInfo ? `${sleepInfo.level}%` : 'Analyzing...'}
          status={sleepInfo ? sleepInfo.case : ''}
          icon={<BrainCircuit className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Live EEG Waves</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <EegChart data={dataPoints} />
          </CardContent>
        </Card>
        <div className="col-span-3 grid grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Headache Risk</CardTitle>
                </CardHeader>
                <CardContent>
                    <RiskGauge value={headacheRisk.risk} label={headacheRisk.label} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Migraine Risk</CardTitle>
                </CardHeader>
                <CardContent>
                    <RiskGauge value={migraineRisk.risk} label={migraineRisk.label} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

const DashboardSkeleton = () => (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 h-[350px]">
          <CardHeader><CardTitle>Live EEG Waves</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </Card>
        <div className="col-span-3 grid grid-cols-2 gap-4">
            <Card className="h-[350px]"><CardHeader><CardTitle>Headache Risk</CardTitle></CardHeader><CardContent><Skeleton className="w-full h-full" /></CardContent></Card>
            <Card className="h-[350px]"><CardHeader><CardTitle>Migraine Risk</CardTitle></CardHeader><CardContent><Skeleton className="w-full h-full" /></CardContent></Card>
        </div>
      </div>
    </div>
)
