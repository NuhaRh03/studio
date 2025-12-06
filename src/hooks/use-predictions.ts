'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';

export type AlertLevel = "high" | "medium" | "low";

export interface PredictionAlert {
  id: string;
  title: string;
  message: string;
  level: AlertLevel;
  timestamp: number;
}

interface PredictionDoc {
  timestamp_ms?: number;
  prediction?: {
    states?: {
      [name: string]: { label: number; prob: number };
    };
    emotion?: {
      class_index?: number;
      label?: string;
      probs?: { [name: string]: number };
    };
  }
}

function capitalize(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function predictionToAlert(id: string, data: PredictionDoc): PredictionAlert | null {
  const ts = data.timestamp_ms ?? 0;
  const states = data.prediction?.states ?? {};
  const emotionLabel = data.prediction?.emotion?.label ?? "Unknown";

  const activeStates: { name: string; prob: number }[] = [];
  Object.entries(states).forEach(([name, v]) => {
    if (v && v.label === 1) {
      activeStates.push({ name, prob: v.prob ?? 0 });
    }
  });

  let level: AlertLevel = "low";
  let title = "Stable State";
  const critStates = ["migraine", "headache"];
  const stressStates = ["stress", "fatigue"];

  const hasCritical = activeStates.some(
    (s) => critStates.includes(s.name) && s.prob >= 0.6
  );
  const hasMedium = activeStates.some(
    (s) =>
      (critStates.includes(s.name) && s.prob >= 0.4) ||
      (stressStates.includes(s.name) && s.prob >= 0.5)
  );

  if (hasCritical) {
    level = "high";
    title = "High Risk of Migraine / Headache";
  } else if (hasMedium) {
    level = "medium";
    title = "Stress / Fatigue Detected";
  } else if (activeStates.length > 0) {
    level = "low";
    title = "Weak Signals Detected";
  } else {
    // We can filter these out later if we don't want to show them
    return null;
  }

  const stateSummary =
    activeStates.length > 0
      ? activeStates
          .map(
            (s) => `${capitalize(s.name)}: ${(s.prob * 100).toFixed(0)}%`
          )
          .join(" • ")
      : "No critical states detected.";

  const message = `Predicted Emotion: ${emotionLabel}. ${stateSummary}`;

  return { id, title, message, level, timestamp: ts };
}

// Hardcoded to match the python script
const DEVICE_ID = 'device1';

export function usePredictions(count: number) {
  const [predictions, setPredictions] = useState<PredictionAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !DEVICE_ID) {
      setLoading(false);
      return;
    }

    const samplesRef = collection(firestore, 'predictions', DEVICE_ID, 'samples');
    const q = query(samplesRef, orderBy('timestamp_ms', 'desc'), limit(count));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newPredictions: PredictionAlert[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as PredictionDoc;
          const alertItem = predictionToAlert(doc.id, data);
          if (alertItem) {
            newPredictions.push(alertItem);
          }
        });
        
        setPredictions(newPredictions);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching predictions:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [count]);

  return { predictions, loading };
}
