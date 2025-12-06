import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: Replace with your own Firebase project configuration.
// You can get this from the Firebase console:
// Project Settings > General > Your apps > Web app > Firebase SDK snippet > Config
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let database: Database | null = null;
let firestore: Firestore | null = null;

// The NEXT_PUBLIC_FIREBASE_PROJECT_ID is used as a flag to determine
// if the Firebase config is properly set up.
if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  try {
    database = getDatabase(app);
    firestore = getFirestore(app);
  } catch (e) {
    console.error('Failed to initialize Firebase services.', e);
  }
} else {
  console.warn(
    'Firebase configuration not found. The app will run in offline/mock data mode. Please set up your Firebase environment variables.'
  );
}

export { app, database, firestore };
