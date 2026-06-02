'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { PropertyType, PriceType, PROPERTY_TYPES_LABELS, PRICE_TYPE_LABELS } from '@/types';

const propertyTypeOptions = [
  { value: '', label: 'Todos los tipos' },
  ...Object.entries(PROPERTY_TYPES_LABELS).map(([value, label]) => ({ value, label }))
];

const priceTypeOptions = [
  { value: '', label: 'Venta y arriendo' },
  ...Object.entries(PRICE_TYPE_LABELS).map(([value, label]) => ({ value, label }))
];

interface PropertyFiltersProps {
  cities?: string[];
  showAdvanced?: boolean;
}

export function PropertyFilters({ cities = [], showAdvanced = false }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(showAdvanced);

  const cityOptions = [
    { value: '', label: 'Todas las ciudades' },
    ...cities.map(city => ({ value: city, label: city }))
  ];

  const [formData, setFormData] = useState({
    query: searchParams.get('q') || '',
    price_type: searchParams.get('type') || '',
    property_type: searchParams.get('property_type') || '',
    city: searchParams.get('city') || '',
  });

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.query) params.set('q', formData.query);
    if (formData.price_type) params.set('type', formData.price_type);
    if (formData.property_type) params.set('property_type', formData.property_type);
    if (formData.city) params.set('city', formData.city);
    router.push(`/propiedades?${params.toString()}`);
  }, [formData, router]);

  const handleClear = useCallback(() => {
    setFormData({
      query: '',
      price_type: '',
      property_type: '',
      city: '',
    });
    router.push('/propiedades');
  }, [router]);

  const hasFilters = formData.query || formData.price_type || formData.property_type || formData.city;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit}>
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar propiedades..."
              value={formData.query}
              onChange={(e) => handleChange('query', e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Select
            options={priceTypeOptions}
            value={formData.price_type}
            onChange={(e) => handleChange('price_type', e.target.value)}
            className="md:w-48"
          />
          <Select
            options={propertyTypeOptions}
            value={formData.property_type}
            onChange={(e) => handleChange('property_type', e.target.value)}
            className="md:w-56"
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 md:flex-none">
              Buscar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:flex"
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filtros
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Ciudad"
              options={cityOptions}
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            {hasFilters && (
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClear}
                  leftIcon={<X className="w-4 h-4" />}
                  className="w-full"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full md:hidden flex items-center justify-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isExpanded ? 'Ocultar filtros' : 'Más filtros'}
        </button>
      </form>
    </div>
  );
}