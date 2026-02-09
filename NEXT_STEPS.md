# 🚀 PRÓXIMOS PASOS - CHECKLIST RÁPIDO

## 1️⃣ CONFIGURACIÓN DE FIREBASE CONSOLE (5-10 mins)

- [ ] Ve a https://console.firebase.google.com
- [ ] Crea nuevo proyecto (ej: "Luminotest-Quotation")
- [ ] Ve a Build → Authentication
- [ ] Habilita Email/Password
- [ ] Habilita Google (opcional)
- [ ] Ve a Settings → Service Accounts
- [ ] Descarga private key JSON
- [ ] Renombralo a `serviceAccountKey.json`
- [ ] Colócalo en la RAÍZ del proyecto
- [ ] Ve a Settings → Project Settings → Tu app
- [ ] Copia la configuración web (firebaseConfig)

**Tiempo total:** ~10 minutos

**Resultado esperado:**
- `serviceAccountKey.json` + en raíz + en .gitignore
- 6 valores `VITE_FIREBASE_*` obtenidos

---

## 2️⃣ ACTUALIZAR .ENV (2 mins)

```bash
# En la raíz del proyecto:
cp .env.example .env
# O si tienes .env existente, agrega estas líneas:
```

```env
# Backend (Firebase Admin SDK)
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Frontend (React)
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:xxxxx
```

---

## 3️⃣ INSTALAR DEPENDENCIAS (2 mins)

```bash
npm install
```

✅ `firebase` y `firebase-admin` se instalarán automáticamente

---

## 4️⃣ ACTUALIZAR ROUTES.TS (10-15 mins)

**Archivo:** `server/routes.ts`

### Paso A: Reemplazar importaciones

```typescript
// ❌ BORRAR estas líneas:
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

// ✅ AGREGAR estas líneas:
import { firebaseAuth, isAuthenticated } from "./firebase-middleware";
```

### Paso B: Remover configuración de Replit Auth

```typescript
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ❌ BORRAR estas líneas:
  // await setupAuth(app);
  // registerAuthRoutes(app);

  // ✅ El middleware de Firebase se aplica en index.ts
  
  // El resto del código sigue igual...
}
```

### Paso C: Actualizar acceso a userId (IMPORTANTE)

**Busca todas las ocurrencias de:**
```typescript
const userId = req.user?.claims?.sub || 'dev-user';
```

**Y reemplázalas por:**
```typescript
const userId = req.user?.uid || 'dev-user';
```

**Búsqueda rápida en VS Code:**
- Presiona `Ctrl+H` (Find and Replace)
- Buscar: `req.user?.claims?.sub`
- Reemplazar: `req.user?.uid`
- Click en "Replace All"

---

## 5️⃣ ACTUALIZAR INDEX.TS (5 mins)

**Archivo:** `server/index.ts`

Después de configurar los parsers JSON, agrega el middleware de Firebase:

```typescript
import { firebaseAuth } from "./firebase-middleware";

// ... después de app.use(express.json()) y app.use(express.urlencoded())

app.use(firebaseAuth); // ← AGREGAR ESTA LÍNEA
```

---

## 6️⃣ ACTUALIZAR COMPONENTE DE LOGIN (15-30 mins)

Opción A: Usa el componente de ejemplo
```typescript
// En el archivo de tu página de Login:
import { FirebaseLoginComponent } from "@/components/FirebaseLogin.example.tsx";

export function LoginPage() {
  return <FirebaseLoginComponent />;
}
```

Opción B: Integra Firebase en tu componente actual
```typescript
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { signIn, signUp } from "@/lib/firebase";

export function LoginPage() {
  const { user, loading, token } = useFirebaseAuth();
  
  // Si tienes email/password form:
  const handleSubmit = async (email: string, password: string) => {
    await signIn(email, password);
    // Tu usuario está autenticado
  };
}
```

---

## 7️⃣ ACTUALIZAR API CALLS (15-20 mins)

En todos tus hooks (use-products.ts, use-quotations.ts, etc):

```typescript
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

export function useProducts() {
  const { token } = useFirebaseAuth();
  
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(api.products.list.path, {
        headers: {
          "Authorization": `Bearer ${token}`  // ← AGREGAR ESTO
        }
      });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
    enabled: !!token  // ← AGREGAR ESTO (solo cuando hay token)
  });
}
```

**Busca:**
- `use-products.ts`
- `use-essays.ts`
- `use-quotations.ts`
- `use-persistent-cart.ts`
- Cualquier hook que haga fetch a `/api/*`

**Patrón para todos:**
```typescript
// 1. Importa el hook
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

// 2. Usa el hook
const { token } = useFirebaseAuth();

// 3. Agrega header Authorization
fetch(url, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

// 4. Desactiva query si no hay token
enabled: !!token
```

---

## 8️⃣ PRUEBA (5-10 mins)

```bash
# Terminal 1
npm run dev

# Abre http://localhost:5173
# 1. Intenta crear una cuenta con email/password
# 2. Intenta iniciar sesión 
# 3. Intenta crear una cotización
# 4. Verifica que la cotización se guardó en BD
```

**Errores esperados que podrías encontrar:**

| Error | Solución |
|-------|----------|
| `VITE_FIREBASE_API_KEY undefined` | Reinicia con `npm run dev` |
| `Cannot find serviceAccountKey.json` | Descargalo de Firebase Console |
| `501 Unauthorized` | El token no se está enviando en headers |
| `Firebase not initialized` | Verifica .env variables |

---

## 📋 RESUMEN DE CAMBIOS

```
ANTES (Replit Auth):
┌──────────────────────────────────────┐
│ User logs in with Replit Auth        │
│ Gets session cookie (httpOnly)       │
│ Routes use req.user.claims.sub       │
└──────────────────────────────────────┘

DESPUÉS (Firebase):
┌──────────────────────────────────────┐
│ User logs in with Firebase           │
│ Gets JWT token (en localStorage)     │
│ Routes extraen token del header      │
│ Middleware valida con Firebase Admin │
│ Routes usan req.user.uid             │
└──────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINAL

- [ ] **Firebase Console:** Proyecto creado, Auth habilitado
- [ ] **Credenciales:** serviceAccountKey.json en raíz + .env actualizado
- [ ] **Dependencias:** `npm install` ejecutado
- [ ] **Backend:** routes.ts actualizado, claims.sub → uid
- [ ] **Backend:** index.ts actualiza con firebaseAuth middleware
- [ ] **Frontend:** useFirebaseAuth Hook entendido
- [ ] **Login:** Componente de login actualizado
- [ ] **API Calls:** Todos los hooks tienen header Authorization
- [ ] **Test:** npm run dev sin errores
- [ ] **Test:** Puedo registrarme
- [ ] **Test:** Puedo iniciar sesión
- [ ] **Test:** Puedo crear cotización
- [ ] **Test:** Puedo ver carrito

---

## 📖 DOCUMENTACIÓN DISPONIBLE

| Archivo | Contenido |
|---------|-----------|
| `FIREBASE_SETUP.md` | Guía detallada Firebase Console |
| `FIREBASE_IMPLEMENTATION_SUMMARY.md` | Qué se hizo y cómo completarlo |
| `FIREBASE_ROUTES_UPDATE.md` | Cómo actualizar routes.ts |
| `STORAGE_ANALYSIS.md` | Análisis de storage.ts actual |
| `FIREBASE_LOGIN.example.tsx` | Componente de login listo |

---

## ❓ DUDAS TÍPICAS

**P: ¿Cuánto tiempo tarda todo esto?**
R: 45-60 minutos total (Firebase setup: 10, código: 35-45, testing: 5-10)

**P: ¿Puedo hacerlo en partes?**
R: Sí, pero debe estar todo para que funcione. Recomiendo todo de una.

**P: ¿Qué pasa si me equivoco?**
R: Siempre puedes volver atrás (git) o crear otro proyecto Firebase.

**P: ¿Los datos antiguos se perderán?**
R: No si hacemos migración de usuarios. Contacta si lo necesitas.

**P: ¿Necesito hacer algo más?**
R: Después de esto, solo asegura que tus tests funcionen.

---

**¿Listo para empezar?** 🚀

Siguiente paso → Ir a Firebase Console y crear proyecto
