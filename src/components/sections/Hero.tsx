'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const OPERATION_TYPES = [
  { value: '', label: 'Selecciona una operación' },
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Arriendo' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'Selecciona una tipología' },
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'office', label: 'Oficina' },
];

const CITIES = [
  { value: '', label: 'Selecciona una ciudad' },
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

function CustomSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent text-gray-700 text-sm font-medium pr-6 focus:outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
    <section className="-mt-[96px] md:-mt-[112px] relative min-h-[600px] lg:min-h-[700px] flex flex-col bg-primary-950 overflow-hidden">
      
      {/* ── 2-Column Split Background ── */}
      <div className="absolute inset-0 flex flex-col lg:flex-row">
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
            <div className="absolute inset-0 bg-primary-950/80"></div>
          </div>

          <div className="max-w-xl text-center md:text-left mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase tracking-tight">
              Encontramos
              <br />
              <span className="text-accent-500">tu propiedad</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
              Con espacios bien ubicados, pensados para que vivas o inviertas
              con total confianza en Chile.
            </p>
            <a
              href="/propiedades"
              className="mt-8 inline-flex items-center gap-2 bg-primary-600 hover:bg-accent-500 text-white font-bold px-8 py-4 rounded-full text-base uppercase tracking-wide transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
            >
              Ver propiedades
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Search card ── */}
      <div className="relative w-full z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-0">
          <div className="bg-white rounded-t-3xl shadow-2xl px-8 pt-8 pb-10 transform -translate-y-12">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Busca, encuentra{' '}
                <span className="text-primary-600">y agenda</span>
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Selecciona el tipo de operación, tipología y ciudad que buscas.{' '}
                <span className="text-primary-600 font-medium">
                  Te mostramos lo que se adapta a ti.
                </span>
              </p>
            </div>

            {/* Filters row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 md:gap-0 bg-gray-50 rounded-2xl px-6 py-5">
              {/* Operation */}
              <div className="flex-1 md:pr-6 md:border-r border-gray-200">
                <CustomSelect
                  label="Tipo de operación"
                  options={OPERATION_TYPES}
                  value={operation}
                  onChange={setOperation}
                />
              </div>

              {/* Property type */}
              <div className="flex-1 md:px-6 md:border-r border-gray-200">
                <CustomSelect
                  label="Tipología"
                  options={PROPERTY_TYPES}
                  value={propertyType}
                  onChange={setPropertyType}
                />
              </div>

              {/* City */}
              <div className="flex-1 md:pl-6">
                <CustomSelect
                  label="Ciudad"
                  options={CITIES}
                  value={city}
                  onChange={setCity}
                />
              </div>

              {/* Search button */}
              <div className="md:ml-4 flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-accent-500 text-white font-semibold px-6 py-3.5 rounded-full transition-all hover:shadow-lg active:scale-95"
                  aria-label="Buscar propiedades"
                >
                  <Search className="w-5 h-5" />
                  <span className="md:hidden">Buscar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}