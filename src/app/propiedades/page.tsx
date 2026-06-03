import { Suspense } from 'react';
import { PropertyCard } from '@/components/properties';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { Button } from '@/components/ui';
import { createServerClient } from '@/lib/supabase/server';
import { getProperties, getPropertyCities } from '@/lib/supabase';
import type { PropertyFilters as FilterType } from '@/types';

interface Props {
  searchParams: Promise<{
    q?: string;
    type?: string;
    property_type?: string;
    city?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: 'Propiedades',
  description: 'Explora nuestra selección de casas, departamentos y terrenos en Chile. Filtra por tipo, precio y ubicación.',
};

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase: any = await createServerClient();
  
  // Build filters
  const filters: FilterType = {};
  if (params.q) filters.city = params.q;
  if (params.type) filters.price_type = params.type as 'sale' | 'rent';
  if (params.property_type) filters.property_type = params.property_type as 'house' | 'apartment' | 'land' | 'commercial' | 'office' | 'industrial';
  if (params.city) filters.city = params.city;

  // Fetch properties and cities
  const [{ data: properties, count }, { data: cities }] = await Promise.all([
    getProperties(supabase, { ...filters, limit: 12 }),
    getPropertyCities(supabase),
  ]);

  const currentPage = parseInt(params.page || '1');
  const totalPages = Math.ceil((count || 0) / 12);

  const getPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (params.q) urlParams.set('q', params.q);
    if (params.type) urlParams.set('type', params.type);
    if (params.property_type) urlParams.set('property_type', params.property_type);
    urlParams.set('page', String(page));
    return `/propiedades?${urlParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-primary-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Encuentra tu propiedad ideal
          </h1>
          <p className="mt-2 text-primary-100 text-lg">
            {count || 0} propiedades disponibles
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <PropertyFilters cities={cities || []} />
      </div>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {params.q && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Resultados para:</span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                {params.q}
              </span>
            </div>
          )}

          <Suspense fallback={<div className="animate-pulse">Cargando propiedades...</div>}>
            {properties && properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <a href={getPageUrl(currentPage - 1)}>
                        <Button variant="outline" size="sm">
                          Anterior
                        </Button>
                      </a>
                    )}
                    <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Página {currentPage} de {totalPages}
                    </span>
                    {currentPage < totalPages && (
                      <a href={getPageUrl(currentPage + 1)}>
                        <Button variant="outline" size="sm">
                          Siguiente
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No se encontraron propiedades
                </p>
                <p className="mt-2 text-gray-500 dark:text-gray-500">
                  Prueba con otros filtros o{' '}
                  <a href="/propiedades" className="text-primary-600 hover:underline">
                    ver todas las propiedades
                  </a>
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  );
}