'use client';

import { useEffect } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

export function PredictionListener() {
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) {
      console.warn('Firestore not available, skipping prediction listener.');
      return;
    }

    const predictionsRef = collection(firestore, 'predictions');
    const q = query(
      predictionsRef,
      where('timestamp', '>', Timestamp.now())
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const { prediction, probability } = data;

            toast({
              title: (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">Health Alert</span>
                </div>
              ),
              description: `${prediction} risk detected. Probability: ${(
                probability * 100
              ).toFixed(0)}%`,
              variant: 'default',
            });
          }
        });
      },
      (error) => {
        console.error('Error listening to predictions:', error);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  return null;
}
