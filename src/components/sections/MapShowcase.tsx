'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight, Train, TrendingUp, Home } from 'lucide-react';

interface MapShowcaseProps {
  properties?: any[];
}

const TEMPLATE_PROPERTIES = [
  {
    id: 'temp-1',
    title: 'Edificio Franklin',
    city: 'Santiago',
    address: 'Franklin 385, Santiago',
    specs: '1, 2 y 3 dormitorios | 1 y 2 baños',
    metric: '7,2% plusvalía en los últimos 3 años',
    poi: 'Metro Ñuble, línea 5 y línea 6',
    price: 'Desde 2.450 UF',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    mapX: '43.75%',
    mapY: '52.5%',
    slug: 'edificio-franklin',
    badge: 'Destacado',
  },
  {
    id: 'temp-2',
    title: 'Edificio Providencia Park',
    city: 'Providencia',
    address: 'Av. Providencia 1420, Providencia',
    specs: '1 y 2 dormitorios | 1 baño',
    metric: '6,8% plusvalía proyectada',
    poi: 'Metro Manuel Montt, línea 1',
    price: 'Desde 3.100 UF',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    mapX: '65%',
    mapY: '42.5%',
    slug: 'providencia-park',
    badge: 'Último ingreso',
  },
  {
    id: 'temp-3',
    title: 'Condominio Ñuñoa Life',
    city: 'Ñuñoa',
    address: 'Irarrázaval 2900, Ñuñoa',
    specs: '2 y 3 dormitorios | 2 baños',
    metric: '8,1% retorno de inversión',
    poi: 'Metro Chile España, línea 3',
    price: 'Desde 2.890 UF',
    image: 'https://images.unsplash.com/photo-1570129476815-ba368ac77011?w=800&q=80',
    mapX: '60%',
    mapY: '61.25%',
    slug: 'nunoa-life',
    badge: 'Oportunidad',
  },
  {
    id: 'temp-4',
    title: 'Espacio Las Condes',
    city: 'Las Condes',
    address: 'Av. Vitacura 3500, Las Condes',
    specs: 'Oficinas comerciales | 1 y 2 baños',
    metric: '9,5% rentabilidad comercial',
    poi: 'Metro El Golf, línea 1',
    price: 'Desde 4.200 UF',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    mapX: '80%',
    mapY: '35%',
    slug: 'las-condes-office',
    badge: 'Comercial',
  },
  {
    id: 'temp-5',
    title: 'Parque Santiago Sur',
    city: 'San Miguel',
    address: 'Gran Avenida 4500, San Miguel',
    specs: '1, 2 y 3 dormitorios | 1 y 2 baños',
    metric: '5,9% plusvalía anual',
    poi: 'Metro Lo Vial, línea 2',
    price: 'Desde 2.150 UF',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    mapX: '35%',
    mapY: '72.5%',
    slug: 'parque-santiago-sur',
    badge: 'Exclusivo',
  },
];

function StylizedMapSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background base */}
      <rect width="800" height="800" fill="#F8FAFC" className="dark:fill-gray-900" />
      
      {/* Grid lines */}
      <path d="M0 100 H800 M0 200 H800 M0 300 H800 M0 400 H800 M0 500 H800 M0 600 H800 M0 700 H800" stroke="#F1F5F9" strokeWidth="1" className="dark:stroke-gray-850" />
      <path d="M100 0 V800 M200 0 V800 M300 0 V800 M400 0 V800 M500 0 V800 M600 0 V800 M700 0 V800" stroke="#F1F5F9" strokeWidth="1" className="dark:stroke-gray-850" />
      
      {/* River Mapocho */}
      <path
        d="M -50 150 Q 200 120 400 220 T 850 180"
        stroke="#E0F2FE"
        strokeWidth="24"
        strokeLinecap="round"
        fill="none"
        className="dark:stroke-sky-950/40"
      />
      <path
        d="M -50 150 Q 200 120 400 220 T 850 180"
        stroke="#BAE6FD"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        className="dark:stroke-sky-900/40"
      />

      {/* Major ring road (Vespucio) */}
      <circle
        cx="400"
        cy="400"
        r="300"
        stroke="#E2E8F0"
        strokeWidth="10"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <circle
        cx="400"
        cy="400"
        r="300"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeDasharray="6 6"
        fill="none"
        className="dark:stroke-gray-700"
      />

      {/* Major Avenue (Alameda/Providencia) */}
      <path
        d="M -50 420 Q 300 400 500 350 T 850 300"
        stroke="#E2E8F0"
        strokeWidth="14"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <path
        d="M -50 420 Q 300 400 500 350 T 850 300"
        stroke="#FFFFFF"
        strokeWidth="4"
        fill="none"
        className="dark:stroke-gray-700"
      />

      {/* Grid road layout */}
      <path d="M-100 0 L900 700" stroke="#F1F5F9" strokeWidth="6" className="dark:stroke-gray-850" />
      <path d="M0 -100 L800 800" stroke="#F1F5F9" strokeWidth="4" className="dark:stroke-gray-850" />
      <path d="M900 100 L-100 800" stroke="#F1F5F9" strokeWidth="4" className="dark:stroke-gray-850" />
      <path d="M300 0 L300 800" stroke="#F1F5F9" strokeWidth="4" className="dark:stroke-gray-850" />
      <path d="M0 600 Q 400 500 800 700" stroke="#F1F5F9" strokeWidth="5" className="dark:stroke-gray-850" />

      {/* Primary roads highlights */}
      <path d="M-100 0 L900 700" stroke="#E2E8F0" strokeWidth="1.5" className="dark:stroke-gray-800" />
      <path d="M0 600 Q 400 500 800 700" stroke="#E2E8F0" strokeWidth="1.5" className="dark:stroke-gray-800" />
      
      {/* Parks */}
      <path
        d="M 450 300 Q 520 280 600 320 T 700 280 L 680 380 Z"
        fill="#DCFCE7"
        className="dark:fill-emerald-950/20"
      />
      <circle cx="150" cy="550" r="80" fill="#DCFCE7" className="dark:fill-emerald-950/20" />
      <rect x="220" y="200" width="100" height="70" rx="10" fill="#DCFCE7" className="dark:fill-emerald-950/20" />
    </svg>
  );
}

export function MapShowcase({ properties = [] }: MapShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine database properties with mock coordinate template
  const mergedProperties = TEMPLATE_PROPERTIES.map((template, index) => {
    const liveProperty = properties[index];
    if (liveProperty) {
      // Format property specs
      const dbSpecs = [
        liveProperty.bedrooms ? `${liveProperty.bedrooms} dorm.` : null,
        liveProperty.bathrooms ? `${liveProperty.bathrooms} ${liveProperty.bathrooms === 1 ? 'baño' : 'baños'}` : null,
        liveProperty.area ? `${liveProperty.area} m²` : null,
      ].filter(Boolean).join(' | ') || template.specs;

      // Extract image
      const dbImage = liveProperty.images && liveProperty.images.length > 0
        ? liveProperty.images[0]
        : template.image;

      // Format price
      const dbPrice = liveProperty.price 
        ? `Desde ${liveProperty.price.toLocaleString('es-CL')} UF` 
        : template.price;

      return {
        ...template,
        id: liveProperty.id,
        title: liveProperty.title,
        city: liveProperty.city || template.city,
        address: liveProperty.address || template.address,
        specs: dbSpecs,
        price: dbPrice,
        image: dbImage,
        slug: liveProperty.slug,
      };
    }
    return template;
  });

  const activeProperty = mergedProperties[activeIndex] || mergedProperties[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + mergedProperties.length) % mergedProperties.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % mergedProperties.length);
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center lg:text-left mb-12">
          <span className="text-sm font-bold text-accent-500 uppercase tracking-widest">
            Últimos ingresos
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Explora las últimas propiedades en el mapa
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Descubre dónde están ubicados nuestros activos más recientes y encuentra la locación estratégica que necesitas para tu negocio o vivienda.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Detail Card (5 columns) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden transition-all duration-300">
              
              {/* Image with Badge */}
              <div className="relative h-64 md:h-72 w-full overflow-hidden">
                <img
                  src={activeProperty.image}
                  alt={activeProperty.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Accent Tag */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg">
                  {activeProperty.badge}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 md:p-8 space-y-5">
                <div>
                  <span className="text-xs md:text-sm font-bold text-accent-500 uppercase tracking-wider">
                    {activeProperty.city}
                  </span>
                  <h3 className="mt-1 text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {activeProperty.title}
                  </h3>
                  <div className="mt-2 h-1 w-12 bg-accent-500 rounded-full" />
                </div>

                {/* Specs & Features */}
                <div className="space-y-3 pt-2 text-gray-600 dark:text-gray-350 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-500" />
                    <span>{activeProperty.specs}</span>
                  </div>
                  
                  {/* Plusvalia/Metric with graphic representation */}
                  <div className="flex items-center gap-2 text-primary-600 dark:text-accent-400 font-semibold bg-primary-50/50 dark:bg-primary-950/20 px-3.5 py-2.5 rounded-xl border border-primary-100/50 dark:border-primary-900/30">
                    <TrendingUp className="w-4 h-4 text-accent-500" />
                    <span>{activeProperty.metric}</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{activeProperty.address}</span>
                  </div>

                  {/* POI / Metro */}
                  <div className="flex items-center gap-2.5">
                    <Train className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                    <span className="truncate">{activeProperty.poi}</span>
                  </div>
                </div>

                {/* Action Buttons & Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href={`/propiedades/${activeProperty.slug}`}
                    className="bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full transition-all shadow-md hover:shadow-primary-600/30 active:scale-95"
                  >
                    CONOCE LA PROPIEDAD
                  </Link>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                      {activeIndex + 1} / {mergedProperties.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handlePrev}
                        className="p-2 border border-gray-200 dark:border-gray-750 text-gray-500 hover:text-primary-600 hover:border-primary-600 dark:hover:text-primary-400 dark:hover:border-primary-450 rounded-full transition-all active:scale-90"
                        aria-label="Anterior propiedad"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-2 border border-gray-200 dark:border-gray-750 text-gray-500 hover:text-primary-600 hover:border-primary-600 dark:hover:text-primary-400 dark:hover:border-primary-450 rounded-full transition-all active:scale-90"
                        aria-label="Siguiente propiedad"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right: Map Box Showcase (7 columns) */}
          <div className="lg:col-span-7 w-full">
            <div className="relative bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-150/80 dark:border-gray-800 shadow-lg aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
              
              {/* Svg Base Map */}
              <StylizedMapSvg className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Map overlay dark/light theme tint */}
              <div className="absolute inset-0 bg-primary-950/[0.02] pointer-events-none" />

              {/* Pin Markers */}
              {mergedProperties.map((property, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={property.id}
                    onClick={() => setActiveIndex(index)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                    style={{ left: property.mapX, top: property.mapY }}
                  >
                    {isActive ? (
                      <div className="relative flex items-center justify-center">
                        {/* Pulse Ring */}
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-accent-400 opacity-75"></span>
                        {/* Dot Icon */}
                        <div className="relative w-6 h-6 rounded-full bg-accent-500 border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-300 scale-110">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-primary-600 dark:bg-primary-400 border-2 border-white dark:border-gray-800 shadow-md group-hover:scale-125 transition-transform" />
                    )}
                  </div>
                );
              })}

              {/* Popover / Bubble info window (only for the active pin) */}
              <div
                className="absolute bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-100 dark:border-gray-700 z-30 w-64 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-auto"
                style={{
                  left: activeProperty.mapX,
                  top: `calc(${activeProperty.mapY} - 16px)`,
                }}
              >
                {/* Arrow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-100 dark:border-gray-700" />
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">
                    {activeProperty.city}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {activeProperty.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                    <Train className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                    <span className="truncate">{activeProperty.poi}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
