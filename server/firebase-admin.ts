import admin from "firebase-admin";
import { readFileSync } from "fs";

// Initialize Firebase Admin SDK
// Priority:
// 1. FIREBASE_SERVICE_ACCOUNT_KEY env var (for Vercel)
// 2. serviceAccountKey.json file (for local dev)
// 3. FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL env vars

const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    try {
      // Priority 1: Load from FIREBASE_SERVICE_ACCOUNT_KEY environment variable (Vercel)
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.log("🔧 Loading Firebase from FIREBASE_SERVICE_ACCOUNT_KEY env var");
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log("✓ Firebase initialized from environment variable");
        return admin;
      }

      // Priority 2: Try to load from service account file (local development)
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";
      
      try {
        const serviceAccountContent = readFileSync(serviceAccountPath, "utf8");
        const serviceAccount = JSON.parse(serviceAccountContent);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log("✓ Firebase initialized with service account key file");
        return admin;
      } catch (fileError) {
        // File doesn't exist, try env vars
      }

      // Priority 3: Try individual environment variables
      if (
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_CLIENT_EMAIL
      ) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
        console.log("✓ Firebase initialized with individual environment variables");
        return admin;
      }

      console.warn("⚠️  Firebase credentials not found. Using emulator or mock mode.");
      return null;
    } catch (error) {
      console.error("✗ Error initializing Firebase:", error);
      return null;
    }
  }

  return admin;
};

export const firebaseAdmin = initializeFirebase();
export type { admin };
