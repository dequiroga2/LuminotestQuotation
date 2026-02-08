# 📖 Guía Paso a Paso: Ejecutar Actualización en Supabase

## Opción Recomendada: Usar el Script SQL Automatizado

### Paso 1: Abre tu Proyecto en Supabase

1. Ve a https://app.supabase.com
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto "Luminotest-Quote-System"

### Paso 2: Abre el SQL Editor

En el panel izquierdo, busca y haz clic en:
```
SQL Editor
```

### Paso 3: Crea una Nueva Consulta

- Haz clic en el botón "+" o "New Query"
- Se abrirá un editor SQL en blanco

### Paso 4: Copia el Script SQL

En tu computadora:
1. Abre el archivo: `SUPABASE_UPDATE.sql`
2. Selecciona TODO el contenido (Ctrl+A)
3. Cópialo (Ctrl+C)

### Paso 5: Pega en Supabase

En Supabase:
1. Haz clic en el editor en blanco
2. Pega el contenido (Ctrl+V)

El editor debe verse así:

```sql
-- ===============================================
-- SCRIPT PARA ACTUALIZAR SUPABASE
-- ===============================================
...
CREATE TABLE IF NOT EXISTS public.product_essays (
  ...
)
...
```

### Paso 6: Ejecuta el Script

Botones a buscar (varían según versión de Supabase):
- **"Run"** (Azul)
- **"Execute"** 
- **"Ejecutar"** (Si está en español)

O usa el atajo: `Ctrl+Enter`

### Paso 7: Espera a que Termine

Verás mensajes como:
```
✓ CREATE TABLE
✓ ALTER TABLE
✓ UPDATE (44 rows)
✓ INSERT (1188 rows)
✓ CREATE INDEX
```

Si todo es verde, ¡significa que funcionó! ✅

### Paso 8: Verifica que Todo se Creó Correctamente

En el mismo editor, ejecuta estas consultas de verificación:

```sql
-- Ver 10 primeros productos con sus títulos
SELECT id, name, titulo FROM public.products LIMIT 10;
```

Resultado esperado:
```
id  | name                           | titulo
----|--------------------------------|------
1   | Aisladores en resina tipo...   | Título 4...
2   | Alfombras y / o tapetes...     | Título 5...
3   | Balasto Lámparas...            | Título 10...
...
```

```sql
-- Contar cuántas relaciones producto-ensayo se crearon
SELECT COUNT(*) as total FROM public.product_essays;
```

Resultado esperado:
```
total
-----
1188
```

```sql
-- Ver ensayos disponibles para el producto ID 1
SELECT e.name
FROM public.product_essays pe
JOIN public.essays e ON pe.essay_id = e.id
WHERE pe.product_id = 1;
```

Resultado esperado:
```
name
-----|-------
Adhesión por el método de cinta
Análisis dimensional
Aumento de temperatura
...
```

---

## Troubleshooting

### Error: "relation 'product_essays' does not exist"
**Causa**: La tabla no se creó
**Solución**: Vuelve al Paso 2 y ejecuta el script completo

### Error: "duplicate key value violates unique constraint"
**Causa**: Ya existe relación producto-ensayo
**Solución**: Es normal, el script usa `ON CONFLICT DO NOTHING`

### Los productos no tienen título
**Causa**: Los UPDATE no se ejecutaron
**Solución**: Ejecuta manualmente:
```sql
UPDATE public.products SET 
  titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos'
WHERE titulo IS NULL;
```

### Error de permisos
**Causa**: Tu usuario no tiene permisos en Supabase
**Solución**: Verifica que eres administrador del proyecto

---

## Alternativa: Ejecutar Paso por Paso (Si algo falla)

Si prefieres ejecutar cada sección por separado:

### 1. Crear tabla product_essays

```sql
CREATE TABLE IF NOT EXISTS public.product_essays (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  essay_id INTEGER NOT NULL REFERENCES public.essays(id) ON DELETE CASCADE,
  UNIQUE(product_id, essay_id)
);
```

### 2. Agregar columna titulo

```sql
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS titulo TEXT;
```

### 3. Actualizar productos con títulos

```sql
UPDATE public.products SET is_retilap = true WHERE is_retilap IS NULL;

UPDATE public.products SET
  titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos'
WHERE titulo IS NULL;

UPDATE public.products SET titulo = 'Título 3 - Fuentes Luminosas'
WHERE id % 4 = 0 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE public.products SET titulo = 'Título 4 - Luminarias para Espacios Interiores'
WHERE id % 4 = 1 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE public.products SET titulo = 'Título 5 - Productos de Iluminación para Espacios Exteriores'
WHERE id % 4 = 2 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';
```

### 4. Crear relaciones

```sql
INSERT INTO public.product_essays (product_id, essay_id) 
SELECT DISTINCT p.id, e.id 
FROM public.products p, public.essays e
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_essays pe 
  WHERE pe.product_id = p.id AND pe.essay_id = e.id
)
ON CONFLICT DO NOTHING;
```

### 5. Crear índices

```sql
CREATE INDEX IF NOT EXISTS idx_product_essays_product_id 
ON public.product_essays(product_id);

CREATE INDEX IF NOT EXISTS idx_product_essays_essay_id 
ON public.product_essays(essay_id);
```

---

## Confirmación Final

Una vez que todo está listo:

1. ✅ El servidor está corriendo (`npm run dev`)
2. ✅ Base de datos tiene `product_essays`
3. ✅ Productos tienen `titulo` asignado
4. ✅ 1188 relaciones creadas
5. ✅ Puedes ir a http://localhost:5173/reglamento

**¡Listo para usar!** 🎉

