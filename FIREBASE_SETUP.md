# 🔥 CONFIGURACIÓN DE FIREBASE

## Paso 1: Crear un Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en **"Agregar proyecto"** o **"Create project"**
3. Ingresa el nombre de tu proyecto (ej: `Luminotest-Quotation`)
4. Haz clic en **Continuar**
5. Desactiva Google Analytics (opcional) y haz clic en **Crear proyecto**
6. Espera a que se cree (tardará unos segundos)

## Paso 2: Obtener Credenciales del BACKEND (Firebase Admin SDK)

### 2A: Descargar Service Account Key (Recomendado)

1. Ve a **Settings** (engranaje ⚙️) → **Project settings**
2. Haz clic en la pestaña **Service Accounts**
3. Haz clic en **Generate New Private Key** (Generar nueva clave privada)
4. Se descargará un archivo JSON (ej: `Luminotest-Quotation-firebase-adminsdk-xxxxx.json`)
5. **Renómbralo a `serviceAccountKey.json`** y colócalo **en la raíz del proyecto**
6. Agrega a `.gitignore`:
   ```
   serviceAccountKey.json
   ```

### 2B: Alternativa - Usar Variables de Entorno

Si prefieres no descargcar el archivo, copia los valores del JSON:

1. Abre el JSON descargado
2. En tu `.env`, agrega:
   ```env
   FIREBASE_PROJECT_ID=tu-proyecto-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-clave-privada-aqui\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto-id.iam.gserviceaccount.com
   ```

## Paso 3: Habilitar Authentication (Sign-in Methods)

1. En Firebase Console, ve a **Build** → **Authentication**
2. Haz clic en **Get started**
3. Haz clic en **Sign-in method** (Método de inicio de sesión)
4. Habilita los siguientes proveedores:
   - ✅ **Email/Password** - Requerido
   - ✅ **Google** (Opcional)
   - ✅ **Microsoft** (Opcional)

### Para Email/Password:
- Haz clic en **Email/Password**
- Activa **Enable** (Habilitar)
- Activa **Email link (passwordless sign-in)** (Opcional)
- Haz clic en **Guardar**

### Para Google (Opcional):
- Haz clic en **Google**
- Activa **Enable**
- Si te lo pide, copia el email de tu proyecto Firebase
- Haz clic en **Guardar**

## Paso 4: Obtener Credenciales del FRONTEND (Web App)

1. En Firebase Console, ve a **Settings** (engranaje ⚙️) → **Project settings**
2. Haz clic en **Tu app** o **Web** si aún no la has creado
3. Si no existe, haz clic en **</> Web** para agregar una
4. Copia los valores de `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxx",
  authDomain: "luminotest-xxxxx.firebaseapp.com",
  projectId: "luminotest-xxxxx",
  storageBucket: "luminotest-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghijklmnop"
};
```

## Paso 5: Configurar Variables de Entorno

Actualiza tu archivo `.env` con los valores:

```env
# Backend
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Frontend
VITE_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=luminotest-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=luminotest-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=luminotest-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdefghijklmnop
```

## Paso 6: Instalar Dependencias

```bash
npm install
```

Las dependencias necesarias ya están en `package.json`:
- `firebase` - SDK para el frontend
- `firebase-admin` - SDK para el backend

## Paso 7: Actualizar Tu Página de Login

Usa el hook `useFirebaseAuth` en tu componente de login:

```tsx
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { signIn, signUp } from "@/lib/firebase";

export function LoginPage() {
  const { user, loading, token } = useFirebaseAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      // Tu usuario está autenticado
    } catch (error) {
      console.error("Error de login:", error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (user) return <div>Bienvenido {user.email}</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const email = e.currentTarget.email.value;
      const password = e.currentTarget.password.value;
      handleLogin(email, password);
    }}>
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}
```

## Paso 8: Usar Token en API Requests

El middleware de autenticación espera el token en el header:

```tsx
import { getIdToken } from "@/lib/firebase";

async function createQuotation(data) {
  const token = await getIdToken();
  
  const response = await fetch("/api/quotations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}
```

O usa el hook `useFirebaseAuth` para obtener el token automáticamente:

```tsx
const { token } = useFirebaseAuth();

useEffect(() => {
  if (token) {
    // Usa token en tus requests
  }
}, [token]);
```

## 🔐 Security Rules (Importante)

Ve a **Build** → **Firestore Database** o **Realtime Database** y actualiza las reglas según tu necesidad.

Para desarrollo rápido (⚠️ NO RECOMENDADO EN PRODUCCIÓN):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## ✅ Checklist

- [ ] Proyecto creado en Firebase Console
- [ ] Service Account Key descargado y renombrado a `serviceAccountKey.json`
- [ ] Variables VITE_ agregadas a `.env`
- [ ] Authentication habilitado (Email/Password como mínimo)
- [ ] Web App creada y firebaseConfig obtenido
- [ ] `npm install` ejecutado
- [ ] `.env` actualizado con todos los valores
- [ ] `serviceAccountKey.json` agregado a `.gitignore`
- [ ] Página de login actualizada con Firebase

## 📝 Notas

- **serviceAccountKey.json** contiene credenciales sensibles. **NUNCA** lo subas a GitHub
- Las variables `VITE_*` se exponen en el bundle JavaScript (es normal)
- El backend usa `firebase-admin` para verificar tokens
- El frontend usa `firebase` SDK para autenticación
- Los tokens expiran en 1 hora automáticamente (se refreshan en el hook)

¿Necesitas ayuda? Contacta al equipo de desarrollo.
