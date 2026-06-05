import { Suspense } from 'react';
import Link from 'next/link';
import { Hero, WhyChooseUs, CTASection, FinancingSection, MapShowcase, AdvisorCTA } from '@/components/sections';
import { PropertyCard } from '@/components/properties';
import { Button } from '@/components/ui';
import { createServerClient } from '@/lib/supabase/server';
import { getFeaturedProperties, getRecentProperties } from '@/lib/supabase';

export const revalidate = 60;





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



      <Suspense fallback={<div className="animate-pulse"><div className="h-[500px] bg-gray-100 dark:bg-gray-900 rounded-xl" /></div>}>
        <MapShowcaseSection />
      </Suspense>

      <AdvisorCTA />
      <WhyChooseUs />



      <CTASection />
    </>
  );
}