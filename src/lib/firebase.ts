// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getFirestore, type Firestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBk-CiP1Qf35wpUx1RXq_KZxGve58PBY8o",
  authDomain: "heartguard-cfc48.firebaseapp.com",
  databaseURL: "https://heartguard-cfc48-default-rtdb.firebaseio.com",
  projectId: "heartguard-cfc48",
  storageBucket: "heartguard-cfc48.firebasestorage.app",
  messagingSenderId: "169173920801",
  appId: "1:169173920801:web:63427b863d444f54ac8760",
  measurementId: "G-VXX3NBGFHY",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let database: Database | null = null;
let firestore: Firestore | null = null;
let analytics;

if (firebaseConfig.projectId) {
  try {
    database = getDatabase(app);
    firestore = getFirestore(app);
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (e) {
    console.error('Failed to initialize Firebase services.', e);
  }
} else {
  console.warn(
    'Firebase configuration not found. The app will run in offline/mock data mode. Please set up your Firebase environment variables.'
  );
}


export { app, database, firestore, analytics };
