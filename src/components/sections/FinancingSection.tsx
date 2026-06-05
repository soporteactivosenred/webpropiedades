'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KeyRound, Handshake, Calendar, Coins, ArrowRight } from 'lucide-react';

const TABS = [
  {
    id: 'parte-pago',
    title: 'Deja tu propiedad en parte de pago',
    icon: KeyRound,
    description: 'Activos en Red te ayuda a dar el siguiente paso: compra tu oficina, local o departamento hoy dejándonos tu propiedad actual en parte de pago. Nosotros nos encargamos de toda la gestión y tramitación para que no tengas que preocuparte de nada.',
    link: '/contacto?subject=Parte%20de%20pago',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
  },
  {
    id: 'renta',
    title: 'Complementa tu renta',
    icon: Handshake,
    description: 'Suma tus ingresos con un co-deudor (socio, familiar o pareja) para alcanzar la capacidad financiera requerida y calificar al financiamiento de tu próxima propiedad comercial, industrial o residencial sin complicaciones.',
    link: '/contacto?subject=Complementar%20renta',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },
  {
    id: 'cuotas',
    title: 'Paga el pie en cuotas',
    icon: Calendar,
    description: 'Facilitamos tu inversión dividiendo el pago del pie de tu propiedad en cuotas mensuales sin interés durante el periodo de construcción o mediante convenios de financiamiento flexibles adaptados a tu flujo de caja.',
    link: '/contacto?subject=Pie%20en%20cuotas',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
  },
  {
    id: 'subsidio',
    title: 'Subsidio y Leasing',
    icon: Coins,
    description: 'Aplica subsidios habitacionales DS19 o DS1 a tu próxima vivienda, o consulta por nuestras opciones de leasing inmobiliario comercial y habitacional que te permiten arrendar con opción de compra, ideal para emprendedores y PyMEs.',
    link: '/contacto?subject=Subsidio%20y%20Leasing',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  },
];

export function FinancingSection() {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);

  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];
  const ActiveIcon = activeTab.icon;

  return (
    <section className="py-16 md:py-24 bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title block */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Alternativas de financiamiento
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Sabemos lo importante que es este momento. Por eso te ofrecemos distintas formas de financiamiento para elegir tu próximo activo o propiedad.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Left: Tabs stack */}
          <div className="flex flex-col gap-3 md:gap-4 justify-center">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all duration-300 border ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-100 dark:border-primary-900/50 shadow-md translate-x-1'
                      : 'bg-white dark:bg-gray-800 border-gray-150/50 dark:border-gray-750 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-sm md:text-base font-bold leading-snug ${
                      isActive ? 'text-primary-900 dark:text-primary-200' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Active Tab display box */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-stretch">
            {/* Box Content (left inside card) */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between gap-8 min-h-[300px]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <ActiveIcon className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {activeTab.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-350 text-sm md:text-base leading-relaxed">
                  {activeTab.description}
                </p>
              </div>

              <Link
                href={activeTab.link}
                className="inline-flex items-center justify-between gap-3 border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 font-bold px-6 py-2.5 rounded-full text-sm transition-all duration-300 self-start group"
              >
                Ver más
                <span className="w-6 h-6 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

            {/* Box Image (right inside card) */}
            <div className="relative w-full md:w-2/5 min-h-[250px] md:min-h-full">
              <img
                src={activeTab.image}
                alt={activeTab.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white dark:from-gray-800 via-transparent md:w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
