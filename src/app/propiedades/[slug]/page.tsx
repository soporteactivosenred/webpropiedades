import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Calendar, Eye, Phone, Mail, Check, ArrowLeft } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { createServerClient } from '@/lib/supabase/server';
import { getPropertyBySlug, incrementPropertyViews } from '@/lib/supabase';
import { formatPrice, formatArea, formatDate } from '@/lib';
import { PROPERTY_TYPES_LABELS, PRICE_TYPE_LABELS, STATUS_LABELS } from '@/types';
import { PropertyContactForm } from './PropertyContactForm';
import { SchemaOrg } from '@/components/seo/SchemaOrg';

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://propiedadesmerino.cl';
const SITE_NAME = 'Propiedades Merino';

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase: any = await createServerClient();
  const { data: property } = await getPropertyBySlug(supabase, slug);

  if (!property) {
    return {
      title: 'Propiedad no encontrada',
      description: 'La propiedad que buscas no está disponible.',
    };
  }

  const ogImage = property.images?.[0] || `${SITE_URL}/images/og-default.jpg`;
  const description = property.description.slice(0, 160);

  return {
    title: `${property.title} | ${SITE_NAME}`,
    description,
    keywords: `${property.title}, ${property.property_type}, ${property.city}, propiedades en venta, Propiedades Merino`,
    openGraph: {
      title: property.title,
      description,
      type: 'website',
      url: `${SITE_URL}/propiedades/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: 'es_CL',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_URL}/propiedades/${slug}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase: any = await createServerClient();
  
  const [propertyResult, incrementResult] = await Promise.all([
    getPropertyBySlug(supabase, slug),
    incrementPropertyViews(supabase, ''), // Will be called separately after we get the ID
  ]);

  const { data: property, error } = propertyResult;

  if (error || !property) {
    notFound();
  }

  // Increment views (fire and forget)
  incrementPropertyViews(supabase, property.id);

  const typeLabel = PROPERTY_TYPES_LABELS[property.property_type as keyof typeof PROPERTY_TYPES_LABELS];
  const priceLabel = PRICE_TYPE_LABELS[property.price_type as keyof typeof PRICE_TYPE_LABELS];
  const statusLabel = STATUS_LABELS[property.status as keyof typeof STATUS_LABELS];

  return (
    <>
      {/* SEO Schemas */}
      <SchemaOrg
        property={{
          name: property.title,
          description: property.description,
          price: property.price,
          priceType: property.price_type,
          address: property.address,
          city: property.city,
          bedrooms: property.bedrooms || undefined,
          bathrooms: property.bathrooms || undefined,
          area: property.area || undefined,
          image: property.images?.[0],
          url: `${SITE_URL}/propiedades/${slug}`,
        }}
        breadcrumbs={[
          { name: 'Inicio', url: '/' },
          { name: 'Propiedades', url: '/propiedades' },
          { name: property.title, url: `/propiedades/${slug}` },
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/propiedades"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a propiedades
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {property.images && property.images.length > 0 ? (
            <>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {property.images.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {property.images.slice(1, 5).map((img: any, i: any) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                      <Image src={img} alt={`${property.title} - ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="relative aspect-[4/3] rounded-xl bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sin imágenes disponibles</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge-primary">{priceLabel}</span>
                <span className="badge-gray">{typeLabel}</span>
                <span className={`badge ${
                  property.status === 'active' ? 'badge-success' : 'badge-warning'
                }`}>
                  {statusLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {property.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>{property.address}, {property.city}, {property.region}</span>
              </div>
            </div>

            {/* Price */}
            <Card>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Precio</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPrice(property.price, property.price_type)}
                  </p>
                </div>
                {property.views > 0 && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{property.views} visitas</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Features */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Características
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bed className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</p>
                      <p className="text-sm text-gray-500">Habitaciones</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Bath className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</p>
                      <p className="text-sm text-gray-500">Baños</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Square className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.area}</p>
                      <p className="text-sm text-gray-500">m² construidos</p>
                    </div>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{property.year_built}</p>
                      <p className="text-sm text-gray-500">Año</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Descripción
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {property.description}
              </p>
            </Card>

            {/* Amenities */}
            {property.features && property.features.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Amenidades
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature: any) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card className="sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ¿Te interesa esta propiedad?
              </h3>
              <PropertyContactForm propertyId={property.id} propertyTitle={property.title} />
            </Card>

            {/* Quick Contact */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contacto directo
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" leftIcon={<Phone className="w-4 h-4" />}>
                  Llamar ahora
                </Button>
                <Button className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
                  Enviar email
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}