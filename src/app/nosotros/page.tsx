import Image from 'next/image';
import { Award, Users, Heart, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';

const stats = [
  { number: '500+', label: 'Propiedades vendidas' },
  { number: 'Desde 2009', label: 'Trayectoria' },
  { number: '98%', label: 'Clientes satisfechos' },
  { number: '50+', label: 'Propiedades activas' },
];

const values = [
  {
    icon: Heart,
    title: 'Compromiso genuino',
    description: 'Nos importa tu bienestar. Cada cliente es único y merece atención personalizada.',
  },
  {
    icon: Award,
    title: 'Excelencia profesional',
    description: 'Constantemente capacitándonos para brindarte el mejor servicio.',
  },
  {
    icon: TrendingUp,
    title: 'Actualización constante',
    description: 'Conocemos las últimas tendencias del mercado para maximizar tu inversión.',
  },
  {
    icon: Users,
    title: 'Equipo cercano',
    description: 'Te acompañamos en cada paso del proceso, con transparencia y honestidad.',
  },
];

const team = [
  {
    name: 'Paula Merino',
    role: 'Fundadora y Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'Más de 20 años de experiencia en el mercado inmobiliario chileno.',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Agente Senior',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Especialista en propiedades residenciales y comerciales.',
  },
  {
    name: 'María González',
    role: 'Asistente Comercial',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'Atención al cliente y coordinación de visitas.',
  },
];

export const metadata = {
  title: 'Nosotros',
  description: 'Conoce al equipo de Activos en Red. Ayudando desde el año 2009 a familias a encontrar su hogar ideal en Chile.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 to-primary-600 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Tu hogar, nuestra pasión
            </h1>
            <p className="mt-6 text-xl text-primary-100">
              En Activos en Red ayudamos desde el año 2009 a familias a encontrar 
              su lugar perfecto. Somos una inmobiliaria comprometida con la excelencia y 
              el bienestar de nuestros clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-800 py-12 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.number}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Nuestra misión
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Brindar un servicio inmobiliario excepcional que supere las expectativas 
                de nuestros clientes. Nos esforzamos por entender sus necesidades únicas 
                y encontrar la propiedad perfecta que se adapte a su estilo de vida.
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Nuestra visión es ser la inmobiliaria de referencia en Chile, reconocida 
                por nuestra integridad, profesionalismo y compromiso con la satisfacción del cliente.
              </p>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Activos en Red"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Nuestros valores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white dark:bg-gray-900 rounded-xl p-6">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Nuestro equipo
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Profesionales comprometidos con tu satisfacción
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                <div className="relative aspect-square">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {member.role}
                  </p>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para encontrar tu hogar?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Contáctanos y te ayudaremos a hacer realidad tu sueño.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+56973081220"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Llamar ahora
            </a>
            <a
              href="mailto:contacto@activosenred.cl"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Enviar email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}