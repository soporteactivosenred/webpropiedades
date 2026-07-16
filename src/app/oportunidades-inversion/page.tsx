import { Suspense } from 'react';
import { PropertyCard } from '@/components/properties';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { Button } from '@/components/ui';
import { createServerClient } from '@/lib/supabase/server';
import { getProperties, getPropertyCities } from '@/lib/supabase';
import type { PropertyFilters as FilterType } from '@/types';
import CapRateCalculator from '@/components/properties/CapRateCalculator';

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
  title: 'Oportunidades de Inversión',
  description: 'Cartera exclusiva de liquidaciones bancarias, activos adjudicados y remates con descuentos únicos.',
};

export default async function OpportunitiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase: any = await createServerClient();
  
  // Build filters (always enforce is_bank_liquidation: true)
  const filters: FilterType = {
    is_bank_liquidation: true
  };
  
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
    return `/oportunidades-inversion?${urlParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-primary-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Oportunidades de Inversión
          </h1>
          <p className="mt-2 text-primary-100 text-lg">
            Cartera exclusiva de liquidaciones bancarias, activos adjudicados y remates.
          </p>
          <p className="mt-1.5 text-xs text-accent-300 font-semibold uppercase tracking-wider">
            {count || 0} liquidaciones activas encontradas
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <PropertyFilters cities={(cities as string[]) || []} />
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
                  No se encontraron liquidaciones bancarias
                </p>
                <p className="mt-2 text-gray-500 dark:text-gray-500">
                  Prueba con otros filtros o contáctanos para asesoría personalizada.
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Calculadora de Rentabilidad (Cap Rate)</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Evalúa de forma rápida y sencilla el retorno de tus inversiones inmobiliarias. Compara la modalidad de arriendo tradicional con arriendo vacacional/Airbnb.
            </p>
          </div>
          <CapRateCalculator />
        </div>
      </section>
    </div>
  );
}
