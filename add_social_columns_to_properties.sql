-- ============================================================
-- Migración: Columnas de Autopublicación en Redes Sociales para Propiedades
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS publish_to_fb BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS publish_to_ig BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS social_caption TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fb_post_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ig_media_id TEXT DEFAULT NULL;

-- Notificar resultado
SELECT 'Columnas de redes sociales agregadas correctamente a public.properties' AS resultado;
