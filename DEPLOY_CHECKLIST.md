# ✅ Checklist de Despliegue en Vercel

Usa esta lista para asegurarte de que todo esté listo antes de desplegar.

## Antes de Desplegar

### 1. Base de Datos PostgreSQL ✓
- [ ] He creado una base de datos PostgreSQL en producción (Supabase/Neon/Railway)
- [ ] He ejecutado el script de migración `supabase/migrations/20260208000820_create_quotation_tables.sql`
- [ ] Tengo mi `DATABASE_URL` lista

### 2. Variables de Entorno ✓
- [ ] `DATABASE_URL` - Connection string de PostgreSQL
- [ ] `SESSION_SECRET` - Clave secreta aleatoria (32+ caracteres)
- [ ] `NODE_ENV=production`

### 3. Código Actualizado ✓
- [ ] He hecho commit de todos los cambios
- [ ] He hecho push a GitHub
- [ ] No tengo archivos sensibles (.env) en el repositorio

### 4. Instalación de Dependencias ✓
```bash
npm install
```

### 5. Build Local (Opcional pero recomendado) ✓
```bash
npm run build
```
Si el build falla localmente, también fallará en Vercel.

## Durante el Despliegue en Vercel

### 1. Conectar GitHub ✓
- [ ] He iniciado sesión en vercel.com
- [ ] He importado mi repositorio de GitHub

### 2. Configuración del Proyecto ✓
- [ ] Framework Preset: "Other"
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist/public`
- [ ] Install Command: `npm install`

### 3. Variables de Entorno en Vercel ✓
- [ ] He agregado `DATABASE_URL`
- [ ] He agregado `SESSION_SECRET`
- [ ] He agregado `NODE_ENV=production`

### 4. Despliegue ✓
- [ ] He clickeado "Deploy"
- [ ] He esperado a que termine el build (2-5 min)

## Después del Despliegue

### 1. Verificación ✓
- [ ] La página principal carga sin errores
- [ ] Puedo navegar por la aplicación
- [ ] El login funciona
- [ ] Puedo crear cotizaciones
- [ ] Los productos y ensayos se cargan correctamente

### 2. Logs y Monitoreo ✓
- [ ] He revisado los logs en Vercel (Deployments → Functions → Logs)
- [ ] No hay errores críticos en los logs

### 3. Dominio (Opcional) ✓
- [ ] He configurado un dominio personalizado
- [ ] El dominio está funcionando correctamente

## Solución Rápida de Problemas

### ❌ Error: "DATABASE_URL must be set"
**Solución**: Agrega la variable de entorno en Vercel → Settings → Environment Variables → Redeploy

### ❌ Error 500 / Internal Server Error
**Solución**: Revisa los logs en Vercel → Deployments → Tu deployment → Functions → View Logs

### ❌ Build Failed
**Solución**: 
1. Revisa el log de build en Vercel
2. Intenta `npm run build` localmente
3. Verifica que todas las dependencias estén en package.json

### ❌ La app no carga / Página en blanco
**Solución**:
1. Verifica que `dist/public` se haya generado correctamente
2. Revisa los logs del navegador (F12 → Console)
3. Verifica que el Output Directory en Vercel sea `dist/public`

## Comandos Útiles

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar desde terminal
vercel --prod

# Ver logs en tiempo real
vercel logs [deployment-url]

# Ver información del proyecto
vercel inspect [deployment-url]
```

## Recursos

- 📖 [Guía Completa de Despliegue](VERCEL_DEPLOYMENT.md)
- 🌐 [Documentación de Vercel](https://vercel.com/docs)
- 🗄️ [Guía de Base de Datos](database/README.md)
- 📘 [README Principal](README.md)

---

**¿Todo listo?** 🎉 ¡Es hora de desplegar! Ve a [vercel.com](https://vercel.com) y sigue los pasos.
