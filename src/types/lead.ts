import type { Database } from './database';

export type Lead = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type LeadUpdate = Database['public']['Tables']['leads']['Update'];

export type LeadSource = 'website' | 'whatsapp' | 'referral' | 'social';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface LeadWithProperty extends Lead {
  property?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  property_id?: string;
  source?: LeadSource;
}

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Sitio web',
  whatsapp: 'WhatsApp',
  referral: 'Recomendación',
  social: 'Redes sociales',
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  converted: 'Convertido',
  lost: 'Perdido',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-800',
};