import { initializeApp, getApps, deleteApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';
import type { Database } from 'firebase/database';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const STORAGE_KEY = 'chorewheel_firebase_config';

// Load stored config from LocalStorage if available
export function getSavedFirebaseConfig(): FirebaseConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Error reading Firebase config from LocalStorage:', e);
    return null;
  }
}

// Save config to LocalStorage
export function saveFirebaseConfig(config: FirebaseConfig | null) {
  try {
    if (config) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error saving Firebase config to LocalStorage:', e);
  }
}

// Initialize Firebase dynamically
let activeApp: FirebaseApp | null = null;
let activeDb: Database | null = null;

export function initFirebase(): Database | null {
  const config = getSavedFirebaseConfig();
  if (!config || !config.databaseURL) {
    activeApp = null;
    activeDb = null;
    return null;
  }

  try {
    // Safely delete any existing Firebase apps to ensure credentials are fresh and not stale
    const apps = getApps();
    for (const app of apps) {
      deleteApp(app).catch(() => {});
    }
    
    activeApp = initializeApp(config);
    activeDb = getDatabase(activeApp);
    return activeDb;
  } catch (e) {
    console.error('Failed to initialize Firebase Realtime DB:', e);
    activeApp = null;
    activeDb = null;
    return null;
  }
}

// Check if Firebase is active
export function isFirebaseEnabled(): boolean {
  return activeDb !== null || initFirebase() !== null;
}

// Database helper operations
export const firebaseService = {
  // Sync state to Firebase
  writeRoomState: async (roomCode: string, state: Record<string, unknown>): Promise<boolean> => {
    const db = activeDb || initFirebase();
    if (!db) return false;
    
    try {
      const roomRef = ref(db, `rooms/${roomCode}`);
      await set(roomRef, {
        ...state,
        lastUpdated: Date.now()
      });
      return true;
    } catch (e) {
      console.error(`Firebase Write Error for room ${roomCode}:`, e);
      return false;
    }
  },

  // Listen for real-time changes
  listenRoomState: (roomCode: string, callback: (state: Record<string, unknown>) => void): (() => void) => {
    const db = activeDb || initFirebase();
    if (!db) return () => {};

    const roomRef = ref(db, `rooms/${roomCode}`);
    
    const listener = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data as Record<string, unknown>);
      }
    }, (error) => {
      console.error(`Firebase Listener Error for room ${roomCode}:`, error);
    });

    // Return unsubscribe function
    return () => {
      off(roomRef, 'value', listener);
    };
  }
};
