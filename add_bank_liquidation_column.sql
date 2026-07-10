-- Script para agregar la columna is_bank_liquidation a la tabla properties
-- Ejecuta esto en tu SQL Editor de Supabase
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_bank_liquidation BOOLEAN DEFAULT false;
