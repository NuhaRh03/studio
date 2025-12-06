'use client';

import { useEffect } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const DEVICE_ID = 'device1';

export function PredictionListener() {
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) {
      console.warn('Firestore not available, skipping prediction listener.');
      return;
    }

    const samplesRef = collection(firestore, 'predictions', DEVICE_ID, 'samples');
    // Listen for documents created in the last 2 seconds to avoid showing old alerts on load
    const q = query(
      samplesRef,
      where('timestamp_ms', '>', Date.now() - 2000)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const states = data.prediction?.states;
            if (states) {
              Object.entries(states).forEach(([state, details]) => {
                const stateDetails = details as { label: number; prob: number };
                
                // Only show toast for high-probability events
                if (stateDetails.label === 1 && stateDetails.prob > 0.8) {
                    toast({
                        title: (
                            <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold capitalize">{state} Alert</span>
                            </div>
                        ),
                        description: `A high risk of ${state} has been detected. Probability: ${(
                            stateDetails.prob * 100
                        ).toFixed(0)}%`,
                        variant: 'default',
                    });
                }
              });
            }
          }
        });
      },
      (error) => {
        console.error('Error listening to predictions for toasts:', error);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  return null;
}
