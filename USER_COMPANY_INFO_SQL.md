# SQL para Agregar Información de Empresa

Ejecuta en el **SQL Editor de Supabase**:

```sql
-- Agregar columnas de información de empresa/usuario
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS organizacion VARCHAR,
ADD COLUMN IF NOT EXISTS direccion VARCHAR,
ADD COLUMN IF NOT EXISTS telefono VARCHAR,
ADD COLUMN IF NOT EXISTS ciudad VARCHAR,
ADD COLUMN IF NOT EXISTS moneda VARCHAR,
ADD COLUMN IF NOT EXISTS symbol VARCHAR;
```

## Campos agregados:
- **organizacion**: Nombre de la empresa
- **direccion**: Dirección de la empresa
- **telefono**: Teléfono de contacto
- **ciudad**: Ciudad
- **moneda**: Tipo de moneda (ej: "COP", "USD")
- **symbol**: Símbolo de moneda (ej: "$", "€")
