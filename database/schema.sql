-- LUMINOTEST Quote System Database Schema
-- Para usar en Supabase PostgreSQL

-- ====================================
-- 1. Enable UUID extension
-- ====================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================
-- 2. Users Table (para autenticación)
-- ====================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- 3. Sessions Table (para manejo de sesiones)
-- ====================================
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions(expire);

-- ====================================
-- 4. Products Table (Productos)
-- ====================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  titulo TEXT,
  is_retilap BOOLEAN DEFAULT FALSE,
  is_retie BOOLEAN DEFAULT FALSE,
  is_otros BOOLEAN DEFAULT FALSE
);

-- ====================================
-- 5. Essays Table (Ensayos)
-- ====================================
CREATE TABLE IF NOT EXISTS essays (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_default_retilap BOOLEAN DEFAULT FALSE,
  is_default_retie BOOLEAN DEFAULT FALSE
);

-- ====================================
-- 6. Product Essays Relationship Table
-- ====================================
CREATE TABLE IF NOT EXISTS product_essays (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  essay_id INTEGER NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  UNIQUE(product_id, essay_id)
);

-- ====================================
-- 7. Quotations Table (Cotizaciones)
-- ====================================
CREATE TABLE IF NOT EXISTS quotations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  type TEXT NOT NULL,
  reglamento_type TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- 8. Quotation Items Table (Items de Cotizaciones)
-- ====================================
CREATE TABLE IF NOT EXISTS quotation_items (
  id SERIAL PRIMARY KEY,
  quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  essay_id INTEGER REFERENCES essays(id)
);

-- ====================================
-- 9. Seed Data - Products (Accesorios)
-- ====================================
INSERT INTO products (name, category) VALUES
  ('Aisladores en resina tipo poste', 'Accesorios'),
  ('Alfombras y / o tapetes aislantes (de la electricidad)', 'Accesorios'),
  ('Balasto Lámparas Fluorescentes Tubulares', 'Accesorios'),
  ('Balasto lámparas de alta intensidad de descarga', 'Accesorios'),
  ('Balastos', 'Accesorios'),
  ('Baterías (pilas) primaria de referencia 9V (6LR61/6F22)', 'Accesorios'),
  ('Baterías (pilas) primaria de referencia AAA', 'Accesorios'),
  ('Baterías (pilas) primaria de referencia AA', 'Accesorios'),
  ('Baterías (pilas) primaria de referencia C', 'Accesorios'),
  ('Baterías (pilas) primaria de referencia D', 'Accesorios'),
  ('Baterías (pilas) primaria de referencia N', 'Accesorios'),
  ('Bombillas', 'Accesorios'),
  ('Bombillas (E14)', 'Accesorios'),
  ('Bombillas (E40)', 'Accesorios'),
  ('Bombillas Fluorescentes', 'Accesorios'),
  ('Bombillas LED', 'Accesorios'),
  ('Cables y alambres conductores', 'Accesorios'),
  ('Calzado dieléctrico (botas de hule)', 'Accesorios'),
  ('Canalizaciones', 'Accesorios'),
  ('Cargadores vehículos sitio', 'Accesorios'),
  ('Casquillos y bases de bombillas', 'Accesorios'),
  ('Clavijas', 'Accesorios'),
  ('Clavijas de uso doméstico y similares', 'Accesorios'),
  ('Clavijas y Tomacorriente', 'Accesorios'),
  ('Drivers', 'Accesorios'),
  ('Drivers o Controladores LED', 'Accesorios'),
  ('Electrodomésticos y aparatos eléctricos similares', 'Accesorios'),
  ('Guantes dieléctricos', 'Accesorios'),
  ('Interruptores automáticos (Breakers)', 'Accesorios'),
  ('Interruptores manuales', 'Accesorios'),
  ('Luminarias', 'Accesorios'),
  ('Luminarias LED', 'Accesorios'),
  ('Luminarias de Emergencia', 'Accesorios'),
  ('Lámparas', 'Accesorios'),
  ('Lámparas LED', 'Accesorios'),
  ('Lámparas fluorescentes', 'Accesorios'),
  ('Mangas dieléctricas', 'Accesorios'),
  ('Mantas aislantes', 'Accesorios'),
  ('Paneles fotovoltaicos', 'Accesorios'),
  ('Portalámparas', 'Accesorios'),
  ('Productos eléctricos', 'Accesorios'),
  ('Tomacorriente', 'Accesorios'),
  ('Tomacorrientes portátiles', 'Accesorios'),
  ('Tubos LED G13 y G5', 'Accesorios')
ON CONFLICT DO NOTHING;

-- ====================================
-- 10. Seed Data - Essays (Ensayos)
-- ====================================
INSERT INTO essays (name, category, is_default_retilap, is_default_retie) VALUES
  ('Adhesión por el método de cinta', 'General', FALSE, FALSE),
  ('Análisis dimensional', 'General', FALSE, FALSE),
  ('Área de la sección transversal del conductor', 'General', FALSE, FALSE),
  ('Aumento de temperatura', 'General', FALSE, FALSE),
  ('Calentamiento y/o Aumento de temperatura', 'General', FALSE, FALSE),
  ('Cámara salina (1 hora)', 'General', FALSE, FALSE),
  ('Capacidad de apertura y cierre', 'General', FALSE, FALSE),
  ('Características Eléctricas y Flujo Luminoso', 'General', FALSE, FALSE),
  ('Distancias de aislamiento y fuga', 'General', FALSE, FALSE),
  ('Endurancia', 'General', FALSE, FALSE),
  ('Evaluación de la durabilidad del rotulado', 'General', FALSE, FALSE),
  ('Fotometría', 'General', TRUE, FALSE),
  ('Grado IP (Hermeticidad)', 'General', FALSE, FALSE),
  ('Impedancia eléctrica', 'General', FALSE, FALSE),
  ('Medición de resistencia a tierra', 'General', FALSE, TRUE),
  ('Operación normal', 'General', FALSE, FALSE),
  ('Protección Contra Choque Eléctrico', 'General', FALSE, FALSE),
  ('Quemador de aguja', 'General', FALSE, FALSE),
  ('Resistencia a la Corrosión', 'General', FALSE, FALSE),
  ('Resistencia a la Humedad', 'General', FALSE, FALSE),
  ('Resistencia de Aislamiento', 'General', FALSE, FALSE),
  ('Rigidez Dieléctrica', 'General', FALSE, FALSE),
  ('Resistencia al Hilo Incandescente', 'General', FALSE, FALSE),
  ('Resistencia al Impacto (IK)', 'General', FALSE, FALSE),
  ('Resistencia de aislamiento a tensión de impulso', 'General', FALSE, FALSE),
  ('Tensión de circuito abierto', 'General', FALSE, FALSE),
  ('Verificación de dimensiones', 'General', FALSE, FALSE)
ON CONFLICT DO NOTHING;

-- ====================================
-- 11. Assign Títulos to Products
-- ====================================
-- Update products with RETILAP flag to have appropriate títulos

UPDATE products SET
  titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos',
  is_retilap = true
WHERE titulo IS NULL;

-- Randomly assign some to other titles for variety
UPDATE products SET
  titulo = 'Título 3 - Fuentes Luminosas'
WHERE id % 4 = 0 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE products SET
  titulo = 'Título 4 - Luminarias para Espacios Interiores'
WHERE id % 4 = 1 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

UPDATE products SET
  titulo = 'Título 5 - Productos de Iluminación para Espacios Exteriores'
WHERE id % 4 = 2 AND titulo = 'Título 10 - Accesorios Eléctricos y Electrónicos';

-- ====================================
-- ====================================
-- For now, we create a default relationship:
-- Assign all essays to all products that have them available
-- In production, this would be seeded based on actual product requirements

INSERT INTO product_essays (product_id, essay_id) 
SELECT DISTINCT p.id, e.id 
FROM products p, essays e
WHERE NOT EXISTS (
  SELECT 1 FROM product_essays pe 
  WHERE pe.product_id = p.id AND pe.essay_id = e.id
)
ON CONFLICT DO NOTHING;
