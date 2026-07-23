export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  whatsapp_avatar: string;
  contact_address: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  seo: {
    default_title: string;
    default_description: string;
    default_keywords: string;
    og_image: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Activos en Red',
  site_tagline: 'Tu hogar, nuestra pasión',
  site_description: 'Encuentra tu próxima propiedad con Activos en Red. Casas, departamentos, terrenos y más.',
  contact_email: 'contacto@activosenred.cl',
  contact_phone: '+56 9 1234 5678',
  contact_whatsapp: '+56912345678',
  whatsapp_avatar: '/ejecutiva.png',
  contact_address: 'La Serena, Chile',
  social_media: {
    facebook: 'https://facebook.com/activosenred',
    instagram: 'https://instagram.com/activosenred',
    linkedin: 'https://linkedin.com/company/activosenred',
  },
  seo: {
    default_title: 'Activos en Red - Tu hogar, nuestra pasión',
    default_description: 'Encuentra tu próxima propiedad con Activos en Red. Casas, departamentos, terrenos y más.',
    default_keywords: 'inmuebles, propiedades, casas, departamentos, arriendo, venta, Chile',
    og_image: '/images/og-default.jpg',
  },
};