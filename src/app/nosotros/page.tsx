import Image from 'next/image';
import { Award, Users, Heart, TrendingUp, MapPin, Phone, Mail, Instagram, Linkedin } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { TeamMember, DEFAULT_TEAM } from '@/types';

export const revalidate = 60; // Revalidar cada minuto para reflejar cambios guardados en el panel

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

function getInstagramUrl(handleOrUrl?: string) {
  if (!handleOrUrl) return '';
  if (handleOrUrl.startsWith('http://') || handleOrUrl.startsWith('https://')) return handleOrUrl;
  const clean = handleOrUrl.replace(/^@/, '').trim();
  return `https://instagram.com/${clean}`;
}

function getLinkedinUrl(url?: string) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://linkedin.com/in/${url.trim()}`;
}

export const metadata = {
  title: 'Nosotros',
  description: 'Conoce al equipo de Activos en Red. Ayudando desde el año 2009 a familias a encontrar su hogar ideal en Chile.',
};

export default async function AboutPage() {
  let team: TeamMember[] = DEFAULT_TEAM;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'team_members')
        .maybeSingle();

      if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
        team = data.value;
      }
    } catch (e) {
      console.warn('Error fetching team from Supabase:', e);
    }
  }

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
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Nuestro equipo
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Profesionales comprometidos con tu satisfacción y el éxito de cada operación
            </p>
          </div>

          {/* Contenedor flexible centrado: 4 por fila, y si hay más de 4, las tarjetas sobrantes se centran perfectamente en la siguiente línea */}
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <div
                key={member.id || member.name + index}
                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-[285px] min-w-[250px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-100 dark:border-gray-700/60"
              >
                {/* Foto en proporción 500px ancho x 600px alto (5:6) */}
                <div className="relative w-full aspect-[5/6] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                  <Image
                    src={member.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=600&fit=crop'}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold text-xs mt-1 uppercase tracking-wider">
                    {member.role}
                  </p>
                  <p className="mt-2.5 text-gray-600 dark:text-gray-400 text-xs leading-relaxed flex-1">
                    {member.bio}
                  </p>

                  {(member.email || member.phone || member.instagram || member.linkedin) && (
                    <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-700/80 space-y-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title={member.email}
                        >
                          <Mail className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/\s+/g, '')}`}
                          className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                          <span>{member.phone}</span>
                        </a>
                      )}

                      {(member.instagram || member.linkedin) && (
                        <div className="flex items-center gap-2 pt-1">
                          {member.instagram && (
                            <a
                              href={getInstagramUrl(member.instagram)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/60 transition-colors"
                              title="Instagram"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={getLinkedinUrl(member.linkedin)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
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