# 🗄️ Configuración de Base de Datos Supabase

## 📋 Pasos para configurar la base de datos en Supabase

### 1️⃣ Crear cuenta y proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub o Email
4. Crea un nuevo proyecto:
   - **Name**: `luminotest-quotes` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: `South America (São Paulo)` (más cercano a Colombia)
   - **Pricing Plan**: Free (suficiente para desarrollo)

5. Espera 2-3 minutos mientras se crea el proyecto

### 2️⃣ Obtener la URL de conexión

1. En el dashboard de Supabase, ve a **Settings** (⚙️) en la barra lateral
2. Selecciona **Database**
3. Desplázate hasta **Connection string**
4. Copia la URI en modo **URI** (no Transaction)
5. Será algo como:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
6. Reemplaza `[YOUR-PASSWORD]` con la contraseña que creaste

### 3️⃣ Ejecutar el esquema SQL

1. En el dashboard de Supabase, ve a **SQL Editor** en la barra lateral
2. Haz clic en "+ New query"
3. Abre el archivo `database/schema.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en **Run** (o presiona `Ctrl/Cmd + Enter`)
7. Verifica que todos los comandos se ejecutaron correctamente (✓ Success)

### 4️⃣ Configurar variables de entorno

1. En la raíz del proyecto, crea un archivo `.env`:
   ```bash
   # Copia desde .env.example si existe
   cp .env.example .env
   ```

2. Edita el archivo `.env` y agrega:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Session (genera un string aleatorio seguro)
   SESSION_SECRET=genera-un-string-aleatorio-muy-largo-y-seguro-aqui
   
   # Replit Auth (opcional - solo si usas Replit)
   REPL_ID=tu-repl-id
   ISSUER_URL=https://replit.com/oidc
   ```

3. Para generar un `SESSION_SECRET` seguro, puedes usar:
   ```bash
   # En PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

### 5️⃣ Inicializar la base de datos (opcional)

Si prefieres usar Drizzle para gestionar las migraciones:

```bash
# Generar migraciones
npm run db:push
```

### 6️⃣ Verificar la conexión

```bash
# Reinicia el servidor
npm run dev
```

Deberías ver en la consola:
```
✓ Database connected successfully
✓ Seeding database... (si es la primera vez)
serving on port 5000
```

## 🔍 Verificar que todo funciona

1. Ve a Supabase → **Table Editor**
2. Deberías ver las siguientes tablas:
   - ✅ users
   - ✅ sessions
   - ✅ products (con 44 productos)
   - ✅ essays (con 27 ensayos)
   - ✅ quotations
   - ✅ quotation_items

## 🚨 Troubleshooting

### Error: "connect ECONNREFUSED"
- Verifica que la `DATABASE_URL` esté correcta
- Asegúrate de reemplazar `[YOUR-PASSWORD]` con tu contraseña real
- Revisa que no haya espacios al inicio/final de la URL

### Error: "SSL connection required"
- Agrega `?sslmode=require` al final de tu DATABASE_URL:
  ```
  DATABASE_URL=postgresql://...postgres?sslmode=require
  ```

### Error: "password authentication failed"
- Verifica tu contraseña en Supabase → Settings → Database → Reset Password

### No aparecen los datos seedeados
- El script SQL ya incluye los datos iniciales
- Si usaste `npm run db:push`, ejecuta el SQL manualmente en Supabase

## 📚 Recursos adicionales

- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

## ✅ ¡Listo!

Una vez completados estos pasos, tu base de datos estará lista para usar con el sistema de cotizaciones LUMINOTEST.
