'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, MapPin, Home, Building2 } from 'lucide-react';
import Image from 'next/image';

const OPERATION_TYPES = [
  { value: '', label: 'Todos los estados' },
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Arriendo' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'Todos los tipos' },
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'office', label: 'Oficina' },
];

const CITIES = [
  { value: '', label: 'Todas las ubicaciones' },
  { value: 'Santiago', label: 'Santiago' },
  { value: 'Las Condes', label: 'Las Condes' },
  { value: 'Providencia', label: 'Providencia' },
  { value: 'Ñuñoa', label: 'Ñuñoa' },
  { value: 'Vitacura', label: 'Vitacura' },
  { value: 'Maipú', label: 'Maipú' },
  { value: 'La Florida', label: 'La Florida' },
  { value: 'Valparaíso', label: 'Valparaíso' },
  { value: 'Viña del Mar', label: 'Viña del Mar' },
  { value: 'Concepción', label: 'Concepción' },
];

const SLIDER_IMAGES = [
  '/fuera-iva.png',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80'
];

interface CustomSelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  icon: React.ComponentType<{ className?: string }>;
}

function CustomSelect({
  label,
  options,
  value,
  onChange,
  icon: Icon,
}: CustomSelectProps) {
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : options[0]?.label;

  return (
    <div className="flex items-center gap-3 w-full min-w-0 group">
      {/* Icon container */}
      <div className="flex-shrink-0 p-2 text-primary-600 transition-colors">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      
      {/* Text & Select container */}
      <div className="flex-1 min-w-0 text-left">
        <span className="block text-sm font-bold text-gray-800 tracking-tight leading-none mb-1">
          {label}
        </span>
        <div className="relative flex items-center">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value} className="text-gray-800 bg-white">
                {o.label}
              </option>
            ))}
          </select>
          <span className="block text-xs md:text-sm text-gray-500 font-medium truncate pr-5 select-none pointer-events-none">
            {displayLabel}
          </span>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600 group-hover:text-primary-800 transition-colors pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [operation, setOperation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (operation) params.set('type', operation);
    if (propertyType) params.set('property_type', propertyType);
    if (city) params.set('city', city);
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="-mt-[96px] md:-mt-[112px] mb-16 md:mb-24 relative min-h-[600px] lg:min-h-[700px] flex flex-col bg-primary-950">
      
      {/* ── 2-Column Split Background ── */}
      <div className="absolute inset-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Solid Dark Blue */}
        <div className="w-full lg:w-1/2 bg-primary-950 relative">
           {/* Subtle pattern or gradient on the left side */}
           <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-transparent"></div>
        </div>
        
        {/* Right Side: Image Slider */}
        <div className="hidden lg:block w-full lg:w-1/2 relative">
          {SLIDER_IMAGES.map((src, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {src.startsWith('/') ? (
                <Image 
                  src={src} 
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                />
              ) : (
                <img 
                  src={src} 
                  alt={`Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )}
              {/* Optional slight overlay so it's not too harsh */}
              <div className="absolute inset-0 bg-primary-900/10"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero content ── */}
      <div className="relative flex-1 flex flex-col justify-center mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-[96px] md:pt-[112px] pb-32">
          {/* Mobile slider background (only visible on mobile, behind the text) */}
          <div className="lg:hidden absolute inset-0 -z-10">
            {SLIDER_IMAGES.map((src, index) => (
               <div 
                 key={index}
                 className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                 style={{ backgroundImage: `url('${src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
               />
            ))}
            <div className="absolute inset-0 bg-primary-950/85"></div>
          </div>

          <div className="max-w-2xl lg:max-w-[48%] text-center md:text-left mx-auto lg:mx-0 relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight uppercase tracking-tight shadow-sm">
              La evolución de la
              <br />
              <span className="text-accent-500 drop-shadow-md">inversión inmobiliaria</span>
              <br />
              en Chile.
            </h1>
            <p className="mt-4 text-sm md:text-base text-gray-300 leading-relaxed drop-shadow-md">
              Acceda a carteras exclusivas de activos adjudicados, remates institucionales y oportunidades en liquidación bancaria con descuentos de hasta un 30% bajo el valor de mercado. Todo respaldado por tecnología avanzada y un riguroso blindaje legal previo.
            </p>
            <a
              href="/propiedades?filter=inversion"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-accent-500 text-white hover:text-primary-950 font-bold px-6 py-3 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm uppercase tracking-wide transition-all shadow-xl active:scale-95 w-full sm:w-auto"
            >
              <span>Ver Oportunidades de Inversión</span>
              <span className="text-base">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Search card ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-0">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl md:rounded-[2.5rem] shadow-2xl px-6 py-8 md:px-10 md:py-10">
            {/* Title */}
            <div className="mb-8 text-center">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
                Encuentra tu próximo activo inmobiliario aquí:
              </h2>
            </div>

            {/* Filters row */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-4 bg-white rounded-3xl md:rounded-full px-6 py-6 md:py-4 shadow-md border border-gray-100">
              {/* City/Comuna */}
              <div className="w-full md:flex-1">
                <CustomSelect
                  label="Ciudad o comuna"
                  options={CITIES}
                  value={city}
                  onChange={setCity}
                  icon={MapPin}
                />
              </div>

              {/* Divider 1 */}
              <div className="hidden md:block w-px h-10 bg-gray-200" />
              <div className="block md:hidden w-full h-px bg-gray-100" />

              {/* Property type */}
              <div className="w-full md:flex-1">
                <CustomSelect
                  label="Tipo de propiedad"
                  options={PROPERTY_TYPES}
                  value={propertyType}
                  onChange={setPropertyType}
                  icon={Home}
                />
              </div>

              {/* Divider 2 */}
              <div className="hidden md:block w-px h-10 bg-gray-200" />
              <div className="block md:hidden w-full h-px bg-gray-100" />

              {/* Operation / Estado */}
              <div className="w-full md:flex-1">
                <CustomSelect
                  label="Estado"
                  options={OPERATION_TYPES}
                  value={operation}
                  onChange={setOperation}
                  icon={Building2}
                />
              </div>

              {/* Divider 3 */}
              <div className="hidden md:block w-px h-10 bg-gray-200" />

              {/* Search Button */}
              <div className="w-full md:w-auto flex justify-center md:justify-start pt-2 md:pt-0">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-14 md:h-14 lg:w-16 lg:h-16 py-3.5 md:py-0 flex items-center justify-center bg-primary-600 hover:bg-accent-500 text-white rounded-xl md:rounded-full font-bold gap-2 transition-all duration-300 shadow-lg hover:shadow-primary-600/30 hover:scale-105 active:scale-95"
                  aria-label="Buscar propiedades"
                >
                  <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[2]" />
                  <span className="md:hidden">Buscar propiedades</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}