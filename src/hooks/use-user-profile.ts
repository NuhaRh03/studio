'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from './use-auth';

export interface UserProfile {
    name: string;
    email: string;
    age: number;
    height_cm: number;
    weight_kg: number;
    job: string;
}

const USER_COLLECTION = 'devices';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
      console.warn('Firestore not available, skipping profile listener.');
      setLoading(false);
      return;
    }
    
    if (!user) {
        setLoading(false);
        setProfile(null);
        return;
    }

    const docRef = doc(firestore, USER_COLLECTION, user.uid, 'data', 'realtime_data');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        console.log("No such document at path:", docRef.path);
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { profile, loading };
}
