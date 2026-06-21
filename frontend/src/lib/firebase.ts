import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZnwm96hrh4f6A13DVBJgjQRrf_il75Uc",
  authDomain: "creatuselloo.firebaseapp.com",
  projectId: "creatuselloo",
  storageBucket: "creatuselloo.firebasestorage.app",
  messagingSenderId: "101943451318",
  appId: "1:101943451318:web:b4a22933754659a1c3d017"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
