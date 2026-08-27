import Link from 'next/link';
import Image from 'next/image';
import { Home, Building2, FileText, Info, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';
import { createClient } from '@supabase/supabase-js';

const quickLinks = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Propiedades', href: '/propiedades', icon: Building2 },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Nosotros', href: '/nosotros', icon: Info },
  { name: 'Contacto', href: '/contacto', icon: Phone },
];

const propertyTypes = [
  { name: 'Casas', href: '/propiedades?type=house' },
  { name: 'Departamentos', href: '/propiedades?type=apartment' },
  { name: 'Terrenos', href: '/propiedades?type=land' },
  { name: 'Locales comerciales', href: '/propiedades?type=commercial' },
];

async function Footer() {
  const currentYear = new Date().getFullYear();

  // Clonar DEFAULT_SETTINGS para evitar modificar la constante global directamente
  const settings = {
    ...DEFAULT_SETTINGS,
    social_media: { ...DEFAULT_SETTINGS.social_media }
  };

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data } = await supabase
        .from('site_settings')
        .select('key, value');

      if (data) {
        const fb = data.find((s: any) => s.key === 'facebook_url')?.value;
        const ig = data.find((s: any) => s.key === 'instagram_url')?.value;
        const li = data.find((s: any) => s.key === 'linkedin_url')?.value;
        const email = data.find((s: any) => s.key === 'contact_email')?.value;
        const phone = data.find((s: any) => s.key === 'contact_phone')?.value;
        const address = data.find((s: any) => s.key === 'contact_address')?.value;
        const siteName = data.find((s: any) => s.key === 'site_name')?.value;
        const siteTagline = data.find((s: any) => s.key === 'site_tagline')?.value;

        if (fb) settings.social_media.facebook = fb;
        if (ig) settings.social_media.instagram = ig;
        if (li) settings.social_media.linkedin = li;
        if (email) settings.contact_email = email;
        if (phone) settings.contact_phone = phone;
        if (address) settings.contact_address = address;
        if (siteName) settings.site_name = siteName;
        if (siteTagline) settings.site_tagline = siteTagline;
      }
    } catch (err) {
      console.error('Error fetching footer settings:', err);
    }
  }

  return (
    <footer className="bg-primary-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="Activos en Red" 
                width={200} 
                height={50} 
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {settings.site_tagline}. Expertos en bienes raíces con años de experiencia en el mercado chileno.
            </p>
            <div className="flex gap-3">
              {settings.social_media.facebook && (
                <a
                  href={settings.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1877F2] hover:bg-[#0e65d9] text-white transition-all hover:scale-110 shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.social_media.instagram && (
                <a
                  href={settings.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] hover:opacity-90 text-white transition-all hover:scale-110 shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.social_media.linkedin && (
                <a
                  href={settings.social_media.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white transition-all hover:scale-110 shadow-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-500 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tipos de Propiedades</h3>
            <ul className="space-y-2">
              {propertyTypes.map((type) => (
                <li key={type.name}>
                  <Link
                    href={type.href}
                    className="text-sm text-gray-400 hover:text-accent-500 transition-colors"
                  >
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{settings.contact_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a href={`tel:${settings.contact_phone}`} className="text-sm text-gray-400 hover:text-accent-500 transition-colors">
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="text-sm text-gray-400 hover:text-accent-500 transition-colors">
                  {settings.contact_email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} {settings.site_name}. Todos los derechos reservados. — Desarrollado por{' '}
            <a 
              href="https://webunica.cl" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-accent-500 transition-colors font-medium"
            >
              webunica.cl
            </a>
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacidad" className="text-gray-400 hover:text-accent-500 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-accent-500 transition-colors">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };