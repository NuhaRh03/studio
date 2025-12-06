'use client';

import React from 'react';
import { usePredictions, type PredictionAlert, type AlertLevel } from '@/hooks/use-predictions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const levelConfig: { [key in AlertLevel]: { icon: React.ElementType, color: string, label: string } } = {
  high: { icon: AlertTriangle, color: 'border-red-500 bg-red-500/10', label: 'Critical' },
  medium: { icon: ShieldAlert, color: 'border-yellow-500 bg-yellow-500/10', label: 'Alert' },
  low: { icon: Info, color: 'border-blue-500 bg-blue-500/10', label: 'Info' },
};

export default function AlertsPage() {
  const { predictions, loading } = usePredictions(50);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Health Alerts</h2>
          <p className="text-muted-foreground">
            Real-time predictions based on your biosignals (stress, fatigue, migraine, emotion).
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Prediction Feed</CardTitle>
          <CardDescription>
            Showing the latest {predictions.length} detected events, with the most recent first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && predictions.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Predictions Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Waiting for data from the prediction script...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {predictions.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertItem alert={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AlertItem({ alert }: { alert: PredictionAlert }) {
  const config = levelConfig[alert.level];
  const Icon = config.icon;
  const levelColorClass = 
    alert.level === 'high' ? 'text-red-500' :
    alert.level === 'medium' ? 'text-yellow-600' :
    'text-blue-500';

  return (
    <div className={cn("flex flex-col gap-2 rounded-lg border-l-4 p-4", config.color)}>
       <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-2 text-sm font-bold uppercase", levelColorClass)}>
                <Icon className="h-4 w-4" />
                <span>{config.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
            </p>
       </div>
      <p className="font-semibold text-lg">{alert.title}</p>
      <p className="text-sm text-muted-foreground">{alert.message}</p>
    </div>
  );
}
