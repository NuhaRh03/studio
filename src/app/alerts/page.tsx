'use client';

import React from 'react';
import { usePredictions } from '@/hooks/use-predictions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BrainCircuit, Zap, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

const stateConfig: { [key: string]: { icon: React.ElementType, color: string } } = {
  stress: { icon: Activity, color: 'bg-red-500' },
  fatigue: { icon: BrainCircuit, color: 'bg-blue-500' },
  headache: { icon: Zap, color: 'bg-yellow-500 text-black' },
  migraine: { icon: Zap, color: 'bg-purple-500' },
};

export default function AlertsPage() {
  const { predictions, loading } = usePredictions('device1', 50);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Health Alerts</h2>
          <p className="text-muted-foreground">
            Real-time predictions based on your biosignals.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Prediction Feed</CardTitle>
          <CardDescription>
            Showing the latest {predictions.length} detected state changes. High-probability events are shown first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && predictions.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
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
                    <AlertItem
                      state={p.state}
                      probability={p.prob}
                      timestamp={p.timestamp}
                    />
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

interface AlertItemProps {
  state: string;
  probability: number;
  timestamp: number;
}

function AlertItem({ state, probability, timestamp }: AlertItemProps) {
  const config = stateConfig[state.toLowerCase()] || { icon: AlertTriangle, color: 'bg-gray-500' };
  const Icon = config.icon;

  const probabilityLabel =
    probability > 0.85 ? 'Very High' : probability > 0.7 ? 'High' : 'Elevated';
  
  const probabilityColor =
    probability > 0.85 ? 'bg-destructive text-destructive-foreground' :
    probability > 0.7 ? 'bg-orange-500 text-white' :
    'bg-yellow-500 text-black';

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold capitalize">{state} Risk Detected</p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </p>
      </div>
      <div>
        <Badge className={`text-xs font-bold ${probabilityColor}`}>
          {probabilityLabel} ({Math.round(probability * 100)}%)
        </Badge>
      </div>
    </div>
  );
}
