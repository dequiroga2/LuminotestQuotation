# SQL para Supabase - Tracking de Usuarios

Ejecuta estos comandos en el SQL Editor de Supabase:

```sql
-- Agregar columnas para tracking de actividad
ALTER TABLE users 
ADD COLUMN interactions_count INTEGER DEFAULT 0,
ADD COLUMN quotations_count INTEGER DEFAULT 0;

-- Índice para consultas rápidas por actividad
CREATE INDEX idx_users_interactions ON users(interactions_count);
CREATE INDEX idx_users_quotations ON users(quotations_count);
```
