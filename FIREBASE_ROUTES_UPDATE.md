// ============================================
// CÓMO ACTUALIZAR routes.ts PARA USAR FIREBASE
// ============================================

// CAMBIO 1: Actualiza los imports
// ❌ Reemplaza esto:
// import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

// ✅ Por esto:
// import { firebaseAuth, isAuthenticated } from "./firebase-middleware";

// CAMBIO 2: En registerRoutes(), reemplaza setupAuth:
// ❌ Quita estos métodos:
// await setupAuth(app);
// registerAuthRoutes(app);

// ✅ Agroga el middleware de Firebase después de configurar parsers JSON:
// app.use(express.json({ ... }));
// app.use(express.urlencoded({ ... }));
// app.use(firebaseAuth); // ← Agrega esta línea

// CAMBIO 3: En los endpoints que requieren autenticación:
// ❌ Antes utilizabas:
// app.post(api.quotations.create.path, isAuthenticated, async (req: any, res) => {
//   const userId = req.user?.claims?.sub || 'dev-user';

// ✅ Ahora usas:
// app.post(api.quotations.create.path, isAuthenticated, async (req: any, res) => {
//   const userId = req.user?.uid || 'dev-user'; // Cambiar de claims.sub a uid

// CAMBIO 4: Actualiza cualquier referencia a req.user
// Firebase User estructura:
// {
//   uid: string;                  // ← ID único del usuario (antes era claims.sub)
//   email?: string;               // ← Email del usuario
//   displayName?: string;         // ← Nombre del usuario
//   photoURL?: string;            // ← URL de foto del perfil
//   emailVerified: boolean;       // ← Si el email está verificado
//   claims?: TokenClaims;         // ← Claims del token
// }

// Ejemplo de almacenamiento de usuario:
// Antes:
// const userId = req.user?.claims?.sub || 'dev-user';

// Después:
// const userId = req.user?.uid || 'dev-user';

// Y para obtener info del usuario:
// // Storage actualizado para usar uid en lugar de id
// await storage.upsertUser({
//   id: userId,  // ← Usa req.user.uid
//   email: req.user?.email,
//   firstName: req.user?.displayName?.split(' ')[0], // Divide por espacio si quieres
//   lastName: req.user?.displayName?.split(' ')[1],
//   profileImageUrl: req.user?.photoURL,
// });

// CAMBIO 5: Schema actualización (si tienes Auth User tabla)
// Asegúrate que tu tabla users tenga estos campos:
// - id (primary key - string/UUID de Firebase)
// - email (string, unique)
// - firstName (string, nullable)
// - lastName (string, nullable)
// - profileImageUrl (string, nullable)
// - createdAt (timestamp)
// - updatedAt (timestamp)

console.log(`
╔════════════════════════════════════════════════════════════════╗
║            INTEGRACIÓN DE FIREBASE EN ROUTES.TS               ║
╚════════════════════════════════════════════════════════════════╝

Sigue estos pasos para actualizar routes.ts:

1. ACTUALIZA IMPORTS:
   Reemplaza la importación de Replit auth con Firebase auth

2. ELIMINA setupAuth:
   Quita los métodos de Replit auth

3. AGREGA MIDDLEWARE FIREBASE:
   Importa y usa firebaseAuth después de configurar parsers

4. ACTUALIZA getUserId:
   Cambia de req.user?.claims?.sub a req.user?.uid

5. PRUEBA:
   npm run dev
   Intenta crear una cotización y verifica que funciona

Si necesitas ayuda:
- Ver archivo: FIREBASE_SETUP.md
- Ver ejemplo: ejemplos/routes.firebase.ts
`);
