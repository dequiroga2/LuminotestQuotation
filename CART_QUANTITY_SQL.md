# SQL para Agregar Cantidad en Carrito

Ejecuta en el **SQL Editor de Supabase**:

```sql
-- Agregar columna de cantidad en carrito de compras
ALTER TABLE shopping_cart_items 
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1 NOT NULL;
```

## Qué hace:
- Agrega una columna `quantity` a cada item del carrito
- Por defecto comienza en 1
- Permite subir/bajar la cantidad de cada item
