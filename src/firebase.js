import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Try to load Firebase credentials from localStorage or .env
const storedConfig = localStorage.getItem('AXIOM_FIREBASE_CONFIG');
let firebaseConfig = null;
if (storedConfig) {
  try {
    firebaseConfig = JSON.parse(storedConfig);
  } catch (e) {
    console.error("Invalid Firebase Config in localStorage:", e);
  }
} else if (import.meta.env.VITE_FIREBASE_API_KEY) {
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
}

let useRealFirebase = false;
let app, auth, db, googleProvider;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    useRealFirebase = true;
    console.log("🔥 Real Firebase initialized successfully!");
  } catch (err) {
    console.error("🔥 Failed to initialize real Firebase, switching to Local Sandbox Mode:", err);
  }
}

// Fallback high-fidelity mock implementation for bulletproof hackathon execution
if (!useRealFirebase) {
  console.log("📦 Firebase Cloud Config not found. Initializing Local Firebase Sandbox Mode...");
  
  // Mock auth
  const mockAuthStateListeners = [];
  let currentMockUser = null;
  const storedUser = localStorage.getItem('AXIOM_MOCK_USER');
  if (storedUser) {
    try {
      currentMockUser = JSON.parse(storedUser);
    } catch (e) {}
  }

  const triggerAuthListeners = () => {
    mockAuthStateListeners.forEach(cb => cb(currentMockUser));
  };

  auth = {
    get currentUser() {
      return currentMockUser;
    },
    onAuthStateChanged: (callback) => {
      mockAuthStateListeners.push(callback);
      // Immediately run callback with current state
      callback(currentMockUser);
      return () => {
        const idx = mockAuthStateListeners.indexOf(callback);
        if (idx !== -1) mockAuthStateListeners.splice(idx, 1);
      };
    },
    // Trigger mock login popup
    signInWithGoogleMock: (email, name) => {
      currentMockUser = {
        uid: 'mock_uid_' + Math.random().toString(36).substr(2, 9),
        displayName: name || 'Gwendolyn SG',
        email: email || 'gwendolyn@dev.sg',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
      };
      localStorage.setItem('AXIOM_MOCK_USER', JSON.stringify(currentMockUser));
      triggerAuthListeners();
      return Promise.resolve({ user: currentMockUser });
    },
    signOut: () => {
      currentMockUser = null;
      localStorage.removeItem('AXIOM_MOCK_USER');
      triggerAuthListeners();
      return Promise.resolve();
    }
  };

  // Mock firestore
  const mockFirestoreListeners = {}; // path -> callbacks

  db = {
    // Simulated setDoc
    setDoc: async (docRef, data) => {
      const path = docRef.path;
      localStorage.setItem(`AXIOM_FIRESTORE_${path}`, JSON.stringify(data));
      // Trigger listeners
      if (mockFirestoreListeners[path]) {
        mockFirestoreListeners[path].forEach(cb => cb({
          exists: () => true,
          data: () => data
        }));
      }
      return Promise.resolve();
    },
    // Simulated getDoc
    getDoc: async (docRef) => {
      const path = docRef.path;
      const dataStr = localStorage.getItem(`AXIOM_FIRESTORE_${path}`);
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          return Promise.resolve({
            exists: () => true,
            data: () => data
          });
        } catch (e) {}
      }
      return Promise.resolve({
        exists: () => false,
        data: () => null
      });
    },
    // Simulated onSnapshot
    onSnapshot: (docRef, callback) => {
      const path = docRef.path;
      if (!mockFirestoreListeners[path]) {
        mockFirestoreListeners[path] = [];
      }
      mockFirestoreListeners[path].push(callback);
      
      // Emit initial value
      const dataStr = localStorage.getItem(`AXIOM_FIRESTORE_${path}`);
      let data = null;
      let exists = false;
      if (dataStr) {
        try {
          data = JSON.parse(dataStr);
          exists = true;
        } catch (e) {}
      }
      callback({
        exists: () => exists,
        data: () => data
      });

      return () => {
        const idx = mockFirestoreListeners[path].indexOf(callback);
        if (idx !== -1) mockFirestoreListeners[path].splice(idx, 1);
      };
    }
  };

  // Standard provider mock
  googleProvider = {};
}

// Unified wrapper functions for React components to import
export { auth, db, googleProvider, useRealFirebase };

// Helper to get doc references in unified way
export function getDocRef(collectionName, documentId) {
  if (useRealFirebase) {
    return doc(db, collectionName, documentId);
  } else {
    return { path: `${collectionName}/${documentId}` };
  }
}

// Authentic Google Sign In wrapper
export async function signInWithGoogle() {
  if (useRealFirebase) {
    return signInWithPopup(auth, googleProvider);
  } else {
    // Trigger mock login popup
    return auth.signInWithGoogleMock();
  }
}

// Authenticated Firestore Operations
export async function saveJournalToCloud(userId, data) {
  const ref = getDocRef('journals', userId);
  if (useRealFirebase) {
    await setDoc(ref, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } else {
    await db.setDoc(ref, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }
}

export function subscribeToJournal(userId, callback) {
  const ref = getDocRef('journals', userId);
  if (useRealFirebase) {
    return onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    });
  } else {
    return db.onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    });
  }
}
