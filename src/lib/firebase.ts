import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  type Auth,
  signInWithEmail: signInWithEmaiLAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";

// ⚠️ IMPORTANTE: Reemplaza esta configuración con la de tu proyecto Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(firebaseApp);

// Enable Firebase Emulator for development (if running locally)
if (import.meta.env.DEV && window.location.hostname === "localhost") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  } catch (error) {
    // Already connected or emulator not running
  }
}

// Auth Functions
export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email: string, password: string) => {
  return signInWithEmaiLAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signInWithMicrosoft = () => {
  const provider = new OAuthProvider("microsoft.com");
  return signInWithPopup(auth, provider);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

// Get ID Token for API requests
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user logged in");
  }
  return await user.getIdToken();
};
