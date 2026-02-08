# 💡 LUMINOTEST - Sistema de Cotizaciones

Sistema web para gestionar cotizaciones de laboratorio para ensayos RETILAP, RETIE y productos eléctricos.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Base de Datos

**⚠️ IMPORTANTE**: Este proyecto requiere PostgreSQL. Se recomienda usar Supabase.

#### Opción A: Usar Supabase (Recomendado)
1. Lee la guía completa en [database/README.md](database/README.md)
2. Crea una cuenta gratis en [supabase.com](https://supabase.com)
3. Ejecuta el script SQL de [database/schema.sql](database/schema.sql)
4. Obtén tu `DATABASE_URL` de Supabase

#### Opción B: PostgreSQL Local
```bash
# Instala PostgreSQL localmente
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Tu DATABASE_URL será algo como:
# postgresql://postgres:password@localhost:5432/luminotest
```

### 3. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y agrega:
# - DATABASE_URL (obligatorio)
# - SESSION_SECRET (obligatorio)
```

### 4. Iniciar el Proyecto

```bash
npm run dev
```

Abre [http://localhost:5000](http://localhost:5000)

## 📁 Estructura del Proyecto

```
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── pages/      # Páginas (Landing, Login, Dashboard, etc.)
│   │   ├── components/ # Componentes UI reutilizables
│   │   └── hooks/      # React hooks personalizados
├── server/              # Backend Express
│   ├── routes.ts       # Definición de rutas API
│   ├── storage.ts      # Capa de acceso a datos
│   └── db.ts           # Configuración de base de datos
├── shared/              # Código compartido
│   ├── schema.ts       # Esquemas de base de datos (Drizzle ORM)
│   └── routes.ts       # Definición de rutas compartidas
└── database/            # Scripts y documentación de BD
    ├── schema.sql      # Script SQL para crear tablas
    └── README.md       # Guía detallada de configuración
```

## 🎨 Stack Tecnológico

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Drizzle ORM)
- **Build**: Vite, esbuild
- **Auth**: Sistema de login personalizado (desarrollo) + Replit Auth (producción)

## 📖 Documentación Adicional

- [Configuración de Base de Datos](database/README.md)
- [Requisitos del Cliente](client/requirements.md)

## 🐛 Troubleshooting

### Error: "DATABASE_URL must be set"
→ Asegúrate de tener el archivo `.env` con `DATABASE_URL` configurado

### Error: "connect ECONNREFUSED"
→ Verifica que tu base de datos PostgreSQL esté corriendo

### Error: "listen EADDRINUSE"
→ El puerto 5000 está ocupado. Cierra otros procesos o cambia el `PORT` en `.env`

## 📝 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Compilar para producción
npm run start    # Iniciar en producción
npm run check    # Verificar tipos TypeScript
npm run db:push  # Sincronizar esquema con BD (Drizzle)
```

## 👨‍💻 Desarrollo

El proyecto usa hot-reload tanto en frontend como backend. Los cambios se reflejan automáticamente.

---

**LUMINOTEST SAS** - Sistema de Cotizaciones © 2026
