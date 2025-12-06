'use client';

import { useState, useEffect, useRef } from 'react';
import { database } from '@/lib/firebase';
import { ref, onChildAdded, query, limitToLast, off, get } from 'firebase/database';
import type { DevicePythonDataPoint } from '@/types';
import { useAuth } from './use-auth';

function generateMockDataPoint(lastPoint?: DevicePythonDataPoint): DevicePythonDataPoint {
  const now = Date.now() / 1000;
  const baseHr = lastPoint?.heartRate ?? 75;
  const baseTemp = lastPoint?.temperature ?? 36.8;

  return {
    id: `mock_${now}`,
    ax: Math.random() * 2 - 1,
    ay: Math.random() * 2 - 1,
    az: Math.random() * 2 - 1,
    gx: Math.random() * 0.1,
    gy: Math.random() * 0.1,
    gz: Math.random() * 0.1,
    delta: Math.random() * 40,
    theta: Math.random() * 30,
    lowAlpha: Math.random() * 20,
    highAlpha: Math.random() * 15,
    highBeta: Math.random() * 10,
    highGamma: Math.random() * 8,
    heartRate: baseHr + (Math.random() - 0.5) * 4,
    temperature: baseTemp + (Math.random() - 0.5) * 0.2,
    timestamp: now,
  };
}

export function useDeviceData(limit: number): DevicePythonDataPoint[] {
  const { user } = useAuth();
  const [data, setData] = useState<DevicePythonDataPoint[]>([]);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    // If Firebase is not configured, use mock data
    if (!database) {
      console.warn('Firebase not configured. Using mock data stream.');
      const interval = setInterval(() => {
        const newPoint = generateMockDataPoint(dataRef.current[dataRef.current.length - 1]);
        setData(prev => [...prev, newPoint].slice(-limit));
      }, 2000);
      return () => clearInterval(interval);
    }
    
    if (!user) {
        setData([]);
        return;
    }

    // Use user's UID to reference their device data
    const deviceId = user.uid;
    const deviceRef = ref(database, `devices/${deviceId}`);
    const dataQuery = query(deviceRef, limitToLast(limit));
    let initialDataLoaded = false;

    const handleNewData = (snapshot: any) => {
      if (!snapshot.exists()) return;
      const value = snapshot.val();
      const id = snapshot.key as string;
      const newDataPoint: DevicePythonDataPoint = { id, ...value };
      
      setData(prevData => {
        if (prevData.some(p => p.id === id)) return prevData;
        const newState = [...prevData, newDataPoint];
        return newState.length > limit ? newState.slice(newState.length - limit) : newState;
      });
    };

    get(dataQuery).then((snapshot) => {
        const initialData: DevicePythonDataPoint[] = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const id = childSnapshot.key as string;
                const value = childSnapshot.val();
                initialData.push({ id, ...value });
            });
            setData(initialData);
        }
        initialDataLoaded = true;

        onChildAdded(query(deviceRef, limitToLast(1)), (snapshot) => {
            if (initialDataLoaded && !dataRef.current.some(p => p.id === snapshot.key)) {
                handleNewData(snapshot);
            }
        });
    });

    return () => {
      if(dataQuery) {
        off(dataQuery);
      }
    };
  }, [limit, user]);

  return data;
}
