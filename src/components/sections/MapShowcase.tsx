'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, ChevronLeft, ChevronRight, TrendingUp, Compass, ExternalLink } from 'lucide-react';
import { getPropertyCode, formatPrice } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

interface MapShowcaseProps {
  properties?: any[];
}

const FALLBACK_PROPERTIES = [
  {
    id: 'prop-1',
    title: 'Avenida del Mar, La Serena',
    city: 'La Serena',
    region: 'Coquimbo',
    address: 'Avenida Pacífico 2401, La Serena',
    specs: '3 dorm. | 2 baños | 80 m²',
    metric: 'Liquidación Bancaria en La Serena',
    poi: 'A pasos de la Av. del Mar y playas',
    price: '3.375 UF',
    image: '/properties/avenida-del-mar-1041/1.png',
    lat: -29.9027,
    lng: -71.2520,
    slug: 'avenida-del-mar-la-serena-1041',
    badge: 'Liquidación Bancaria',
    code: 'COD-1041',
  },
  {
    id: 'prop-2',
    title: 'Condominio La Herradura, Coquimbo',
    city: 'Coquimbo',
    region: 'Coquimbo',
    address: 'La Herradura, Coquimbo',
    specs: '2 dorm. | 2 baños | 68 m²',
    metric: 'Alta rentabilidad en arriendos',
    poi: 'Vista a la bahía y conectividad directa',
    price: '2.950 UF',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    lat: -29.9806,
    lng: -71.3508,
    slug: 'condominio-la-herradura-coquimbo',
    badge: 'Destacado',
    code: 'COD-1038',
  },
  {
    id: 'prop-3',
    title: 'Departamento Sector Peñuelas',
    city: 'Coquimbo',
    region: 'Coquimbo',
    address: 'Av. Los Pescadores, Peñuelas, Coquimbo',
    specs: '2 dorm. | 1 baño | 58 m²',
    metric: '7,8% retorno de inversión anual',
    poi: 'Frente a la playa y sector comercial',
    price: '2.680 UF',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    lat: -29.9485,
    lng: -71.2854,
    slug: 'departamento-sector-penuelas',
    badge: 'Oportunidad',
    code: 'COD-1039',
  },
  {
    id: 'prop-4',
    title: 'Casa San Joaquín, La Serena',
    city: 'La Serena',
    region: 'Coquimbo',
    address: 'San Joaquín, La Serena',
    specs: '4 dorm. | 3 baños | 140 m²',
    metric: 'Barrio residencial consolidado',
    poi: 'Cercano a colegios y supermercados',
    price: '6.200 UF',
    image: 'https://images.unsplash.com/photo-1570129476815-ba368ac77011?w=800&q=80',
    lat: -29.9180,
    lng: -71.2400,
    slug: 'casa-san-joaquin-la-serena',
    badge: 'Exclusivo',
    code: 'COD-1040',
  },
  {
    id: 'prop-5',
    title: 'Terreno Pan de Azúcar, Coquimbo',
    city: 'Coquimbo',
    region: 'Coquimbo',
    address: 'Ruta D-43, Pan de Azúcar, Coquimbo',
    specs: 'Terreno 5.000 m²',
    metric: 'Ideal proyecto o factibilidad comercial',
    poi: 'Excelente acceso por carretera principal',
    price: '1.950 UF',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    lat: -30.0150,
    lng: -71.2800,
    slug: 'terreno-pan-de-azucar',
    badge: 'Parcela',
    code: 'COD-1035',
  },
];

function OpenStreetMapContainer({
  activeProperty,
  allProperties,
  onSelectProperty,
}: {
  activeProperty: any;
  allProperties: any[];
  onSelectProperty: (index: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isCancelled = false;

    import('leaflet').then((leafletModule) => {
      if (isCancelled || !mapRef.current) return;
      const L = leafletModule.default || leafletModule;

      // Inicializar mapa si no existe
      if (!leafletMap.current) {
        const container = mapRef.current as any;
        if (container._leaflet_id) {
          container._leaflet_id = null;
        }

        const map = L.map(mapRef.current, {
          center: [activeProperty.lat, activeProperty.lng],
          zoom: 14,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        leafletMap.current = map;
      }

      const map = leafletMap.current;

      // Limpiar marcadores anteriores
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Renderizar marcadores para todas las propiedades
      allProperties.forEach((prop, idx) => {
        const isActive = prop.id === activeProperty.id;

        const iconHtml = `
          <div style="
            background: ${isActive ? '#0284c7' : '#0f172a'};
            width: ${isActive ? '34px' : '26px'};
            height: ${isActive ? '34px' : '26px'};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="${isActive ? '18' : '12'}" height="${isActive ? '18' : '12'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-osm-pin',
          html: iconHtml,
          iconSize: isActive ? [34, 34] : [26, 26],
          iconAnchor: isActive ? [17, 34] : [13, 26],
          popupAnchor: [0, -28],
        });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 200px;">
            <div style="font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase;">${prop.city} • ${prop.code}</div>
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${prop.title}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${prop.address}</div>
            <div style="font-size: 13px; font-weight: 800; color: #0284c7; margin-top: 6px;">${prop.price}</div>
          </div>
        `;

        const marker = L.marker([prop.lat, prop.lng], { icon })
          .addTo(map)
          .bindPopup(popupContent);

        marker.on('click', () => {
          onSelectProperty(idx);
        });

        if (isActive) {
          marker.openPopup();
        }

        markersRef.current.push(marker);
      });

      // Mover el mapa hacia las coordenadas de la propiedad activa
      map.flyTo([activeProperty.lat, activeProperty.lng], 14, {
        duration: 1.2,
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [activeProperty.id, activeProperty.lat, activeProperty.lng]);

  useEffect(() => {
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-slate-100 dark:bg-gray-900">
      {/* Contenedor Leaflet OpenStreetMap */}
      <div ref={mapRef} className="w-full h-full min-h-[420px] z-10" />

      {/* Tarjeta Flotante sobre el Mapa */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-20 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent-500/10 text-accent-600 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-accent-600 bg-accent-50 dark:bg-accent-950/40 px-2 py-0.5 rounded">
                OpenStreetMap • {activeProperty.city}
              </span>
              {activeProperty.code && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {activeProperty.code}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 line-clamp-1">
              {activeProperty.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {activeProperty.address}
            </p>
          </div>
        </div>

        <a
          href={`https://www.openstreetmap.org/?mlat=${activeProperty.lat}&mlon=${activeProperty.lng}#map=16/${activeProperty.lat}/${activeProperty.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/40 hover:bg-accent-100 px-3 py-1.5 rounded-xl transition-colors shrink-0"
        >
          <span>Abrir OpenStreetMap ↗</span>
        </a>
      </div>
    </div>
  );
}

export function MapShowcase({ properties = [] }: MapShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Combinar propiedades reales de la BD con coordinadas reales de Chile
  const mergedProperties = (properties && properties.length > 0 ? properties : FALLBACK_PROPERTIES).map((prop, index) => {
    const fallback = FALLBACK_PROPERTIES[index % FALLBACK_PROPERTIES.length];
    const liveProp = properties[index];

    if (!liveProp) {
      return fallback;
    }

    const code = getPropertyCode(liveProp);
    const priceStr = liveProp.price ? formatPrice(liveProp.price, liveProp.price_type || 'sale') : fallback.price;
    const specs = [
      liveProp.bedrooms ? `${liveProp.bedrooms} dorm.` : null,
      liveProp.bathrooms ? `${liveProp.bathrooms} ${liveProp.bathrooms === 1 ? 'baño' : 'baños'}` : null,
      liveProp.area ? `${liveProp.area} m²` : (liveProp.terrain_area ? `${liveProp.terrain_area} m² terreno` : null),
    ].filter(Boolean).join(' | ') || fallback.specs;

    const image = (liveProp.images && liveProp.images.length > 0)
      ? liveProp.images[0]
      : fallback.image;

    // Coordenadas reales lat/lng o asignación por ciudad en Coquimbo / Chile
    let lat = liveProp.latitude;
    let lng = liveProp.longitude;

    if (!lat || !lng) {
      const cityLower = (liveProp.city || '').toLowerCase();
      if (cityLower.includes('serena')) {
        lat = -29.9027 + (index * 0.005);
        lng = -71.2520 + (index * 0.003);
      } else if (cityLower.includes('coquimbo')) {
        lat = -29.9806 - (index * 0.004);
        lng = -71.3508 + (index * 0.003);
      } else {
        lat = fallback.lat;
        lng = fallback.lng;
      }
    }

    const poi = (liveProp.features && liveProp.features.length > 0)
      ? liveProp.features.slice(0, 2).join(' • ')
      : `Excelente ubicación en ${liveProp.city || 'Chile'}`;

    return {
      id: liveProp.id || fallback.id,
      title: liveProp.title,
      city: liveProp.city || fallback.city,
      region: liveProp.region || fallback.region,
      address: liveProp.address || fallback.address,
      specs,
      metric: liveProp.is_bank_liquidation ? '¡Oportunidad de Liquidación Bancaria!' : 'Excelente conectividad y plusvalía',
      poi,
      price: priceStr,
      image,
      lat,
      lng,
      slug: liveProp.slug || fallback.slug,
      badge: liveProp.is_bank_liquidation ? 'Liquidación Bancaria' : (liveProp.price_type === 'rent' ? 'Arriendo' : 'Venta'),
      code,
    };
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
        {/* Encabezado */}
        <div className="text-center lg:text-left mb-12">
          <span className="text-sm font-bold text-accent-500 uppercase tracking-widest">
            Ubicaciones Estratégicas
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Explora las últimas propiedades en el mapa
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Descubre dónde están ubicados nuestros activos más recientes en OpenStreetMap con su geolocalización exacta.
          </p>
        </div>

        {/* Grid de Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Ficha de la Propiedad (5 Columnas) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden transition-all duration-300">
              
              {/* Imagen con Etiqueta y Código */}
              <div className="relative h-64 md:h-72 w-full overflow-hidden">
                <img
                  src={activeProperty.image}
                  alt={activeProperty.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Tag de Estado */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg">
                  {activeProperty.badge}
                </div>

                {/* Código de Propiedad */}
                {activeProperty.code && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {activeProperty.code}
                  </div>
                )}
              </div>

              {/* Detalle */}
              <div className="p-6 md:p-8 space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-bold text-accent-500 uppercase tracking-wider">
                      {activeProperty.city}
                    </span>
                    <span className="text-sm font-bold text-primary-600 dark:text-accent-400">
                      {activeProperty.price}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {activeProperty.title}
                  </h3>
                  <div className="mt-2 h-1 w-12 bg-accent-500 rounded-full" />
                </div>

                {/* Especificaciones */}
                <div className="space-y-3 pt-2 text-gray-600 dark:text-gray-350 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-500" />
                    <span>{activeProperty.specs}</span>
                  </div>
                  
                  {/* Plusvalía / Métrica */}
                  <div className="flex items-center gap-2 text-primary-600 dark:text-accent-400 font-semibold bg-primary-50/50 dark:bg-primary-950/20 px-3.5 py-2.5 rounded-xl border border-primary-100/50 dark:border-primary-900/30">
                    <TrendingUp className="w-4 h-4 text-accent-500" />
                    <span>{activeProperty.metric}</span>
                  </div>

                  {/* Dirección */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{activeProperty.address}</span>
                  </div>

                  {/* Características de Conectividad */}
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                    <span className="truncate">{activeProperty.poi}</span>
                  </div>
                </div>

                {/* Acciones y Navegación */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href={`/propiedades/${activeProperty.slug}`}
                    className="bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full transition-all shadow-md hover:shadow-primary-600/30 active:scale-95"
                  >
                    CONOCE LA PROPIEDAD
                  </Link>

                  {/* Flechas de Navegación */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                      {activeIndex + 1} / {mergedProperties.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handlePrev}
                        className="p-2 border border-gray-200 dark:border-gray-750 text-gray-500 hover:text-primary-600 hover:border-primary-600 dark:hover:text-primary-400 rounded-full transition-all active:scale-90"
                        aria-label="Anterior propiedad"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-2 border border-gray-200 dark:border-gray-750 text-gray-500 hover:text-primary-600 hover:border-primary-600 dark:hover:text-primary-400 rounded-full transition-all active:scale-90"
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

          {/* Mapa Interactivo OpenStreetMap (7 Columnas) */}
          <div className="lg:col-span-7 w-full">
            <OpenStreetMapContainer
              activeProperty={activeProperty}
              allProperties={mergedProperties}
              onSelectProperty={(idx) => setActiveIndex(idx)}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
