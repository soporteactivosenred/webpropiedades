'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Building2, MapPin } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { PROPERTY_TYPES_LABELS, PRICE_TYPE_LABELS } from '@/types';

const propertyTypes = [
  { value: '', label: 'Todos los tipos' },
  ...Object.entries(PROPERTY_TYPES_LABELS).map(([value, label]) => ({ value, label }))
];

export function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (propertyType) params.set('property_type', propertyType);
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Tu hogar,
              <br />
              <span className="text-accent-400">nuestra pasión</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100 max-w-lg">
              Más de 15 años ayudando a familias a encontrar su lugar perfecto en Chile. 
              Casas, departamentos y terrenos en las mejores ubicaciones.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl md:text-4xl font-bold">500+</p>
                <p className="text-sm text-primary-200 mt-1">Propiedades</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">15+</p>
                <p className="text-sm text-primary-200 mt-1">Años</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold">98%</p>
                <p className="text-sm text-primary-200 mt-1">Satisfacción</p>
              </div>
            </div>
          </div>

          {/* Right: Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Encuentra tu próxima propiedad
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                placeholder="Ciudad, barrio o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MapPin className="w-5 h-5" />}
                className="text-gray-900 dark:text-gray-100"
              />
              <Select
                options={propertyTypes}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="Tipo de propiedad"
              />
              <Button type="submit" className="w-full" size="lg">
                <Search className="w-5 h-5 mr-2" />
                Buscar propiedades
              </Button>
            </form>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Búsquedas populares:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => router.push('/propiedades?type=sale&property_type=house')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Home className="w-3 h-3" />
                  Casas en venta
                </button>
                <button
                  onClick={() => router.push('/propiedades?type=rent&property_type=apartment')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Building2 className="w-3 h-3" />
                  Departamentos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}