-- ========================================================
-- AGREGAR COLUMNA VIDEO A PROPIEDADES
-- Copia y pega esto en el SQL Editor de tu Supabase actual:
-- https://supabase.com/dashboard/project/incliamwcihysuiwboye/sql/new
-- ========================================================

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_url TEXT;
