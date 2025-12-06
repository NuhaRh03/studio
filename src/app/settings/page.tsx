'use client';

import React, { useMemo } from 'react';
import { useDeviceData } from '@/hooks/use-device-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SettingsPage() {
  const dataPoints = useDeviceData(1);
  const latestData = useMemo(() => (dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : null), [dataPoints]);

  const connectionStatus = useMemo(() => {
    if (!latestData) {
      return {
        status: 'Connecting...',
        color: 'bg-yellow-500',
        icon: <Wifi className="h-4 w-4 text-white" />,
        lastUpdate: 'N/A',
      };
    }
    const lastUpdateSeconds = Date.now() / 1000 - latestData.timestamp;
    if (lastUpdateSeconds > 15) {
      return {
        status: 'Disconnected',
        color: 'bg-red-500',
        icon: <WifiOff className="h-4 w-4 text-white" />,
        lastUpdate: `Over ${Math.round(lastUpdateSeconds)}s ago`,
      };
    }
    return {
      status: 'Connected',
      color: 'bg-green-500',
      icon: <Wifi className="h-4 w-4 text-white" />,
      lastUpdate: formatDistanceToNow(new Date(latestData.timestamp * 1000), { addSuffix: true }),
    };
  }, [latestData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Sensor Connection</h2>
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>Live status of the connection to your biosensor device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className={`flex items-center justify-center rounded-full h-12 w-12 ${connectionStatus.color}`}>
              {connectionStatus.icon}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{connectionStatus.status}</p>
              <p className="text-sm text-muted-foreground">
                Last update: {latestData ? connectionStatus.lastUpdate : 'Waiting for data...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Sensor Data</CardTitle>
          <CardDescription>The most recent raw data point received from the sensor.</CardDescription>
        </CardHeader>
        <CardContent>
          {latestData ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm bg-muted p-4 rounded-lg">
              {Object.entries(latestData).map(([key, value]) => (
                <div key={key}>
                  <p className="text-muted-foreground">{key}</p>
                  <p className="font-mono font-semibold">
                    {typeof value === 'number' ? value.toFixed(4) : String(value)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-muted p-4 rounded-lg">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i}><Skeleton className="h-10 w-full" /></div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
