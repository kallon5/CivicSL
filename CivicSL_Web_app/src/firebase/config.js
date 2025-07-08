import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeGphd1oWb-g0VXjUyyKZWnPB5qSi7miw",
  authDomain: "civicsl.firebaseapp.com",
  projectId: "civicsl",
  storageBucket: "civicsl.firebasestorage.app",
  messagingSenderId: "113257378406",
  appId: "1:113257378406:web:958722fca4c9a86765f3a7",
  measurementId: "G-RPEGVGHG06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed - multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.log('Persistence not supported');
    }
  });

export default app; 