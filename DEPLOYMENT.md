# 🚀 Guía de Deployment en Vercel

## 📋 Pre-requisitos

Antes de desplegar, asegúrate de tener:

1. ✅ **Cuenta de GitHub** con tu repositorio actualizado
2. ✅ **Cuenta de Vercel** ([vercel.com](https://vercel.com))
3. ✅ **Base de datos Supabase** funcionando
4. ✅ **Proyecto Firebase** con Authentication habilitado
5. ✅ **serviceAccountKey.json** descargado de Firebase

---

## 🔐 Paso 1: Preparar Variables de Entorno

### 1.1 Obtener el Service Account Key como JSON string

En tu computadora local, ejecuta:

```bash
# En PowerShell (Windows)
Get-Content .\serviceAccountKey.json -Raw | Set-Clipboard

# O en terminal (Linux/Mac)
cat serviceAccountKey.json | pbcopy
```

Esto copia todo el contenido del archivo en tu portapapeles como un string.

### 1.2 Lista de Variables para Vercel

Necesitas configurar estas variables en Vercel:

| Variable | Ejemplo | Dónde obtenerla |
|----------|---------|-----------------|
| `DATABASE_URL` | `postgresql://postgres.xxx:pass@...pooler.supabase.com:6543/postgres` | Supabase → Settings → Database → Connection Pooling |
| `VITE_FIREBASE_API_KEY` | `AIzaSyBC3gfq...` | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_AUTH_DOMAIN` | `luminotest-quotation.firebaseapp.com` | Firebase Console → Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | `luminotest-quotation` | Firebase Console → Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | `luminotest-quotation.appspot.com` | Firebase Console → Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase Console → Project Settings |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abc123` | Firebase Console → Project Settings |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | `{"type":"service_account",...}` | Contenido completo de `serviceAccountKey.json` como string |
| `NODE_ENV` | `production` | Dejar como está |

---

## 📤 Paso 2: Subir Cambios a GitHub

```bash
# Verifica que serviceAccountKey.json NO esté en git
git status

# Agrega todos los cambios
git add .

# Commit
git commit -m "feat: Integración Firebase Auth + Supabase lista para producción"

# Push a GitHub
git push origin main
```

**⚠️ IMPORTANTE:** Verifica que `serviceAccountKey.json` aparezca en `.gitignore` y NO se suba a GitHub.

---

## 🌐 Paso 3: Conectar Vercel con GitHub

### 3.1 Importar Proyecto

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Git Repository"**
3. Selecciona tu repositorio: `dequiroga2/LuminotestQuotation`
4. Click **"Import"**

### 3.2 Configurar Build Settings

Vercel debería detectar automáticamente:
- **Framework Preset:** None / Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist/public`
- **Install Command:** `npm install`

✅ **No cambies nada si ya está así**.

### 3.3 Agregar Variables de Entorno

**ANTES de hacer el primer deploy:**

1. En la pantalla de configuración, busca **"Environment Variables"**
2. Agrega **TODAS** las variables de la tabla anterior una por una:
   - Click **"Add New"**
   - Nombre: `DATABASE_URL`
   - Value: Tu connection string de Supabase
   - Environment: **Production** (y opcionalmente Preview/Development)
   - Repite para TODAS las variables

**🔥 Paso CRÍTICO:** Para `FIREBASE_SERVICE_ACCOUNT_KEY`:
- Pega el **contenido COMPLETO** del JSON que copiaste
- Debe ser una sola línea, sin saltos de línea
- Ejemplo: `{"type":"service_account","project_id":"luminotest-quotation",...}`

### 3.4 Deploy

1. Click **"Deploy"**
2. Espera 2-5 minutos
3. ✅ Si todo sale bien, verás: **"Your project is ready"**

---

## 🔍 Paso 4: Verificar Deployment

### 4.1 Verificar que la app cargue

Visita la URL que Vercel te dio (ej: `luminotest-quote-system.vercel.app`)

### 4.2 Probar Login

1. Ve a la página de login
2. Intenta iniciar sesión con un usuario de Firebase
3. Verifica que te redirija al Dashboard

### 4.3 Revisar Logs (si algo falla)

1. En Vercel, ve a tu proyecto
2. Click en **"Deployments"**
3. Click en el deployment más reciente
4. Ve a la pestaña **"Functions"** → **"api/index"**
5. Revisa los logs para ver errores

---

## 🐛 Troubleshooting

### Error: "Firebase Admin SDK not initialized"

**Causa:** La variable `FIREBASE_SERVICE_ACCOUNT_KEY` no está configurada o está mal formateada.

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que `FIREBASE_SERVICE_ACCOUNT_KEY` existe
3. El valor debe ser un JSON válido en UNA sola línea
4. Redeploy: Vercel → Deployments → Options → Redeploy

### Error: "Database connection failed"

**Causa:** La `DATABASE_URL` es incorrecta o Supabase está bloqueando conexiones.

**Solución:**
1. Ve a Supabase → Settings → Database
2. Copia la **Connection Pooling** URL (Transaction mode)
3. Actualiza `DATABASE_URL` en Vercel
4. Redeploy

### Error: "Firebase user ID not provided"

**Causa:** El frontend no está enviando el JWT token en las peticiones.

**Solución:**
1. Verifica que todas las variables `VITE_FIREBASE_*` estén configuradas en Vercel
2. Redeploy para que el frontend se reconstruya con las variables
3. Limpia caché del navegador (Ctrl+Shift+R)

### Las variables no se actualizan

**Solución:**
Después de cambiar variables en Vercel:
1. Ve a **Deployments**
2. Click en el último deployment
3. Click **"..."** → **"Redeploy"**
4. Marca **"Use existing Build Cache"** como OFF
5. Click **"Redeploy"**

---

## ✅ Checklist Final

Antes de considerar el deployment exitoso:

- [ ] La página principal carga sin errores
- [ ] El login funciona con usuarios de Firebase
- [ ] El Dashboard muestra las opciones (Reglamento, Producto, Ensayo)
- [ ] Se pueden agregar items al carrito
- [ ] El carrito persiste al refrescar la página
- [ ] Se pueden crear cotizaciones
- [ ] Los logs de Vercel no muestran errores críticos

---

## 🔄 Deployments Automáticos

Una vez configurado, cada push a `main` en GitHub activará un deployment automático en Vercel.

Para hacer cambios:

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```

Vercel detectará el cambio y desplegará automáticamente en 2-5 minutos.

---

## 🎯 Dominio Personalizado (Opcional)

Para usar tu propio dominio:

1. Ve a Vercel → Settings → Domains
2. Click **"Add Domain"**
3. Ingresa tu dominio (ej: `quotes.luminotest.com`)
4. Sigue las instrucciones para configurar DNS

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel → Deployments → Functions → api/index
2. Verifica las variables de entorno en Vercel → Settings → Environment Variables
3. Comprueba que Firebase y Supabase estén funcionando

---

**¡Listo!** 🎉 Tu aplicación está en producción.
