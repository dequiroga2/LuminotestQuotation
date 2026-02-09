import { useEffect, useState } from "react";
import { auth, getIdToken } from "@/lib/firebase";
import type { User } from "firebase/auth";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser) => {
        try {
          setUser(firebaseUser);
          
          if (firebaseUser) {
            // Get ID token for API requests
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
          } else {
            setToken(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Auth error");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Refresh token every hour (tokens expire after 1 hour)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const newToken = await getIdToken();
        setToken(newToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Token refresh failed");
      }
    }, 55 * 60 * 1000); // Refresh after 55 minutes

    return () => clearInterval(interval);
  }, [user]);

  return {
    user,
    loading,
    error,
    token,
    isAuthenticated: !!user,
  };
}
