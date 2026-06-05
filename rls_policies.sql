-- Script para configurar permisos de lectura pública (RLS Policies)
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Habilitar Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas anteriores (por si acaso existen)
DROP POLICY IF EXISTS "Permitir lectura pública de propiedades" ON public.properties;
DROP POLICY IF EXISTS "Permitir lectura pública de blog" ON public.blog_posts;
DROP POLICY IF EXISTS "Permitir lectura pública de configuración" ON public.site_settings;

-- 3. Crear políticas para que cualquier usuario visitante pueda LEER los datos
CREATE POLICY "Permitir lectura pública de propiedades" 
ON public.properties FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de blog" 
ON public.blog_posts FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de configuración" 
ON public.site_settings FOR SELECT USING (true);

-- Nota: Para la tabla 'leads' (contactos) NO damos acceso de lectura pública 
-- por seguridad (solo los administradores deben verlos).

-- Permitir que el boton de WhatsApp (usuario anonimo) pueda insertar leads en la BD
CREATE POLICY "Permitir crear leads publicos" 
ON public.leads FOR INSERT 
WITH CHECK (true);

