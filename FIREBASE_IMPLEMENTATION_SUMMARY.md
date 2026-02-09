# ✅ RESUMEN IMPLEMENTACIÓN FIREBASE

## 📋 ¿QUÉ SE HA HECHO?

### Backend (Node.js/Express)
- ✅ `server/firebase-admin.ts` - Inicializa Firebase Admin SDK con credenciales
- ✅ `server/firebase-middleware.ts` - Middleware de autenticación que valida tokens JWT
- ✅ `.env.example` - Actualizado con variables necesarias para Firebase

**Cómo funciona:**
1. Frontend envía token JWT en el header `Authorization: Bearer <token>`
2. El middleware `firebaseAuth` valida el token con Firebase Admin SDK
3. Si es válido, agrega `req.user` con datos del usuario
4. Si falla, retorna error 401 Unauthorized

### Frontend (React)
- ✅ `src/lib/firebase.ts` - Inicializa Firebase SDK y expone funciones de auth
- ✅ `src/hooks/use-firebase-auth.ts` - Hook que maneja el estado de autenticación
- ✅ `src/components/FirebaseLogin.example.tsx` - Componente de login de ejemplo

**Cómo funciona:**
1. `useFirebaseAuth()` se suscribe a cambios de estado de autenticación
2. Obtiene y guarda el token JWT automáticamente
3. Refresca el token cada 55 minutos (validez: 1 hora)
4. Proporciona usuario, token, loading y estado de error

### Documentación
- 📖 `FIREBASE_SETUP.md` - Guía paso a paso para configurar Firebase Console
- 📖 `FIREBASE_ROUTES_UPDATE.md` - Cómo actualizar las rutas existentes
- 📖 Este archivo - Resumen de qué hacer

## 🚀 ¿QUÉ TIENES QUE HACER?

### Paso 1: Crear Proyecto en Firebase Console (5 minutos)
```
1. Ve a https://console.firebase.google.com
2. Crea un nuevo proyecto
3. Habilita Authentication (Email/Password + Google)
4. Sigue: FIREBASE_SETUP.md
```

### Paso 2: Obtener Credenciales (2 minutos)
```
1. Descarga serviceAccountKey.json desde Firebase Console
2. Colócalo en la raíz del proyecto (junto a package.json)
3. Agrega a .gitignore:
   serviceAccountKey.json
4. Copia las credenciales web (VITE_*)
```

### Paso 3: Actualizar .env (1 minuto)
```bash
# Copia .env.example a .env
cp .env.example .env

# O renombralo:
mv .env.example .env

# Luego actualiza con tus valores reales de Firebase
```

### Paso 4: Instalar dependencias (2 minutos)
```bash
npm install
```

Las dependencias ya están en package.json:
- `firebase@^11.2.1`
- `firebase-admin@^13.2.0`

### Paso 5: Actualizar routes.ts (10 minutos)
En `server/routes.ts`:

**Reemplaza:**
```typescript
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);
```

**Por:**
```typescript
import { firebaseAuth, isAuthenticated } from "./firebase-middleware";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Los parsers JSON/UrlEncoded ya están en index.ts
  // Solo agrega el middleware:
  app.use(firebaseAuth);
```

**Actualiza todos los endpoints donde usas `req.user?.claims?.sub` por `req.user?.uid`:**
```typescript
// ❌ Antes:
const userId = req.user?.claims?.sub || 'dev-user';

// ✅ Después:
const userId = req.user?.uid || 'dev-user';
```

### Paso 6: Actualizar Login Component (5 minutos)
Usa el componente de ejemplo como referencia:

```tsx
import { FirebaseLoginComponent } from "@/components/FirebaseLogin.example.tsx";

// O copia la lógica a tu componente existente:
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { signIn, signUp } from "@/lib/firebase";

export function LoginPage() {
  const { user, loading, token } = useFirebaseAuth();
  
  if (loading) return <div>Cargando...</div>;
  if (user) return <div>Bienvenido {user.email}</div>;

  return (
    // Tu formulario aquí
  );
}
```

### Paso 7: Usar Token en API Requests (2 minutos)
Actualiza tus hooks para pasar el token Firebase:

```tsx
// En hooks como use-products.ts, use-quotations.ts, etc:
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

export function useProducts() {
  const { token } = useFirebaseAuth();
  
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return res.json();
    },
    enabled: !!token // Solo ejecuta si hay token
  });
}
```

### Paso 8: Prueba (5 minutos)
```bash
npm run dev

# Intenta:
# 1. Ir a http://localhost:5173/login
# 2. Crear una nueva cuenta
# 3. Iniciar sesión
# 4. Crear una cotización
```

## 🔒 Seguridad

### Sobre `serviceAccountKey.json`
- ⚠️ **NUNCA** lo subas a GitHub
- ✅ Asegúrate que esté en `.gitignore`
- 🔑 Contiene credenciales privadas de tu proyecto Firebase

### Sobre `VITE_FIREBASE_*`
- ℹ️ Son públicas (se exponen en el bundle JavaScript)
- ✅ Es seguro, Firebase está diseñado para esto
- 🛡️ Security Rules de Firebase protegen los datos

### Tokens JWT
- ⏱️ Expiran en 1 hora
- 🔄 Se refrescan automáticamente en el hook
- 🔑 Deben enviarse en header `Authorization: Bearer <token>`

## 📊 Estructura Storage vs Firebase

Storage.ts sigue siendo usado para:
```
✅ database operations (productos, ensayos, cotizaciones)
✅ shopping cart
✅ quotation items
```

Firebase reemplaza a Replit Auth para:
```
❌ Replit Auth (ANTIGUO)
✅ Firebase Authentication (NUEVO)
```

**Storage NO cambió** - sigue manejando la base de datos exactamente igual.

## 🐛 Troubleshooting

### Error: "FIREBASE_SERVICE_ACCOUNT_PATH not found"
```
✅ Solución: Descarga serviceAccountKey.json de Firebase Console
✅ Colócalo en la raíz del proyecto
✅ Reinicia npm run dev
```

### Error: "Invalid or expired token"
```
✅ Solución: El token expiró o es inválido
✅ Limpia localStorage y vuelve a iniciar sesión
✅ Asegúrate que el frontend y backend usan la misma Firebase config
```

### Error: "VITE_FIREBASE_API_KEY is undefined"
```
✅ Solución: Agrega las variables VITE_ a .env
✅ Reinicia npm run dev (vite necesita reescanearlo)
```

### Storage operations fallan después de Firebase
```
✅ Verificación: El user id cambió de claims.sub (Replit) a uid (Firebase)
✅ Solución: Actualiza storage.ts si accede a req.user?.claims?.sub
✅ También actualiza el schema de la tabla users si es necesario
```

## 📚 Archivos de Referencia

- `FIREBASE_SETUP.md` - Guía completa Firebase Console
- `FIREBASE_ROUTES_UPDATE.md` - Cómo actualizar code
- `src/components/FirebaseLogin.example.tsx` - Componente de login listo
- `.env.example` - Variables de environment

## ✅ Checklist Final

- [ ] Proyecto creado en Firebase Console
- [ ] serviceAccountKey.json descargado y en raíz del proyecto
- [ ] serviceAccountKey.json en .gitignore
- [ ] .env actualizado con todas las credenciales
- [ ] npm install ejecutado
- [ ] routes.ts actualizado (importa firebaseAuth)
- [ ] Cambiar req.user?.claims?.sub a req.user?.uid
- [ ] Login component actualizado con useFirebaseAuth
- [ ] API hooks actualizados para pasar token
- [ ] npm run dev funciona sin errores
- [ ] Puedo crear un usuario en login
- [ ] Puedo crear una cotización autenticado

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar Firestore en lugar de PostgreSQL?**
R: No es obligatorio. Laravel mantiene PostgreSQL. Firebase solo reemplaza auth.

**P: ¿Los usuarios antiguos de Replit Auth seguirán funcionando?**
R: No, tendrán que crear nueva cuenta con Firebase. Los datos pueden migrarse.

**P: ¿Cómo migro usuarios de Replit a Firebase?**
R: Necesitarías un script especial. Contáctame si lo necesitas.

**P: ¿Qué pasa si olvido agregar el token?**
R: El middleware retorna 401 Unauthorized. El cliente debe tener el token.

---

**¿Necesitas ayuda?** Lee FIREBASE_SETUP.md o FIREBASE_ROUTES_UPDATE.md
