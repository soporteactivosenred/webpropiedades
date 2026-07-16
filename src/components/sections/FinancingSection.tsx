'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Handshake, Scale, Compass, ArrowRight, Check } from 'lucide-react';

const TABS = [
  {
    id: 'corretaje',
    title: 'Corretaje de propiedades',
    icon: KeyRound,
    subtitle: 'Intermediamos profesionalmente la comercialización de tu inmueble, priorizando el máximo valor y rapidez.',
    features: [
      'Garantizar una venta segura y libre de preocupaciones.',
      'Acompañar y asesorar de forma continua durante toda la gestión.',
      'Optimizar y acelerar los tiempos del proceso comercial.',
      'Entregar un sólido respaldo tanto legal como comercial.'
    ],
    link: '/contacto?subject=Corretaje%20de%20propiedades',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  },
  {
    id: 'administracion',
    title: 'Administración de arriendos',
    icon: Handshake,
    subtitle: 'Gestionamos integralmente tu propiedad de alquiler, brindando tranquilidad a propietarios e inquilinos.',
    features: [
      'Asegurar y organizar tus recaudaciones mensuales con puntualidad.',
      'Optimizar tu tiempo libre y evitarte preocupaciones innecesarias.',
      'Evaluar y seleccionar minuciosamente a arrendatarios calificados.',
      'Entregar un servicio de administración profesional y constante.'
    ],
    link: '/contacto?subject=Administracion%20de%20arriendos',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },
  {
    id: 'asesoria',
    title: 'Asesoría legal y operacional',
    icon: Scale,
    subtitle: 'Apoyamos técnica y jurídicamente cada fase de tus gestiones y transacciones de bienes raíces.',
    features: [
      'Ejecutar operaciones inmobiliarias seguras y totalmente libres de riesgos.',
      'Prevenir anticipadamente cualquier conflicto legal o documental.',
      'Ofrecer un acompañamiento profesional y cercano en todo momento.'
    ],
    link: '/contacto?subject=Asesoria%20legal%20y%20operacional',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  },
  {
    id: 'tasacion',
    title: 'Tasación comercial',
    icon: Compass,
    subtitle: 'Determinamos el valor real de tu propiedad basándonos en un riguroso análisis comparativo de mercado.',
    features: [
      'Establecer un precio competitivo y ajustado a la realidad del sector.',
      'Acelerar la velocidad de venta o arriendo de tu inmueble.',
      'Sustentar técnicamente procesos legales, comerciales o financieros.'
    ],
    link: '/contacto?subject=Tasacion%20comercial',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
  },
];

export function FinancingSection() {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);

  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];
  const ActiveIcon = activeTab.icon;

  return (
    <section id="servicios" className="py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title block */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Te acompañamos en cada etapa de tu proceso inmobiliario, entregando soluciones integrales y profesionales para rentabilizar y proteger tus activos.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Left: Tabs stack (scrollable row on mobile, vertical column on desktop) */}
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 justify-start lg:justify-center scrollbar-none snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-2.5 lg:py-5 rounded-full lg:rounded-2xl text-left transition-all duration-300 border flex-shrink-0 snap-start ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-100 dark:border-primary-900/50 text-primary-900 dark:text-primary-200 shadow-sm lg:translate-x-1'
                      : 'bg-white dark:bg-gray-800 border-gray-150/50 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <TabIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-bold whitespace-nowrap lg:whitespace-normal leading-tight">
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Active Tab display box */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-stretch">
            {/* Box Content */}
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-between gap-6 md:gap-8 min-h-[260px] md:min-h-[350px]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2.5 text-accent-600 dark:text-accent-400">
                  <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-950/30 flex items-center justify-center">
                    <ActiveIcon className="w-4.5 h-4.5 lg:w-5 lg:h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider">
                    {activeTab.title}
                  </h3>
                </div>
                
                <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {activeTab.subtitle}
                </h4>

                <ul className="space-y-2 mt-4">
                  {activeTab.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-gray-600 dark:text-gray-300 text-xs md:text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400 flex items-center justify-center mt-0.5">
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </span>
                      <span className="leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={activeTab.link}
                className="inline-flex items-center justify-between gap-3 border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 font-bold px-6 py-2.5 rounded-full text-xs md:text-sm transition-all duration-300 self-start group mt-4"
              >
                Solicitar información
                <span className="w-5 h-5 lg:w-6 lg:h-6 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                </span>
              </Link>
            </div>

            {/* Box Image */}
            <div className="relative w-full md:w-2/5 min-h-[200px] md:min-h-full overflow-hidden">
              <img
                src={activeTab.image}
                alt={activeTab.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white dark:from-gray-800 to-transparent md:hidden" />
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white dark:from-gray-800 to-transparent hidden md:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
