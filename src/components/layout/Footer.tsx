import Link from 'next/link';
import { Home, Building2, FileText, Info, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';

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

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Activos en <span className="text-primary-400">Red</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {DEFAULT_SETTINGS.site_tagline}. Expertos en bienes raíces con años de experiencia en el mercado chileno.
            </p>
            <div className="flex gap-4">
              {DEFAULT_SETTINGS.social_media.facebook && (
                <a
                  href={DEFAULT_SETTINGS.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {DEFAULT_SETTINGS.social_media.instagram && (
                <a
                  href={DEFAULT_SETTINGS.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {DEFAULT_SETTINGS.social_media.linkedin && (
                <a
                  href={DEFAULT_SETTINGS.social_media.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors"
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
                      className="flex items-center gap-2 text-sm hover:text-primary-400 transition-colors"
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
                    className="text-sm hover:text-primary-400 transition-colors"
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
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{DEFAULT_SETTINGS.contact_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href={`tel:${DEFAULT_SETTINGS.contact_phone}`} className="text-sm hover:text-primary-400">
                  {DEFAULT_SETTINGS.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href={`mailto:${DEFAULT_SETTINGS.contact_email}`} className="text-sm hover:text-primary-400">
                  {DEFAULT_SETTINGS.contact_email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} {DEFAULT_SETTINGS.site_name}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacidad" className="hover:text-primary-400 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-primary-400 transition-colors">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };