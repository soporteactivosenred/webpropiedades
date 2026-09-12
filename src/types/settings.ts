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
  contact_phone: '+56 9 73081220',
  contact_whatsapp: '+56973081220',
  whatsapp_avatar: '/ejecutiva.png',
  contact_address: 'Gómez Carreño 333, La Serena',
  social_media: {
    facebook: 'https://facebook.com/activosenred.cl',
    instagram: 'https://instagram.com/activosenred.cl',
    linkedin: 'https://linkedin.com/company/activosenred',
  },
  seo: {
    default_title: 'Activos en Red - Tu hogar, nuestra pasión',
    default_description: 'Encuentra tu próxima propiedad con Activos en Red. Casas, departamentos, terrenos y más.',
    default_keywords: 'inmuebles, propiedades, casas, departamentos, arriendo, venta, Chile',
    og_image: '/images/og-default.jpg',
  },
};

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  phone?: string;
  instagram?: string;
  linkedin?: string;
}

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Paula Merino Alvarez',
    role: 'Fundadora & Directora Comercial',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop',
    bio: 'Líder estratégica del área de liquidación bancaria e inversiones inmobiliarias.',
  },
  {
    id: '2',
    name: 'María José Merino Alvarez',
    role: 'Co-Fundadora & Jefa de Administración y Finanzas',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=600&fit=crop',
    bio: 'Encargada de la gestión operativa, contratos y administración de arriendos.',
    email: 'administraciones@activosenred.cl',
  },
  {
    id: '3',
    name: 'Paulino Rojas Callejas',
    role: 'Agente de Ventas Senior',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop',
    bio: 'Asesor especialista en negociación, captación y cierre de oportunidades comerciales.',
    email: 'paulino.rojas@activosenred.cl',
    phone: '+56973081220',
  },
  {
    id: '4',
    name: 'Eduardo Merino Vera',
    role: 'Agente de Ventas',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=600&fit=crop',
    bio: 'Asesor inmobiliario en terreno, dedicado a brindar una atención personalizada.',
    email: 'contacto@activosenred.cl',
    phone: '+56954161011',
  },
];