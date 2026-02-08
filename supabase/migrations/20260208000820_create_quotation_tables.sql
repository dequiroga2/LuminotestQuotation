/*
  # Sistema de Cotizaciones LUMINOTEST
  
  1. Tablas Nuevas
    - `quotations`
      - `id` (uuid, clave primaria)
      - `user_id` (uuid, referencia a auth.users)
      - `type` (text, tipo de cotización: reglamento/producto/ensayo)
      - `subtype` (text, subtipo específico)
      - `items` (jsonb, items seleccionados)
      - `status` (text, estado de la cotización)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para usuarios autenticados para acceder solo a sus propias cotizaciones
*/

CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('reglamento', 'producto', 'ensayo')),
  subtype text,
  items jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quotations"
  ON quotations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quotations"
  ON quotations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotations"
  ON quotations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotations"
  ON quotations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_quotations_user_id ON quotations(user_id);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);