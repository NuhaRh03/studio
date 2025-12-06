'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';

export interface Prediction {
  id: string;
  state: string;
  prob: number;
  timestamp: number;
}

export function usePredictions(deviceId: string, count: number) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !deviceId) {
      setLoading(false);
      return;
    }

    const samplesRef = collection(firestore, 'predictions', deviceId, 'samples');
    const q = query(samplesRef, orderBy('timestamp_ms', 'desc'), limit(count));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newPredictions: Prediction[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const states = data.prediction?.states;
          if (states) {
            Object.entries(states).forEach(([state, details]) => {
              const stateDetails = details as { label: number; prob: number };
              if (stateDetails.label === 1 && stateDetails.prob > 0.65) {
                newPredictions.push({
                  id: `${doc.id}-${state}`,
                  state: state,
                  prob: stateDetails.prob,
                  timestamp: data.timestamp_ms,
                });
              }
            });
          }
        });
        
        // Sort by probability (highest first) then by timestamp
        newPredictions.sort((a, b) => b.prob - a.prob || b.timestamp - a.timestamp);

        setPredictions(newPredictions);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching predictions:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [deviceId, count]);

  return { predictions, loading };
}
