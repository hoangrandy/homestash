import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqAJt95W1sPoEbA-lgPyVT3NHc9zLlRkk",
  authDomain: "homestash-161ff.firebaseapp.com",
  projectId: "homestash-161ff",
  storageBucket: "homestash-161ff.firebasestorage.app",
  messagingSenderId: "183785979360",
  appId: "1:183785979360:web:3b5ae1c0974da107b2bf85",
  measurementId: "G-D4LQKCLHSS"
};

// Initialize Firebase conditionally to prevent SSR issues in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

// Conditionally initialize analytics only in the browser and if supported
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
