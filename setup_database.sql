-- Script de Inicialización de Base de Datos para Supabase
-- Ejecuta esto en tu SQL Editor para crear las tablas necesarias

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla profiles (si vas a tener usuarios/agentes)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear tabla properties
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_type TEXT NOT NULL CHECK (price_type IN ('sale', 'rent')),
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'land', 'commercial', 'office', 'industrial')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'sold', 'rented')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area INTEGER,
  parking_spaces INTEGER,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  year_built INTEGER,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear tabla leads (Contactos/Formularios)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'referral', 'social')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Crear tabla blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Crear tabla site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Columnas adicionales para Mercado Libre / Portal Inmobiliario Chile
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS publish_to_meli BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS meli_item_id TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS meli_permalink TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS meli_status TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS meli_listing_type TEXT;

-- Insertar la propiedad de prueba que solicitaste anteriormente (Avenida del Mar)
INSERT INTO public.properties (
  title, slug, description, price, price_type, property_type, status, address, city, region, bedrooms, bathrooms, area, parking_spaces, features, images
) VALUES (
  'Avenida del Mar, La Serena',
  'avenida-del-mar-la-serena-1041',
  'Condominio Playa Blanca. Valor 3.375 UF. ¡LIQUIDACIÓN BANCARIA EN LA SERENA! Excelente oportunidad de inversión. Depto en tercer piso, con ascensor, 3 amplios dormitorios, 2 baños, balcón con linda vista, cocina amoblada y equipada, logia interior 76 m2, estacionamiento y bodega. Ubicación Premium: Avenida Pacífico 2401, La Serena. A pasos de la Avenida del Mar, restaurantes, playas y con excelente conectividad.',
  3375, 'sale', 'apartment', 'active', 'Avenida Pacífico 2401', 'La Serena', 'Coquimbo', 3, 2, 80, 1,
  ARRAY['Ascensor', 'Balcón', 'Estacionamiento', 'Bodega', 'Piscina', 'Terraza', 'Cocina equipada'],
  ARRAY[
    '/properties/avenida-del-mar-1041/1.png', 
    '/properties/avenida-del-mar-1041/2.png', 
    '/properties/avenida-del-mar-1041/3.png', 
    '/properties/avenida-del-mar-1041/4.png'
  ]
) ON CONFLICT (slug) DO NOTHING;
