import type { RequestHandler } from "express";
import { firebaseAdmin } from "./firebase-admin";

export interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: FirebaseUser & { claims?: any };
  firebaseToken?: string;
}

/**
 * Middleware para verificar token de Firebase
 * Extrae el token del header Authorization: Bearer <token>
 */
export const firebaseAuth: RequestHandler = async (req: any, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    // Si está en desarrollo sin credenciales, permitir modo dev
    if (!firebaseAdmin) {
      req.user = {
        uid: "dev-user",
        email: "dev@example.com",
        displayName: "Dev User",
        emailVerified: true,
      };
      return next();
    }

    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verificar el token con Firebase Admin SDK
    const decodedToken = await firebaseAdmin!.auth().verifyIdToken(token);

    // Obtener datos adicionales del usuario si es necesario
    const user = await firebaseAdmin!.auth().getUser(decodedToken.uid);

    req.user = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      claims: decodedToken,
    };

    req.firebaseToken = token;
    next();
  } catch (error: any) {
    console.error("Firebase auth error:", error);

    // En desarrollo sin credenciales, permitir acceso
    if (!firebaseAdmin) {
      req.user = {
        uid: "dev-user",
        email: token?.substring(0, 20) || "dev@example.com",
        displayName: "Dev User",
        emailVerified: true,
      };
      return next();
    }

    res.status(401).json({
      error: "Invalid or expired token",
      message: error.message,
    });
  }
};

/**
 * Alias para compatibilidad - usa firebaseAuth
 */
export const isAuthenticated = firebaseAuth;
