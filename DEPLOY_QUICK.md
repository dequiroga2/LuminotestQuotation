# 🚀 DEPLOYMENT - PASOS RÁPIDOS

## ✅ Archivos Preparados

- ✅ `vercel.json` - Configuración optimizada (3GB RAM, 30s timeout)
- ✅ `api/index.ts` - Serverless function actualizada
- ✅ `script/build.mjs` - Incluye firebase-admin en bundle
- ✅ `server/firebase-admin.ts` - Soporta FIREBASE_SERVICE_ACCOUNT_KEY
- ✅ `.env.vercel` - Template de variables
- ✅ `DEPLOYMENT.md` - Guía completa paso a paso
- ✅ `.gitignore` - serviceAccountKey.json excluido

---

## 📦 PASO 1: Preparar Service Account Key

```powershell
# Copia el contenido del archivo como string
Get-Content .\serviceAccountKey.json -Raw | Set-Clipboard
```

Ahora tienes el JSON completo en tu portapapeles.

---

## 🔗 PASO 2: Subir a GitHub

```bash
# Verifica que serviceAccountKey.json NO esté incluido
git status

# Si aparece, agrégalo a .gitignore:
echo "serviceAccountKey.json" >> .gitignore

# Subir cambios
git add .
git commit -m "feat: Configuración Vercel lista - Firebase + Supabase"
git push origin main
```

---

## 🌐 PASO 3: Deploy en Vercel

1. **Ir a Vercel:**
   - [vercel.com/new](https://vercel.com/new)

2. **Importar repositorio:**
   - Selecciona `dequiroga2/LuminotestQuotation`
   - Click "Import"

3. **Configurar variables (ANTES de deploy):**

   Agrega estas 9 variables en "Environment Variables":

   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | Tu connection string de Supabase |
   | `VITE_FIREBASE_API_KEY` | De Firebase Console |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `tu-proyecto.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `tu-proyecto` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `tu-proyecto.appspot.com` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | De Firebase Console |
   | `VITE_FIREBASE_APP_ID` | De Firebase Console |
   | **`FIREBASE_SERVICE_ACCOUNT_KEY`** | **Pega el JSON que copiaste** |
   | `NODE_ENV` | `production` |

4. **Deploy:**
   - Click "Deploy"
   - Espera 3-5 minutos

---

## 🧪 PASO 4: Probar

1. Visita tu URL de Vercel
2. Prueba hacer login
3. Verifica que el carrito funcione
4. Crea una cotización de prueba

---

## 🐛 Si algo falla:

### Ver logs en Vercel:
1. Deployments → Click en el último
2. Functions → api/index
3. Busca errores en rojo

### Variables no funcionan:
1. Settings → Environment Variables
2. Verifica que todas estén presentes
3. Redeploy: Deployments → ... → Redeploy (sin cache)

---

## 📚 Guía Completa

Para más detalles, revisa: **`DEPLOYMENT.md`**

---

**¡Listo para producción!** 🎉
