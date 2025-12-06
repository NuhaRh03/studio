'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export interface UserProfile {
    name: string;
    email: string;
    age: number;
    height_cm: number;
    weight_kg: number;
    job: string;
}

// NOTE: We are using a hardcoded user and document ID for demonstration purposes.
// In a real application, this should be dynamic based on the logged-in user.
const USER_COLLECTION = '25zoRah4wZsAKzLeZJpL';
const PROFILE_DOC_ID = 'realtime_data';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
      console.warn('Firestore not available, skipping profile listener.');
      setLoading(false);
      return;
    }

    const docRef = doc(firestore, USER_COLLECTION, PROFILE_DOC_ID);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        console.log("No such document!");
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { profile, loading };
}
