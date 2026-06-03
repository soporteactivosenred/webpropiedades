import Link from 'next/link';
import { Home, Building2, Key, Users, CheckCircle, Phone } from 'lucide-react';

const features = [
  {
    icon: Home,
    title: 'Amplia cartera',
    description: 'Más de 500 propiedades en las mejores zonas de Chile',
  },
  {
    icon: Building2,
    title: 'Profesionales',
    description: 'Equipo con más de 15 años de experiencia en el mercado',
  },
  {
    icon: Key,
    title: 'Trámites帮你',
    description: 'Te acompañamos en todo el proceso de compra o arriendo',
  },
  {
    icon: Users,
    title: 'Atención personalizada',
    description: 'Escuchamos tus necesidades y encontramos la propiedad ideal',
  },
  {
    icon: CheckCircle,
    title: 'Garantía de calidad',
    description: 'Todas nuestras propiedades están verificadas',
  },
  {
    icon: Phone,
    title: 'Disponible siempre',
    description: 'Contáctanos por teléfono, WhatsApp o visítanos',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            En Activos en Red nos esforzamos por brindarte la mejor experiencia en el mercado inmobiliario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/nosotros"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Conoce más sobre nosotros →
          </Link>
        </div>
      </div>
    </section>
  );
}