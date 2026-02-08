# Comandos SQL para Actualizar la Base de Datos - Carrito Persistente

Ejecuta estos comandos en Supabase SQL Editor para adicionar la funcionalidad de carrito persistente.

## 1. Crear la tabla `shopping_cart_items`

```sql
CREATE TABLE IF NOT EXISTS shopping_cart_items (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT,
  essay_ids TEXT NOT NULL,
  essay_names TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 2. Crear índices para mejor rendimiento

```sql
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON shopping_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_created ON shopping_cart_items(user_id, created_at);
```

## 3. Crear función para actualizar `updated_at` automáticamente

```sql
CREATE OR REPLACE FUNCTION update_shopping_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shopping_cart_update_timestamp
BEFORE UPDATE ON shopping_cart_items
FOR EACH ROW
EXECUTE FUNCTION update_shopping_cart_updated_at();
```

## 4. (Opcional) Limpiar carritos antiguos (más de 7 días sin usar)

```sql
-- Ejecuta esto ocasionalmente para limpiar carritos abandonados
DELETE FROM shopping_cart_items 
WHERE updated_at < NOW() - INTERVAL '7 days';
```

---

## Pasos para Ejecutar en Supabase:

1. **Abre Supabase** → Tu proyecto
2. **Ve a SQL Editor** (lado izquierdo)
3. **Copia y ejecuta el código SQL anterior**, sección por sección
4. **Verifica que no haya errores** (deberías ver ✓)
5. **Listo!** La tabla y funcionalidad están creadas

---

## Estructura de Datos Guardados

Cada item en el carrito se guarda así:

```json
{
  "id": 1,
  "user_id": "user_12345",
  "product_id": 5,
  "product_name": "Luminarias LED",
  "essay_ids": "[1, 2, 3]",      // JSON array as text
  "essay_names": "[\"Fotometría\", \"Rigidez Dieléctrica\", \"Tensión\"]",
  "created_at": "2026-02-07T10:30:00Z",
  "updated_at": "2026-02-07T10:30:00Z"
}
```

---

## Endpoints API Disponibles

Ahora el frontend puede usar:

- **GET /api/cart** - Obtener carrito del usuario
- **POST /api/cart** - Agregar/actualizar item al carrito
- **DELETE /api/cart/:id** - Eliminar un item específico
- **DELETE /api/cart** - Vaciar todo el carrito

El carrito **persiste entre sesiones** y se sincroniza automáticamente.
