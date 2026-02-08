-- ===============================================
-- SCRIPT PARA ACTUALIZAR SUPABASE
-- ===============================================
-- Ejecutar esta consulta en el SQL Editor de Supabase
-- Pasos:
-- 1. Abre tu proyecto en https://app.supabase.com
-- 2. Ve a SQL Editor
-- 3. Copia y pega este script
-- 4. Haz clic en "Run" / "Ejecutar"

-- ===============================================
-- PASO 1: Crear tabla product_essays
-- ===============================================
CREATE TABLE IF NOT EXISTS public.product_essays (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  essay_id INTEGER NOT NULL REFERENCES public.essays(id) ON DELETE CASCADE,
  UNIQUE(product_id, essay_id)
);

-- ===============================================
-- PASO 2: Agregar columna titulo a products si no existe
-- ===============================================
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS titulo TEXT;

-- ===============================================
-- PASO 3: Actualizar productos con títulos
-- ===============================================
-- Primero, asegurar que todos tengan is_retilap en true
UPDATE public.products SET is_retilap = true WHERE is_retilap IS NULL;

-- Asignar título 10 por defecto
UPDATE public.products SET
  titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos'
WHERE titulo IS NULL;

-- Distribuir entre otros títulos basado en ID
UPDATE public.products SET titulo = 'Título 3 - Fuentes Luminosas'
WHERE id % 4 = 0 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE public.products SET titulo = 'Título 4 - Luminarias para Espacios Interiores'
WHERE id % 4 = 1 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE public.products SET titulo = 'Título 5 - Productos de Iluminación para Espacios Exteriores'
WHERE id % 4 = 2 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

-- ===============================================
-- PASO 4: Crear relaciones producto-ensayo
-- ===============================================
INSERT INTO public.product_essays (product_id, essay_id) 
SELECT DISTINCT p.id, e.id 
FROM public.products p, public.essays e
WHERE NOT EXISTS (
  SELECT 1 FROM public.product_essays pe 
  WHERE pe.product_id = p.id AND pe.essay_id = e.id
)
ON CONFLICT DO NOTHING;

-- ===============================================
-- PASO 5: Crear índices para mejor rendimiento
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_product_essays_product_id 
ON public.product_essays(product_id);

CREATE INDEX IF NOT EXISTS idx_product_essays_essay_id 
ON public.product_essays(essay_id);

-- ===============================================
-- PASO 6: Verificar que todo se creó correctamente
-- ===============================================
-- Ejecuta estas consultas para verificar:

-- Ver nuevos productos con títulos
SELECT id, name, titulo, is_retilap FROM public.products LIMIT 10;

-- Contar relaciones producto-ensayo creadas
SELECT COUNT(*) as total_product_essays FROM public.product_essays;

-- Ver ejemplo de ensayos para un producto
SELECT pe.product_id, p.name, e.name as essay_name
FROM public.product_essays pe
JOIN public.products p ON pe.product_id = p.id
JOIN public.essays e ON pe.essay_id = e.id
WHERE p.id = 1;
