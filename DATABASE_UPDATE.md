# Actualización de Base de Datos - Sistema Mejorado de Cotizaciones por Reglamento

## Cambios Realizados

### 1. **Nueva Tabla: product_essays**
Relación muchos-a-muchos entre productos y ensayos. Cada producto puede tener múltiples ensayos asociados.

```sql
CREATE TABLE product_essays (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  essay_id INTEGER NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  UNIQUE(product_id, essay_id)
);
```

### 2. **Nuevo Campo: products.titulo**
Agrupa productos por los 9 títulos del RETILAP según lo especificado en la RETILAP.

```sql
ALTER TABLE products ADD COLUMN titulo TEXT;
```

### 3. **Datos Seed Actualizados**
- Los 44 productos se distribuyen entre:
  - Título 3 - Fuentes Luminosas (id % 4 = 0)
  - Título 4 - Luminarias para Espacios Interiores (id % 4 = 1)
  - Título 5 - Productos de Iluminación para Espacios Exteriores (id % 4 = 2)
  - Título 10 - Accesorios Eléctricos y Electrónicos (id % 4 = 3)

- Los 27 ensayos se relacionan con todos los productos
  - Cada producto tiene acceso a todos los ensayos disponibles
  - En producción, esto debería ser más granular según los requisitos reales

## Cómo Ejecutar la Actualización en Supabase

### Opción 1: Ejecutar el schema.sql completo
1. Ve a Supabase Dashboard → Tu Proyecto
2. Abre el SQL Editor
3. Copia el contenido de `database/schema.sql`
4. Pega en el editor y ejecuta
5. **Nota**: Si ya tienes datos, esto puede tener conflictos. Considera usar la Opción 2.

### Opción 2: Ejecutar solo los cambios nuevos (Recomendado)

```sql
-- 1. Crear tabla product_essays
CREATE TABLE IF NOT EXISTS product_essays (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  essay_id INTEGER NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  UNIQUE(product_id, essay_id)
);

-- 2. Agregar columna titulo a products
ALTER TABLE products ADD COLUMN IF NOT EXISTS titulo TEXT;

-- 3. Actualizar productos existentes con títulos
UPDATE products SET
  titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos',
  is_retilap = true
WHERE titulo IS NULL;

UPDATE products SET titulo = 'Título 3 - Fuentes Luminosas'
WHERE id % 4 = 0 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE products SET titulo = 'Título 4 - Luminarias para Espacios Interiores'
WHERE id % 4 = 1 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE products SET titulo = 'Título 5 - Productos de Iluminación para Espacios Exteriores'
WHERE id % 4 = 2 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

-- 4. Crear relaciones sistema producto-ensayo
INSERT INTO product_essays (product_id, essay_id) 
SELECT DISTINCT p.id, e.id 
FROM products p, essays e
WHERE NOT EXISTS (
  SELECT 1 FROM product_essays pe 
  WHERE pe.product_id = p.id AND pe.essay_id = e.id
)
ON CONFLICT DO NOTHING;

-- 5. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_product_essays_product_id ON product_essays(product_id);
CREATE INDEX IF NOT EXISTS idx_product_essays_essay_id ON product_essays(essay_id);
```

## Nuevas Características Frontend

### 1. **Flujo Mejorado de Cotización por Reglamento**
- **Paso 1**: Seleccionar Normativa (RETILAP/RETIE/OTROS)
- **Paso 2**: Elegir método (Por Reglamento o Por Producto)
- **Paso 3**: Seleccionar Título (solo en mode "Por Reglamento") - 9 opciones
- **Paso 4**: Seleccionar Producto (filtrado por título si aplica)
- **Paso 5**: Seleccionar Ensayos (solo los disponibles para ese producto)

### 2. **Carrito de Compra (Marketplace)**
- Panel lateral que muestra todos los artículos seleccionados
- Contador de ensayos totales
- Capacidad de agregar múltiples productos
- Cada producto con sus ensayos específicos
- Botones para limpiar carrito o solicitar cotización

### 3. **Mejoras de UX**
- Ensayos con fondo opaco para mejor legibilidad
- Filtrado de productos por título
- Buscador de productos
- Navigación fluida entre pasos
- Animaciones de transición

## API Endpoints Actualizados

### GET /api/products
**Query params:**
- `regulationType`: "RETILAP" | "RETIE" | "OTROS" (opcional)
- `titulo`: "Título X - ..." (opcional)

**Ejemplo:**
```bash
GET /api/products?regulationType=RETILAP&titulo=Título%203%20-%20Fuentes%20Luminosas
```

### GET /api/essays
**Query params:**
- `productId`: number (opcional)

**Ejemplo:**
```bash
GET /api/essays?productId=5
```

## Hooks Personalizados Creados

1. **useTitulos()** - Devuelve la lista de 9 títulos
2. **useEssaysByProduct(productId)** - Obtiene ensayos de un producto específico
3. **useQuotationCart()** - Maneja el estado del carrito

## Archivo Afectados

### Backend
- `server/routes.ts` - Endpoints actualizados con filtros
- `server/storage.ts` - Nuevo método `getEssaysByProduct()`

### Database
- `shared/schema.ts` - Nueva tabla `productEssays`
- `database/schema.sql` - Script SQL actualizado

### Frontend
- `client/src/pages/Reglamento.tsx` - Componente completamente reescrito
- `client/src/hooks/use-titulos.ts` - Nuevo hook
- `client/src/hooks/use-essays-by-product.ts` - Nuevo hook
- `client/src/hooks/use-quotation-cart.ts` - Nuevo hook

## Testing

Para probar localmente:
1. Ejecuta `npm run dev`
2. Navega a `/reglamento`
3. Sigue el flujo de 5 pasos
4. Agrega múltiples productos al carrito
5. Revisa el panel lateral del carrito
6. Solicita la cotización

