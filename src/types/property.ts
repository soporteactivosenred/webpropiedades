import type { Database } from './database';

export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

export type PriceType = 'sale' | 'rent';
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'office' | 'industrial';
export type PropertyStatus = 'draft' | 'active' | 'sold' | 'rented';

export interface PropertyWithAgent extends Property {
  agent?: {
    full_name: string | null;
    phone: string | null;
    email: string;
  };
}

export interface PropertyFilters {
  price_type?: PriceType;
  property_type?: PropertyType;
  city?: string;
  region?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  min_bathrooms?: number;
  min_area?: number;
  features?: string[];
  filter?: string;
  is_bank_liquidation?: boolean;
}

export interface PropertyCardProps {
  property: Property;
  featured?: boolean;
  compact?: boolean;
}

export const PROPERTY_TYPES_LABELS: Record<PropertyType, string> = {
  house: 'Casa',
  apartment: 'Departamento',
  land: 'Terreno',
  commercial: 'Local comercial',
  office: 'Oficina',
  industrial: 'Industrial',
};

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  sale: 'Venta',
  rent: 'Arriendo',
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  draft: 'Borrador',
  active: 'Activa',
  sold: 'Vendida',
  rented: 'Arrendada',
};

export const PROPERTY_FEATURES = [
  'Piscina',
  'Jardín',
  'Terraza',
  'Balcón',
  'Estacionamiento',
  'Bodega',
  'Gimnasio',
  'Seguridad 24h',
  'Ascensor',
  'Amoblado',
  'Pet Friendly',
  'Aire acondicionado',
  'Calefacción',
  'Lavandería',
  'Quincho',
  'Sala de eventos',
  'Vista al mar',
  'Vista a la ciudad',
] as const;