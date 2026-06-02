import Link from 'next/link';
import { ArrowRight, Home, Building2, DollarSign } from 'lucide-react';

const propertyTypes = [
  {
    icon: Home,
    title: 'Casas',
    description: 'Encuentra casas para toda la familia',
    href: '/propiedades?property_type=house',
    count: 150,
  },
  {
    icon: Building2,
    title: 'Departamentos',
    description: 'Departamentos en las mejores zonas',
    href: '/propiedades?property_type=apartment',
    count: 200,
  },
  {
    icon: DollarSign,
    title: 'Terrenos',
    description: 'Terrenos para construir tu futuro',
    href: '/propiedades?property_type=land',
    count: 75,
  },
];

export function PropertyTypesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Explora por tipo de propiedad
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Encuentra exactamente lo que buscas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.title}
                href={type.href}
                className="group relative bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4">
                    <Icon className="w-32 h-32" />
                  </div>
                </div>

                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold">{type.title}</h3>
                  <p className="mt-2 text-primary-100">{type.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-primary-200">{type.count} propiedades</span>
                    <span className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                      Ver todas <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}