import { Suspense } from 'react';
import Link from 'next/link';
import { Hero, WhyChooseUs, PropertyTypesSection, CTASection, FinancingSection, MapShowcase } from '@/components/sections';
import { PropertyCard } from '@/components/properties';
import { Button } from '@/components/ui';
import { createServerClient } from '@/lib/supabase/server';
import { getFeaturedProperties, getRecentProperties } from '@/lib/supabase';

export const revalidate = 60;

async function FeaturedProperties() {
  const supabase: any = await createServerClient();
  const { data: properties } = await getFeaturedProperties(supabase, 6);

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Próximamente mostraremos propiedades destacadas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.slice(0, 6).map((property: any) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}



async function MapShowcaseSection() {
  const supabase: any = await createServerClient();
  const { data: properties } = await getRecentProperties(supabase, 5);
  return <MapShowcase properties={properties || []} />;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FinancingSection />

      {/* Featured Properties */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Propiedades destacadas
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Las mejores opciones seleccionadas para ti
              </p>
            </div>
            <Link href="/propiedades">
              <Button variant="outline">Ver todas</Button>
            </Link>
          </div>
          <Suspense fallback={<div className="animate-pulse"><div className="h-80 bg-gray-200 rounded-xl" /></div>}>
            <FeaturedProperties />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<div className="animate-pulse"><div className="h-[500px] bg-gray-100 dark:bg-gray-900 rounded-xl" /></div>}>
        <MapShowcaseSection />
      </Suspense>

      <PropertyTypesSection />
      <WhyChooseUs />



      <CTASection />
    </>
  );
}