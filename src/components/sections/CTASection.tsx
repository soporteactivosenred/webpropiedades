import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { DEFAULT_SETTINGS } from '@/types';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Tienes una propiedad para vender o arrendar?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Contáctanos hoy y te ayudamos a encontrar al comprador o arrendatario ideal. 
              Evaluación gratuita y sin compromiso.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-primary-100">
                <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Evaluación gratuita de tu propiedad
              </li>
              <li className="flex items-center gap-3 text-primary-100">
                <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fotografía profesional incluida
              </li>
              <li className="flex items-center gap-3 text-primary-100">
                <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Publicación en portales principales
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Contáctanos ahora
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                  <a href={`tel:${DEFAULT_SETTINGS.contact_phone}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600">
                    {DEFAULT_SETTINGS.contact_phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <a href={`mailto:${DEFAULT_SETTINGS.contact_email}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600">
                    {DEFAULT_SETTINGS.contact_email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {DEFAULT_SETTINGS.contact_address}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/contacto">
                <Button className="w-full" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar mensaje
                </Button>
              </Link>
              <Link href="/vender-mi-propiedad">
                <Button variant="outline" className="w-full" size="lg">
                  Quiero vender mi propiedad
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}