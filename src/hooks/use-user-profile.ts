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

const USER_COLLECTION = 'users';

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

    // The user document itself contains the profile info.
    const docRef = doc(firestore, USER_COLLECTION, user.uid);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Assuming your python script might set more than just profile data
        // It's safer to construct the profile object.
        setProfile({
          name: data.name || 'N/A',
          email: user.email || 'N/A',
          age: data.age || 0,
          height_cm: data.height_cm || 0,
          weight_kg: data.weight_kg || 0,
          job: data.job || 'N/A'
        });
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
