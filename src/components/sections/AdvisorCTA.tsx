'use client';

import { ArrowRight } from 'lucide-react';

export function AdvisorCTA() {
  const handleOpenChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-whatsapp-modal'));
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Side: Image */}
          <div className="relative w-full lg:w-2/5 aspect-[16/10] lg:aspect-[4/3] shrink-0 rounded-2xl overflow-hidden shadow-md">
            <img
              src="/agente-ia.png"
              alt="Asesor Inmobiliario Digital"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Text & Actions */}
          <div className="flex-1 space-y-4 md:space-y-6 text-left">
            <div className="space-y-2">
              <span className="block text-sm md:text-base font-bold text-primary-600 dark:text-accent-400">
                Conoce a Activos en Red IA • Asesor inmobiliario
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Tu asesor <span className="text-primary-600 dark:text-accent-400 font-extrabold">con inteligencia artificial</span>
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-350 text-sm md:text-base leading-relaxed max-w-2xl">
              Resuelve tus dudas y toma la decisión de comprar tu nueva propiedad a tu ritmo.
            </p>

            <button
              onClick={handleOpenChat}
              className="inline-flex items-center justify-between gap-4 bg-primary-950 dark:bg-primary-900 hover:bg-primary-900 dark:hover:bg-primary-850 text-white font-bold px-6 py-3.5 rounded-full text-xs md:text-sm transition-all duration-300 shadow-lg group hover:scale-102 active:scale-98"
            >
              <span>Pregúntale a Activos en Red IA</span>
              <span className="w-5 h-5 bg-white text-primary-950 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
