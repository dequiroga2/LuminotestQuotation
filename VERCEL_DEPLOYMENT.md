# Guía de Despliegue en Vercel

Este documento explica cómo desplegar la aplicación Luminotest Quote System en Vercel a través de GitHub.

## Requisitos Previos

1. **Cuenta de Vercel**: Crea una cuenta en [vercel.com](https://vercel.com)
2. **Repositorio en GitHub**: Tu código debe estar en un repositorio de GitHub
3. **Base de Datos PostgreSQL**: Necesitas una base de datos PostgreSQL en producción (opciones recomendadas):
   - [Supabase](https://supabase.com) - Gratis para empezar
   - [Neon](https://neon.tech) - Serverless PostgreSQL
   - [Railway](https://railway.app) - Fácil de configurar
   - [Vercel Postgres](https://vercel.com/storage/postgres) - Integrado con Vercel

## Paso 1: Preparar la Base de Datos

### Opción A: Usar Supabase (Recomendado)

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En tu proyecto, ve a `Settings` > `Database`
3. Copia la `Connection String` (modo URI)
4. Ejecuta el script de migración en tu base de datos:
   - Ve a `SQL Editor` en Supabase
   - Ejecuta el contenido de `supabase/migrations/20260208000820_create_quotation_tables.sql`

### Opción B: Usar Neon

1. Ve a [neon.tech](https://neon.tech) y crea un proyecto
2. Copia la connection string de tu proyecto
3. Usa un cliente PostgreSQL para ejecutar el script de migración

## Paso 2: Instalar Dependencias

```bash
npm install
```

## Paso 3: Desplegar en Vercel desde GitHub

### 3.1 Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio de GitHub (`LuminotestQuotation`)
4. Click en **"Import"**

### 3.2 Configurar el Proyecto

En la página de configuración:

- **Framework Preset**: Select "Other"
- **Root Directory**: `./` (dejar por defecto)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 3.3 Configurar Variables de Entorno

Click en **"Environment Variables"** y agrega:

```
DATABASE_URL=tu_connection_string_postgresql
NODE_ENV=production
SESSION_SECRET=genera-una-clave-segura-aleatoria-aqui
```

**IMPORTANTE**: Para `SESSION_SECRET`, genera una cadena aleatoria segura. Puedes usar:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Si usas Replit Auth, también agrega:
```
REPLIT_AUTH_CLIENT_ID=tu_client_id
REPLIT_AUTH_CLIENT_SECRET=tu_client_secret
```

### 3.4 Desplegar

1. Click en **"Deploy"**
2. Espera a que Vercel construya y despliegue tu aplicación (2-5 minutos)
3. Una vez completado, recibirás una URL de producción

## Paso 4: Verificar el Despliegue

1. Visita la URL que Vercel te proporcione (ej: `luminotest-quote-system.vercel.app`)
2. Verifica que:
   - La página principal carga correctamente
   - Puedes iniciar sesión
   - Las funcionalidades principales funcionan

## Paso 5: Configurar Dominio Personalizado (Opcional)

1. En tu proyecto de Vercel, ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

## Despliegue desde la Terminal (Alternativa)

También puedes desplegar usando Vercel CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar a producción
vercel --prod
```

## Actualizaciones Automáticas

Una vez configurado, cada vez que hagas `git push` a tu rama `main`:
- Vercel automáticamente detectará los cambios
- Construirá y desplegará la nueva versión
- En 2-3 minutos tendrás tu app actualizada

## Solución de Problemas

### Error: "DATABASE_URL must be set"

- Verifica que hayas agregado la variable de entorno `DATABASE_URL` en Vercel
- Ve a tu proyecto → Settings → Environment Variables

### Error 500 en producción

- Revisa los logs en Vercel: Tu proyecto → Deployments → Click en el deployment → Functions → View Logs
- Verifica que todas las variables de entorno estén configuradas

### La aplicación no carga

- Verifica que el build se haya completado exitosamente
- Revisa los logs de build en Vercel
- Asegúrate de que `dist/public` contenga los archivos del frontend

### Problemas de Autenticación

- Si usas Replit Auth, considera migrar a otra solución para producción
- Opciones: NextAuth.js, Auth0, Clerk, o Supabase Auth

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Verificar tipos TypeScript
npm run check

# Push de schema a base de datos
npm run db:push
```

## Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel + Node.js](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase Docs](https://supabase.com/docs)

## Notas Importantes

- ⚠️ Vercel usa funciones serverless, no mantiene estado entre requests
- ⚠️ Asegúrate de usar una base de datos externa (no SQLite local)
- ⚠️ Las sesiones de usuario se guardan en la base de datos (via connect-pg-simple)
- ⚠️ Los archivos estáticos se sirven desde `dist/public`
